"use client";
import {useCallback,useEffect,useState} from "react";
type Status="TODO"|"IN_PROGRESS"|"DONE"|"BLOCKED"|"DEFERRED";
type Project={id:string;title:string;objective:string;nextAction:string;workstreamId:string|null;
 workstreamName:string|null;status:Status;revision:number;archivedAt:string|null;updatedAt:string;
 taskCount:number;completedTaskCount:number;recordCount:number};
type Stream={id:string;name:string;sourceKey:string;state:string};
type Form={title:string;objective:string;nextAction:string;status:Status;workstreamId:string};
const empty:Form={title:"",objective:"",nextAction:"",status:"TODO",workstreamId:""};
const statuses:Record<Status,string>={TODO:"Yapılacak",IN_PROGRESS:"Devam Ediyor",DONE:"Yapıldı",BLOCKED:"Engellendi",DEFERRED:"Ertelendi"};
export default function ProjectsPanel(){
 const [projects,setProjects]=useState<Project[]>([]);
 const [streams,setStreams]=useState<Stream[]>([]);
 const [ready,setReady]=useState(false);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [archived,setArchived]=useState(false);
 const [editing,setEditing]=useState<Project|null>(null);
 const [form,setForm]=useState<Form>(empty);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const [history,setHistory]=useState<{action:string;revision:number;createdAt:string}[]|null>(null);
 const [historyId,setHistoryId]=useState<string|null>(null);
 const load=useCallback(async()=>{
  setLoading(true);
  try{
   const r=await fetch("/api/cc/projects"+(archived?"?archived=1":""),{cache:"no-store",credentials:"same-origin"});
   const v=await r.json();
   if(!r.ok)throw Error(v.error||"Projeler yüklenemedi");
   setReady(v.managementReady===true);setProjects(v.projects||[]);setStreams(v.workstreams||[]);setError("");
  }catch(e){setError(e instanceof Error?e.message:"Projeler yüklenemedi");}
  finally{setLoading(false);}
 },[archived]);
 useEffect(()=>{void load()},[load]);
 function begin(p?:Project){
  setEditing(p||null);setMessage("");setHistory(null);setHistoryId(null);
  setForm(p?{title:p.title,objective:p.objective,nextAction:p.nextAction,status:p.status,workstreamId:p.workstreamId||""}:empty);
 }
 const patch=<K extends keyof Form>(key:K,value:Form[K])=>setForm(s=>({...s,[key]:value}));
 async function mutate(operation:"create"|"update"|"archive"|"restore",p?:Project){
  if(operation==="archive"&&!window.confirm("Projeyi arşivlemek istiyor musunuz? Bağlı görevler ve kayıtlar korunur."))return;
  setBusy(true);setError("");setMessage("");
  try{
   const payload=operation==="create"||operation==="update"?
     {operation,...form,workstreamId:form.workstreamId||null,...(operation==="update"?{id:editing?.id,revision:editing?.revision}:{})}:
     {operation,id:p?.id,revision:p?.revision};
   const r=await fetch("/api/cc/projects",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const v=await r.json();if(!r.ok)throw Error(v.error||"Proje işlemi başarısız");
   begin();setMessage("Proje işlemi kaydedildi; geçmiş korunuyor.");await load();
  }catch(e){setError(e instanceof Error?e.message:"Proje işlemi başarısız");}
  finally{setBusy(false);}
 }
 async function showHistory(p:Project){
  if(historyId===p.id){setHistoryId(null);setHistory(null);return;}
  setHistoryId(p.id);setHistory(null);
  try{
   const r=await fetch("/api/cc/projects?history="+encodeURIComponent(p.id),{credentials:"same-origin",cache:"no-store"});
   const v=await r.json();if(!r.ok)throw Error(v.error||"Geçmiş bulunamadı");setHistory(v.events||[]);
  }catch(e){setError(e instanceof Error?e.message:"Geçmiş alınamadı");}
 }
 const exportProjects=async()=>{
  setBusy(true);setError("");
  try{
   const r=await fetch("/api/cc/projects/export",{credentials:"same-origin",cache:"no-store"});
   if(!r.ok){const v=await r.json();throw Error(v.error||"Proje aktarımı başarısız");}
   const blob=await r.blob();const url=window.URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;
   a.download="vyren-command-center-projects-"+new Date().toISOString().slice(0,10)+".json";
   document.body.appendChild(a);a.click();a.remove();
   window.setTimeout(()=>window.URL.revokeObjectURL(url),3000);
   setMessage("Proje, bağlantı ve revizyon verileri bu cihaza indirildi; dosyayı güvenli saklayın.");
  }catch(e){setError(e instanceof Error?e.message:"Proje aktarımı başarısız");}
  finally{setBusy(false);}
 };
 return <section className="panel stack">
  <h2>Projeler</h2>
  <div className="alert small">Bu alan yalnızca Command Center operasyonel projelerini yönetir. VDCP, FFA, Master veya lifecycle kabul ve yetkilerini değiştirmez. Görev tamamlanması proje ya da VDCP kabulü değildir.</div>
  {!ready&&!loading&&<div className="alert small">Proje yönetimi Preview migration 006 uygulanana kadar kullanıma kapalıdır. Diğer modüller çalışmaya devam eder.</div>}
  {error&&<div className="alert" role="alert">{error}</div>}
  {message&&<p role="status">{message}</p>}
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button onClick={()=>void load()} disabled={busy||loading}>Yenile</button>
   <button onClick={()=>setArchived(x=>!x)} disabled={busy}>{archived?"Arşivi Gizle":"Arşivi de Göster"}</button>
   {ready&&<button className="primary" disabled={busy} onClick={()=>begin()}>Yeni Proje</button>}
   {ready&&<button disabled={busy} onClick={()=>void exportProjects()}>Proje ve Bağlantıları JSON İndir</button>}
  </div>
  {ready&&<section className="card stack">
   <h3>{editing?"Projeyi Düzenle":"Yeni Proje Oluştur"}</h3>
   <div className="field"><label>Proje başlığı</label><input maxLength={200} value={form.title} onChange={e=>patch("title",e.target.value)}/></div>
   <div className="field"><label>Amaç</label><textarea rows={3} maxLength={4000} value={form.objective} onChange={e=>patch("objective",e.target.value)}/></div>
   <div className="field"><label>Çalışma alanı (isteğe bağlı)</label><select value={form.workstreamId} onChange={e=>patch("workstreamId",e.target.value)}>
    <option value="">Bağımsız proje</option>
    {streams.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
   </select></div>
   <div className="field"><label>Durum</label><select value={form.status} onChange={e=>patch("status",e.target.value as Status)}>
    {(Object.keys(statuses) as Status[]).map(s=><option key={s} value={s}>{statuses[s]}</option>)}
   </select></div>
   <div className="field"><label>Sonraki adım</label><textarea maxLength={2000} rows={2} value={form.nextAction} onChange={e=>patch("nextAction",e.target.value)}/></div>
   <div className="row" style={{gap:8,flexWrap:"wrap"}}>
    <button className="primary" disabled={busy||form.title.trim().length<2} onClick={()=>void mutate(editing?"update":"create")}>{editing?"Değişiklikleri Kaydet":"Proje Oluştur"}</button>
    {editing&&<button disabled={busy} onClick={()=>begin()}>İptal</button>}
   </div>
  </section>}
  {loading&&<p>Projeler yükleniyor...</p>}
  {!loading&&ready&&projects.length===0&&<p className="small muted">Henüz operasyonel proje yok. Eski kayıtlar ve görevler otomatik taşınmadı.</p>}
  {projects.map(p=><article key={p.id} className="card stack">
   <div className="row between"><b>{p.title}</b><span className="badge">{statuses[p.status]}{p.archivedAt?" / Arşiv":""}</span></div>
   {p.objective&&<p style={{whiteSpace:"pre-wrap"}}>{p.objective}</p>}
   <p className="small muted">{p.workstreamName||"Bağımsız proje"} · {p.taskCount} bağlı görev · {p.completedTaskCount} tamamlanan görev · {p.recordCount} durum kaydı · Revizyon {p.revision}</p>
   {p.nextAction&&<p><b>Sonraki adım:</b> {p.nextAction}</p>}
   <div className="row" style={{gap:8,flexWrap:"wrap"}}>
    {!p.archivedAt&&<button disabled={busy} onClick={()=>begin(p)}>Düzenle</button>}
    <button disabled={busy} onClick={()=>void showHistory(p)}>{historyId===p.id?"Geçmişi Gizle":"Geçmiş"}</button>
    <button disabled={busy} onClick={()=>void mutate(p.archivedAt?"restore":"archive",p)}>{p.archivedAt?"Geri Al":"Arşivle"}</button>
   </div>
   {historyId===p.id&&history&&<div className="stack">{history.map((e,i)=><p key={i} className="small muted">{e.action} · Rev {e.revision} · {new Date(e.createdAt).toLocaleString("tr-TR")}</p>)}</div>}
  </article>)}
 </section>;
}
