"use client";
import {useCallback,useEffect,useState} from "react";
import StatusPill from "./status-pill";
import {SignOut} from "./sign-in";
import ArchivePanel from "./archive-panel";
import AuditPanel from "./audit-panel";
import SecurityPanel from "./security-panel";
import TeamPanel from "./team-panel";
import ProjectRecordsPanel from "./project-records-panel";
import WorkstreamsPanel from "./workstreams-panel";
import OpportunitiesPanel from "./opportunities-panel";
import OverviewPanel from "./overview-panel";
import ProjectContextPanel from "./project-context-panel";
import ProjectsPanel from "./projects-panel";
import AssignmentReportPanel from "./assignment-report-panel";
import ModuleHealthPanel from "./module-health-panel";
type Actor={id:string;name:string;role:"Founder"|"Contributor"};
type Member={id:string;name:string;role:string};
type Submission={id:string;body:string;evidenceUrl:string|null;createdAt:string};
type Review={decision:string;reason:string|null;createdAt:string};
type Task={id:string;title:string;objective:string;expectedOutput:string;ownerId:string;ownerName:string;status:string;projectId:string|null;projectName:string|null;archivedAt:string|null;submissions:Submission[];reviews:Review[];createdAt:string};
type AuditEvent={id:string;action:string;actorName:string;taskTitle:string;createdAt:string};
type Data={actor:Actor;members:Member[];tasks:Task[];audit?:AuditEvent[];nextCursor?:string|null};
const dictionary:Record<string,string>={"BRIEFED":"Tanımlandı","ACCEPTED":"Kabul Edildi","IN PROGRESS":"Devam Ediyor","FOUNDER REVIEW":"Kurucu İncelemesi","COMPLETED":"Tamamlandı"};

type View="active"|"archive"|"audit"|"team"|"records"|"workstreams"|"opportunities"|"overview"|"context"|"projects"|"assignment"|"moduleHealth"|"qa";
type NavItem={id:View;label:string;symbol:string};
type NavGroup={heading:string;items:NavItem[]};
const founderNav:NavGroup[]=[
 {heading:"YÖNETİM",items:[
  {id:"overview",label:"Genel Bakış",symbol:"◫"},
  {id:"active",label:"Görevler",symbol:"✓"},
  {id:"projects",label:"Projeler",symbol:"▣"},
  {id:"records",label:"Proje Kayıtları",symbol:"≡"},
  {id:"workstreams",label:"Çalışma Alanları",symbol:"▤"},
  {id:"opportunities",label:"Fırsatlar",symbol:"◇"}
 ]},
 {heading:"ORGANİZASYON",items:[
  {id:"team",label:"Ekip",symbol:"♙"},
  {id:"assignment",label:"İş Yükü",symbol:"▥"}
 ]},
 {heading:"KAYNAKLAR",items:[{id:"context",label:"Proje Bağlamı",symbol:"⌑"}]},
 {heading:"GEÇMİŞ",items:[
  {id:"archive",label:"Görev Arşivi",symbol:"▱"},
  {id:"audit",label:"İşlem Geçmişi",symbol:"◷"}
 ]},
 {heading:"SİSTEM",items:[{id:"moduleHealth",label:"Modül Sağlığı",symbol:"⚙"}]}
];
const contributorNav:NavGroup[]=[
 {heading:"ÇALIŞMA ALANI",items:[{id:"active",label:"Görevlerim",symbol:"✓"}]}
];
const qaNav:NavGroup={heading:"GELİŞTİRME / PREVIEW",items:[{id:"qa",label:"Test ve Tanı",symbol:"⌘"}]};
const defaultView=(founder:boolean):View=>founder?"overview":"active";

