import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"};
const reject=(message:string,status:number)=>Response.json({error:message},{status,headers});

type CountRow={status:string;count:number};
type Item={id:string;title:string;status:string;nextAction?:string;workstream?:string;organization?:string;ownerName?:string};
const normalize=(rows:CountRow[])=>Object.fromEntries(rows.map(r=>[r.status,Number(r.count)]));

export async function GET(){
 if(!phase2Configured())return reject("Command Center Preview etkin değil",503);
 try{
  const actor=await getActor();
  if(!actor)return reject("Yetkisiz",401);
  if(actor.role!=="Founder")return reject("Yalnızca Kurucu erişebilir",403);
  const client=await database().connect();
  let opened=false;
  try{
   // Every count and action list must describe one PostgreSQL snapshot.
   await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
   opened=true;
   const flags=await client.query<{streams:boolean;opportunities:boolean}>(`
    SELECT to_regclass('public.cc_workstreams') IS NOT NULL AS streams,
      to_regclass('public.cc_opportunities') IS NOT NULL AS opportunities`);
   const features=flags.rows[0];
   const tasks=await client.query<CountRow>(`
    SELECT status,count(*)::integer AS count
    FROM cc_tasks WHERE archived_at IS NULL GROUP BY status`);
   const records=await client.query<CountRow>(`
    SELECT status,count(*)::integer AS count
    FROM cc_project_records WHERE archived_at IS NULL GROUP BY status`);
   const recordArchive=await client.query<{count:number}>(`
    SELECT count(*)::integer AS count FROM cc_project_records WHERE archived_at IS NOT NULL`);
   const taskArchive=await client.query<{count:number}>(`
    SELECT count(*)::integer AS count FROM cc_tasks WHERE archived_at IS NOT NULL`);

   const workstreams=features.streams?await client.query<CountRow>(`
    SELECT state AS status,count(*)::integer AS count FROM cc_workstreams GROUP BY state`)
    :{rows:[] as CountRow[]};
   const opportunities=features.opportunities?await client.query<CountRow>(`
    SELECT stage AS status,count(*)::integer AS count
    FROM cc_opportunities WHERE archived_at IS NULL GROUP BY stage`)
    :{rows:[] as CountRow[]};
   const opportunityArchive=features.opportunities?await client.query<{count:number}>(`
    SELECT count(*)::integer AS count FROM cc_opportunities WHERE archived_at IS NOT NULL`)
    :{rows:[{count:0}]};

   // Read-only attention queues. No automatic gate / acceptance decisions.
   const reviews=await client.query<Item>(`
    SELECT t.id::text,t.title,t.status,m.name AS "ownerName"
    FROM cc_tasks t JOIN cc_members m ON m.auth_user_id=t.owner_id
    WHERE t.archived_at IS NULL AND t.status='FOUNDER REVIEW'
    ORDER BY t.updated_at DESC,t.id DESC LIMIT 8`);
   const recordActions=await client.query<Item>(`
    SELECT id::text,title,status,workstream,next_action AS "nextAction"
    FROM cc_project_records
    WHERE archived_at IS NULL AND status IN ('BLOCKED','IN_PROGRESS','TODO','DEFERRED')
     AND length(btrim(next_action))>0
    ORDER BY CASE status WHEN 'BLOCKED' THEN 0 WHEN 'IN_PROGRESS' THEN 1
     WHEN 'TODO' THEN 2 WHEN 'DEFERRED' THEN 3 ELSE 4 END,updated_at DESC,id DESC
    LIMIT 8`);
   const opportunityActions=features.opportunities?await client.query<Item>(`
    SELECT id::text,title,stage AS status,workstream,organization,
      next_action AS "nextAction"
    FROM cc_opportunities
    WHERE archived_at IS NULL AND stage NOT IN ('CLOSED','DORMANT')
      AND length(btrim(next_action))>0
    ORDER BY CASE stage WHEN 'WAITING_EXTERNAL' THEN 0 WHEN 'INTERNAL_REVIEW' THEN 1
     WHEN 'PROPOSAL' THEN 2 WHEN 'DISCUSSION' THEN 3
     WHEN 'REPLY_RECEIVED' THEN 4 WHEN 'CONTACTED' THEN 5
     WHEN 'QUALIFIED' THEN 6 ELSE 7 END,updated_at DESC,id DESC LIMIT 8`)
    :{rows:[] as Item[]};

   await client.query("COMMIT");
   opened=false;
   return Response.json({
    scope:"OPERATIONAL_ONLY_NOT_CANONICAL",
    asOf:new Date().toISOString(),
    source:"Preview PostgreSQL operational tables",
    features,
    counts:{
      tasks:normalize(tasks.rows),archivedTasks:taskArchive.rows[0]?.count||0,
      records:normalize(records.rows),archivedRecords:recordArchive.rows[0]?.count||0,
      workstreams:normalize(workstreams.rows),
      opportunities:normalize(opportunities.rows),
      archivedOpportunities:opportunityArchive.rows[0]?.count||0
    },
    attention:{founderReviews:reviews.rows,recordActions:recordActions.rows,
      opportunityActions:opportunityActions.rows},
    limits:{perQueue:8},
    note:"Only entered operational records. No Master/VDCP/lifecycle synchronization, no Genesis readiness or legal confirmation."
   },{headers});
  }catch{
   if(opened)await client.query("ROLLBACK").catch(()=>{});
   return reject("Yönetim özeti okunamadı; hiçbir kayıt değiştirilmedi",503);
  }finally{client.release();}
 }catch{return reject("Yönetim özetine erişilemiyor",503);}
}
