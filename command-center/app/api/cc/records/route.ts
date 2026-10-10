import {NextRequest} from "next/server";
import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";

type Status="TODO"|"IN_PROGRESS"|"DONE"|"BLOCKED"|"DEFERRED";
type Mutation={operation?:string;id?:string;revision?:number;workstream?:string;title?:string;summary?:string;status?:string;nextAction?:string;evidenceUrl?:string};
type Row={id:string;revision:number;archived_at:string|null};
class Failure extends Error{constructor(message:string,public status=400){super(message);}}
const reject=(message:string,status=400)=>Response.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
const uuid=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const statuses:Status[]=["TODO","IN_PROGRESS","DONE","BLOCKED","DEFERRED"];
const safeUrl=(u:string)=>{try{const x=new URL(u);return x.protocol==="https:"&&Boolean(x.hostname)&&u.length<=2000;}catch{return false;}};
const sameOrigin=(r:NextRequest)=>r.headers.get("origin")===new URL(r.url).origin;
async function checkedFounder(){
 if(!phase2Configured())throw new Failure("Command Center Preview kurulumunu kontrol edin",503);
 const actor=await getActor();
 if(!actor)throw new Failure("Yetkisiz",401);
 if(actor.role!=="Founder")throw new Failure("Yalnızca Kurucu erişebilir",403);
 return actor;
}

const columns=`id::text,title,workstream,summary,status,next_action AS "nextAction",
 evidence_url AS "evidenceUrl",revision,archived_at AS "archivedAt",
 created_at AS "createdAt",updated_at AS "updatedAt"`;

export async function GET(request:NextRequest){
 try{
  await checkedFounder();
  const db=database();
  const history=request.nextUrl.searchParams.get("history");
  if(history!==null){
   if(!uuid(history))throw new Failure("Kayıt ID geçersiz");
   const exists=await db.query("SELECT 1 FROM cc_project_records WHERE id=$1",[history]);
   if(!exists.rowCount)throw new Failure("Kayıt bulunamadı",404);
   const events=await db.query(`SELECT action,revision,snapshot,created_at AS "createdAt"
     FROM cc_project_record_events WHERE record_id=$1 ORDER BY id DESC LIMIT 100`,[history]);
   return Response.json({events:events.rows},{headers:{"Cache-Control":"no-store"}});
  }
  const includeArchived=request.nextUrl.searchParams.get("archived")==="1";
  const records=await db.query(
   `SELECT ${columns} FROM cc_project_records
    WHERE ($1::boolean OR archived_at IS NULL) ORDER BY updated_at DESC LIMIT 250`,
   [includeArchived]);
  return Response.json({records:records.rows},{headers:{"Cache-Control":"no-store"}});
 }catch(e){
  if(e instanceof Failure)return reject(e.message,e.status);
  return reject("Proje kayıtları henüz hazır değil. Preview 003 migration durumunu kontrol edin.",503);
 }
}

