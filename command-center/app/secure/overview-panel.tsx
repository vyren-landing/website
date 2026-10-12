"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import StatusPill from "./status-pill";

type Destination="active"|"records"|"workstreams"|"opportunities";
type Item={
 id:string;title:string;status:string;nextAction?:string;workstream?:string;
 organization?:string;ownerName?:string
};
type Counts={
 tasks:Record<string,number>;records:Record<string,number>;
 workstreams:Record<string,number>;opportunities:Record<string,number>;
 archivedTasks:number;archivedRecords:number;archivedOpportunities:number
};
type Report={
 asOf:string;scope:string;source:string;
 features:{streams:boolean;opportunities:boolean};
 counts:Counts;
 attention:{founderReviews:Item[];recordActions:Item[];opportunityActions:Item[]};
 limits:{perQueue:number}
};

const labels:Record<string,string>={
 "BRIEFED":"Tanımlandı","ACCEPTED":"Kabul Edildi","IN PROGRESS":"Devam Ediyor",
 "FOUNDER REVIEW":"Kurucu İncelemesi","COMPLETED":"Tamamlandı","CANCELLED":"İptal",
 "TODO":"Yapılacak","IN_PROGRESS":"Devam Ediyor","DONE":"Yapıldı",
 "BLOCKED":"Engellendi","DEFERRED":"Ertelendi","ACTIVE":"Aktif",
 "PAUSED":"Beklemede","ARCHIVED":"Arşiv","RESEARCH":"Araştırma",
 "QUALIFIED":"Ön Eleme","CONTACTED":"İletişim Kuruldu",
 "REPLY_RECEIVED":"Yanıt Alındı","DISCUSSION":"Görüşme","PROPOSAL":"Teklif",
 "INTERNAL_REVIEW":"İç İnceleme","WAITING_EXTERNAL":"Dış Yanıt Bekleniyor",
 "DORMANT":"Durgun","CLOSED":"Takip Kapandı"
};
const total=(data:Record<string,number>)=>
 Object.values(data).reduce((n,value)=>n+value,0);
const sorted=(data:Record<string,number>)=>
 Object.entries(data).sort((a,b)=>b[1]-a[1]);
const shortListLimit=4;

function StatusBreakdown({title,counts,archived}:{
 title:string;counts:Record<string,number>;archived?:number
}){
 return <article className="cc-overview-breakdown-card">
  <div className="row between"><b>{title}</b><span className="small muted">{total(counts)} kayıt</span></div>
  {sorted(counts).length===0&&<p className="small muted">Kayıt bulunmuyor.</p>}
  {sorted(counts).map(([status,count])=>
   <div className="cc-overview-breakdown-row" key={status}>
    <span>{labels[status]||status}</span><b>{count}</b>
   </div>)}
  {archived!==undefined&&<div className="cc-overview-breakdown-row muted">
   <span>Arşivlenen</span><b>{archived}</b>
  </div>}
 </article>;
}

function AttentionGroup({title,subtitle,countLabel,items,empty,open,buttonLabel}:{
 title:string;subtitle:string;countLabel:string;items:Item[];
 empty:string;open:()=>void;buttonLabel:string
}){
 const shown=items.slice(0,shortListLimit);
 return <article className="cc-overview-attention-card">
  <div className="cc-overview-attention-head">
   <div className="stack" style={{gap:4}}>
    <h3>{title}</h3><p className="small muted">{subtitle}</p>
   </div>
   <span className="cc-overview-count">{countLabel}</span>
  </div>
  <div className="cc-overview-items">
   {shown.length===0?<p className="cc-overview-empty">{empty}</p>:
    shown.map(item=><div className="cc-overview-item" key={item.id}>
     <div className="row between">
      <b>{item.title}</b>
      <StatusPill status={item.status} label={labels[item.status]||item.status}/>
     </div>
     {(item.ownerName||item.organization||item.workstream)&&
      <p className="small muted">
       {[item.ownerName,item.organization,item.workstream].filter(Boolean).join(" · ")}
      </p>}
     {item.nextAction&&<p className="cc-overview-next"><b>Sonraki:</b> {item.nextAction}</p>}
    </div>)}
   {items.length>shown.length&&
    <p className="small muted">Bu kartta ilk {shown.length} kayıt gösteriliyor.</p>}
  </div>
  <button type="button" className="cc-overview-open" onClick={open}>
   {buttonLabel} <span aria-hidden="true">→</span>
  </button>
 </article>;
}

function Metric({label,value,description,open}:{
 label:string;value:number;description:string;open:()=>void
}){
 return <button type="button" className="cc-overview-metric" onClick={open}>
  <span className="small muted">{label}</span>
  <span className="cc-overview-metric-value">{value}</span>
  <span className="cc-overview-metric-caption">{description} <span aria-hidden="true">↗</span></span>
 </button>;
}

