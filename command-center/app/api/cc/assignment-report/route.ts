import {NextRequest} from "next/server";
import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store"};
const reject=(error:string,status:number)=>Response.json({error},{status,headers});
const validUid=(s:string)=>s.length>0&&s.length<=160;

export async function GET(request:NextRequest){
 if(!phase2Configured())return reject("Preview yapılandırılmadı",503);
 try{
  const actor=await getActor({readOnly:true});if(!actor)return reject("Yetkisiz",401);
  if(actor.role!=="Founder")return reject("Yalnızca Kurucu erişebilir",403);
  const db=database();
  const schema=await db.query<{positionReady:boolean}>(
   `SELECT EXISTS(SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='cc_members' AND column_name='position_title') AS "positionReady"`);
  const positionReady=schema.rows[0]?.positionReady===true;
  const members=await db.query<{id:string;name:string;active:boolean;positionTitle:string|null;total:number;briefed:number;accepted:number;progress:number;review:number;completed:number}>(
   `SELECT m.auth_user_id AS id,m.name,m.active,
    ${positionReady?"m.position_title":"NULL::text"} AS "positionTitle",
    COUNT(t.id)::int AS total,
    COUNT(t.id) FILTER(WHERE t.status='BRIEFED')::int AS briefed,
    COUNT(t.id) FILTER(WHERE t.status='ACCEPTED')::int AS accepted,
    COUNT(t.id) FILTER(WHERE t.status='IN PROGRESS')::int AS progress,
    COUNT(t.id) FILTER(WHERE t.status='FOUNDER REVIEW')::int AS review,
    COUNT(t.id) FILTER(WHERE t.status='COMPLETED')::int AS completed
    FROM cc_members m LEFT JOIN cc_tasks t ON t.owner_id=m.auth_user_id AND t.archived_at IS NULL
    WHERE m.role='Contributor'
    GROUP BY m.auth_user_id,m.name,m.active${positionReady?",m.position_title":""}
    ORDER BY m.name,m.auth_user_id`);
  const selected=request.nextUrl.searchParams.get("owner");
  const pageRaw=request.nextUrl.searchParams.get("page")||"1";
  const page=Number(pageRaw);
  if(!Number.isSafeInteger(page)||page<1||page>100000)return reject("Sayfa geçersiz",400);
  if(selected!==null&&!validUid(selected))return reject("Sorumlu geçersiz",400);
  let tasks:unknown[]=[];
  let total=0;
  const pageSize=50;
  if(selected!==null){
   const where=selected==="all"?"": " AND t.owner_id=$1";
   const params=selected==="all"?[]:[selected];
   const count=await db.query<{n:number}>(`SELECT COUNT(*)::int AS n FROM cc_tasks t WHERE t.archived_at IS NULL${where}`,params);
   total=count.rows[0]?.n||0;
   const list=await db.query(`SELECT t.id::text,t.title,t.status,t.owner_id AS "ownerId",
     m.name AS "ownerName",t.updated_at AS "updatedAt"
     FROM cc_tasks t JOIN cc_members m ON m.auth_user_id=t.owner_id
     WHERE t.archived_at IS NULL${where}
     ORDER BY t.updated_at DESC,t.id DESC LIMIT ${pageSize} OFFSET ${(page-1)*pageSize}`,params);
   tasks=list.rows;
  }
  return Response.json({positionReady,members:members.rows,selectedOwner:selected,
    tasks,total,page,pageSize,scope:"FOUNDER_OPERATIONAL_ONLY"},{headers});
 }catch{return reject("Görev dağılımı okunamadı",503);}
}
