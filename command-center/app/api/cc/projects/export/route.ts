import {database,getActor,phase2Configured} from "../../../../../lib/phase2";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store, max-age=0","X-Content-Type-Options":"nosniff"};
const reject=(message:string,status:number)=>Response.json({error:message},{status,headers});
export async function GET(){
 if(!phase2Configured())return reject("Command Center Preview yapılandırılmadı",503);
 const actor=await getActor();
 if(!actor)return reject("Yetkisiz",401);
 if(actor.role!=="Founder")return reject("Yalnızca Kurucu erişebilir",403);
 const client=await database().connect();let opened=false;
 try{
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");opened=true;
  const readiness=await client.query<{ready:boolean}>(`SELECT
   to_regclass('public.cc_projects') IS NOT NULL
   AND to_regclass('public.cc_project_events') IS NOT NULL
   AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
    AND table_name='cc_tasks' AND column_name='project_id')
   AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
    AND table_name='cc_project_records' AND column_name='project_id') AS ready`);
  if(!readiness.rows[0]?.ready){await client.query("ROLLBACK");opened=false;return reject("Preview migration 006 henüz uygulanmadı",503);}
  const counts=await client.query<{projects:string;events:string;taskLinks:string;recordLinks:string}>(`
   SELECT
    (SELECT count(*)::text FROM cc_projects) AS projects,
    (SELECT count(*)::text FROM cc_project_events) AS events,
    (SELECT count(*)::text FROM cc_tasks WHERE project_id IS NOT NULL) AS "taskLinks",
    (SELECT count(*)::text FROM cc_project_records WHERE project_id IS NOT NULL) AS "recordLinks"`);
  const c=counts.rows[0];
  const numbers=[c.projects,c.events,c.taskLinks,c.recordLinks].map(Number);
  if(numbers.some(n=>!Number.isSafeInteger(n)||n<0)||numbers[0]>10000||numbers[1]>100000||numbers[2]>100000||numbers[3]>100000){
   await client.query("ROLLBACK");opened=false;
   return reject("Eksiksiz proje aktarımı sınırı aşıldı; sayfalı aktarım gerekli",413);
  }
  const [projects,events,tasks,records]=await Promise.all([
   client.query(`SELECT id::text,title,workstream_id::text AS "workstreamId",
     objective,next_action AS "nextAction",status,revision,
     created_by AS "createdBy",updated_by AS "updatedBy",
     archived_at AS "archivedAt",created_at AS "createdAt",updated_at AS "updatedAt"
     FROM cc_projects ORDER BY created_at,id`),
   client.query(`SELECT id::text,project_id::text AS "projectId",actor_id AS "actorId",
     action,revision,snapshot,created_at AS "createdAt" FROM cc_project_events ORDER BY id`),
   client.query(`SELECT id::text,project_id::text AS "projectId",status,
     archived_at AS "archivedAt" FROM cc_tasks WHERE project_id IS NOT NULL ORDER BY id`),
   client.query(`SELECT id::text,project_id::text AS "projectId",revision,
     archived_at AS "archivedAt" FROM cc_project_records WHERE project_id IS NOT NULL ORDER BY id`)
  ]);
  if([projects.rowCount,events.rowCount,tasks.rowCount,records.rowCount].some((n,i)=>n!==numbers[i]))
   throw Error("Snapshot count mismatch");
  await client.query("COMMIT");opened=false;
  const at=new Date().toISOString();
  const body=JSON.stringify({format:"VYREN_CC_OPERATIONAL_PROJECT_LINKS_V1",exportedAt:at,
   authority:"OPERATIONAL_ONLY_NOT_CANONICAL",counts:{projects:numbers[0],events:numbers[1],
   taskLinks:numbers[2],recordLinks:numbers[3]},projects:projects.rows,events:events.rows,
   taskLinks:tasks.rows,recordLinks:records.rows},null,2);
  return new Response(body,{headers:{...headers,"Content-Type":"application/json; charset=utf-8",
    "Content-Disposition":`attachment; filename="vyren-command-center-projects-${at.slice(0,10)}.json"`}});
 }catch{
  if(opened)await client.query("ROLLBACK").catch(()=>{});
  return reject("Proje aktarımı tamamlanamadı; veri değişmedi",500);
 }finally{client.release();}
}
