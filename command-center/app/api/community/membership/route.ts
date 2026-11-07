import {NextRequest} from "next/server";
import {headers} from "next/headers";
import {communityEnabled,database,getAuth} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};
function fail(message:string,status:number){return Response.json({error:message},{status,headers:noStore});}
async function currentUser(){
 const auth=getAuth();
 if(!auth)return null;
 const session=await auth.api.getSession({headers:await headers()});
 return session?.user?.id?session.user:null;
}
async function approvedSocial(userId:string){
 const r=await database().query<{accountId:string}>(
  'SELECT "accountId" FROM account WHERE "userId"=$1 AND "providerId"=$2 LIMIT 1',[userId,"google"]);
 return (r.rowCount??0)>0;
}
export async function GET(){
 if(!communityEnabled())return fail("Community membership is not yet available",503);
 try{
  const user=await currentUser();
  if(!user)return Response.json({signedIn:false,joined:false},{headers:noStore});
  const p=await database().query<{displayName:string;wantsToContribute:boolean}>(
   'SELECT display_name AS "displayName", wants_to_contribute AS "wantsToContribute" FROM cc_community_profiles WHERE auth_user_id=$1',[user.id]);
  return Response.json({signedIn:true,joined:(p.rowCount??0)>0,profile:p.rows[0]||null},{headers:noStore});
 }catch{return fail("Membership data is unavailable",503);}
}
export async function POST(request:NextRequest){
 if(!communityEnabled())return fail("Community membership is not yet available",503);
 if(request.headers.get("origin")!==new URL(request.url).origin)return fail("Invalid origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")return fail("JSON required",415);
 const raw=await request.text();
 if(raw.length>1000)return fail("Request too large",413);
 let input:{agreeToCommunityRules?:unknown;wantsToContribute?:unknown};
 try{input=JSON.parse(raw);if(!input||typeof input!=="object")throw Error("Invalid");}
 catch{return fail("Invalid request",400);}
 if(input.agreeToCommunityRules!==true||typeof input.wantsToContribute!=="boolean")
  return fail("Community rules consent and contribution preference are required",400);
 try{
  const user=await currentUser();
  if(!user)return fail("Sign in required",401);
  // First phase: only explicitly signed-in Google accounts. LinkedIn will be added
  // after its OAuth app/callback is configured, without implicit account merging.
  if(user.emailVerified!==true||!(await approvedSocial(user.id)))
   return fail("Verified Google sign-in required for this preview",403);
  const display=(user.name||"Member").trim().slice(0,150)||"Member";
  const saved=await database().query(
   'INSERT INTO cc_community_profiles(auth_user_id,display_name,wants_to_contribute) VALUES($1,$2,$3) ON CONFLICT(auth_user_id) DO UPDATE SET wants_to_contribute=EXCLUDED.wants_to_contribute,updated_at=now() RETURNING auth_user_id',
   [user.id,display,input.wantsToContribute]);
  if(!saved.rowCount)return fail("Membership could not be saved",503);
  return Response.json({ok:true,joined:true},{headers:noStore});
 }catch{return fail("Membership is temporarily unavailable",503);}
}
