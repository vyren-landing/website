import {Pool} from "pg";
import {betterAuth} from "better-auth";
import {nextCookies} from "better-auth/next-js";
import {headers} from "next/headers";

export type MemberRole = "Founder"|"Contributor";
export type Actor = {id:string;name:string;role:MemberRole};
let pool:Pool|undefined;

export function phase2Configured(){
 return process.env.CC_LIVE_ENABLED==="true" && !!(process.env.DATABASE_URL&&process.env.BETTER_AUTH_SECRET&&process.env.GITHUB_CLIENT_ID&&process.env.GITHUB_CLIENT_SECRET&&process.env.FOUNDER_GITHUB_ACCOUNT_ID);
}
export function database(){
 if(!process.env.DATABASE_URL)throw new Error("Database is not configured");
 if(!pool)pool=new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:7000,idleTimeoutMillis:30000,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:true}:undefined});
 return pool;
}
function createAuth(){
 return betterAuth({
   database:database(),
   secret:process.env.BETTER_AUTH_SECRET!,
   emailAndPassword:{enabled:false},
   // A Google login sharing the Founder's email must not silently gain Github authority.
   account:{accountLinking:{disableImplicitLinking:true}},
   socialProviders:{
     github:{clientId:process.env.GITHUB_CLIENT_ID!,clientSecret:process.env.GITHUB_CLIENT_SECRET!},
     ...(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET?
       {google:{clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET,prompt:"select_account" as const}}:{})
   },
   session:{cookieCache:{enabled:true,maxAge:5*60}},
   plugins:[nextCookies()]
  });
}
let auth:ReturnType<typeof createAuth>|undefined;
export function getAuth(){
 if(!phase2Configured())return null;
 if(!auth)auth=createAuth();
 return auth;
}
/** Fail-closed authorization: provider identity + explicit role allowlists, never OAuth alone. */
export async function getActor():Promise<Actor|null>{
 const provider=getAuth();if(!provider)return null;
 const session=await provider.api.getSession({headers:await headers()});
 if(!session?.user?.id)return null;
 const uid=session.user.id;
 const accounts=await database().query<{accountId:string;providerId:string}>(
  'SELECT "accountId", "providerId" FROM account WHERE "userId"=$1 AND "providerId" IN ($2,$3)',
  [uid,"github","google"]);
 const githubId=accounts.rows.find(a=>a.providerId==="github")?.accountId;
 const googleId=accounts.rows.find(a=>a.providerId==="google")?.accountId;
 const founder=!!githubId&&githubId===process.env.FOUNDER_GITHUB_ACCOUNT_ID;
 const githubTest=!!githubId&&!!process.env.TEST_GITHUB_ACCOUNT_ID&&githubId===process.env.TEST_GITHUB_ACCOUNT_ID&&!founder;
 const approvedGoogleEmail=(process.env.TEST_GOOGLE_EMAIL||"").trim().toLowerCase();
 const googleTest=!!googleId&&!!approvedGoogleEmail&&session.user.emailVerified===true&&
  session.user.email.toLowerCase()===approvedGoogleEmail&&
  (!process.env.TEST_GOOGLE_ACCOUNT_ID||googleId===process.env.TEST_GOOGLE_ACCOUNT_ID);
 let role:MemberRole|null=founder?"Founder":(githubTest||googleTest?"Contributor":null);
 // Only an explicitly invited, verified Google identity may become a new Contributor.
 // The first verified login pins the grant to Google's provider account ID and Better Auth user.
 // Revoked grants cannot silently re-bind to a different identity at the same address.
 if(!role&&googleId&&session.user.emailVerified===true){
  const email=(session.user.email||"").trim().toLowerCase();
  if(email){
   const db=database();
   const claim=await db.query<{id:string}>(
    `UPDATE cc_team_invites
      SET status='ACTIVE',google_account_id=$2,member_id=$3,updated_at=now()
      WHERE email=$1 AND status='PENDING' AND google_account_id IS NULL AND member_id IS NULL
      RETURNING id`,[email,googleId,uid]);
   if(claim.rowCount)role="Contributor";
   else {
    const invited=await db.query<{status:string;google_account_id:string|null;member_id:string|null}>(
     'SELECT status,google_account_id,member_id FROM cc_team_invites WHERE email=$1',[email]);
    if(invited.rows[0]?.status==="ACTIVE"&&invited.rows[0].google_account_id===googleId&&invited.rows[0].member_id===uid)
     role="Contributor";
   }
  }
 }
 if(!role)return null;
 const name=(googleTest&&!founder?"VYREN Test Contributor":(session.user.name||"Member")).slice(0,150);
 await database().query(
  'INSERT INTO cc_members(auth_user_id,role,name,active) VALUES($1,$2,$3,TRUE) ON CONFLICT(auth_user_id) DO UPDATE SET role=EXCLUDED.role,name=EXCLUDED.name,updated_at=now()',
  [uid,role,name]);
 const member=await database().query<{active:boolean}>('SELECT active FROM cc_members WHERE auth_user_id=$1',[uid]);
 if(!member.rows[0]?.active)return null;
 return {id:uid,name,role};
}
