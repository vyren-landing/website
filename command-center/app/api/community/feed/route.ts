import {NextRequest} from "next/server";
import {database} from "../../../../lib/phase2";
import {parsePublicFeedQuery,publicFeedEnabled} from "../../../../lib/community-feed-policy.mjs";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
const deny=(message:string,status:number)=>Response.json({error:message},{status,headers});
export async function GET(request:NextRequest){
 if(!publicFeedEnabled(process.env))return deny("Community discussions are being prepared",503);
 const url=new URL(request.url);
 const query=parsePublicFeedQuery(url.searchParams.get("topic"),url.searchParams.get("page"));
 if(!query)return deny("Invalid feed filter",400);
 try{
  const db=database();
  const schema=await db.query<{ready:boolean}>(`SELECT
   to_regclass('public.cc_community_posts') IS NOT NULL AS ready`);
  if(schema.rows[0]?.ready!==true)return deny("Community feed is not ready",503);
  // Always require the published and approved state in SQL, not just the UI.
  // No author emails, private member metadata, internal work IDs or reports.
  const posts=await db.query<{
   id:string;topic:string;title:string;body:string;
   displayName:string;publishedAt:string
  }>(`SELECT p.id::text,p.topic,p.title,p.body,
    COALESCE(NULLIF(cp.display_name,''),'Community member') AS "displayName",
    p.approved_at AS "publishedAt"
    FROM cc_community_posts p
    LEFT JOIN cc_community_profiles cp ON cp.auth_user_id=p.author_user_id
    WHERE p.visibility='PUBLIC' AND p.moderation_status='APPROVED'
      AND p.approved_at IS NOT NULL AND ($1::text IS NULL OR p.topic=$1)
    ORDER BY p.approved_at DESC,p.id DESC LIMIT $2 OFFSET $3`,
   [query.topic,query.limit,query.offset]);
  return Response.json({posts:posts.rows,page:query.page,hasMore:posts.rows.length===query.limit},{headers});
 }catch{return deny("Community feed temporarily unavailable",503);}
}
