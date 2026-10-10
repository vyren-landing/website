"use client";
import {useCallback,useEffect,useMemo,useState} from "react";

type Action={title:string;status:string;nextAction:string};
type State="ACTIVE"|"PAUSED"|"ARCHIVED"|"UNREGISTERED";
type Stream={
 id:string|null;key:string;name:string;summary:string;nextAction:string;
 managed:boolean;state:State;revision:number;
 total:number;todo:number;inProgress:number;done:number;
 blocked:number;deferred:number;updatedAt:string;nextActions:Action[]
};
type Result={streams:Stream[];asOf:string;source:string;managementReady:boolean};
type Form={name:string;summary:string;nextAction:string;state:"ACTIVE"|"PAUSED"};
type Editor={kind:"create"|"adopt"|"update";sourceKey:string;id:string|null;revision:number};
type HistoryEvent={action:string;revision:number;createdAt:string;snapshot:Record<string,unknown>};
const initial:Form={name:"",summary:"",nextAction:"",state:"ACTIVE"};
const status:Record<string,string>={
 TODO:"YAPILACAK",IN_PROGRESS:"DEVAM EDİYOR",DONE:"YAPILDI",
 BLOCKED:"ENGELLENDİ",DEFERRED:"ERTELENDİ"
};
const stateLabel:Record<State,string>={
 ACTIVE:"AKTİF",PAUSED:"BEKLEMEDE",ARCHIVED:"ARŞİV",
 UNREGISTERED:"HENÜZ YÖNETİM KAYDI YOK"
};

