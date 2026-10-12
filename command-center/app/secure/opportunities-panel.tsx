"use client";
import {useCallback,useEffect,useState} from "react";
import StatusPill from "./status-pill";
type Opportunity={id:string;title:string;organization:string;workstream:string;category:string;stage:string;summary:string;nextAction:string;evidenceUrl:string|null;revision:number;archivedAt:string|null;updatedAt:string};
type Form={title:string;organization:string;workstream:string;category:string;stage:string;summary:string;nextAction:string;evidenceUrl:string};
type Event={action:string;revision:number;createdAt:string;snapshot:Record<string,unknown>};
const empty:Form={title:"",organization:"",workstream:"Partnerships & Funding",category:"PARTNERSHIP",stage:"RESEARCH",summary:"",nextAction:"",evidenceUrl:""};
const stages=["RESEARCH","QUALIFIED","CONTACTED","REPLY_RECEIVED","DISCUSSION","PROPOSAL","INTERNAL_REVIEW","WAITING_EXTERNAL","DORMANT","CLOSED"];
const stageTR=["Araştırma","Ön Eleme","İletişim Kuruldu","Yanıt Alındı","Görüşme","Teklif","İç İnceleme","Dış Yanıt Bekleniyor","Beklemede","Takip Kapandı"];
const categories=["PARTNERSHIP","PROVIDER","FUNDING","EXCHANGE","OTHER"];
const categoryTR=["İş Ortaklığı","Sağlayıcı","Fonlama","Borsa / Listeleme","Diğer"];
export default function OpportunitiesPanel(){
 const [rows,setRows]=useState<Opportunity[]>([]),[ready,setReady]=useState(false);
 const [archived,setArchived]=useState(false),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const [error,setError]=useState(""),[message,setMessage]=useState("");
 const [editing,setEditing]=useState<Opportunity|null>(null),[form,setForm]=useState<Form>(empty);
 const [formOpen,setFormOpen]=useState(false),[query,setQuery]=useState("");
 const [historyId,setHistoryId]=useState<string|null>(null),[history,setHistory]=useState<Event[]|null>(null);
 const load=useCallback(async()=>{
  setLoading(true);setError("");
  try{
   const r=await fetch("/api/cc/opportunities"+(archived?"?archived=1":""),{credentials:"same-origin",cache:"no-store"});
   const x=await r.json();if(!r.ok)throw new Error(x.error||"Kayıtlar alınamadı");
   setReady(x.ready===true);setRows(x.opportunities||[]);
  }catch(e){setError(e instanceof Error?e.message:"Yükleme başarısız");}
  finally{setLoading(false);}
 },[archived]);
 useEffect(()=>{void load()},[load]);
 const edit=(o:Opportunity)=>{setFormOpen(true);setEditing(o);setForm({title:o.title,organization:o.organization,workstream:o.workstream,category:o.category,stage:o.stage,summary:o.summary,nextAction:o.nextAction,evidenceUrl:o.evidenceUrl||""});};
 const resetForm=()=>{setFormOpen(false);setEditing(null);setForm(empty);};
 const patch=(key:keyof Form,value:string)=>setForm(s=>({...s,[key]:value}));
 const mutate=async(operation:string,o?:Opportunity)=>{
  if(operation==="archive"&&!window.confirm("Fırsat arşivlensin mi? Geçmiş silinmez."))return;
  setBusy(true);setError("");setMessage("");
  try{
   const payload=operation==="create"?{operation,...form}:operation==="update"?{operation,...form,id:editing?.id,revision:editing?.revision}:{operation,id:o?.id,revision:o?.revision};
   const r=await fetch("/api/cc/opportunities",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(payload)});
   const x=await r.json();if(!r.ok)throw new Error(x.error||"İşlem başarısız");
   resetForm();setHistoryId(null);setHistory(null);
   setMessage("İşlem kaydedildi; geçmiş korundu.");await load();
  }catch(e){setError(e instanceof Error?e.message:"İşlem başarısız");}
  finally{setBusy(false);}
 };
 const showHistory=async(o:Opportunity)=>{
  if(historyId===o.id){setHistoryId(null);setHistory(null);return;}
  setHistoryId(o.id);setHistory(null);setError("");
  try{
   const r=await fetch("/api/cc/opportunities?history="+encodeURIComponent(o.id),{credentials:"same-origin",cache:"no-store"});
   const x=await r.json();if(!r.ok)throw new Error(x.error||"Geçmiş alınamadı");setHistory(x.events||[]);
  }catch(e){setError(e instanceof Error?e.message:"Geçmiş alınamadı");}
 };
 const visibleRows=rows.filter(o=>(o.title+" "+o.organization+" "+o.workstream+" "+o.nextAction).toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));
 return <section className="panel stack">
  <div className="cc-list-toolbar"><div><h2>Fırsatlar ve İş Ortaklıkları</h2><p className="small muted">Temasları, yanıtları ve sonraki işlemleri takip edin.</p></div>{ready&&<button className="primary" disabled={busy} aria-expanded={formOpen} aria-controls="cc-opportunity-editor" onClick={()=>{if(formOpen)resetForm();else{setEditing(null);setForm(empty);setFormOpen(true);}}}>{formOpen?"Formu Kapat":"+ Yeni Fırsat"}</button>}</div>
  <div className="alert small">Bu ekran yalnızca operasyonel takip içindir. Aşama adları sözleşme, bağlayıcı teklif, fon, borsa listeleme veya canonical VYREN kararı anlamına gelmez. Doğrulanmamış dış yanıtları gerçekmiş gibi kaydetmeyin.</div>
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button disabled={busy||loading} onClick={()=>void load()}>Yenile</button>
   <button disabled={busy} onClick={()=>setArchived(a=>!a)}>{archived?"Arşivi Gizle":"Arşivi de Göster"}</button>
  </div>
  {error&&<div className="alert" role="alert">{error}</div>}
  {message&&<p role="status">{message}</p>}
  {!loading&&!ready&&<p className="alert small">Preview migration 005 henüz uygulanmadı. Mevcut modüller çalışmaya devam ediyor.</p>}
  {ready&&rows.length>0&&<div className="field"><label htmlFor="cc-opportunity-search">Fırsat ara</label><input id="cc-opportunity-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Fırsat, kurum veya sonraki işlem"/></div>}
  {ready&&formOpen&&<section className="card stack cc-editor" id="cc-opportunity-editor">
   <h3>{editing?"Fırsatı Güncelle":"Yeni Operasyonel Fırsat"}</h3>
   {([["title","Fırsat Başlığı *",200],["organization","Kurum / Karşı Taraf",200],["workstream","Çalışma Alanı *",120]] as const).map(([key,label,max])=><div className="field" key={key}>
    <label htmlFor={"op-"+key}>{label}</label>
    <input id={"op-"+key} value={form[key]} maxLength={max} onChange={e=>patch(key,e.target.value)}/>
   </div>)}
   <div className="field"><label htmlFor="op-cat">Fırsat Türü</label>
    <select id="op-cat" value={form.category} onChange={e=>patch("category",e.target.value)}>
     {categories.map((c,i)=><option value={c} key={c}>{categoryTR[i]}</option>)}
    </select></div>
   <div className="field"><label htmlFor="op-stage">Takip Aşaması</label>
    <select id="op-stage" value={form.stage} onChange={e=>patch("stage",e.target.value)}>
     {stages.map((s,i)=><option value={s} key={s}>{stageTR[i]}</option>)}
    </select></div>
   {([["summary","Doğrulanan Durum",4000],["nextAction","Sonraki İşlem / Bekleme Nedeni",2000]] as const).map(([key,label,max])=><div className="field" key={key}>
    <label htmlFor={"op-"+key}>{label}</label>
    <textarea id={"op-"+key} rows={3} maxLength={max} value={form[key]} onChange={e=>patch(key,e.target.value)}/>
   </div>)}
   <div className="field"><label htmlFor="op-url">Kanıt Bağlantısı (HTTPS, isteğe bağlı)</label>
    <input id="op-url" type="url" maxLength={2000} value={form.evidenceUrl} onChange={e=>patch("evidenceUrl",e.target.value)}/>
   </div>
   <div className="row" style={{gap:8,flexWrap:"wrap"}}>
    <button className="primary" disabled={busy||form.title.trim().length<2||form.workstream.trim().length<2} onClick={()=>void mutate(editing?"update":"create")}>{busy?"Kaydediliyor...":editing?"Güncellemeyi Kaydet":"Fırsatı Kaydet"}</button>
    <button disabled={busy} onClick={resetForm}>İptal</button>
   </div>
  </section>}
  {ready&&rows.length===0&&<p>Henüz operasyonel fırsat kaydı yok. Önceki VYREN görüşmeleri otomatik olarak içe aktarılmadı.</p>}
  {ready&&rows.length>0&&visibleRows.length===0&&<p className="small muted">Aramayla eşleşen fırsat bulunamadı.</p>}
  {ready&&visibleRows.map(o=><article className="card stack" key={o.id}>
   <div className="row between"><b>{o.title}</b><StatusPill status={o.archivedAt?"ARCHIVED":o.stage} label={o.archivedAt?"ARŞİV":stageTR[stages.indexOf(o.stage)]||o.stage}/></div>
   <p className="small muted">{categoryTR[categories.indexOf(o.category)]||o.category} · {o.workstream} · {o.organization} · Revizyon {o.revision}</p>
   {o.summary&&<p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{o.summary}</p>}
   {o.nextAction&&<p><b>Sonraki işlem:</b> {o.nextAction}</p>}
   {o.evidenceUrl&&<a href={o.evidenceUrl} target="_blank" rel="noopener noreferrer">Kanıt Bağlantısı</a>}
   <div className="row" style={{gap:8,flexWrap:"wrap"}}>
    {!o.archivedAt&&<button disabled={busy} onClick={()=>edit(o)}>Düzenle</button>}
    <button disabled={busy} onClick={()=>void showHistory(o)}>Değişiklik Geçmişi</button>
    <button disabled={busy} onClick={()=>void mutate(o.archivedAt?"restore":"archive",o)}>{o.archivedAt?"Arşivden Geri Al":"Arşivle (Silmeden)"}</button>
   </div>
   {historyId===o.id&&<div className="panel stack"><b>Gerçek Değişiklikler</b>{history===null?<p>Yükleniyor...</p>:history.map(h=><p key={h.revision} className="small">{new Date(h.createdAt).toLocaleString("tr-TR")} · {h.action} · Revizyon {h.revision} · {String(h.snapshot.stage||"")}</p>)}</div>}
  </article>)}
  {loading&&<p>Yükleniyor...</p>}
  <p className="small muted">Yalnızca Kurucu erişimi. Arşivlenen kayıtlar ve tüm olaylar JSON dışa aktarımıyla taşınabilir; canonical yetki oluşturmaz.</p>
 </section>;
}
