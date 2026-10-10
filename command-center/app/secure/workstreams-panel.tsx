"use client";
import {useCallback,useEffect,useMemo,useState} from "react";

type Action={title:string;status:string;nextAction:string};
type Stream={
 name:string;total:number;todo:number;inProgress:number;done:number;
 blocked:number;deferred:number;updatedAt:string;nextActions:Action[]
};
type Result={streams:Stream[];asOf:string;source:string};
const status:Record<string,string>={
 TODO:"YAPILACAK",IN_PROGRESS:"DEVAM EDİYOR",DONE:"YAPILDI",
 BLOCKED:"ENGELLENDİ",DEFERRED:"ERTELENDİ"
};

export default function WorkstreamsPanel({openRecords}:{openRecords:()=>void}){
 const [data,setData]=useState<Result|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [query,setQuery]=useState("");
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
 const filtered=useMemo(()=>data?.streams.filter(s=>s.name.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")))||[],[data,query]);
 const totals=data?.streams.reduce((p,s)=>({
  total:p.total+s.total,active:p.active+s.todo+s.inProgress,
  blocked:p.blocked+s.blocked,deferred:p.deferred+s.deferred,
  done:p.done+s.done
 }),{total:0,active:0,blocked:0,deferred:0,done:0});
 return <section className="panel stack">
  <h2>Çalışma Alanları</h2>
  <div className="alert small">Bu görünüm yalnızca Command Center'ın gerçek PostgreSQL operasyonel kayıtlarından üretilir. VYREN Master, VDCP, FFA, GNR veya Lifecycle kararlarına yetki vermez. Henüz sisteme girilmemiş işler burada görünmez.</div>
  <p className="small muted">Yeni tablo veya veri aktarımı yapılmaz. Çalışma alanları mevcut kayıtlardaki çalışma alanı adlarına göre gruplandırılır. Arşivlenmiş kayıtlar aktif sayılara dahil edilmez.</p>
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button onClick={()=>void load()} disabled={loading}>{loading?"Yükleniyor...":"Görünümü Yenile"}</button>
   <button onClick={openRecords}>Proje Kayıtlarına Git</button>
  </div>
  {error&&<div className="alert" role="alert">{error}</div>}
  {data&&<>
   <p className="small muted">Kaynak: operasyonel proje kayıtları · Son okuma: {new Date(data.asOf).toLocaleString("tr-TR")}</p>
   <p><b>{data.streams.length}</b> çalışma alanı · <b>{totals?.total||0}</b> aktif kayıt · <b>{totals?.active||0}</b> yapılacak/devam eden · <b>{totals?.blocked||0}</b> engellenen · <b>{totals?.deferred||0}</b> ertelenen · <b>{totals?.done||0}</b> yapılan</p>
   {data.streams.length>0&&<div className="field"><label htmlFor="cc-workstream-search">Çalışma alanı ara</label>
    <input id="cc-workstream-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Çalışma alanı adı"/>
   </div>}
   {data.streams.length===0&&<p>Henüz aktif operasyonel proje kaydı bulunmuyor. Bu durum VYREN projesinde hiç çalışma olmadığı anlamına gelmez.</p>}
   {filtered.length===0&&data.streams.length>0&&<p>Aramayla eşleşen çalışma alanı bulunamadı.</p>}
   {filtered.map(s=><article className="card stack" key={s.name}>
    <div className="row between"><b>{s.name}</b><span className="badge">{s.total} kayıt</span></div>
    <p className="small muted">YAPILACAK {s.todo} · DEVAM EDİYOR {s.inProgress} · YAPILDI {s.done} · ENGELLENDİ {s.blocked} · ERTELENDİ {s.deferred}</p>
    <p className="small muted">Son güncelleme: {new Date(s.updatedAt).toLocaleString("tr-TR")}</p>
    {s.nextActions.length>0&&<div className="stack">
     <b>Öncelikli kayıtlı sonraki adımlar</b>
     {s.nextActions.map((a,i)=><div className="panel stack" key={i}>
      <p className="small"><b>{a.title}</b> · {status[a.status]||a.status}</p>
      <p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{a.nextAction}</p>
     </div>)}
    </div>}
    {s.nextActions.length===0&&<p className="small muted">Bu alanda aktif kayıtlara yazılmış sonraki adım bulunmuyor.</p>}
   </article>)}
  </>}
  {loading&&!data&&<p>Çalışma alanları yükleniyor...</p>}
 </section>;
}
