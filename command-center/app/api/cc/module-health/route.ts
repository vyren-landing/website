import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"};
const reject=(error:string,status:number)=>Response.json({error},{status,headers});

/** Founder-only operational health scan: SELECTs only; no customer data returned. */
export async function GET(){
 if(!phase2Configured())return reject("Preview yapılandırılmadı",503);
 try {
  const actor=await getActor({readOnly:true});
  if(!actor)return reject("Yetkisiz",401);
  if(actor.role!=="Founder")return reject("Yalnızca Kurucu erişebilir",403);
  const client=await database().connect();
  try {
   await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
   const schema=await client.query<{workstreams:boolean;opportunities:boolean;invites:boolean;position:boolean}>(`SELECT
    to_regclass('public.cc_workstreams') IS NOT NULL AND to_regclass('public.cc_workstream_events') IS NOT NULL AS workstreams,
    to_regclass('public.cc_opportunities') IS NOT NULL AND to_regclass('public.cc_opportunity_events') IS NOT NULL AS opportunities,
    to_regclass('public.cc_team_invites') IS NOT NULL AS invites,
    EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cc_members' AND column_name='position_title') AS position`);
   const ready=schema.rows[0];
   if(!ready?.workstreams||!ready.opportunities||!ready.invites){
    await client.query("COMMIT");
    return Response.json({scope:"FOUNDER_OPERATIONAL_ONLY",schema:ready,allChecksPassed:false,reason:"MISSING_MODULE_SCHEMA",checkedAt:new Date().toISOString()},{headers});
   }
   const r=await client.query<{
    workstreams:number;workstreamEvents:number;opportunities:number;opportunityEvents:number;
    invites:number;pendingInvites:number;activeInvites:number;revokedInvites:number;
    duplicateStreamRevisions:number;duplicateOpportunityRevisions:number;
    orphanStreamEvents:number;orphanOpportunityEvents:number;invalidInviteLinks:number
   }>(`SELECT
    (SELECT count(*)::int FROM cc_workstreams) AS workstreams,
    (SELECT count(*)::int FROM cc_workstream_events) AS "workstreamEvents",
    (SELECT count(*)::int FROM cc_opportunities) AS opportunities,
    (SELECT count(*)::int FROM cc_opportunity_events) AS "opportunityEvents",
    (SELECT count(*)::int FROM cc_team_invites) AS invites,
    (SELECT count(*)::int FROM cc_team_invites WHERE status='PENDING') AS "pendingInvites",
    (SELECT count(*)::int FROM cc_team_invites WHERE status='ACTIVE') AS "activeInvites",
    (SELECT count(*)::int FROM cc_team_invites WHERE status='REVOKED') AS "revokedInvites",
    (SELECT count(*)::int FROM (SELECT workstream_id,revision FROM cc_workstream_events GROUP BY workstream_id,revision HAVING count(*)>1) d) AS "duplicateStreamRevisions",
    (SELECT count(*)::int FROM (SELECT opportunity_id,revision FROM cc_opportunity_events GROUP BY opportunity_id,revision HAVING count(*)>1) d) AS "duplicateOpportunityRevisions",
    (SELECT count(*)::int FROM cc_workstream_events e LEFT JOIN cc_workstreams w ON w.id=e.workstream_id WHERE w.id IS NULL) AS "orphanStreamEvents",
    (SELECT count(*)::int FROM cc_opportunity_events e LEFT JOIN cc_opportunities o ON o.id=e.opportunity_id WHERE o.id IS NULL) AS "orphanOpportunityEvents",
    (SELECT count(*)::int FROM cc_team_invites i WHERE (i.member_id IS NULL)<>(i.google_account_id IS NULL)) AS "invalidInviteLinks"`);
   await client.query("COMMIT");
   const x=r.rows[0];
   const allChecksPassed=Boolean(x)&&x.duplicateStreamRevisions===0&&x.duplicateOpportunityRevisions===0&&x.orphanStreamEvents===0&&x.orphanOpportunityEvents===0&&x.invalidInviteLinks===0;
   return Response.json({scope:"FOUNDER_OPERATIONAL_ONLY",schema:ready,counts:x,allChecksPassed,checkedAt:new Date().toISOString(),
    caveat:"Salt okunur yapısal kontrol. Gerçek oluşturma, arşiv/restore, invite lifecycle ve bağımsız security testi yerine geçmez."},{headers});
  } catch {
   await client.query("ROLLBACK").catch(()=>{});
   return reject("Modül kontrolü tamamlanamadı",503);
  } finally {client.release();}
 }catch {return reject("Modül sağlık kontrolü için erişim doğrulanamadı",503);}
}
