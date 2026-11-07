import {database} from "../../../../lib/phase2";
import {qaReadinessAllowed} from "../../../../lib/qa-readiness.mjs";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};

export async function GET(){
 if(!qaReadinessAllowed(process.env))return Response.json({error:"Not found"},{status:404,headers:noStore});
 try{
  const check=await database().query<{
   databaseName:string;
   schemaReady:boolean;
   profileRows:number;
   grantRows:number;
  }>(`SELECT
   current_database() AS "databaseName",
   to_regclass('public.cc_community_profiles') IS NOT NULL
   AND to_regclass('public.cc_contributor_grants') IS NOT NULL AS "schemaReady",
   (SELECT count(*)::int FROM cc_community_profiles) AS "profileRows",
   (SELECT count(*)::int FROM cc_contributor_grants) AS "grantRows"`);
  const ready=check.rows[0]?.schemaReady===true;
  return Response.json({
   service:"isolated-community-qa",
   schemaReady:ready,
   communityEnabled:process.env.CC_COMMUNITY_ENABLED==="true",
   commandCenterEnabled:process.env.CC_LIVE_ENABLED==="true",
   noRealUsersProvisioned:check.rows[0]?.profileRows===0&&check.rows[0]?.grantRows===0,
  },{status:ready?200:503,headers:noStore});
 }catch{
  return Response.json({error:"QA database readiness check unavailable"},{status:503,headers:noStore});
 }
}
