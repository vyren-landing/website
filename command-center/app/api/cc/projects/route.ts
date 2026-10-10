import {NextRequest} from "next/server";
import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store"};
class Failure extends Error {constructor(message:string,public status=400){super(message);}}
const reject=(message:string,status=400)=>Response.json({error:message},{status,headers});
const uuid=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const statuses=["TODO","IN_PROGRESS","DONE","BLOCKED","DEFERRED"] as const;
type Mutation={operation?:string;id?:string;revision?:number;title?:string;
 objective?:string;nextAction?:string;status?:string;workstreamId?:string|null};
async function founder(){
 if(!phase2Configured())throw new Failure("Command Center Preview yapılandırılmadı",503);
 const actor=await getActor();
 if(!actor)throw new Failure("Yetkisiz",401);
 if(actor.role!=="Founder")throw new Failure("Yalnızca Kurucu erişebilir",403);
 return actor;
}
async function ready(){
 const r=await database().query<{ready:boolean}>(`SELECT
  to_regclass('public.cc_projects') IS NOT NULL
  AND to_regclass('public.cc_project_events') IS NOT NULL AS ready`);
 return r.rows[0]?.ready===true;
}
export async function GET(request:NextRequest){
 try{
  await founder();
  if(!await ready())return Response.json({managementReady:false,projects:[],workstreams:[]},{headers});
  const db=database();
  const history=request.nextUrl.searchParams.get("history");
  if(history!==null){
   if(!uuid(history))throw new Failure("Proje ID geçersiz");
   const exists=await db.query("SELECT 1 FROM cc_projects WHERE id=$1",[history]);
   if(!exists.rowCount)throw new Failure("Proje bulunamadı",404);
   const events=await db.query(`SELECT action,revision,snapshot,created_at AS "createdAt"
      FROM cc_project_events WHERE project_id=$1 ORDER BY id DESC LIMIT 100`,[history]);
   return Response.json({events:events.rows},{headers});
  }
  const archived=request.nextUrl.searchParams.get("archived")==="1";
  const [projects,workstreams]=await Promise.all([
   db.query(`SELECT p.id::text AS id,p.title,p.objective,p.next_action AS "nextAction",
      p.workstream_id::text AS "workstreamId",w.display_name AS "workstreamName",
      p.status,p.revision,p.archived_at AS "archivedAt",
      p.updated_at AS "updatedAt",
      (SELECT count(*)::integer FROM cc_tasks t WHERE t.project_id=p.id AND t.archived_at IS NULL) AS "taskCount",
      (SELECT count(*)::integer FROM cc_tasks t WHERE t.project_id=p.id AND t.status='COMPLETED' AND t.archived_at IS NULL) AS "completedTaskCount",
      (SELECT count(*)::integer FROM cc_project_records r WHERE r.project_id=p.id AND r.archived_at IS NULL) AS "recordCount"
     FROM cc_projects p LEFT JOIN cc_workstreams w ON w.id=p.workstream_id
     WHERE ($1::boolean OR p.archived_at IS NULL)
     ORDER BY p.updated_at DESC LIMIT 250`,[archived]),
   db.query(`SELECT id::text AS id,display_name AS name,source_key AS "sourceKey",state
      FROM cc_workstreams WHERE state<>'ARCHIVED' ORDER BY display_name`)
  ]);
  return Response.json({managementReady:true,projects:projects.rows,workstreams:workstreams.rows},{headers});
 }catch(e){
  if(e instanceof Failure)return reject(e.message,e.status);
  return reject("Projeler okunamadı; Preview 006 migration ve veritabanını doğrulayın",503);
 }
}
export async function POST(request:NextRequest){
 if(request.headers.get("origin")!==new URL(request.url).origin)return reject("Geçersiz Origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")return reject("JSON gerekli",415);
 const raw=await request.text();
 if(raw.length>15000)return reject("İstek çok uzun",413);
 let input:Mutation;
 try{input=JSON.parse(raw);if(!input||typeof input!=="object"||Array.isArray(input))throw Error();}
 catch{return reject("Geçersiz JSON");}
 try{
  const actor=await founder();
  if(!await ready())throw new Failure("Projeler için Preview migration 006 bekleniyor",503);
  const op=input.operation;
  if(!["create","update","archive","restore"].includes(op||""))throw new Failure("Geçersiz proje işlemi");
  const client=await database().connect();
  try{
   await client.query("BEGIN");
   let id="";
   if(op==="create"||op==="update"){
    const title=(input.title||"").trim(),objective=(input.objective||"").trim();
    const nextAction=(input.nextAction||"").trim();
    const workstreamId=input.workstreamId||null;
    if(title.length<2||title.length>200||objective.length>4000||nextAction.length>2000||
       !statuses.includes(input.status as typeof statuses[number])||
       (workstreamId&&!uuid(workstreamId)))throw new Failure("Proje alanları geçersiz");
    if(workstreamId){
     const ws=await client.query("SELECT 1 FROM cc_workstreams WHERE id=$1 AND state<>'ARCHIVED'",[workstreamId]);
     if(!ws.rowCount)throw new Failure("Aktif veya bekleyen çalışma alanı bulunamadı",409);
    }
    if(op==="create"){
     const made=await client.query<{id:string}>(`INSERT INTO cc_projects
       (title,objective,next_action,status,workstream_id,created_by,updated_by)
       VALUES($1,$2,$3,$4,$5,$6,$6) RETURNING id::text AS id`,
       [title,objective,nextAction,input.status,workstreamId,actor.id]);
     id=made.rows[0].id;
    }else{
     if(!input.id||!uuid(input.id)||!Number.isInteger(input.revision)||!input.revision||input.revision<1)
      throw new Failure("Proje ID/revizyon geçersiz");
     const current=await client.query<{revision:number;archived_at:string|null}>(
       "SELECT revision,archived_at FROM cc_projects WHERE id=$1 FOR UPDATE",[input.id]);
     if(!current.rowCount)throw new Failure("Proje bulunamadı",404);
     if(current.rows[0].archived_at)throw new Failure("Arşivlenmiş proje güncellenemez",409);
     if(current.rows[0].revision!==input.revision)throw new Failure("Proje başka işlemle güncellendi; yenileyin",409);
     id=input.id;
     await client.query(`UPDATE cc_projects SET title=$2,objective=$3,next_action=$4,status=$5,
       workstream_id=$6,revision=revision+1,updated_by=$7,updated_at=now() WHERE id=$1`,
       [id,title,objective,nextAction,input.status,workstreamId,actor.id]);
    }
   }else{
    if(!input.id||!uuid(input.id)||!Number.isInteger(input.revision)||!input.revision||input.revision<1)
     throw new Failure("Proje ID/revizyon geçersiz");
    const current=await client.query<{revision:number;archived_at:string|null}>(
      "SELECT revision,archived_at FROM cc_projects WHERE id=$1 FOR UPDATE",[input.id]);
    if(!current.rowCount)throw new Failure("Proje bulunamadı",404);
    if(current.rows[0].revision!==input.revision)throw new Failure("Proje başka işlemle güncellendi; yenileyin",409);
    if(op==="archive"&&current.rows[0].archived_at)throw new Failure("Proje zaten arşivde",409);
    if(op==="restore"&&!current.rows[0].archived_at)throw new Failure("Proje arşivde değil",409);
    id=input.id;
    await client.query(`UPDATE cc_projects SET archived_at=$2,revision=revision+1,
      updated_by=$3,updated_at=now() WHERE id=$1`,
      [id,op==="archive"?new Date():null,actor.id]);
   }
   const after=await client.query<{revision:number;state:unknown}>(`
     SELECT revision,to_jsonb(p)-'created_by'-'updated_by' AS state
     FROM cc_projects p WHERE id=$1`,[id]);
   await client.query(`INSERT INTO cc_project_events
     (project_id,actor_id,action,revision,snapshot) VALUES($1,$2,$3,$4,$5::jsonb)`,
     [id,actor.id,(op||"").toUpperCase(),after.rows[0].revision,JSON.stringify(after.rows[0].state)]);
   await client.query("INSERT INTO cc_audit(actor_id,action,target_id,details) VALUES($1,$2,$3,$4)",
     [actor.id,"project_"+op,id,JSON.stringify({revision:after.rows[0].revision})]);
   await client.query("COMMIT");
   return Response.json({ok:true,id,revision:after.rows[0].revision},{headers});
  }catch(e){await client.query("ROLLBACK");throw e;}
  finally{client.release();}
 }catch(e){
  if(e instanceof Failure)return reject(e.message,e.status);
  return reject("Proje işlemi tamamlanamadı; işlem geri alındı",500);
 }
}
