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

   await client.query("COMMIT");
   transactionOpen=false;
   const exportedAt=new Date().toISOString();
   const filename="vyren-command-center-records-"+exportedAt.slice(0,10)+".json";
   const body=JSON.stringify({
    format:"VYREN_CC_OPERATIONAL_RECORDS_V1",
    exportedAt,
    authority:"OPERATIONAL_ONLY_NOT_CANONICAL",
    scope:"Command Center project records, including archived entries and full event snapshots",
    note:"Not VYREN Master, Launch Lifecycle Decision Ledger, FFA or GNR. No canonical decisions are created by this export.",
    counts:{records:recordCount,events:eventCount},
    records:records.rows,
    events:events.rows
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
