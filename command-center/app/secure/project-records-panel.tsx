"use client";
import {useCallback,useEffect,useState} from "react";

type Status="TODO"|"IN_PROGRESS"|"DONE"|"BLOCKED"|"DEFERRED";
type RecordRow={
 id:string;title:string;workstream:string;summary:string;status:Status;
 nextAction:string;evidenceUrl:string|null;revision:number;
 archivedAt:string|null;createdAt:string;updatedAt:string;
};
type FormState={title:string;workstream:string;summary:string;status:Status;nextAction:string;evidenceUrl:string};
type HistoryEvent={action:string;revision:number;createdAt:string;snapshot:Record<string,unknown>};
const empty:FormState={title:"",workstream:"Command Center",summary:"",status:"TODO",nextAction:"",evidenceUrl:""};
const labels:Record<Status,string>={
 TODO:"YAPILACAK",IN_PROGRESS:"DEVAM EDİYOR",DONE:"YAPILDI",
 BLOCKED:"ENGELLENDİ",DEFERRED:"ERTELENDİ"
};
const date=(v:string)=>new Date(v).toLocaleString("tr-TR");

export default function ProjectRecordsPanel(){
 const [rows,setRows]=useState<RecordRow[]>([]);
 const [form,setForm]=useState<FormState>(empty);
 const [editing,setEditing]=useState<RecordRow|null>(null);
 const [archived,setArchived]=useState(false);
 const [historyId,setHistoryId]=useState<string|null>(null);
 const [history,setHistory]=useState<HistoryEvent[]|null>(null);
 const [busy,setBusy]=useState(false);
 const [exportBusy,setExportBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");

 const load=useCallback(async(includeArchive:boolean)=>{
  setLoading(true);setError("");
  try{
   const response=await fetch("/api/cc/records"+(includeArchive?"?archived=1":""),{cache:"no-store",credentials:"same-origin"});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Kayıtlar alınamadı");
   setRows(data.records||[]);
  }catch(e){setError(e instanceof Error?e.message:"Kayıtlar alınamadı");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void load(archived)},[load,archived]);
 const patch=(key:keyof FormState,value:string)=>setForm(s=>({...s,[key]:value}));
 const reset=()=>{setEditing(null);setForm(empty);};
 const edit=(row:RecordRow)=>{
  setEditing(row);setMessage("");
  setForm({title:row.title,workstream:row.workstream,summary:row.summary,
   status:row.status,nextAction:row.nextAction,evidenceUrl:row.evidenceUrl||""});
 };
 const mutate=async(operation:"create"|"update"|"archive"|"restore",row?:RecordRow)=>{
  if(operation==="archive"&&!window.confirm("Kaydı silmeden arşivlemek istiyor musunuz?"))return;
  setBusy(true);setError("");setMessage("");
  try{
   const payload=operation==="create"?{operation,...form}:
    operation==="update"?{operation,...form,id:editing?.id,revision:editing?.revision}:
    {operation,id:row?.id,revision:row?.revision};
   const response=await fetch("/api/cc/records",{
    method:"POST",credentials:"same-origin",
    headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
   });
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"İşlem başarısız");
   setMessage(operation==="create"?"Operasyonel kayıt oluşturuldu":
    operation==="update"?"Operasyonel kayıt güncellendi":
    operation==="archive"?"Kayıt arşivlendi":"Kayıt geri alındı");
   reset();
   setHistory(null);setHistoryId(null);
   await load(archived);
  }catch(e){setError(e instanceof Error?e.message:"İşlem başarısız");}
  finally{setBusy(false);}
 };
 const exportRecords=async()=>{
  setExportBusy(true);setError("");setMessage("");
  try{
   const response=await fetch("/api/cc/records/export",{credentials:"same-origin",cache:"no-store"});
   if(!response.ok){
    const data=await response.json();
    throw new Error(data.error||"Veriler dışa aktarılamadı");
   }
   const blob=await response.blob();
   const url=window.URL.createObjectURL(blob);
   const a=document.createElement("a");
   a.href=url;
   a.download="vyren-command-center-records-"+new Date().toISOString().slice(0,10)+".json";
   document.body.appendChild(a);
   a.click();
   a.remove();
   window.setTimeout(()=>window.URL.revokeObjectURL(url),3000);
   setMessage("Kayıtlar ve revizyon geçmişi, yalnızca bu cihaza JSON olarak indirildi. Dosyayı özel ve güvenli saklayın.");
  }catch(e){setError(e instanceof Error?e.message:"Veriler dışa aktarılamadı");}
  finally{setExportBusy(false);}
 };
 const showHistory=async(row:RecordRow)=>{
  if(historyId===row.id){setHistoryId(null);setHistory(null);return;}
  setHistoryId(row.id);setHistory(null);setError("");
  try{
   const response=await fetch("/api/cc/records?history="+encodeURIComponent(row.id),{cache:"no-store",credentials:"same-origin"});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Geçmiş okunamadı");
   setHistory(data.events||[]);
  }catch(e){setError(e instanceof Error?e.message:"Geçmiş okunamadı");}
 };
 const grouped=(Object.keys(labels) as Status[]).map(status=>({
  status,items:rows.filter(r=>r.status===status&&!r.archivedAt)
 }));
 return <section className="panel stack">
  <h2>Proje Kayıtları ve Durum Takibi</h2>
  <div className="alert small">Yalnızca operasyonel yönetim kaydıdır. VYREN Master, FFA, GNR, token ekonomisi veya lifecycle kararlarını değiştirmez. Burada “YAPILDI” yazılması bir canonical PASS anlamına gelmez.</div>
  <p className="small muted">Kurucu bu alanda işlerin mevcut durumunu ve sonraki adımını kaydedebilir. Geçmiş güncellemeler saklanır; geriye dönük sahte işlem kaydı oluşturulmaz.</p>
  {error&&<div className="alert" role="alert">{error}</div>}
  {message&&<div className="alert" role="status">{message}</div>}
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button disabled={loading||busy} onClick={()=>void load(archived)}>Kayıtları Yenile</button>
   <button disabled={busy} onClick={()=>setArchived(x=>!x)}>{archived?"Arşivi Gizle":"Arşivi de Göster"}</button>
   <button disabled={busy||exportBusy} onClick={()=>void exportRecords()}>{exportBusy?"İndiriliyor...":"Kayıtları ve Geçmişi JSON Olarak İndir"}</button>
  </div>
  <p className="small muted">JSON aktarımı arşivlenmiş kayıtları ve tüm revizyon olaylarını da içerir; sunucu verisini değiştirmez. İndirilen özel dosya canonical VYREN Master belgesi değildir.</p>
  <section className="card stack" aria-label="Operasyonel kayıt düzenleyici">
   <h3>{editing?"Kaydı Güncelle":"Yeni Operasyonel Kayıt"}</h3>
   <div className="field"><label htmlFor="cc-record-title">Başlık *</label><input id="cc-record-title" maxLength={200} value={form.title} onChange={e=>patch("title",e.target.value)}/></div>
   <div className="field"><label htmlFor="cc-record-stream">Çalışma alanı *</label><input id="cc-record-stream" maxLength={120} value={form.workstream} onChange={e=>patch("workstream",e.target.value)}/></div>
   <div className="field"><label htmlFor="cc-record-status">Durum *</label>
    <select id="cc-record-status" value={form.status} onChange={e=>patch("status",e.target.value)}>
     {(Object.keys(labels) as Status[]).map(x=><option key={x} value={x}>{labels[x]}</option>)}
    </select>
   </div>
   <div className="field"><label htmlFor="cc-record-summary">Açıklama / Mevcut Sonuç</label>
    <textarea id="cc-record-summary" rows={4} maxLength={4000} value={form.summary} onChange={e=>patch("summary",e.target.value)}/>
   </div>
   <div className="field"><label htmlFor="cc-record-next">Sonraki Adım / Bekleme Nedeni</label>
    <textarea id="cc-record-next" rows={3} maxLength={2000} value={form.nextAction} onChange={e=>patch("nextAction",e.target.value)}/>
   </div>
   <div className="field"><label htmlFor="cc-record-evidence">Kanıt Bağlantısı (isteğe bağlı, HTTPS)</label>
    <input id="cc-record-evidence" type="url" maxLength={2000} value={form.evidenceUrl} onChange={e=>patch("evidenceUrl",e.target.value)} placeholder="https://"/>
   </div>
   <div className="row" style={{gap:8,flexWrap:"wrap"}}>
    <button className="primary" disabled={busy||form.title.trim().length<2||form.workstream.trim().length<2} onClick={()=>void mutate(editing?"update":"create")}>{busy?"Kaydediliyor...":editing?"Güncellemeyi Kaydet":"Operasyonel Kaydı Oluştur"}</button>
    {editing&&<button disabled={busy} onClick={reset}>Düzenlemeyi İptal Et</button>}
   </div>
  </section>
  {loading&&<p>Kayıtlar yükleniyor...</p>}
  {!loading&&rows.length===0&&<p className="small muted">Henüz operasyonel proje kaydı yok. Test sonuçları veya canonical kararlar otomatik olarak içe aktarılmadı.</p>}
  {grouped.map(group=>group.items.length>0&&<section key={group.status} className="stack">
    <h3>{labels[group.status]} ({group.items.length})</h3>
    {group.items.map(row=><article key={row.id} className="card stack">
     <div className="row between"><b style={{overflowWrap:"anywhere"}}>{row.title}</b><span className="badge">{labels[row.status]}</span></div>
     <p className="small muted">{row.workstream} · Son güncelleme {date(row.updatedAt)} · Revizyon {row.revision}</p>
     {row.summary&&<p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{row.summary}</p>}
     {row.nextAction&&<p className="small"><b>Sonraki adım:</b> {row.nextAction}</p>}
     {row.evidenceUrl&&<a href={row.evidenceUrl} target="_blank" rel="noopener noreferrer" style={{overflowWrap:"anywhere"}}>Kanıt Bağlantısı</a>}
     <div className="row" style={{gap:8,flexWrap:"wrap"}}>
      <button disabled={busy} onClick={()=>edit(row)}>Düzenle</button>
      <button disabled={busy} onClick={()=>void showHistory(row)}>{historyId===row.id?"Geçmişi Gizle":"Değişiklik Geçmişi"}</button>
      <button disabled={busy} onClick={()=>void mutate("archive",row)}>Arşivle</button>
     </div>
     {historyId===row.id&&<div className="panel stack">
      <b>Gerçek Kayıt İşlemleri</b>
      {history===null?<p>Yükleniyor...</p>:history.map(ev=><p key={ev.revision} className="small">
       {date(ev.createdAt)} · {ev.action} · Revizyon {ev.revision} · {String(ev.snapshot.status||"")}
      </p>)}
     </div>}
    </article>)}
  </section>)}
  {archived&&rows.filter(r=>r.archivedAt).length>0&&<section className="stack">
   <h3>ARŞİV ({rows.filter(r=>r.archivedAt).length})</h3>
   {rows.filter(r=>r.archivedAt).map(row=><article className="card stack" key={row.id}>
    <b>{row.title}</b><p className="small muted">{row.workstream} · {labels[row.status]} · Revizyon {row.revision}</p>
    <p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{row.summary}</p>
    <button disabled={busy} onClick={()=>void mutate("restore",row)}>Geçmişi Koruyarak Geri Al</button>
   </article>)}
  </section>}
 </section>;
}