export default function SecureWorkspace({actor,showQaTools=false}:{actor:Actor;showQaTools?:boolean}){
 const tr=actor.role==="Founder";
 const label=(en:string,translated:string)=>tr?translated:en;
 const [data,setData]=useState<Data|null>(null);
 const [view,setView]=useState<View>(defaultView(tr));
 const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
 const navGroups=tr?founderNav:showQaTools?[...contributorNav,qaNav]:contributorNav;
 const allowedViews=navGroups.flatMap(group=>group.items.map(item=>item.id));
 const currentItem=navGroups.flatMap(group=>group.items).find(item=>item.id===view);
 const viewTitle=currentItem?.label||(tr?"Genel Bakış":"Görevlerim");
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [title,setTitle]=useState("");
 const [showTaskForm,setShowTaskForm]=useState(false);
 const [objective,setObjective]=useState("");
 const [output,setOutput]=useState("");
 const [owner,setOwner]=useState("");
 const [projectId,setProjectId]=useState("");
 const [projects,setProjects]=useState<{id:string;title:string}[]>([]);
 const [projectReady,setProjectReady]=useState(false);
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
 const loadProjects=useCallback(async()=>{if(!tr)return;
  try{const r=await fetch("/api/cc/projects",{credentials:"same-origin",cache:"no-store"});const v=await r.json();
   if(r.ok){setProjectReady(v.managementReady===true);setProjects((v.projects||[]).map((p:{id:string;title:string})=>({id:p.id,title:p.title})));}}
  catch{/* Legacy standalone tasks remain available. */}
 },[tr]);
 useEffect(()=>{if(tr&&(view==="active"||view==="projects"))void loadProjects()},[loadProjects,tr,view]);

 // UI routing only. This does not change or extend server permissions.
 const navigate=useCallback((next:View)=>{
  const valid=tr?founderNav.flatMap(g=>g.items.map(x=>x.id)):
   [...contributorNav,...(showQaTools?[qaNav]:[])].flatMap(g=>g.items.map(x=>x.id));
  if(!valid.includes(next))return;
  setView(next);setMobileMenuOpen(false);
  const url=new URL(window.location.href);
  if(next===defaultView(tr))url.searchParams.delete("tab");
  else url.searchParams.set("tab",next);
  window.history.pushState({ccView:next},"",url.pathname+url.search+url.hash);
  if(next==="active")void load();
 },[tr,showQaTools,load]);
 useEffect(()=>{
  const sync=()=>{
   const requested=new URLSearchParams(window.location.search).get("tab") as View|null;
   const valid=tr?founderNav.flatMap(g=>g.items.map(x=>x.id)):
    [...contributorNav,...(showQaTools?[qaNav]:[])].flatMap(g=>g.items.map(x=>x.id));
   setView(requested&&valid.includes(requested)?requested:defaultView(tr));
   setMobileMenuOpen(false);
  };
  sync();
  window.addEventListener("popstate",sync);
  return ()=>window.removeEventListener("popstate",sync);
 },[tr,showQaTools]);

 const action=async(operation:string,fields:Record<string,string>)=>{
  setBusy(true);setError("");
  try{
   const r=await fetch("/api/cc",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({operation,...fields})});
   const body=await r.json();if(!r.ok)throw new Error(body.error||"Operation failed");
   if(operation==="create"){setTitle("");setObjective("");setOutput("");setProjectId("");setShowTaskForm(false);}
   if(operation==="submit"){setDrafts(x=>({...x,[fields.id]:""}));setLinks(x=>({...x,[fields.id]:""}));}
   if(operation==="revise")setReasons(x=>({...x,[fields.id]:""}));
   await load();
  }catch(e){setError(e instanceof Error?e.message:"Operation failed");}
  finally{setBusy(false);}
 };
 return <div className="shell cc-live-shell">
  <aside className={"side cc-live-side"+(mobileMenuOpen?" is-open":"")} id="cc-live-nav">
   <div className="cc-live-brand">◈ VYREN</div>
   <p className="cc-live-brand-sub">COMMAND CENTER</p>
   <nav className="cc-live-nav" aria-label={tr?"Kurucu navigasyonu":"Katkı sağlayan navigasyonu"}>
    {navGroups.map(group=><div className="cc-live-nav-group" key={group.heading}>
     <p className="cc-live-nav-heading">{group.heading}</p>
     {group.items.map(item=><button key={item.id} type="button"
       className={"cc-live-nav-item"+(view===item.id?" is-active":"")}
       aria-current={view===item.id?"page":undefined}
       disabled={busy}
       onClick={()=>navigate(item.id)}>
       <span className="cc-live-nav-symbol" aria-hidden="true">{item.symbol}</span>
       <span>{item.label}</span>
     </button>)}
    </div>)}
   </nav>
   <div className="cc-live-profile">
    <span className="cc-live-avatar" aria-hidden="true">{actor.name.trim().charAt(0).toLocaleUpperCase("tr-TR")||"V"}</span>
    <div className="cc-live-profile-info"><b>{actor.name}</b><span>{tr?"Kurucu":"Katkı Sağlayan"}</span></div>
   </div>
   <div className="cc-live-signout"><SignOut/></div>
  </aside>
  <main className="main cc-live-main">
   <div className="cc-live-mobile-top">
    <b>◈ VYREN <span className="small muted">COMMAND CENTER</span></b>
    <button type="button" aria-controls="cc-live-nav" aria-expanded={mobileMenuOpen}
      onClick={()=>setMobileMenuOpen(s=>!s)}>{mobileMenuOpen?"Menüyü Kapat":"☰ Menü"}</button>
   </div>
   <header className="cc-live-header">
    <div><p className="cc-live-eyebrow">{tr?"KURUCU ÇALIŞMA ALANI":"KATKI SAĞLAYAN ÇALIŞMA ALANI"}</p>
     <h1>{viewTitle}</h1>
     <p className="muted small">Operasyonel çalışma alanı · Onaylı hesap erişimi</p>
    </div>
    <span className="cc-live-scope">Operasyonel · Canonical yetki yok</span>
   </header>
   <div className="stack cc-live-content">
    <p className="cc-live-disclaimer">Bu çalışma alanındaki işlemler VYREN protocol, ekonomi, FFA, governance veya lifecycle kararlarını değiştirmez.</p>
    {error&&<div className="alert" role="alert">{error}</div>}
    {!tr&&showQaTools&&view==="qa"&&<SecurityPanel actorId={actor.id}/>}

  {view==="active"&&<div className="cc-list-toolbar">
   <div><h2>{tr?"Görevler ve Teslimler":"Görevlerim"}</h2><p className="small muted">{tr?"Mevcut görevleri yönetin, teslimleri inceleyin ve gerektiğinde yeni görev atayın.":"Atanan işleri ve teslimlerinizi yönetin."}</p></div>
   <div className="row"><button disabled={busy} onClick={()=>void load()}>{label("Refresh","Yenile")}</button>
   {tr&&<button className="primary" disabled={busy} aria-expanded={showTaskForm} aria-controls="cc-task-editor" onClick={()=>setShowTaskForm(v=>!v)}>{showTaskForm?"Formu Kapat":"+ Yeni Görev"}</button>}</div>
  </div>}
  {tr&&view==="archive"&&<ArchivePanel onRestore={()=>navigate("active")}/>}
  {tr&&view==="audit"&&<AuditPanel/>}
  {tr&&view==="team"&&<TeamPanel onChange={()=>void load()}/>}
  {tr&&view==="projects"&&<ProjectsPanel/>}
  {tr&&view==="assignment"&&<AssignmentReportPanel/>}
  {tr&&view==="moduleHealth"&&<ModuleHealthPanel/>}
  {tr&&view==="records"&&<ProjectRecordsPanel/>}
  {tr&&view==="workstreams"&&<WorkstreamsPanel openRecords={()=>navigate("records")}/>}
  {tr&&view==="opportunities"&&<OpportunitiesPanel/>}
  {tr&&view==="overview"&&<OverviewPanel openView={navigate}/>}
  {tr&&view==="context"&&<ProjectContextPanel/>}
  {tr&&view==="active"&&showTaskForm&&<section className="panel stack cc-editor" id="cc-task-editor"><h2>Yeni Görev Ata</h2>
    <div className="field"><label>Görev başlığı</label><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={200}/></div>
    <div className="field"><label>Amaç</label><textarea value={objective} rows={3} maxLength={4000} onChange={e=>setObjective(e.target.value)}/></div>
    <div className="field"><label>Beklenen çıktı</label><input value={output} onChange={e=>setOutput(e.target.value)} maxLength={2000}/></div>
    {projectReady&&<div className="field"><label>İlgili proje (isteğe bağlı)</label><select value={projectId} onChange={e=>setProjectId(e.target.value)}>
    <option value="">Bağımsız görev</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
   </select></div>}
   <div className="field"><label>Sorumlu (onaylı gerçek hesap)</label><select value={owner} onChange={e=>setOwner(e.target.value)}><option value="">Bir katkı sağlayan seçin</option>{(data?.members||[]).filter(m=>m.role==="Contributor").map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
    <div className="row"><button className="primary" disabled={busy||!owner||title.trim().length<2||objective.trim().length<3} onClick={()=>void action("create",{title,objective,expectedOutput:output,ownerId:owner,projectId})}>Görev Oluştur</button><button disabled={busy} onClick={()=>setShowTaskForm(false)}>İptal</button></div>
    {!(data?.members||[]).some(m=>m.role==="Contributor")&&<p className="small muted">Test kullanıcısı henüz gerçek hesabıyla doğrulanmadı; şu anda kimseye gerçek görev atanamaz.</p>}
  </section>}
  {view==="active"&&<section className="panel stack"><h2>{tr?"Mevcut Görevler":"Atanan Görevlerim"}</h2>
    {!data&&<p>{label("Loading...","Yükleniyor...")}</p>}
    {data?.tasks.length===0&&<p>{label("No assigned tasks yet.","Henüz görev bulunmuyor.")}</p>}
    {data?.tasks.map(t=>{
      const latest=t.submissions[t.submissions.length-1];
      const revision=[...t.reviews].reverse().find(r=>r.decision==="REVISION");
      const expanded=open===t.id;
      const own=t.ownerId===actor.id;
      const showEdit=own&&t.status==="IN PROGRESS";
      return <article key={t.id} className="card stack">
       <div className="row between"><b>{t.title}</b><StatusPill status={t.status} label={tr?(dictionary[t.status]||t.status):t.status}/></div>
       <p>{t.objective}</p>{t.projectName&&<p className="small muted">Proje: {t.projectName}</p>}
       {tr&&projectReady&&<div className="field"><label>Proje bağlantısı</label><select value={t.projectId||""} disabled={busy} onChange={e=>void action("set_project",{id:t.id,projectId:e.target.value})}>
        <option value="">Bağımsız görev</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
       </select></div>}
       <p className="small muted">{label("Owner","Sorumlu")}: {t.ownerName} · {label("Expected output","Beklenen çıktı")}: {t.expectedOutput}</p>
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
        {tr&&t.status==="COMPLETED"&&<button disabled={busy} onClick={()=>{if(window.confirm("Tamamlanan görevi geçmişi korunarak arşivle?"))void action("archive",{id:t.id});}}>Arşivle (Silmeden)</button>}
       </div>}
      </article>;
    })}
  </section>}
   </div>
  </main>
 </div>;
}
