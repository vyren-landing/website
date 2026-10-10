import {NextRequest} from "next/server";
import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
type Mutation={operation?:string;email?:string;id?:string};
class ApiFailure extends Error {constructor(message:string,public status=400){super(message);}}
const reject=(message:string,status=400)=>Response.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
const validEmail=(email:string)=>email.length>=5&&email.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const uuid=(value:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
function sameOrigin(request:NextRequest){return request.headers.get("origin")===new URL(request.url).origin;}
async function founder(){
 if(!phase2Configured())return null;
 const actor=await getActor();
 return actor?.role==="Founder"?actor:null;
}
export async function GET(){
 if(!phase2Configured())return reject("Kurulum tamamlanmadı",503);
 try{
  const actor=await getActor();
  if(!actor)return reject("Yetkisiz",401);
  if(actor.role!=="Founder")return reject("Yalnızca Kurucu erişebilir",403);
  const db=database();
  const [members,invites]=await Promise.all([
   db.query(`SELECT auth_user_id AS id,name,role,active,created_at AS "createdAt"
     FROM cc_members WHERE role='Contributor' ORDER BY created_at DESC LIMIT 200`),
   db.query(`SELECT id::text,email,status,member_id AS "memberId",created_at AS "createdAt",updated_at AS "updatedAt"
     FROM cc_team_invites ORDER BY created_at DESC LIMIT 200`)
  ]);
  return Response.json({members:members.rows,invites:invites.rows},{headers:{"Cache-Control":"no-store"}});
 }catch{return reject("Ekip kayıtları hazır değil. Önce 002_team_invitations.sql migration uygulanmalı.",503);}
}
export async function POST(request:NextRequest){
 if(!phase2Configured())return reject("Kurulum tamamlanmadı",503);
 if(!sameOrigin(request))return reject("Geçersiz Origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")return reject("JSON gerekli",415);
 const raw=await request.text();if(raw.length>3000)return reject("İstek fazla uzun",413);
 let input:Mutation;
 try{input=JSON.parse(raw);if(!input||typeof input!=="object")throw Error("shape");}
 catch{return reject("Geçersiz JSON",400);}
 try{
  const actor=await getActor();
  if(!actor)return reject("Yetkisiz",401);
  if(actor.role!=="Founder")return reject("Yalnızca Kurucu işlem yapabilir",403);
  const operation=input.operation||"";
  if(!["invite","revoke_invite","reactivate_invite","disable_member","enable_member"].includes(operation))
   return reject("Geçersiz ekip işlemi",400);
  const db=database(),client=await db.connect();
  try{
   await client.query("BEGIN");
   let auditTarget="";
   if(operation==="invite"){
    const email=(input.email||"").trim().toLowerCase();
    if(!validEmail(email))throw new ApiFailure("Geçerli bir Google e-posta adresi gerekli");
    if(email===(process.env.TEST_GOOGLE_EMAIL||"").trim().toLowerCase())
     throw new ApiFailure("Bu adres zaten test Contributor hesabı olarak tanımlı",409);
    const result=await client.query<{id:string}>(`
      INSERT INTO cc_team_invites(email,created_by) VALUES($1,$2)
      ON CONFLICT(email) DO UPDATE SET status='PENDING',updated_at=now()
       WHERE cc_team_invites.status='REVOKED' AND cc_team_invites.member_id IS NULL
      RETURNING id::text`,[email,actor.id]);
    if(!result.rowCount)throw new ApiFailure("Bu adres zaten kayıtlı veya bağlı bir hesap; önce mevcut kaydı yönetin",409);
    auditTarget=result.rows[0].id;
   }else if(operation==="revoke_invite"||operation==="reactivate_invite"){
    const id=input.id||"";
    if(!uuid(id))throw new ApiFailure("Davet ID geçersiz");
    const result=await client.query<{id:string;status:string;memberId:string|null}>(
      'SELECT id::text,status,member_id AS "memberId" FROM cc_team_invites WHERE id=$1 FOR UPDATE',[id]);
    if(!result.rowCount)throw new ApiFailure("Davet bulunamadı",404);
    const invite=result.rows[0];
    auditTarget=invite.id;
    if(operation==="revoke_invite"){
     if(invite.status==="REVOKED")throw new ApiFailure("Erişim zaten kapalı",409);
     await client.query("UPDATE cc_team_invites SET status='REVOKED',updated_at=now() WHERE id=$1",[id]);
     if(invite.memberId){
      await client.query("UPDATE cc_members SET active=FALSE,updated_at=now() WHERE auth_user_id=$1 AND role='Contributor'",[invite.memberId]);
      await client.query('DELETE FROM "session" WHERE "userId"=$1',[invite.memberId]);
     }
    }else{
     if(invite.status!=="REVOKED")throw new ApiFailure("Yalnızca kapalı davet yeniden etkinleştirilebilir",409);
     if(invite.memberId){
      const active=await client.query("UPDATE cc_members SET active=TRUE,updated_at=now() WHERE auth_user_id=$1 AND role='Contributor' RETURNING auth_user_id",[invite.memberId]);
      if(!active.rowCount)throw new ApiFailure("Bağlı Contributor bulunamadı",409);
     }
     await client.query("UPDATE cc_team_invites SET status=$2,updated_at=now() WHERE id=$1",[id,invite.memberId?"ACTIVE":"PENDING"]);
    }
   }else{
    const id=input.id||"";
    if(!id||id.length>160)throw new ApiFailure("Üye ID geçersiz");
    const result=await client.query<{id:string;active:boolean}>(
     'SELECT auth_user_id AS id,active FROM cc_members WHERE auth_user_id=$1 AND role=$2 FOR UPDATE',[id,"Contributor"]);
    if(!result.rowCount)throw new ApiFailure("Contributor bulunamadı",404);
    const desired=operation==="enable_member";
    if(result.rows[0].active===desired)throw new ApiFailure(desired?"Erişim zaten açık":"Erişim zaten kapalı",409);
    await client.query("UPDATE cc_members SET active=$2,updated_at=now() WHERE auth_user_id=$1",[id,desired]);
    await client.query("UPDATE cc_team_invites SET status=$2,updated_at=now() WHERE member_id=$1",
      [id,desired?"ACTIVE":"REVOKED"]);
    if(!desired)await client.query('DELETE FROM "session" WHERE "userId"=$1',[id]);
    auditTarget=id;
   }
   await client.query(
    "INSERT INTO cc_audit(actor_id,action,target_id,details) VALUES($1,$2,$3,$4)",
    [actor.id,"team_"+operation,auditTarget,JSON.stringify({at:new Date().toISOString()})]);
   await client.query("COMMIT");
   return Response.json({ok:true},{headers:{"Cache-Control":"no-store"}});
  }catch(e){await client.query("ROLLBACK");throw e;}
  finally{client.release();}
 }catch(e){
  return e instanceof ApiFailure?reject(e.message,e.status):reject("Ekip işlemi gerçekleştirilemedi; veri değişikliği geri alındı",500);
 }
}
