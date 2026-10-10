import {NextRequest} from "next/server";
import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";

type Stage="RESEARCH"|"QUALIFIED"|"CONTACTED"|"REPLY_RECEIVED"|"DISCUSSION"|
 "PROPOSAL"|"INTERNAL_REVIEW"|"WAITING_EXTERNAL"|"DORMANT"|"CLOSED";
type Category="PARTNERSHIP"|"PROVIDER"|"FUNDING"|"EXCHANGE"|"OTHER";
type Mutation={operation?:string;id?:string;revision?:number;title?:string;
 organization?:string;category?:string;stage?:string;summary?:string;
 nextAction?:string;evidenceUrl?:string};
type LockRow={id:string;revision:number;archived_at:string|null};
class Failure extends Error{constructor(message:string,public status=400){super(message);}}
const headers={"Cache-Control":"private, no-store"};
const reject=(message:string,status=400)=>Response.json({error:message},{status,headers});
const uuid=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const stages:Stage[]=["RESEARCH","QUALIFIED","CONTACTED","REPLY_RECEIVED","DISCUSSION",
 "PROPOSAL","INTERNAL_REVIEW","WAITING_EXTERNAL","DORMANT","CLOSED"];
const categories:Category[]=["PARTNERSHIP","PROVIDER","FUNDING","EXCHANGE","OTHER"];
const safeUrl=(u:string)=>{try{const x=new URL(u);return x.protocol==="https:"&&Boolean(x.hostname)&&u.length<=2000;}catch{return false;}};
const asText=(s:unknown)=>(typeof s==="string"?s:"").trim();
async function founder(){
 if(!phase2Configured())throw new Failure("Command Center Preview yapılandırılmadı",503);
 const actor=await getActor();
 if(!actor)throw new Failure("Yetkisiz",401);
 if(actor.role!=="Founder")throw new Failure("Yalnızca Kurucu erişebilir",403);
 return actor;
}
async function ready(){
 const r=await database().query<{ready:boolean}>(`SELECT
  to_regclass('public.cc_opportunities') IS NOT NULL
   AND to_regclass('public.cc_opportunity_events') IS NOT NULL AS ready`);
 return r.rows[0]?.ready===true;
}
const columns=`id::text,title,organization,category,stage,summary,
 next_action AS "nextAction",evidence_url AS "evidenceUrl",revision,
 archived_at AS "archivedAt",created_at AS "createdAt",updated_at AS "updatedAt"`;