export default function OverviewPanel({openView}:{openView:(view:Destination)=>void}){
 const [data,setData]=useState<Report|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const load=useCallback(async()=>{
  setBusy(true);setError("");
  try{
   const response=await fetch("/api/cc/overview",{credentials:"same-origin",cache:"no-store"});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"Yönetim özeti yüklenemedi");
   if(!result.counts||!result.attention)throw new Error("Geçersiz rapor yanıtı");
   setData(result as Report);
  }catch(e){
   setError(e instanceof Error?e.message:"Yönetim özeti yüklenemedi");
  }finally{setBusy(false);}
 },[]);
 useEffect(()=>{void load()},[load]);

 const focus=useMemo(()=>{
  if(!data)return null;
  const counts=data.counts;
  return {
   tasks:total(counts.tasks),
   records:total(counts.records),
   streams:total(counts.workstreams),
   opportunities:total(counts.opportunities),
   reviews:counts.tasks["FOUNDER REVIEW"]||0,
   blocked:counts.records.BLOCKED||0,
   waiting:counts.opportunities.WAITING_EXTERNAL||0
  };
 },[data]);

 return <section className="cc-overview stack" aria-label="Operasyonel Genel Bakış">
  <div className="cc-list-toolbar">
   <div>
    <h2>Operasyonun Genel Görünümü</h2>
    <p className="small muted">Önce inceleme ve takip gerektiren işleri görün, ardından diğer kayıtlara geçin.</p>
   </div>
   <button type="button" disabled={busy} onClick={()=>void load()}>
    {busy?"Yenileniyor...":"Görünümü Yenile"}
   </button>
  </div>
  <p className="cc-overview-boundary">
   Yalnızca Command Center'a girilmiş operasyonel kayıtlar. VYREN Master, FFA, GNR, VDCP ve
   Launch Lifecycle ile canlı senkronizasyon veya canonical PASS anlamı taşımaz.
  </p>
  {error&&<p role="alert" className="alert">{error}</p>}
  {!data&&busy&&<p className="panel" role="status">Operasyonel kayıtlar okunuyor...</p>}
  {data&&focus&&<>
   <section className="cc-overview-priority" aria-labelledby="cc-overview-priority-title">
    <div className="cc-overview-section-head">
     <div><h2 id="cc-overview-priority-title">Öncelikli Takip</h2>
      <p className="small muted">İlgili işlem modülüne geçin. Bu ekran yalnızca bilgi gösterir.</p>
     </div>
     <span className="small muted">Her listede en çok {data.limits.perQueue} kayıt alınır.</span>
    </div>
    <div className="cc-overview-attention-grid">
     <AttentionGroup title="Kurucu İncelemesi" subtitle="Teslim ve onay bekleyen görevler"
      countLabel={focus.reviews+" bekliyor"}
      items={data.attention.founderReviews||[]} empty="İnceleme bekleyen görev yok."
      open={()=>openView("active")} buttonLabel="Görevleri Aç"/>
     <AttentionGroup title="Proje Takibi" subtitle="Engeller ve kaydedilmiş sonraki adımlar"
      countLabel={focus.blocked+" engelli"}
      items={data.attention.recordActions||[]} empty="Takip sırasına alınmış proje kaydı yok."
      open={()=>openView("records")} buttonLabel="Proje Kayıtlarını Aç"/>
     <AttentionGroup title="Dış Temaslar" subtitle="Fırsatlar, dış yanıtlar ve görüşmeler"
      countLabel={focus.waiting+" yanıt bekliyor"}
      items={data.attention.opportunityActions||[]} empty="Kayıtlı açık takip işlemi yok."
      open={()=>openView("opportunities")} buttonLabel="Fırsatları Aç"/>
    </div>
   </section>

   <section className="cc-overview-snapshot" aria-labelledby="cc-overview-snapshot-title">
    <div className="cc-overview-section-head">
     <div><h2 id="cc-overview-snapshot-title">Operasyonun Durumu</h2>
      <p className="small muted">Arşiv dışı kayıtlar; çalışma alanları için kayıtlı toplam.</p>
     </div>
    </div>
    <div className="cc-overview-metrics">
     <Metric label="Görevler" value={focus.tasks} description="Görev listesini aç"
      open={()=>openView("active")}/>
     <Metric label="Proje Kayıtları" value={focus.records} description="Durum takibine git"
      open={()=>openView("records")}/>
     <Metric label="Çalışma Alanları" value={focus.streams} description="Alanları incele"
      open={()=>openView("workstreams")}/>
     <Metric label="Fırsatlar" value={focus.opportunities} description="Fırsatları incele"
      open={()=>openView("opportunities")}/>
    </div>
   </section>

   <details className="cc-overview-details">
    <summary>Durum dağılımları ve arşiv sayılarını göster</summary>
    <div className="cc-overview-breakdowns">
     <StatusBreakdown title="Görevler" counts={data.counts.tasks}
      archived={data.counts.archivedTasks}/>
     <StatusBreakdown title="Proje Kayıtları" counts={data.counts.records}
      archived={data.counts.archivedRecords}/>
     <StatusBreakdown title="Çalışma Alanları" counts={data.counts.workstreams}/>
     <StatusBreakdown title="Fırsatlar" counts={data.counts.opportunities}
      archived={data.counts.archivedOpportunities}/>
    </div>
   </details>

   <footer className="cc-overview-footer">
    <span>Yanıt zamanı: {new Date(data.asOf).toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"})}</span>
    <span>Listeler sınırlı örnektir; tüm kayıtlar ilgili modüllerdedir. Kayıt bulunmaması, projenin tamamlandığı anlamına gelmez.</span>
   </footer>
  </>}
 </section>;
}
