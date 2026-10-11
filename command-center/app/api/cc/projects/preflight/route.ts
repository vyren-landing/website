import {database,getActor,phase2Configured} from "../../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"};
const reject=(message:string,status:number)=>Response.json({error:message},{status,headers});

type SchemaRow={
 members:boolean;tasks:boolean;records:boolean;workstreams:boolean;
 projects:boolean;events:boolean;taskLink:boolean;recordLink:boolean;
 projectsWorkstreamFk:boolean;tasksProjectFk:boolean;recordsProjectFk:boolean;
 eventsProjectFk:boolean;
};
const required=["members","tasks","records","workstreams","projects","events",
 "taskLink","recordLink","projectsWorkstreamFk","tasksProjectFk","recordsProjectFk",
 "eventsProjectFk"] as const;

/** Founder-only, read-only Preview schema inspection. Never executes a migration. */
export async function GET(){
 if(process.env.VERCEL_ENV!=="preview")return reject("Yalnızca Preview ortamında",404);
 if(!phase2Configured())return reject("Preview erişimi yapılandırılmadı",503);
 try{
  const actor=await getActor({readOnly:true});
  if(!actor)return reject("Yetkisiz",401);
  if(actor.role!=="Founder")return reject("Yalnızca Kurucu erişebilir",403);
  const client=await database().connect();
  let opened=false;
  try{
   await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
   opened=true;
   const metadata=await client.query<SchemaRow>(`SELECT
     to_regclass('public.cc_members') IS NOT NULL AS members,
     to_regclass('public.cc_tasks') IS NOT NULL AS tasks,
     to_regclass('public.cc_project_records') IS NOT NULL AS records,
     to_regclass('public.cc_workstreams') IS NOT NULL AS workstreams,
     to_regclass('public.cc_projects') IS NOT NULL AS projects,
     to_regclass('public.cc_project_events') IS NOT NULL AS events,
     EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
      AND table_name='cc_tasks' AND column_name='project_id') AS "taskLink",
     EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
      AND table_name='cc_project_records' AND column_name='project_id') AS "recordLink",
     EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conrelid=to_regclass('public.cc_projects')
      AND c.contype='f' AND c.confrelid=to_regclass('public.cc_workstreams')) AS "projectsWorkstreamFk",
     EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conrelid=to_regclass('public.cc_tasks')
      AND c.contype='f' AND c.confrelid=to_regclass('public.cc_projects')) AS "tasksProjectFk",
     EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conrelid=to_regclass('public.cc_project_records')
      AND c.contype='f' AND c.confrelid=to_regclass('public.cc_projects')) AS "recordsProjectFk",
     EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conrelid=to_regclass('public.cc_project_events')
      AND c.contype='f' AND c.confrelid=to_regclass('public.cc_projects')) AS "eventsProjectFk"`);
   const schema=metadata.rows[0];
   const missing=required.filter(k=>schema[k]!==true);
   let counts:null|{projects:number;projectEvents:number;linkedTasks:number;linkedRecords:number;
    orphanTaskLinks:number;orphanRecordLinks:number}=null;
   if(missing.length===0){
    const counted=await client.query<{projects:number;projectEvents:number;linkedTasks:number;
     linkedRecords:number;orphanTaskLinks:number;orphanRecordLinks:number}>(`
      SELECT
       (SELECT count(*)::integer FROM cc_projects) AS projects,
       (SELECT count(*)::integer FROM cc_project_events) AS "projectEvents",
       (SELECT count(*)::integer FROM cc_tasks WHERE project_id IS NOT NULL) AS "linkedTasks",
       (SELECT count(*)::integer FROM cc_project_records WHERE project_id IS NOT NULL) AS "linkedRecords",
       (SELECT count(*)::integer FROM cc_tasks t LEFT JOIN cc_projects p ON p.id=t.project_id
         WHERE t.project_id IS NOT NULL AND p.id IS NULL) AS "orphanTaskLinks",
       (SELECT count(*)::integer FROM cc_project_records r LEFT JOIN cc_projects p ON p.id=r.project_id
         WHERE r.project_id IS NOT NULL AND p.id IS NULL) AS "orphanRecordLinks"`);
    counts=counted.rows[0];
   }
   await client.query("COMMIT");opened=false;
   return Response.json({scope:"PREVIEW_ONLY",authority:"OPERATIONAL_ONLY",
    schemaReady:missing.length===0,missing,checks:schema,counts,
    backup:"NOT_VERIFIED_BY_THIS_CHECK",
    migrationExecution:"NOT_PERFORMED_BY_THIS_CHECK",
    runtimeTests:"NOT_VERIFIED_BY_THIS_CHECK",
    checkedAt:new Date().toISOString()},{headers});
  }catch{
   if(opened)await client.query("ROLLBACK").catch(()=>{});
   return reject("Ön kontrol tamamlanamadı. Şema veya erişim doğrulanmalı.",503);
  }finally{client.release();}
 }catch{return reject("Ön kontrol için erişim doğrulanamadı",503);}
}
