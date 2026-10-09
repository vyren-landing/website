"use client";
import {useCallback,useEffect,useState} from "react";
import ArchivePanel from "./archive-panel";
import AuditPanel from "./audit-panel";
type Actor={id:string;name:string;role:"Founder"|"Contributor"};
type Member={id:string;name:string;role:string};
type Submission={id:string;body:string;evidenceUrl:string|null;createdAt:string};
type Review={decision:string;reason:string|null;createdAt:string};
type Task={id:string;title:string;objective:string;expectedOutput:string;ownerId:string;ownerName:string;status:string;archivedAt:string|null;submissions:Submission[];reviews:Review[];createdAt:string};
type AuditEvent={id:string;action:string;actorName:string;taskTitle:string;createdAt:string};
type Data={actor:Actor;members:Member[];tasks:Task[];audit?:AuditEvent[];nextCursor?:string|null};
const dictionary:Record<string,string>={"BRIEFED":"Tanımlandı","ACCEPTED":"Kabul Edildi","IN PROGRESS":"Devam Ediyor","FOUNDER REVIEW":"Kurucu İncelemesi","COMPLETED":"Tamamlandı"};
export default function SecureWorkspace({actor}:{actor:Actor}){
 const tr=actor.role==="Founder";
 const label=(en:string,translated:string)=>tr?translated:en;
 const [data,setData]=useState<Data|null>(null);
 const [view,setView]=useState<"active"|"archive"|"audit">("active");
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [title,setTitle]=useState("");
 const [objective,setObjective]=useState("");
 const [output,setOutput]=useState("");
 const [owner,setOwner]=useState("");
 const [drafts,setDrafts]=useState<Record<string,string>>({});
 const [links,setLinks]=useState<Record<string,string>>({});
 const [reasons,setReasons]=useState<Record<string,string>>({});
 const [open,setOpen]=useState<string|null>(null);
 const load=useCallback(async()=>{
  try{const r=await fetch("/api/cc?view=active",{credentials:"same-origin",cache:"no-store"});
   const x=await r.json();if(!r.ok)throw new Error(x.error||"Data unavailable");setData(x);setError("");
  }catch(e){setError(e instanceof Error?e.message:"Unable to load tasks");}
 },[]);
 useEffect(()=>{void load()},[load]);
 const action=async(operation:string,fields:Record<string,string>)=>{
  setBusy(true);setError("");
  try{
   const r=await fetch("/api/cc",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({operation,...fields})});
   const body=await r.json();if(!r.ok)throw new Error(body.error||"Operation failed");
   if(operation==="create"){setTitle("");setObjective("");setOutput("");}
   if(operation==="submit"){setDrafts(x=>({...x,[fields.id]:""}));setLinks(x=>({...x,[fields.id]:""}));}
   if(operation==="revise")setReasons(x=>({...x,[fields.id]:""}));
   await load();
  }catch(e){setError(e instanceof Error?e.message:"Operation failed");}
  finally{setBusy(false);}
 };
 return <div className="stack">
  <div className="alert">Bu alan yalnızca operasyonel görevler içindir. Canonical lifecycle, FFA, ekonomi, treasury ve governance yetkisi taşımaz.</div>
  {error&&<div className="alert" role="alert">{error}</div>}
  <button disabled={busy} onClick={()=>void load()}>{label("Refresh","Yenile")}</button>
  {tr&&view==="active"&&<section className="panel stack"><h2>Yeni Görev Ata</h2>
    <div className="field"><label>Görev başlığı</label><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={200}/></div>
    <div className="field"><label>Amaç</label><textarea value={objective} rows={3} maxLength={4000} onChange={e=>setObjective(e.target.value)}/></div>
    <div className="field"><label>Beklenen çıktı</label><input value={output} onChange={e=>setOutput(e.target.value)} maxLength={2000}/></div>
    <div className="field"><label>Sorumlu (onaylı gerçek hesap)</label><select value={owner} onChange={e=>setOwner(e.target.value)}><option value="">Bir katkı sağlayan seçin</option>{(data?.members||[]).filter(m=>m.role==="Contributor").map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
    <button className="primary" disabled={busy||!owner||title.trim().length<2||objective.trim().length<3} onClick={()=>void action("create",{title,objective,expectedOutput:output,ownerId:owner})}>Görev Oluştur</button>
    {!(data?.members||[]).some(m=>m.role==="Contributor")&&<p className="small muted">Test kullanıcısı henüz gerçek hesabıyla doğrulanmadı; şu anda kimseye gerçek görev atanamaz.</p>}
  </section>}
  <section className="panel stack"><h2>{label("My Tasks","Görevler ve Teslimler")}</h2>
    {!data&&<p>{label("Loading...","Yükleniyor...")}</p>}
    {data?.tasks.length===0&&<p>{label("No assigned tasks yet.","Henüz görev bulunmuyor.")}</p>}
    {data?.tasks.map(t=>{
      const latest=t.submissions[t.submissions.length-1];
      const revision=[...t.reviews].reverse().find(r=>r.decision==="REVISION");
      const expanded=open===t.id;
      const own=t.ownerId===actor.id;
      const showEdit=own&&t.status==="IN PROGRESS";
      return <article key={t.id} className="card stack">
       <div className="row between"><b>{t.title}</b><span className="badge">{tr?(dictionary[t.status]||t.status):t.status}</span></div>
       <p>{t.objective}</p><p className="small muted">{label("Owner","Sorumlu")}: {t.ownerName} · {label("Expected output","Beklenen çıktı")}: {t.expectedOutput}</p>
       <button onClick={()=>setOpen(expanded?null:t.id)}>{expanded?label("Close details","Ayrıntıları Gizle"):label("Open details","Ayrıntıları Aç")}</button>
       {expanded&&<div className="stack">
        {latest&&<div className="panel stack"><b>{label("Submitted report","Teslim Edilen Rapor")}</b><p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{latest.body}</p>{latest.evidenceUrl&&<a href={latest.evidenceUrl} target="_blank" rel="noopener noreferrer" style={{overflowWrap:"anywhere"}}>Kanıt Bağlantısı</a>}</div>}
        {revision&&<div className="alert"><b>{label("Last revision feedback","Son Revizyon Notu")}</b><p>{revision.reason}</p></div>}
        {own&&t.status==="BRIEFED"&&<button disabled={busy} onClick={()=>void action("accept",{id:t.id})}>{label("Accept","Kabul Et")}</button>}
        {own&&t.status==="ACCEPTED"&&<button disabled={busy} onClick={()=>void action("start",{id:t.id})}>{label("Start","Başlat")}</button>}
        {showEdit&&<div className="stack">
         <div className="field"><label>{label("Written deliverable * (minimum 30 characters)","Yazılı Teslim / Rapor * (en az 30 karakter)")}</label><textarea rows={6} value={drafts[t.id]||""} onChange={e=>setDrafts(s=>({...s,[t.id]:e.target.value}))} maxLength={10000}/></div>
         <div className="field"><label>{label("HTTPS evidence link (optional)","HTTPS Kanıt Bağlantısı (isteğe bağlı)")}</label><input value={links[t.id]||""} onChange={e=>setLinks(s=>({...s,[t.id]:e.target.value}))} maxLength={2000}/></div>
         <button className="primary" disabled={busy||(drafts[t.id]||"").trim().length<30} onClick={()=>void action("submit",{id:t.id,body:drafts[t.id]||"",evidenceUrl:links[t.id]||""})}>{label("Submit for Founder Review","Kurucu İncelemesine Gönder")}</button>
        </div>}
        {tr&&t.status==="FOUNDER REVIEW"&&<div className="stack">
         {latest&&<button className="primary" disabled={busy} onClick={()=>void action("approve",{id:t.id})}>Raporu Kabul Et</button>}
         <div className="field"><label>Revizyon Gerekçesi</label><textarea rows={3} value={reasons[t.id]||""} onChange={e=>setReasons(s=>({...s,[t.id]:e.target.value}))}/></div>
         <button disabled={busy||(reasons[t.id]||"").trim().length<10} onClick={()=>void action("revise",{id:t.id,reason:reasons[t.id]||""})}>Revizyon İste</button>
        </div>}
        {tr&&t.status==="COMPLETED"&&<button disabled={busy} onClick={()=>{if(window.confirm("Tamamlanan görevi geçmişi korunarak arşivle?"))void action("archive",{id:t.id});}}>Kaldır / Arşivle</button>}
       </div>}
      </article>;
    })}
  </section>
 </div>;
}