export async function POST(request:NextRequest){
 if(!sameOrigin(request))return reject("Geçersiz Origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")return reject("JSON gerekli",415);
 const raw=await request.text();
 if(raw.length>15000)return reject("İstek fazla uzun",413);
 let input:Mutation;
 try{input=JSON.parse(raw);if(!input||typeof input!=="object"||Array.isArray(input))throw Error();}
 catch{return reject("Geçersiz JSON");}

 try{
  const actor=await checkedFounder();
  const op=input.operation;
  if(!["create","update","archive","restore"].includes(op||""))throw new Failure("Geçersiz kayıt işlemi");
  const db=database(),client=await db.connect();
  try{
   await client.query("BEGIN");
   let id="";
   if(op==="create"||op==="update"){
    const title=(input.title||"").trim();
    const workstream=(input.workstream||"").trim();
    const summary=(input.summary||"").trim();
    const nextAction=(input.nextAction||"").trim();
    const evidenceUrl=(input.evidenceUrl||"").trim();
    if(title.length<2||title.length>200||workstream.length<2||workstream.length>120||
      summary.length>4000||nextAction.length>2000||(evidenceUrl&&!safeUrl(evidenceUrl)))
      throw new Failure("Kayıt alanları geçersiz");
    if(!statuses.includes(input.status as Status))throw new Failure("Geçersiz kayıt durumu");
    if(op==="create"){
     const made=await client.query<{id:string}>(`INSERT INTO cc_project_records
       (title,workstream,summary,status,next_action,evidence_url,created_by,updated_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$7) RETURNING id::text AS id`,
      [title,workstream,summary,input.status,nextAction,evidenceUrl||null,actor.id]);
     id=made.rows[0].id;
    }else{
     if(!input.id||!uuid(input.id)||typeof input.revision!=="number"||!Number.isInteger(input.revision)||input.revision<1)
      throw new Failure("Kayıt ID/revizyon geçersiz");
     const current=await client.query<Row>(
      "SELECT id::text AS id,revision,archived_at FROM cc_project_records WHERE id=$1 FOR UPDATE",[input.id]);
     if(!current.rowCount)throw new Failure("Kayıt bulunamadı",404);
     if(current.rows[0].archived_at)throw new Failure("Arşivlenmiş kayıt değiştirilemez",409);
     if(current.rows[0].revision!==input.revision)throw new Failure("Kayıt başka bir işlemle güncellendi; listeyi yenileyin",409);
     id=current.rows[0].id;
     await client.query(`UPDATE cc_project_records SET
       title=$2,workstream=$3,summary=$4,status=$5,next_action=$6,evidence_url=$7,
       revision=revision+1,updated_by=$8,updated_at=now() WHERE id=$1`,
      [id,title,workstream,summary,input.status,nextAction,evidenceUrl||null,actor.id]);
    }
   }else{
    if(!input.id||!uuid(input.id)||typeof input.revision!=="number"||!Number.isInteger(input.revision)||input.revision<1)
     throw new Failure("Kayıt ID/revizyon geçersiz");
    const current=await client.query<Row>(
     "SELECT id::text AS id,revision,archived_at FROM cc_project_records WHERE id=$1 FOR UPDATE",[input.id]);
    if(!current.rowCount)throw new Failure("Kayıt bulunamadı",404);
    if(current.rows[0].revision!==input.revision)throw new Failure("Kayıt başka bir işlemle güncellendi; listeyi yenileyin",409);
    if(op==="archive"&&current.rows[0].archived_at)throw new Failure("Zaten arşivde",409);
    if(op==="restore"&&!current.rows[0].archived_at)throw new Failure("Kayıt arşivde değil",409);
    id=current.rows[0].id;
    await client.query(`UPDATE cc_project_records SET archived_at=$2,
     revision=revision+1,updated_by=$3,updated_at=now() WHERE id=$1`,
     [id,op==="archive"?new Date():null,actor.id]);
   }

   // Capture the exact server-side post-mutation state, never a user-claimed event.
   const after=await client.query<{revision:number;state:unknown}>(
    `SELECT revision,to_jsonb(r) - 'created_by' - 'updated_by' AS state
      FROM cc_project_records r WHERE id=$1`,[id]);
   await client.query(
    `INSERT INTO cc_project_record_events(record_id,actor_id,action,revision,snapshot)
      VALUES($1,$2,$3,$4,$5::jsonb)`,
    [id,actor.id,(op||"").toUpperCase(),after.rows[0].revision,JSON.stringify(after.rows[0].state)]);
   await client.query("INSERT INTO cc_audit(actor_id,action,target_id,details) VALUES($1,$2,$3,$4)",
    [actor.id,"record_"+op,id,JSON.stringify({revision:after.rows[0].revision})]);
   await client.query("COMMIT");
   return Response.json({ok:true,id,revision:after.rows[0].revision},{headers:{"Cache-Control":"no-store"}});
  }catch(e){await client.query("ROLLBACK");throw e;}
  finally{client.release();}
 }catch(e){
  if(e instanceof Failure)return reject(e.message,e.status);
  return reject("Kayıt işlemi tamamlanamadı. Değişiklik geri alındı.",500);
 }
}
