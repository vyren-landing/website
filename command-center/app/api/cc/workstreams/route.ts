import {NextRequest} from "next/server";
import {database,getActor,phase2Configured} from "../../../../lib/phase2";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const headers={"Cache-Control":"private, no-store"};
const fail=(message:string,status:number)=>Response.json({error:message},{status,headers});
const uuid=(id:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
class Failure extends Error{constructor(message:string,public status=400){super(message);}}
type Summary={
 key:string;total:number;todo:number;inProgress:number;done:number;
 blocked:number;deferred:number;updatedAt:string
};
type Catalog={
 id:string;key:string;name:string;summary:string;nextAction:string;
 state:"ACTIVE"|"PAUSED"|"ARCHIVED";revision:number;
 updatedAt:string;createdAt:string
};
type Action={key:string;title:string;status:string;nextAction:string};
type Mutation={
 operation?:string;sourceKey?:string;name?:string;summary?:string;nextAction?:string;
 state?:string;id?:string;revision?:number
};
async function founder(readOnly=false){
 if(!phase2Configured())throw new Failure("Command Center Preview yapılandırılmadı",503);
 const actor=await getActor({readOnly});
 if(!actor)throw new Failure("Yetkisiz",401);
 if(actor.role!=="Founder")throw new Failure("Yalnızca Kurucu erişebilir",403);
 return actor;
}
async function ready(db:{query:(sql:string)=>Promise<{rows:Array<{ready:boolean}>}>}){
 const r=await db.query(`SELECT
  to_regclass('public.cc_workstreams') IS NOT NULL
   AND to_regclass('public.cc_workstream_events') IS NOT NULL AS ready`);
 return r.rows[0]?.ready===true;
}

export async function GET(request:NextRequest){
 try{
  await founder(true);
  const client=await database().connect();
  let opened=false;
  try{
   await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
   opened=true;
   const managementReady=await ready(client);
   const history=request.nextUrl.searchParams.get("history");
   if(history!==null){
    if(!managementReady)throw new Failure("Çalışma alanı yönetimi için Preview migration 004 bekleniyor",503);
    if(!uuid(history))throw new Failure("Çalışma alanı ID geçersiz");
    const exists=await client.query("SELECT 1 FROM cc_workstreams WHERE id=$1",[history]);
    if(!exists.rowCount)throw new Failure("Çalışma alanı bulunamadı",404);
    const events=await client.query(`
     SELECT action,revision,snapshot,created_at AS "createdAt"
     FROM cc_workstream_events WHERE workstream_id=$1 ORDER BY id DESC LIMIT 100`,[history]);
    await client.query("COMMIT");
    opened=false;
    return Response.json({events:events.rows},{headers});
   }
   // Legacy records retain their immutable workstream values.
   const summary=await client.query<Summary>(`
    SELECT workstream AS key,
      count(*)::integer AS total,
      count(*) FILTER (WHERE status='TODO')::integer AS todo,
      count(*) FILTER (WHERE status='IN_PROGRESS')::integer AS "inProgress",
      count(*) FILTER (WHERE status='DONE')::integer AS done,
      count(*) FILTER (WHERE status='BLOCKED')::integer AS blocked,
      count(*) FILTER (WHERE status='DEFERRED')::integer AS deferred,
      max(updated_at) AS "updatedAt"
    FROM cc_project_records WHERE archived_at IS NULL
    GROUP BY workstream ORDER BY workstream ASC`);
   const actions=await client.query<Action>(`
    SELECT workstream AS key,title,status,next_action AS "nextAction"
    FROM (
      SELECT workstream,title,status,next_action,updated_at,id,
        row_number() OVER(PARTITION BY workstream ORDER BY
          CASE status WHEN 'BLOCKED' THEN 0 WHEN 'IN_PROGRESS' THEN 1
          WHEN 'TODO' THEN 2 WHEN 'DEFERRED' THEN 3 ELSE 4 END,
          updated_at DESC,id DESC) AS rank
      FROM cc_project_records
      WHERE archived_at IS NULL
        AND status IN ('BLOCKED','IN_PROGRESS','TODO','DEFERRED')
        AND length(btrim(next_action))>0
    ) ranked WHERE rank<=3 ORDER BY workstream,rank`);
   const catalog=managementReady?await client.query<Catalog>(`
    SELECT id::text,key,display_name AS name,summary,next_action AS "nextAction",
      state,revision,created_at AS "createdAt",updated_at AS "updatedAt"
    FROM (SELECT id,source_key AS key,display_name,summary,next_action,state,revision,created_at,updated_at
      FROM cc_workstreams) w ORDER BY display_name`):{rows:[] as Catalog[]};
   await client.query("COMMIT");
   opened=false;
   const byKey=new Map(summary.rows.map(s=>[s.key,s]));
   const defined=new Set(catalog.rows.map(s=>s.key));
   const blank={total:0,todo:0,inProgress:0,done:0,blocked:0,deferred:0};
   const streams=[
    ...catalog.rows.map(c=>({
     ...blank,...(byKey.get(c.key)||{}),...c,
     managed:true,
     nextActions:actions.rows.filter(a=>a.key===c.key).map(a=>({
      title:a.title,status:a.status,nextAction:a.nextAction
     }))
    })),
    ...summary.rows.filter(s=>!defined.has(s.key)).map(s=>({
     ...s,id:null,name:s.key,summary:"",nextAction:"",state:"UNREGISTERED",
     revision:0,createdAt:null,managed:false,
     nextActions:actions.rows.filter(a=>a.key===s.key).map(a=>({
      title:a.title,status:a.status,nextAction:a.nextAction
     }))
    }))
   ].sort((a,b)=>a.name.localeCompare(b.name,"tr"));
   return Response.json({
    scope:"OPERATIONAL_ONLY_NOT_CANONICAL",
    source:"cc_project_records and optional cc_workstreams",
    asOf:new Date().toISOString(),managementReady,streams
   },{headers});
  }catch(e){
   if(opened)await client.query("ROLLBACK").catch(()=>{});
   if(e instanceof Failure)return fail(e.message,e.status);
   return fail("Çalışma alanları okunamadı. Mevcut kayıtlar değiştirilmedi.",503);
  }finally{client.release();}
 }catch(e){
  return e instanceof Failure?fail(e.message,e.status):fail("Çalışma alanlarına erişilemiyor",503);
 }
}

export async function POST(request:NextRequest){
 if(request.headers.get("origin")!==new URL(request.url).origin)return fail("Geçersiz Origin",403);
 if((request.headers.get("content-type")||"").split(";")[0]!=="application/json")
  return fail("JSON gerekli",415);
 const raw=await request.text();
 if(raw.length>15000)return fail("İstek fazla uzun",413);
 let input:Mutation;
 try{
  const value:unknown=JSON.parse(raw);
  if(!value||typeof value!=="object"||Array.isArray(value))throw Error();
  input=value as Mutation;
 }catch{return fail("Geçersiz JSON",400);}
 try{
  const actor=await founder();
  const op=input.operation;
  if(!["create","adopt","update","archive","restore"].includes(op||""))
   throw new Failure("Geçersiz çalışma alanı işlemi");
  const db=database(),client=await db.connect();
  let opened=false;
  try{
   if(!await ready(client))
    throw new Failure("Çalışma alanı yönetimi için Preview migration 004 gerekli",503);
   await client.query("BEGIN");
   opened=true;
   let id:string;
   const text=(s:unknown)=>(typeof s==="string"?s:"").trim();
   if(op==="create"||op==="adopt"){
    const name=text(input.name),summary=text(input.summary),nextAction=text(input.nextAction);
    const key=op==="create"?name:text(input.sourceKey);
    if(key.length<2||key.length>120||name.length<2||name.length>120||
       summary.length>4000||nextAction.length>2000)
     throw new Failure("Çalışma alanı alanları geçersiz");
    if(op==="adopt"){
     const exists=await client.query("SELECT 1 FROM cc_project_records WHERE workstream=$1 LIMIT 1",[key]);
     if(!exists.rowCount)throw new Failure("Bu adla mevcut çalışma alanı kaydı bulunamadı",404);
    }
    const created=await client.query<{id:string}>(`
     INSERT INTO cc_workstreams(source_key,display_name,summary,next_action,created_by,updated_by)
     VALUES($1,$2,$3,$4,$5,$5) RETURNING id::text`,
     [key,name,summary,nextAction,actor.id]);
    id=created.rows[0].id;
   }else{
    if(!input.id||!uuid(input.id)||!Number.isInteger(input.revision)||Number(input.revision)<1)
     throw new Failure("Kayıt ID veya revizyon geçersiz");
    const current=await client.query<{id:string;revision:number;state:string}>(`
     SELECT id::text,revision,state FROM cc_workstreams WHERE id=$1 FOR UPDATE`,[input.id]);
    if(!current.rowCount)throw new Failure("Çalışma alanı bulunamadı",404);
    const row=current.rows[0];
    if(row.revision!==input.revision)throw new Failure("Çalışma alanı değişmiş; yenileyin",409);
    id=row.id;
    if(op==="update"){
     if(row.state==="ARCHIVED")throw new Failure("Önce arşivden geri alın",409);
     const name=text(input.name),summary=text(input.summary),nextAction=text(input.nextAction);
     if(name.length<2||name.length>120||summary.length>4000||nextAction.length>2000||
        !["ACTIVE","PAUSED"].includes(input.state||""))
      throw new Failure("Çalışma alanı alanları geçersiz");
     await client.query(`UPDATE cc_workstreams SET display_name=$2,summary=$3,
      next_action=$4,state=$5,revision=revision+1,updated_by=$6,updated_at=now()
      WHERE id=$1`,[id,name,summary,nextAction,input.state,actor.id]);
    }else if(op==="archive"){
     if(row.state==="ARCHIVED")throw new Failure("Zaten arşivde",409);
     await client.query(`UPDATE cc_workstreams SET restore_state=state,
      state='ARCHIVED',revision=revision+1,updated_by=$2,updated_at=now()
      WHERE id=$1`,[id,actor.id]);
    }else{
     if(row.state!=="ARCHIVED")throw new Failure("Arşivde değil",409);
     await client.query(`UPDATE cc_workstreams SET state=restore_state,
      revision=revision+1,updated_by=$2,updated_at=now()
      WHERE id=$1`,[id,actor.id]);
    }
   }
   const snapshot=await client.query<{revision:number;state:unknown}>(`
    SELECT revision,to_jsonb(w)-'created_by'-'updated_by' AS state
    FROM cc_workstreams w WHERE id=$1`,[id]);
   await client.query(`
    INSERT INTO cc_workstream_events(workstream_id,actor_id,action,revision,snapshot)
    VALUES($1,$2,$3,$4,$5::jsonb)`,
    [id,actor.id,(op||"").toUpperCase(),snapshot.rows[0].revision,JSON.stringify(snapshot.rows[0].state)]);
   await client.query(`
    INSERT INTO cc_audit(actor_id,action,target_id,details) VALUES($1,$2,$3,$4)`,
    [actor.id,"workstream_"+op,id,JSON.stringify({revision:snapshot.rows[0].revision})]);
   await client.query("COMMIT");
   opened=false;
   return Response.json({ok:true,id,revision:snapshot.rows[0].revision},{headers});
  }catch(e){
   if(opened)await client.query("ROLLBACK").catch(()=>{});
   if((e as {code?:string})?.code==="23505")return fail("Bu çalışma alanı anahtarı zaten mevcut",409);
   return e instanceof Failure?fail(e.message,e.status):
    fail("İşlem tamamlanamadı; değişiklik geri alındı",500);
  }finally{client.release();}
 }catch(e){
  return e instanceof Failure?fail(e.message,e.status):fail("Yetki doğrulanamadı",503);
 }
}