export async function GET(request:NextRequest){
 try{
  await founder();
  const installed=await ready();
  if(!installed){
   return Response.json({ready:false,opportunities:[]},{headers});
  }
  const history=request.nextUrl.searchParams.get("history");
  if(history!==null){
   if(!uuid(history))throw new Failure("Fırsat ID geçersiz");
   const exists=await database().query("SELECT 1 FROM cc_opportunities WHERE id=$1",[history]);
   if(!exists.rowCount)throw new Failure("Fırsat bulunamadı",404);
   const events=await database().query(`
    SELECT action,revision,snapshot,created_at AS "createdAt"
    FROM cc_opportunity_events WHERE opportunity_id=$1 ORDER BY id DESC LIMIT 100`,[history]);
   return Response.json({ready:true,events:events.rows},{headers});
  }
  const incl=request.nextUrl.searchParams.get("archived")==="1";
  const result=await database().query(`
   SELECT ${columns} FROM cc_opportunities WHERE ($1::boolean OR archived_at IS NULL)
    ORDER BY updated_at DESC LIMIT 250`,[incl]);
  return Response.json({ready:true,opportunities:result.rows},{headers});
 }catch(e){
  if(e instanceof Failure)return reject(e.message,e.status);
  return reject("Fırsat kayıtları okunamadı; veritabanı bağlantısını kontrol edin",503);
 }
}
export async function POST(request:NextRequest){
 if(request.headers.get("origin")!==new URL(request.url).origin)return reject("Geçersiz Origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")
  return reject("JSON gerekli",415);
 const raw=await request.text();
 if(raw.length>16000)return reject("İstek fazla uzun",413);
 let input:Mutation;
 try{
  const data:unknown=JSON.parse(raw);
  if(!data||typeof data!=="object"||Array.isArray(data))throw Error();
  input=data as Mutation;
 }catch{return reject("Geçersiz JSON");}
 try{
  const actor=await founder();
  const op=input.operation;
  if(!["create","update","archive","restore"].includes(op||""))
   throw new Failure("Geçersiz fırsat işlemi");
  if(!await ready())throw new Failure("Fırsat yönetimi için Preview migration 005 gerekli",503);
  const client=await database().connect();
  let inTx=false;
  try{
   await client.query("BEGIN");
   inTx=true;
   let id="";
   if(op==="create"||op==="update"){
    const title=asText(input.title),organization=asText(input.organization);
    const summary=asText(input.summary),nextAction=asText(input.nextAction);
    const evidenceUrl=asText(input.evidenceUrl);
    if(title.length<2||title.length>200||organization.length>200||
       summary.length>4000||nextAction.length>2000||
       (evidenceUrl&&!safeUrl(evidenceUrl))||
       !stages.includes(input.stage as Stage)||!categories.includes(input.category as Category))
      throw new Failure("Fırsat alanları geçersiz");
    if(op==="create"){
     const created=await client.query<{id:string}>(`
      INSERT INTO cc_opportunities
       (title,organization,category,stage,summary,next_action,evidence_url,created_by,updated_by)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING id::text`,
      [title,organization,input.category,input.stage,summary,nextAction,evidenceUrl||null,actor.id]);
     id=created.rows[0].id;
    }else{
     if(!input.id||!uuid(input.id)||!Number.isInteger(input.revision)||input.revision<1)
      throw new Failure("Fırsat ID veya revizyon geçersiz");
     const locked=await client.query<LockRow>(
      "SELECT id::text,revision,archived_at FROM cc_opportunities WHERE id=$1 FOR UPDATE",[input.id]);
     if(!locked.rowCount)throw new Failure("Fırsat bulunamadı",404);
     if(locked.rows[0].archived_at)throw new Failure("Arşivlenmiş fırsat güncellenemez",409);
     if(locked.rows[0].revision!==input.revision)throw new Failure("Fırsat başka işlemle değişmiş; listeyi yenileyin",409);
     id=locked.rows[0].id;
     await client.query(`UPDATE cc_opportunities SET title=$2,organization=$3,category=$4,
      stage=$5,summary=$6,next_action=$7,evidence_url=$8,
      revision=revision+1,updated_by=$9,updated_at=now() WHERE id=$1`,
      [id,title,organization,input.category,input.stage,summary,nextAction,evidenceUrl||null,actor.id]);
    }
   }else{
    if(!input.id||!uuid(input.id)||!Number.isInteger(input.revision)||input.revision<1)
     throw new Failure("Fırsat ID veya revizyon geçersiz");
    const locked=await client.query<LockRow>(
     "SELECT id::text,revision,archived_at FROM cc_opportunities WHERE id=$1 FOR UPDATE",[input.id]);
    if(!locked.rowCount)throw new Failure("Fırsat bulunamadı",404);
    const row=locked.rows[0];
    if(row.revision!==input.revision)throw new Failure("Fırsat değişmiş; yenileyin",409);
    if(op==="archive"&&row.archived_at)throw new Failure("Zaten arşivde",409);
    if(op==="restore"&&!row.archived_at)throw new Failure("Fırsat arşivde değil",409);
    id=row.id;
    await client.query(`UPDATE cc_opportunities SET archived_at=$2,
     revision=revision+1,updated_by=$3,updated_at=now() WHERE id=$1`,
     [id,op==="archive"?new Date():null,actor.id]);
   }
   const post=await client.query<{revision:number;state:unknown}>(`
    SELECT revision,to_jsonb(o)-'created_by'-'updated_by' AS state
    FROM cc_opportunities o WHERE id=$1`,[id]);
   await client.query(`
    INSERT INTO cc_opportunity_events(opportunity_id,actor_id,action,revision,snapshot)
     VALUES($1,$2,$3,$4,$5::jsonb)`,
    [id,actor.id,(op||"").toUpperCase(),post.rows[0].revision,JSON.stringify(post.rows[0].state)]);
   await client.query(`
    INSERT INTO cc_audit(actor_id,action,target_id,details) VALUES($1,$2,$3,$4)`,
    [actor.id,"opportunity_"+op,id,JSON.stringify({revision:post.rows[0].revision})]);
   await client.query("COMMIT");
   inTx=false;
   return Response.json({ok:true,id,revision:post.rows[0].revision},{headers});
  }catch(e){
   if(inTx)await client.query("ROLLBACK").catch(()=>{});
   if(e instanceof Failure)return reject(e.message,e.status);
   return reject("Fırsat işlemi geri alındı; hiçbir kısmi kayıt oluşturulmadı",500);
  }finally{client.release();}
 }catch(e){
  return e instanceof Failure?reject(e.message,e.status):reject("Fırsat işlemi başlatılamadı",503);
 }
}
