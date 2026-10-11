"use client";
import {useCallback,useEffect,useState} from "react";
type Status="TODO"|"IN_PROGRESS"|"DONE"|"BLOCKED"|"DEFERRED";
type Project={id:string;title:string;objective:string;nextAction:string;workstreamId:string|null;
 workstreamName:string|null;status:Status;revision:number;archivedAt:string|null;updatedAt:string;
 taskCount:number;completedTaskCount:number;recordCount:number};
type Stream={id:string;name:string;sourceKey:string;state:string};
type Preflight={scope:string;schemaReady:boolean;missing:string[];
 checks:Record<string,boolean>;counts:null|{projects:number;projectEvents:number;linkedTasks:number;
 linkedRecords:number;orphanTaskLinks:number;orphanRecordLinks:number};
 backup:string;migrationExecution:string;runtimeTests:string;checkedAt:string};
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
 const [formOpen,setFormOpen]=useState(false);
 const [query,setQuery]=useState("");
 const [form,setForm]=useState<Form>(empty);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const [checking,setChecking]=useState(false);
 const [preflight,setPreflight]=useState<Preflight|null>(null);
 const [history,setHistory]=useState<{action:string;revision:number;createdAt:string}[]|null>(null);
 const [historyId,setHistoryId]=useState<string|null>(null);
 const [detailId,setDetailId]=useState<string|null>(null);
 const [detail,setDetail]=useState<{tasks:{id:string;title:string;status:string;ownerName:string}[];records:{id:string;title:string;status:string;nextAction:string}[];taskTruncated:boolean;recordTruncated:boolean}|null>(null);
 async function showDetail(p:Project){
  if(detailId===p.id){setDetailId(null);setDetail(null);return;}
  setDetailId(p.id);setDetail(null);setError("");
  try{const r=await fetch("/api/cc/projects?detail="+encodeURIComponent(p.id),{credentials:"same-origin",cache:"no-store"});
   const v=await r.json();if(!r.ok)throw Error(v.error||"Proje ayrıntıları yüklenemedi");setDetail(v);
  }catch(e){setError(e instanceof Error?e.message:"Proje ayrıntıları yüklenemedi");}
 }
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
  setEditing(p||null);setFormOpen(true);setMessage("");setHistory(null);setHistoryId(null);
  setForm(p?{title:p.title,objective:p.objective,nextAction:p.nextAction,status:p.status,workstreamId:p.workstreamId||""}:empty);
 }
 const closeForm=()=>{setFormOpen(false);setEditing(null);setForm(empty);};
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
   closeForm();setMessage("Proje işlemi kaydedildi; geçmiş korunuyor.");await load();
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
 const inspectSchema=async()=>{
  setChecking(true);setError("");setPreflight(null);
  try{
   // Relative URL keeps the existing Founder session on this exact host.
   const r=await fetch("/api/cc/projects/preflight",{credentials:"same-origin",cache:"no-store"});
   const v=await r.json();
   if(!r.ok){
    if(r.status===401)throw Error("Bu adreste geçerli Kurucu oturumu bulunamadı. Aynı Command Center adresindeki /secure ekranından GitHub ile giriş yapın.");
    if(r.status===403)throw Error("Bu hesap Kurucu olarak yetkilendirilmemiş.");
    throw Error(v.error||"Ön kontrol çalıştırılamadı");
   }
   setPreflight(v);
  }catch(e){setError(e instanceof Error?e.message:"Ön kontrol çalıştırılamadı");}
  finally{setChecking(false);}
 };
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
 const visibleProjects=projects.filter(p=>(p.title+" "+p.objective+" "+(p.workstreamName||"")).toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));
 return <section className="panel stack">
  <div className="cc-list-toolbar"><div><h2>Projeler</h2><p className="small muted">Projeleri, bağlı görevleri ve durumları yönetin.</p></div>{ready&&<button className="primary" disabled={busy} aria-expanded={formOpen} aria-controls="cc-project-editor" onClick={()=>formOpen?closeForm():begin()}>{formOpen?"Formu Kapat":"+ Yeni Proje"}</button>}</div>
  <div className="alert small">Bu alan yalnızca Command Center operasyonel projelerini yönetir. VDCP, FFA, Master veya lifecycle kabul ve yetkilerini değiştirmez. Görev tamamlanması proje ya da VDCP kabulü değildir.</div>
  {!ready&&!loading&&<div className="alert small">Proje yönetimi Preview migration 006 uygulanana kadar kullanıma kapalıdır. Diğer modüller çalışmaya devam eder.</div>}
  {error&&<div className="alert" role="alert">{error}</div>}
  {message&&<p role="status">{message}</p>}
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button onClick={()=>void load()} disabled={busy||loading}>Yenile</button>
   <button onClick={()=>setArchived(x=>!x)} disabled={busy}>{archived?"Arşivi Gizle":"Arşivi de Göster"}</button>
   {ready&&<button disabled={busy} onClick={()=>void exportProjects()}>Proje ve Bağlantıları JSON İndir</button>}
  </div>
  {ready&&projects.length>0&&<div className="field"><label htmlFor="cc-project-search">Proje ara</label><input id="cc-project-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Başlık, amaç veya çalışma alanı"/></div>}
  {ready&&formOpen&&<section className="card stack cc-editor" id="cc-project-editor">
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
    <button disabled={busy} onClick={closeForm}>İptal</button>
   </div>
  </section>}
  {preflight&&<section className="card stack" aria-label="Preview veritabanı şema kontrolü">
   <h3>Preview Şema Ön Kontrolü</h3>
   <p><b>{preflight.schemaReady?"Şema hazır":"Eksik şema tespit edildi"}</b></p>
   {preflight.missing.length>0&&<p className="small">Eksik alanlar: {preflight.missing.join(", ")}</p>}
   {preflight.schemaReady&&preflight.counts&&<p className="small">Projeler: {preflight.counts.projects} · Proje geçmişi: {preflight.counts.projectEvents} · Bağlı görevler: {preflight.counts.linkedTasks} · Bağlı kayıtlar: {preflight.counts.linkedRecords} · Yetim görev bağlantısı: {preflight.counts.orphanTaskLinks} · Yetim kayıt bağlantısı: {preflight.counts.orphanRecordLinks}</p>}
   <p className="small muted">Bu kontrol salt okunurdur. Yedek: doğrulanmadı · Migration çalıştırılmaz · Gerçek kullanıcı testleri ayrıca gereklidir.</p>
   <p className="small muted">Son kontrol: {new Date(preflight.checkedAt).toLocaleString("tr-TR")}</p>
  </section>}
  {loading&&<p>Projeler yükleniyor...</p>}
  {!loading&&ready&&projects.length===0&&<p className="small muted">Henüz operasyonel proje yok. Eski kayıtlar ve görevler otomatik taşınmadı.</p>}
  {ready&&projects.length>0&&visibleProjects.length===0&&<p className="small muted">Aramayla eşleşen proje bulunamadı.</p>}
  {visibleProjects.map(p=><article key={p.id} className="card stack">
   <div className="row between"><b>{p.title}</b><span className="badge">{statuses[p.status]}{p.archivedAt?" / Arşiv":""}</span></div>
   {p.objective&&<p style={{whiteSpace:"pre-wrap"}}>{p.objective}</p>}
   <p className="small muted">{p.workstreamName||"Bağımsız proje"} · {p.taskCount} bağlı görev · {p.completedTaskCount} tamamlanan görev · {p.recordCount} durum kaydı · Revizyon {p.revision}</p>
   {p.nextAction&&<p><b>Sonraki adım:</b> {p.nextAction}</p>}
   <div className="row" style={{gap:8,flexWrap:"wrap"}}>
    {!p.archivedAt&&<button disabled={busy} onClick={()=>begin(p)}>Düzenle</button>}
    <button disabled={busy} onClick={()=>void showDetail(p)}>{detailId===p.id?"İşleri Gizle":"Bağlı İşleri Göster"}</button>
    <button disabled={busy} onClick={()=>void showHistory(p)}>{historyId===p.id?"Geçmişi Gizle":"Geçmiş"}</button>
    <button disabled={busy} onClick={()=>void mutate(p.archivedAt?"restore":"archive",p)}>{p.archivedAt?"Geri Al":"Arşivle"}</button>
   </div>
   {detailId===p.id&&detail&&<div className="panel stack">
    <b>Bağlı Görevler ({detail.tasks.length}{detail.taskTruncated?"+":""})</b>
    {detail.tasks.length===0&&<p className="small muted">Bu projeye bağlı görev yok.</p>}
    {detail.tasks.map(t=><p key={t.id} className="small">{t.title} · {t.status} · {t.ownerName}</p>)}
    <b>Durum Kayıtları ({detail.records.length}{detail.recordTruncated?"+":""})</b>
    {detail.records.length===0&&<p className="small muted">Bu projeye bağlı durum kaydı yok.</p>}
    {detail.records.map(r=><p key={r.id} className="small">{r.title} · {statuses[r.status as Status]||r.status}{r.nextAction?" · Sonraki: "+r.nextAction:""}</p>)}
    {(detail.taskTruncated||detail.recordTruncated)&&<p className="small muted">İlk 100 sonuç gösteriliyor; tam ilişki verileri JSON dışa aktarımında korunur.</p>}
   </div>}
   {historyId===p.id&&history&&<div className="stack">{history.map((e,i)=><p key={i} className="small muted">{e.action} · Rev {e.revision} · {new Date(e.createdAt).toLocaleString("tr-TR")}</p>)}</div>}
  </article>)}
 </section>;
}
