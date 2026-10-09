import {NextRequest} from "next/server";
import {database,getActor,phase2Configured,type Actor} from "../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
type Mutation={operation:string;id?:string;title?:string;objective?:string;expectedOutput?:string;ownerId?:string;body?:string;evidenceUrl?:string;reason?:string};
const reject=(message:string,status=400)=>Response.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
async function actorOrError():Promise<Actor|null>{
 if(!phase2Configured())return null;
 return getActor();
}
function sameOrigin(req:NextRequest){
 const origin=req.headers.get("origin");
 return !!origin&&origin===new URL(req.url).origin;
}
function validHttps(url:string){try{const u=new URL(url);return u.protocol==="https:"&&!!u.hostname&&url.length<=2000;}catch{return false;}}
export async function GET(){
 if(!phase2Configured())return reject("Kurulum tamamlanmadı",503);
 try{
  const actor=await actorOrError();if(!actor)return reject("Yetkisiz",401);
  const db=database();
  const data=await db.query(
   `SELECT t.id,t.title,t.objective,t.expected_output AS "expectedOutput",t.owner_id AS "ownerId",
     m.name AS "ownerName",t.status,t.created_at AS "createdAt",t.updated_at AS "updatedAt"
    FROM cc_tasks t JOIN cc_members m ON m.auth_user_id=t.owner_id
    WHERE t.archived_at IS NULL AND ($1::boolean OR t.owner_id=$2)
    ORDER BY t.updated_at DESC LIMIT 250`,[actor.role==="Founder",actor.id]);
  const ids=data.rows.map(r=>r.id);
  const submissions=ids.length?await db.query(
   'SELECT id,task_id AS "taskId",submitted_by AS "submittedBy",body,evidence_url AS "evidenceUrl",created_at AS "createdAt" FROM cc_deliverables WHERE task_id=ANY($1::uuid[]) ORDER BY created_at ASC',[ids]):{rows:[]};
  const reviews=ids.length?await db.query(
   'SELECT task_id AS "taskId",decision,reason,created_at AS "createdAt" FROM cc_reviews WHERE task_id=ANY($1::uuid[]) ORDER BY created_at ASC',[ids]):{rows:[]};
  const members=actor.role==="Founder"?await db.query('SELECT auth_user_id AS id,name,role FROM cc_members WHERE active=TRUE ORDER BY name'):{rows:[]};
  return Response.json({actor,tasks:data.rows.map(t=>({...t,submissions:submissions.rows.filter(x=>x.taskId===t.id),reviews:reviews.rows.filter(x=>x.taskId===t.id)})),members:members.rows},{headers:{"Cache-Control":"no-store"}});
 }catch{return reject("Veritabanı erişimi veya şeması doğrulanamadı",503);}
}
export async function POST(request:NextRequest){
 if(!phase2Configured())return reject("Kurulum tamamlanmadı",503);
 if(!sameOrigin(request))return reject("Geçersiz Origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")return reject("JSON gerekli",415);
 const raw=await request.text();if(raw.length>20000)return reject("İstek fazla uzun",413);
 let input:Mutation;
 try{input=JSON.parse(raw) as Mutation;if(!input||typeof input!=="object")throw Error("shape");}
 catch{return reject("Geçersiz JSON");}
 try{
  const actor=await actorOrError();if(!actor)return reject("Yetkisiz",401);
  const db=database();
  const client=await db.connect();
  try{
   await client.query("BEGIN");
   let taskId="";
   if(input.operation==="create"){
    if(actor.role!=="Founder")return reject("Yalnızca Kurucu görev oluşturabilir",403);
    const title=(input.title||"").trim(),objective=(input.objective||"").trim();
    const expected=(input.expectedOutput||"").trim(),owner=input.ownerId||"";
    if(title.length<2||title.length>200||objective.length<3||objective.length>4000||expected.length>2000)return reject("Görev alanları geçersiz");
    const ownerRow=await client.query('SELECT 1 FROM cc_members WHERE auth_user_id=$1 AND role=$2 AND active=TRUE',[owner,"Contributor"]);
    if(!ownerRow.rowCount)return reject("Aktif Contributor bulunamadı");
    const made=await client.query<{id:string}>('INSERT INTO cc_tasks(title,objective,expected_output,owner_id,created_by) VALUES($1,$2,$3,$4,$5) RETURNING id',[title,objective,expected,owner,actor.id]);
    taskId=made.rows[0].id;
   }else{
    if(!input.id||!/^[0-9a-f-]{36}$/i.test(input.id))return reject("Görev ID geçersiz");
    const res=await client.query<{id:string;owner_id:string;status:string;archived_at:string|null}>(
     'SELECT id,owner_id,status,archived_at FROM cc_tasks WHERE id=$1 FOR UPDATE',[input.id]);
    if(!res.rowCount)return reject("Görev bulunamadı",404);
    const t=res.rows[0];taskId=t.id;
    if(t.archived_at)return reject("Arşivlenmiş görev değiştirilemez",409);
    const own=t.owner_id===actor.id,founder=actor.role==="Founder";
    if(input.operation==="accept"&&own&&t.status==="BRIEFED")await client.query('UPDATE cc_tasks SET status=$2,updated_at=now() WHERE id=$1',[t.id,"ACCEPTED"]);
    else if(input.operation==="start"&&own&&t.status==="ACCEPTED")await client.query('UPDATE cc_tasks SET status=$2,updated_at=now() WHERE id=$1',[t.id,"IN PROGRESS"]);
    else if(input.operation==="submit"&&own&&t.status==="IN PROGRESS"){
     const body=(input.body||"").trim(),url=(input.evidenceUrl||"").trim();
     if(body.length<30||body.length>10000||(url&&!validHttps(url)))return reject("En az 30 karakter rapor ve geçerli HTTPS bağlantısı gerekli");
     await client.query('INSERT INTO cc_deliverables(task_id,submitted_by,body,evidence_url) VALUES($1,$2,$3,$4)',[t.id,actor.id,body,url||null]);
     await client.query('UPDATE cc_tasks SET status=$2,updated_at=now() WHERE id=$1',[t.id,"FOUNDER REVIEW"]);
    }else if(input.operation==="approve"&&founder&&t.status==="FOUNDER REVIEW"){
     const latest=await client.query('SELECT 1 FROM cc_deliverables WHERE task_id=$1 LIMIT 1',[t.id]);
     if(!latest.rowCount)return reject("Somut teslim olmadan onay verilemez",409);
     await client.query('INSERT INTO cc_reviews(task_id,reviewed_by,decision) VALUES($1,$2,$3)',[t.id,actor.id,"APPROVE"]);
     await client.query('UPDATE cc_tasks SET status=$2,updated_at=now() WHERE id=$1',[t.id,"COMPLETED"]);
    }else if(input.operation==="revise"&&founder&&t.status==="FOUNDER REVIEW"){
     const reason=(input.reason||"").trim();
     if(reason.length<10||reason.length>3000)return reject("En az 10 karakter revizyon gerekçesi gerekli");
     await client.query('INSERT INTO cc_reviews(task_id,reviewed_by,decision,reason) VALUES($1,$2,$3,$4)',[t.id,actor.id,"REVISION",reason]);
     await client.query('UPDATE cc_tasks SET status=$2,updated_at=now() WHERE id=$1',[t.id,"IN PROGRESS"]);
    }else if(input.operation==="archive"&&founder&&t.status==="COMPLETED"){
     await client.query('UPDATE cc_tasks SET archived_at=now(),updated_at=now() WHERE id=$1',[t.id]);
    }else return reject("Bu işlem bu rol veya görev durumu için yasak",403);
   }
   await client.query('INSERT INTO cc_audit(actor_id,action,target_id,details) VALUES($1,$2,$3,$4)',[actor.id,input.operation,taskId,JSON.stringify({at:new Date().toISOString()})]);
   await client.query("COMMIT");
   return Response.json({ok:true,taskId},{headers:{"Cache-Control":"no-store"}});
  }catch(e){await client.query("ROLLBACK");throw e;}
  finally{client.release();}
 }catch{return reject("İşlem gerçekleştirilemedi; veri değişikliği geri alındı",500);}
}
