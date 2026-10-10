import {database,getActor,phase2Configured} from "../../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const baseHeaders={
 "Cache-Control":"private, no-store, max-age=0",
 "X-Content-Type-Options":"nosniff"
};
function errorResponse(message:string,status:number){
 return Response.json({error:message},{status,headers:baseHeaders});
}

export async function GET(){
 if(!phase2Configured())return errorResponse("Command Center Preview kurulu değil",503);
 try{
  const actor=await getActor();
  if(!actor)return errorResponse("Yetkisiz",401);
  if(actor.role!=="Founder")return errorResponse("Yalnızca Kurucu erişebilir",403);

  const client=await database().connect();
  let transactionOpen=false;
  try{
   // Both tables must represent one consistent database snapshot.
   await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
   transactionOpen=true;
   const counts=await client.query<{records:string;events:string}>(`
    SELECT
     (SELECT count(*)::text FROM cc_project_records) AS records,
     (SELECT count(*)::text FROM cc_project_record_events) AS events
   `);
   const recordCount=Number(counts.rows[0]?.records||0);
   const eventCount=Number(counts.rows[0]?.events||0);
   // Reject rather than silently truncate any historical evidence.
   if(!Number.isSafeInteger(recordCount)||!Number.isSafeInteger(eventCount)||
      recordCount>10000||eventCount>100000){
    await client.query("ROLLBACK");
    transactionOpen=false;
    return errorResponse("Tam veri aktarımı sınırı aşıldı. Eksiksiz, sayfalı aktarım gerektiriyor; hiçbir kayıt kısaltılmadı.",413);
   }
   const records=await client.query(`
    SELECT id::text,title,workstream,summary,status,next_action AS "nextAction",
      evidence_url AS "evidenceUrl",revision,
      created_by AS "createdBy",updated_by AS "updatedBy",
      archived_at AS "archivedAt",created_at AS "createdAt",updated_at AS "updatedAt"
    FROM cc_project_records ORDER BY created_at,id
   `);
   const events=await client.query(`
    SELECT id::text,record_id::text AS "recordId",actor_id AS "actorId",
      action,revision,snapshot,created_at AS "createdAt"
    FROM cc_project_record_events ORDER BY id
   `);
   if(records.rowCount!==recordCount||events.rowCount!==eventCount)
    throw new Error("Export snapshot totals inconsistent");

   // Workstream metadata and actual audit revisions travel with project records.
   // The old records-only export remains operational until Preview migration 004.
   const schema=await client.query<{ready:boolean}>(`SELECT
     to_regclass('public.cc_workstreams') IS NOT NULL
     AND to_regclass('public.cc_workstream_events') IS NOT NULL AS ready`);
   const withWorkstreams=schema.rows[0]?.ready===true;
   let streamCount=0,eventStreamCount=0;
   let workstreams:{rows:unknown[];rowCount:number|null}={rows:[],rowCount:0};
   let workstreamEvents:{rows:unknown[];rowCount:number|null}={rows:[],rowCount:0};
   if(withWorkstreams){
    const count=await client.query<{streams:string;events:string}>(`
     SELECT (SELECT count(*)::text FROM cc_workstreams) AS streams,
      (SELECT count(*)::text FROM cc_workstream_events) AS events`);
    streamCount=Number(count.rows[0]?.streams||0);
    eventStreamCount=Number(count.rows[0]?.events||0);
    if(!Number.isSafeInteger(streamCount)||!Number.isSafeInteger(eventStreamCount)||
       streamCount>10000||eventStreamCount>100000){
     await client.query("ROLLBACK");
     transactionOpen=false;
     return errorResponse("Çalışma alanı ve geçmişinin tam aktarım sınırı aşıldı. Eksik dosya verilmedi.",413);
    }
    workstreams=await client.query(`
     SELECT id::text,source_key AS "sourceKey",display_name AS "name",summary,
      next_action AS "nextAction",state,restore_state AS "restoreState",revision,
      created_by AS "createdBy",updated_by AS "updatedBy",
      created_at AS "createdAt",updated_at AS "updatedAt"
     FROM cc_workstreams ORDER BY created_at,id`);
    workstreamEvents=await client.query(`
     SELECT id::text,workstream_id::text AS "workstreamId",actor_id AS "actorId",
      action,revision,snapshot,created_at AS "createdAt"
     FROM cc_workstream_events ORDER BY id`);
    if(workstreams.rowCount!==streamCount||workstreamEvents.rowCount!==eventStreamCount)
     throw new Error("Workstream export snapshot totals inconsistent");
   }

   // Opportunity pipeline and its immutable history are part of the same portable snapshot.
   // If migration 005 is not installed, export the existing datasets unchanged.
   const oppSchema=await client.query<{ready:boolean}>(`SELECT
     to_regclass('public.cc_opportunities') IS NOT NULL
     AND to_regclass('public.cc_opportunity_events') IS NOT NULL AS ready`);
   const withOpportunities=oppSchema.rows[0]?.ready===true;
   let opportunityCount=0,opportunityEventCount=0;
   let opportunities:{rows:unknown[];rowCount:number|null}={rows:[],rowCount:0};
   let opportunityEvents:{rows:unknown[];rowCount:number|null}={rows:[],rowCount:0};
   if(withOpportunities){
    const count=await client.query<{opportunities:string;events:string}>(`
      SELECT (SELECT count(*)::text FROM cc_opportunities) AS opportunities,
       (SELECT count(*)::text FROM cc_opportunity_events) AS events`);
    opportunityCount=Number(count.rows[0]?.opportunities||0);
    opportunityEventCount=Number(count.rows[0]?.events||0);
    if(!Number.isSafeInteger(opportunityCount)||!Number.isSafeInteger(opportunityEventCount)||
       opportunityCount>10000||opportunityEventCount>100000){
     await client.query("ROLLBACK");
     transactionOpen=false;
     return errorResponse("Fırsatlar ve geçmişinin eksiksiz aktarım sınırı aşıldı; eksik dosya verilmedi.",413);
    }
    opportunities=await client.query(`
      SELECT id::text,title,organization,workstream,category,stage,
       summary,next_action AS "nextAction",evidence_url AS "evidenceUrl",
       revision,created_by AS "createdBy",updated_by AS "updatedBy",
       archived_at AS "archivedAt",created_at AS "createdAt",updated_at AS "updatedAt"
      FROM cc_opportunities ORDER BY created_at,id`);
    opportunityEvents=await client.query(`
      SELECT id::text,opportunity_id::text AS "opportunityId",
       actor_id AS "actorId",action,revision,snapshot,created_at AS "createdAt"
      FROM cc_opportunity_events ORDER BY id`);
    if(opportunities.rowCount!==opportunityCount||opportunityEvents.rowCount!==opportunityEventCount)
     throw new Error("Opportunity export totals inconsistent");
   }

   await client.query("COMMIT");
   transactionOpen=false;
   const exportedAt=new Date().toISOString();
   const filename="vyren-command-center-records-"+exportedAt.slice(0,10)+".json";
   const body=JSON.stringify({
    format:withOpportunities?"VYREN_CC_OPERATIONAL_RECORDS_V3":withWorkstreams?"VYREN_CC_OPERATIONAL_RECORDS_V2":"VYREN_CC_OPERATIONAL_RECORDS_V1",
    exportedAt,
    authority:"OPERATIONAL_ONLY_NOT_CANONICAL",
    scope:"Command Center operational datasets installed in Preview, including archived items and full event snapshots",
    note:"Not VYREN Master, Launch Lifecycle Decision Ledger, FFA or GNR. No canonical decisions are created by this export.",
    counts:{records:recordCount,events:eventCount,
     ...(withWorkstreams?{workstreams:streamCount,workstreamEvents:eventStreamCount}:{}),
     ...(withOpportunities?{opportunities:opportunityCount,opportunityEvents:opportunityEventCount}:{})},
    records:records.rows,
    events:events.rows,
    ...(withWorkstreams?{workstreams:workstreams.rows,workstreamEvents:workstreamEvents.rows}:{}),
    ...(withOpportunities?{opportunities:opportunities.rows,opportunityEvents:opportunityEvents.rows}:{})
   },null,2);
   return new Response(body,{
    status:200,
    headers:{
     ...baseHeaders,
     "Content-Type":"application/json; charset=utf-8",
     "Content-Disposition":`attachment; filename="${filename}"`
    }
   });
  }catch{
   if(transactionOpen)await client.query("ROLLBACK").catch(()=>{});
   return errorResponse("Veri aktarımı tamamlanamadı. Kayıtlar değiştirilmedi.",500);
  }finally{client.release();}
 }catch{
  return errorResponse("Veri aktarımı başlatılamadı.",503);
 }
}
