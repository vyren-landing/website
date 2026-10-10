"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
type Item={id:string;title:string;status:string;nextAction?:string;workstream?:string;organization?:string;ownerName?:string};
type Counts={tasks:Record<string,number>;records:Record<string,number>;workstreams:Record<string,number>;opportunities:Record<string,number>;archivedTasks:number;archivedRecords:number;archivedOpportunities:number};
type Report={asOf:string;scope:string;source:string;features:{streams:boolean;opportunities:boolean};counts:Counts;attention:{founderReviews:Item[];recordActions:Item[];opportunityActions:Item[]};limits:{perQueue:number}};
const names:Record<string,string>={
 "BRIEFED":"TANIMLANDI","ACCEPTED":"KABUL EDİLDİ","IN PROGRESS":"DEVAM EDİYOR",
 "FOUNDER REVIEW":"KURUCU İNCELEMESİ","COMPLETED":"TAMAMLANDI","CANCELLED":"İPTAL",
 "TODO":"YAPILACAK","IN_PROGRESS":"DEVAM EDİYOR","DONE":"YAPILDI",
 "BLOCKED":"ENGELLENDİ","DEFERRED":"ERTELENDİ","ACTIVE":"AKTİF",
 "PAUSED":"BEKLEMEDE","ARCHIVED":"ARŞİV",
 "RESEARCH":"ARAŞTIRMA","QUALIFIED":"ÖN ELEME","CONTACTED":"İLETİŞİM",
 "REPLY_RECEIVED":"YANIT ALINDI","DISCUSSION":"GÖRÜŞME","PROPOSAL":"TEKLİF",
 "INTERNAL_REVIEW":"İÇ İNCELEME","WAITING_EXTERNAL":"DIŞ YANIT BEKLENİYOR",
 "DORMANT":"DURGUN","CLOSED":"TAKİP KAPANDI"
};
const total=(data:Record<string,number>)=>Object.values(data).reduce((n,v)=>n+v,0);
const ordered=(data:Record<string,number>)=>Object.entries(data).sort((a,b)=>b[1]-a[1]);
function CountsGroup({title,counts,archived}:{title:string;counts:Record<string,number>;archived?:number}){
 return <article className="card stack">
  <div className="row between"><b>{title}</b><span className="badge">{total(counts)} aktif</span></div>
  {Object.keys(counts).length===0?<p className="small muted">Henüz aktif operasyonel kayıt yok.</p>:
   ordered(counts).map(([key,count])=><p className="small" key={key}>{names[key]||key}: <b>{count}</b></p>)}
  {archived!==undefined&&<p className="small muted">Arşivde: {archived}</p>}
 </article>;
}
function Queue({title,items,empty,open}:{title:string;items:Item[];empty:string;open:()=>void}){
 return <article className="card stack">
  <div className="row between"><h3>{title}</h3><button onClick={open}>İlgili Bölümü Aç</button></div>
  {items.length===0&&<p className="small muted">{empty}</p>}
  {items.map(row=><div key={row.id} className="panel stack">
   <b>{row.title}</b>
   <p className="small muted">{names[row.status]||row.status}{row.workstream?" · "+row.workstream:""}{row.ownerName?" · "+row.ownerName:""}{row.organization?" · "+row.organization:""}</p>
   {row.nextAction&&<p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{row.nextAction}</p>}
  </div>)}
 </article>;
}
export default function OverviewPanel({openView}:{openView:(view:"active"|"records"|"workstreams"|"opportunities")=>void}){
 const [data,setData]=useState<Report|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const load=useCallback(async()=>{
  setBusy(true);setError("");
  try{
   const r=await fetch("/api/cc/overview",{credentials:"same-origin",cache:"no-store"});
   const body=await r.json();
   if(!r.ok)throw new Error(body.error||"Yönetim özeti yüklenemedi");
   if(!body.counts||!body.attention)throw new Error("Geçersiz rapor yanıtı");
   setData(body);
  }catch(e){setError(e instanceof Error?e.message:"Yönetim özeti yüklenemedi");}
  finally{setBusy(false);}
 },[]);
 useEffect(()=>{void load()},[load]);
 const focus=useMemo(()=>{
  if(!data)return null;
  const c=data.counts;
  return {
   tasks:total(c.tasks),
   records:total(c.records),
   opportunities:total(c.opportunities),
   review:c.tasks["FOUNDER REVIEW"]||0,
   blocked:c.records.BLOCKED||0,
   waiting:(c.opportunities.WAITING_EXTERNAL||0),
   streams:total(c.workstreams)
  };
 },[data]);
 return <section className="panel stack">
  <h2>Yönetim Özeti / Raporlar</h2>
  <div className="alert small">Bu ekran sadece Command Center PostgreSQL operasyonlarını özetler. VYREN Master, VDCP, GNR, FFA veya Launch Lifecycle ile canlı senkronize değildir. Gösterilmeyen işlerin tamamlandığı veya Genesis'in hazır olduğu sonucu çıkarılamaz.</div>
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button disabled={busy} onClick={()=>void load()}>{busy?"Okunuyor...":"Raporu Yenile"}</button>
   <button onClick={()=>openView("records")}>Proje Kayıtlarına Git</button>
  </div>
  {error&&<p className="alert" role="alert">{error}</p>}
  {data&&<p className="small muted">Tutarlı PostgreSQL okuması: {new Date(data.asOf).toLocaleString("tr-TR")} · Kaynak: yalnızca operasyonel kayıtlar · Bu ekran veri değiştirmez.</p>}
  {focus&&<section className="card stack">
   <h3>Tek Bakışta</h3>
   <div className="row" style={{gap:12,flexWrap:"wrap"}}>
    <span><b>{focus.tasks}</b> aktif görev</span>
    <span><b>{focus.records}</b> aktif proje kaydı</span>
    <span><b>{focus.streams}</b> çalışma alanı</span>
    <span><b>{focus.opportunities}</b> aktif fırsat</span>
   </div>
   <p className="small">Kurucu incelemesi bekleyen görev: <b>{focus.review}</b> · Engellenen proje kaydı: <b>{focus.blocked}</b> · Dış yanıt bekleyen fırsat: <b>{focus.waiting}</b></p>
  </section>}
  {data&&<div className="stack">
   <div className="row" style={{gap:12,flexWrap:"wrap",alignItems:"stretch"}}>
    <div style={{flex:"1 1 220px"}}><CountsGroup title="Görev Durumu" counts={data.counts.tasks} archived={data.counts.archivedTasks}/></div>
    <div style={{flex:"1 1 220px"}}><CountsGroup title="Proje Kayıtları" counts={data.counts.records} archived={data.counts.archivedRecords}/></div>
   </div>
   <div className="row" style={{gap:12,flexWrap:"wrap",alignItems:"stretch"}}>
    <div style={{flex:"1 1 220px"}}><CountsGroup title="Çalışma Alanları" counts={data.counts.workstreams}/></div>
    <div style={{flex:"1 1 220px"}}><CountsGroup title="Fırsatlar" counts={data.counts.opportunities} archived={data.counts.archivedOpportunities}/></div>
   </div>
   <h3>Takip ve İnceleme Kuyruğu</h3>
   <Queue title="Kurucu İncelemesi Bekleyen Görevler" items={data.attention.founderReviews}
    empty="Şu anda bu ekrana kayıtlı Kurucu incelemesi bekleyen görev yok." open={()=>openView("active")}/>
   <Queue title="Proje Kayıtlarının Sonraki Adımları" items={data.attention.recordActions}
    empty="Aktif, engellenen veya ertelenen proje kayıtlarında sonraki adım yok." open={()=>openView("records")}/>
   <Queue title="Fırsatlar ve Dış Temaslar" items={data.attention.opportunityActions}
    empty="Bu görünümde takip işlemi yazılmış açık fırsat bulunmuyor." open={()=>openView("opportunities")}/>
   <p className="small muted">Kuyruklar her kategoride en çok {data.limits.perQueue} öğe gösterir. Sayılar tüm aktif tablolardan hesaplanır; kuyruklar tam dışa aktarma değildir. Arşivlenmiş veriler geçmişleriyle korunur.</p>
  </div>}
  {busy&&!data&&<p>Yönetim özeti hazırlanıyor...</p>}
 </section>;
}
