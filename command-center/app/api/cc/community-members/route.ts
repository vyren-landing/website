import {NextRequest} from "next/server";
import {communityEnabled,database,getActor} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
const deny=(message:string,status:number)=>Response.json({error:message},{status,headers});
class Failure extends Error{constructor(message:string,public status=400){super(message);}}
async function founder(){
 const actor=await getActor({readOnly:true});
 return actor?.role==="Founder"?actor:null;
}
export async function GET(){
 if(!communityEnabled())return deny("Topluluk yetki yönetimi etkin değil",503);
 try{
  const actor=await founder();
  if(!actor)return deny("Yalnızca Kurucu erişebilir",403);
  const profiles=await database().query(`
   SELECT p.auth_user_id AS id,p.display_name AS name,u.email AS email,p.wants_to_contribute AS "wantsToContribute",
      p.created_at AS "joinedAt",g.active AS "directGrantActive",
      m.role AS "existingRole",m.active AS "existingActive"
   FROM cc_community_profiles p
   JOIN "user" u ON u.id=p.auth_user_id
   LEFT JOIN cc_contributor_grants g ON g.auth_user_id=p.auth_user_id
   LEFT JOIN cc_members m ON m.auth_user_id=p.auth_user_id
   ORDER BY p.created_at DESC LIMIT 200`);
  return Response.json({members:profiles.rows},{headers});
 }catch{return deny("Üye kayıtlarına erişilemedi",503);}
}
export async function POST(request:NextRequest){
 if(!communityEnabled())return deny("Topluluk yetki yönetimi etkin değil",503);
 if(request.headers.get("origin")!==new URL(request.url).origin)return deny("Geçersiz Origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")return deny("JSON gerekli",415);
 const raw=await request.text();
 if(raw.length>600)return deny("İstek fazla uzun",413);
 let input:{operation?:unknown;id?:unknown};
 try{input=JSON.parse(raw);}catch{return deny("Geçersiz JSON",400);}
 if(!input||typeof input!=="object"||(input.operation!=="grant"&&input.operation!=="revoke")||
    typeof input.id!=="string"||input.id.length<1||input.id.length>160)return deny("Geçersiz yetki işlemi",400);
 try{
  const actor=await founder();
  if(!actor)return deny("Yalnızca Kurucu işlem yapabilir",403);
  const db=database(),client=await db.connect();
  try{
   await client.query("BEGIN");
   const target=await client.query<{id:string;name:string;verified:boolean;memberRole:string|null;memberActive:boolean|null;grantActive:boolean|null;hasGrant:boolean}>(
    `SELECT p.auth_user_id AS id,p.display_name AS name,u."emailVerified" AS verified,
       m.role AS "memberRole",m.active AS "memberActive",
       g.active AS "grantActive",(g.auth_user_id IS NOT NULL) AS "hasGrant"
     FROM cc_community_profiles p
     JOIN "user" u ON u.id=p.auth_user_id
     LEFT JOIN cc_members m ON m.auth_user_id=p.auth_user_id
     LEFT JOIN cc_contributor_grants g ON g.auth_user_id=p.auth_user_id
     WHERE p.auth_user_id=$1 FOR UPDATE OF p`,[input.id]);
   if(!target.rowCount)throw new Failure("Topluluk üyesi bulunamadı",404);
   const t=target.rows[0];
   if(t.id===actor.id||t.memberRole==="Founder")throw new Failure("Kurucu yetkisi bu işlemle değiştirilemez",403);
   if(t.verified!==true)throw new Failure("Doğrulanmamış hesaba Contributor yetkisi verilemez",403);
   // Do not create an alternative authority path around legacy invited/test Contributor grants.
   if(t.memberRole==="Contributor"&&!t.hasGrant)
    throw new Failure("Bu hesap zaten mevcut Contributor sistemiyle yönetiliyor",409);
   if(input.operation==="grant"){
    if(t.grantActive===true)throw new Failure("Yetki zaten açık",409);
    await client.query(
     `INSERT INTO cc_contributor_grants(auth_user_id,active,granted_by,granted_at,revoked_by,revoked_at)
      VALUES($1,TRUE,$2,now(),NULL,NULL)
      ON CONFLICT(auth_user_id) DO UPDATE SET active=TRUE,granted_by=$2,granted_at=now(),revoked_by=NULL,revoked_at=NULL,updated_at=now()`,
     [t.id,actor.id]);
    await client.query(
     `INSERT INTO cc_members(auth_user_id,role,name,active)
      VALUES($1,'Contributor',$2,TRUE)
      ON CONFLICT(auth_user_id) DO UPDATE SET name=EXCLUDED.name,active=TRUE,updated_at=now()
      WHERE cc_members.role='Contributor'`,[t.id,t.name]);
   }else{
    if(!t.hasGrant||t.grantActive!==true)throw new Failure("Açık doğrudan yetki bulunamadı",409);
    await client.query(
     "UPDATE cc_contributor_grants SET active=FALSE,revoked_by=$2,revoked_at=now(),updated_at=now() WHERE auth_user_id=$1",
     [t.id,actor.id]);
    await client.query(
     "UPDATE cc_members SET active=FALSE,updated_at=now() WHERE auth_user_id=$1 AND role='Contributor'",[t.id]);
    await client.query('DELETE FROM "session" WHERE "userId"=$1',[t.id]);
   }
   await client.query(
    "INSERT INTO cc_audit(actor_id,action,target_id,details) VALUES($1,$2,$3,$4)",
    [actor.id,"community_"+input.operation,t.id,JSON.stringify({source:"founder_direct_grant",at:new Date().toISOString()})]);
   await client.query("COMMIT");
   return Response.json({ok:true},{headers});
  }catch(e){await client.query("ROLLBACK");throw e;}
  finally{client.release();}
 }catch(e){return e instanceof Failure?deny(e.message,e.status):deny("Yetki işlemi gerçekleştirilemedi",503);}
}
