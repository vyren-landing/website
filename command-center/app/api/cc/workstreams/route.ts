import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const headers={"Cache-Control":"private, no-store"};
const fail=(message:string,status:number)=>Response.json({error:message},{status,headers});

type StreamRow={
 name:string;total:number;todo:number;inProgress:number;done:number;
 blocked:number;deferred:number;updatedAt:string
};
type NextActionRow={workstream:string;title:string;status:string;nextAction:string};

export async function GET(){
 if(!phase2Configured())return fail("Command Center Preview yapılandırmasını kontrol edin",503);
 try{
  const actor=await getActor();
  if(!actor)return fail("Yetkisiz",401);
  if(actor.role!=="Founder")return fail("Yalnızca Kurucu erişebilir",403);

  const client=await database().connect();
  let open=false;
  try{
   await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
   open=true;
   // This is an operational projection of actual records; it never imports
   // or changes the canonical Master, lifecycle, FFA or VDCP sources.
   const summary=await client.query<StreamRow>(`
    SELECT workstream AS name,
      count(*)::integer AS total,
      count(*) FILTER (WHERE status='TODO')::integer AS todo,
      count(*) FILTER (WHERE status='IN_PROGRESS')::integer AS "inProgress",
      count(*) FILTER (WHERE status='DONE')::integer AS done,
      count(*) FILTER (WHERE status='BLOCKED')::integer AS blocked,
      count(*) FILTER (WHERE status='DEFERRED')::integer AS deferred,
      max(updated_at) AS "updatedAt"
    FROM cc_project_records
    WHERE archived_at IS NULL
    GROUP BY workstream
    ORDER BY workstream ASC
   `);
   // Bounded next-action display, not a limited/partial record export.
   const actions=await client.query<NextActionRow>(`
    SELECT workstream,title,status,next_action AS "nextAction" FROM (
      SELECT workstream,title,status,next_action,updated_at,
        row_number() OVER (PARTITION BY workstream
          ORDER BY CASE status
            WHEN 'BLOCKED' THEN 0 WHEN 'IN_PROGRESS' THEN 1
            WHEN 'TODO' THEN 2 WHEN 'DEFERRED' THEN 3 ELSE 4 END,
            updated_at DESC, id DESC) AS rank
      FROM cc_project_records
      WHERE archived_at IS NULL
        AND status IN ('BLOCKED','IN_PROGRESS','TODO','DEFERRED')
        AND length(btrim(next_action))>0
    ) ranked WHERE rank<=3 ORDER BY workstream,rank
   `);
   await client.query("COMMIT");
   open=false;
   return Response.json({
    scope:"OPERATIONAL_ONLY_NOT_CANONICAL",
    source:"cc_project_records",
    asOf:new Date().toISOString(),
    streams:summary.rows.map(s=>({...s,
      nextActions:actions.rows.filter(a=>a.workstream===s.name).map(a=>({
        title:a.title,status:a.status,nextAction:a.nextAction
      }))
    }))
   },{headers});
  }catch{
   if(open)await client.query("ROLLBACK").catch(()=>{});
   return fail("Çalışma alanları okunamadı; proje kayıtları değiştirilmedi",503);
  }finally{client.release();}
 }catch{
  return fail("Çalışma alanlarına erişilemiyor",503);
 }
}