export default function WorkstreamsPanel({openRecords}:{openRecords:()=>void}){
 const [data,setData]=useState<Result|null>(null);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const [query,setQuery]=useState("");
 const [editor,setEditor]=useState<Editor|null>(null);
 const [form,setForm]=useState<Form>(initial);
 const [historyId,setHistoryId]=useState<string|null>(null);
 const [history,setHistory]=useState<HistoryEvent[]|null>(null);

 const load=useCallback(async()=>{
  setLoading(true);setError("");
  try{
   const r=await fetch("/api/cc/workstreams",{credentials:"same-origin",cache:"no-store"});
   const body=await r.json();
   if(!r.ok)throw new Error(body.error||"Çalışma alanları alınamadı");
   if(!Array.isArray(body.streams))throw new Error("Geçersiz çalışma alanı yanıtı");
   setData(body);
  }catch(e){setError(e instanceof Error?e.message:"Çalışma alanları yüklenemedi");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void load()},[load]);
 const filtered=useMemo(()=>data?.streams.filter(s=>
  (s.name+" "+s.key).toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))
 )||[],[data,query]);
 const totals=data?.streams.reduce((p,s)=>({
  total:p.total+s.total,active:p.active+s.todo+s.inProgress,
  blocked:p.blocked+s.blocked,deferred:p.deferred+s.deferred,
  done:p.done+s.done
 }),{total:0,active:0,blocked:0,deferred:0,done:0});

 const start=(kind:Editor["kind"],row?:Stream)=>{
  setEditor({kind,sourceKey:row?.key||"",id:row?.id||null,revision:row?.revision||0});
  setForm({name:row?.name||"",summary:row?.summary||"",
   nextAction:row?.nextAction||"",
   state:row?.state==="PAUSED"?"PAUSED":"ACTIVE"});
  setMessage("");setError("");
 };
 const mutate=async(operation:string,fields:Record<string,unknown>)=>{
  setBusy(true);setError("");setMessage("");
  try{
   const response=await fetch("/api/cc/workstreams",{
    method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({operation,...fields})
   });
   const body=await response.json();
   if(!response.ok)throw new Error(body.error||"İşlem başarısız");
   setEditor(null);setForm(initial);setHistoryId(null);setHistory(null);
   setMessage("Çalışma alanı işlemi kaydedildi; önceki kayıtlar ve geçmişleri korunuyor.");
   await load();
  }catch(e){setError(e instanceof Error?e.message:"Çalışma alanı işlemi başarısız");}
  finally{setBusy(false);}
 };
 const save=()=>{
  if(!editor||form.name.trim().length<2||busy)return;
  void mutate(editor.kind,{
   sourceKey:editor.sourceKey,id:editor.id,revision:editor.revision,
   name:form.name,summary:form.summary,nextAction:form.nextAction,state:form.state
  });
 };
 const archive=async(row:Stream,operation:"archive"|"restore")=>{
  if(!row.id||busy)return;
  if(operation==="archive"&&!window.confirm(
   "Yalnızca çalışma alanı katalog kaydı arşivlenecek. İlgili proje kayıtları ve tüm geçmiş korunacak. Devam?"
  ))return;
  await mutate(operation,{id:row.id,revision:row.revision});
 };
 const showHistory=async(row:Stream)=>{
  if(!row.id)return;
  if(historyId===row.id){setHistoryId(null);setHistory(null);return;}
  setHistoryId(row.id);setHistory(null);setError("");
  try{
   const r=await fetch("/api/cc/workstreams?history="+encodeURIComponent(row.id),{
    credentials:"same-origin",cache:"no-store"
   });
   const body=await r.json();
   if(!r.ok)throw new Error(body.error||"Geçmiş okunamadı");
   setHistory(body.events||[]);
  }catch(e){setError(e instanceof Error?e.message:"Geçmiş alınamadı");}
 };
 return <section className="panel stack">
  <h2>Çalışma Alanları</h2>
  <div className="alert small">Bu ekran yalnızca Command Center operasyonlarını yönetir. VYREN Master, VDCP, FFA, GNR veya lifecycle kararlarını değiştirmez. Henüz sisteme aktarılmamış VYREN işleri otomatik olarak görüntülenmez.</div>
  <p className="small muted">Alan adı, açıklama, sonraki adım ve aktif/beklemede/arşiv durumu ayrı yönetilebilir. Bağlı operasyonel kayıtların geçmişte kullanılan çalışma alanı anahtarları sabit kalır; arşivleme hiçbir kaydı silmez.</p>
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button onClick={()=>void load()} disabled={loading||busy}>{loading?"Yükleniyor...":"Görünümü Yenile"}</button>
   <button onClick={openRecords}>Proje Kayıtlarına Git</button>
   {data?.managementReady&&<button disabled={busy} className="primary"
      onClick={()=>start("create")}>Yeni Çalışma Alanı</button>}
  </div>
  {data&&!data.managementReady&&<div className="alert small">
   Çalışma alanlarını ayrı yönetmek için Preview migration 004 henüz uygulanmadı.
   Mevcut PostgreSQL proje kayıtlarının görüntülenmesi kesintisiz sürüyor. Bu ekran migration tamamlanana kadar salt okunur.
  </div>}
  {error&&<div className="alert" role="alert">{error}</div>}
  {message&&<p role="status">{message}</p>}
  {data?.managementReady&&editor&&<section className="card stack" aria-label="Çalışma alanı düzenleyici">
   <h3>{editor.kind==="create"?"Yeni Çalışma Alanı":
    editor.kind==="adopt"?"Mevcut Çalışma Alanını Yönetime Al":"Çalışma Alanını Düzenle"}</h3>
   {editor.kind!=="create"&&<p className="small muted">
    Sabit anahtar: {editor.sourceKey}. Görünen adın değişmesi mevcut proje kayıtlarını taşımaz veya silmez.
   </p>}
   <div className="field"><label htmlFor="cc-stream-name">Görünen ad *</label>
    <input id="cc-stream-name" maxLength={120} value={form.name}
     onChange={e=>setForm(s=>({...s,name:e.target.value}))}/>
   </div>
   <div className="field"><label htmlFor="cc-stream-summary">Amaç ve kapsam</label>
    <textarea id="cc-stream-summary" maxLength={4000} rows={3} value={form.summary}
     onChange={e=>setForm(s=>({...s,summary:e.target.value}))}/>
   </div>
   <div className="field"><label htmlFor="cc-stream-next">Çalışma alanının sonraki adımı</label>
    <textarea id="cc-stream-next" maxLength={2000} rows={3} value={form.nextAction}
     onChange={e=>setForm(s=>({...s,nextAction:e.target.value}))}/>
   </div>
   {editor.kind==="update"&&<div className="field"><label htmlFor="cc-stream-state">Operasyonel durum</label>
    <select id="cc-stream-state" value={form.state}
     onChange={e=>setForm(s=>({...s,state:e.target.value as Form["state"]}))}>
     <option value="ACTIVE">AKTİF</option><option value="PAUSED">BEKLEMEDE</option>
    </select>
   </div>}
   <div className="row" style={{gap:8,flexWrap:"wrap"}}>
    <button className="primary" disabled={busy||form.name.trim().length<2} onClick={save}>
     {busy?"Kaydediliyor...":"Çalışma Alanını Kaydet"}
    </button>
    <button disabled={busy} onClick={()=>setEditor(null)}>İptal</button>
   </div>
  </section>}
  {data&&<>
   <p className="small muted">Kaynak: operasyonel PostgreSQL kayıtları · Son okuma: {new Date(data.asOf).toLocaleString("tr-TR")}</p>
   <p><b>{data.streams.length}</b> çalışma alanı · <b>{totals?.total||0}</b> aktif kayıt · <b>{totals?.active||0}</b> yapılacak/devam eden · <b>{totals?.blocked||0}</b> engellenen · <b>{totals?.deferred||0}</b> ertelenen · <b>{totals?.done||0}</b> yapılan</p>
   {data.streams.length>0&&<div className="field"><label htmlFor="cc-workstream-search">Çalışma alanı ara</label>
    <input id="cc-workstream-search" value={query}
     onChange={e=>setQuery(e.target.value)} placeholder="Çalışma alanı adı"/>
   </div>}
   {data.streams.length===0&&<p>Henüz çalışma alanı bulunmuyor. VYREN projesindeki işler bu ekrana otomatik aktarılmış değildir.</p>}
   {filtered.length===0&&data.streams.length>0&&<p>Eşleşen çalışma alanı bulunamadı.</p>}
   {filtered.map(s=><article className="card stack" key={s.key}>
    <div className="row between"><b>{s.name}</b>
     <span className="badge">{stateLabel[s.state]} · {s.total} kayıt</span>
    </div>
    {s.managed&&s.name!==s.key&&<p className="small muted">Sabit anahtar: {s.key}</p>}
    {s.summary&&<p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{s.summary}</p>}
    <p className="small muted">YAPILACAK {s.todo} · DEVAM EDİYOR {s.inProgress} · YAPILDI {s.done} · ENGELLENDİ {s.blocked} · ERTELENDİ {s.deferred}</p>
    <p className="small muted">Son güncelleme: {new Date(s.updatedAt).toLocaleString("tr-TR")}</p>
    {s.nextAction&&<p><b>Alan düzeyindeki sonraki adım:</b> {s.nextAction}</p>}
    {s.nextActions.length>0&&<div className="stack">
     <b>Kayıtlardaki öncelikli sonraki adımlar</b>
     {s.nextActions.map((a,i)=><div className="panel stack" key={i}>
      <p className="small"><b>{a.title}</b> · {status[a.status]||a.status}</p>
      <p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{a.nextAction}</p>
     </div>)}
    </div>}
    {!s.nextAction&&s.nextActions.length===0&&<p className="small muted">Bu alanda aktif bir sonraki adım kaydı bulunmuyor.</p>}
    {data.managementReady&&<div className="row" style={{gap:8,flexWrap:"wrap"}}>
     {!s.managed?<button disabled={busy} onClick={()=>start("adopt",s)}>Mevcut Alanı Yönetime Al</button>:
      <>
       {s.state!=="ARCHIVED"&&<button disabled={busy} onClick={()=>start("update",s)}>Düzenle</button>}
       <button disabled={busy} onClick={()=>void showHistory(s)}>Değişiklik Geçmişi</button>
       {s.state==="ARCHIVED"?
        <button disabled={busy} onClick={()=>void archive(s,"restore")}>Arşivden Geri Al</button>:
        <button disabled={busy} onClick={()=>void archive(s,"archive")}>Arşivle (Silmeden)</button>}
      </>}
    </div>}
    {historyId===s.id&&s.id&&<div className="panel stack">
     <b>Gerçek Çalışma Alanı Değişiklikleri</b>
     {history===null?<p>Yükleniyor...</p>:history.map(h=>
      <p className="small" key={h.revision}>{new Date(h.createdAt).toLocaleString("tr-TR")} · {h.action} · Revizyon {h.revision} · {String(h.snapshot.state||"")}</p>
     )}
    </div>}
   </article>)}
  </>}
  {loading&&!data&&<p>Çalışma alanları yükleniyor...</p>}
 </section>;
}
