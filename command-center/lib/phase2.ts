import {Pool} from "pg";
import {betterAuth} from "better-auth";
import {nextCookies} from "better-auth/next-js";
import {headers} from "next/headers";

export type MemberRole = "Founder"|"Contributor";
export type Actor = {id:string;name:string;role:MemberRole};
type CCAuth = ReturnType<typeof betterAuth>;
let pool:Pool|undefined;
let auth:CCAuth|undefined;

export function phase2Configured(){
 return !!(process.env.DATABASE_URL&&process.env.BETTER_AUTH_SECRET&&process.env.GITHUB_CLIENT_ID&&process.env.GITHUB_CLIENT_SECRET&&process.env.FOUNDER_GITHUB_ACCOUNT_ID);
}
export function database(){
 if(!process.env.DATABASE_URL)throw new Error("Database is not configured");
 if(!pool)pool=new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:7000,idleTimeoutMillis:30000,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:true}:undefined});
 return pool;
}
export function getAuth():CCAuth|null{
 if(!phase2Configured())return null;
 if(!auth){
  auth=betterAuth({
   database:database(),
   secret:process.env.BETTER_AUTH_SECRET!,
   emailAndPassword:{enabled:false},
   socialProviders:{github:{clientId:process.env.GITHUB_CLIENT_ID!,clientSecret:process.env.GITHUB_CLIENT_SECRET!}},
   session:{cookieCache:{enabled:true,maxAge:5*60}},
   plugins:[nextCookies()]
  });
 }
 return auth;
}
/** Fail-closed authorization by numeric GitHub OAuth account identity. */
export async function getActor():Promise<Actor|null>{
 const provider=getAuth();if(!provider)return null;
 const session=await provider.api.getSession({headers:await headers()});
 if(!session?.user?.id)return null;
 const uid=session.user.id;
 const accounts=await database().query<{accountId:string}>(
  'SELECT "accountId" FROM account WHERE "userId"=$1 AND "providerId"=$2 LIMIT 1',
  [uid,"github"]);
 const githubId=accounts.rows[0]?.accountId;
 if(!githubId)return null;
 const role:MemberRole|null=githubId===process.env.FOUNDER_GITHUB_ACCOUNT_ID?"Founder":(
  process.env.TEST_GITHUB_ACCOUNT_ID&&githubId===process.env.TEST_GITHUB_ACCOUNT_ID&&githubId!==process.env.FOUNDER_GITHUB_ACCOUNT_ID?"Contributor":null
 );
 if(!role)return null;
 const name=(session.user.name||"Member").slice(0,150);
 await database().query(
  'INSERT INTO cc_members(auth_user_id,role,name,active) VALUES($1,$2,$3,TRUE) ON CONFLICT(auth_user_id) DO UPDATE SET role=EXCLUDED.role,name=EXCLUDED.name,updated_at=now()',
  [uid,role,name]);
 const member=await database().query<{active:boolean}>('SELECT active FROM cc_members WHERE auth_user_id=$1',[uid]);
 if(!member.rows[0]?.active)return null;
 return {id:uid,name,role};
}
