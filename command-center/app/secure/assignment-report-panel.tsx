"use client";
import {useCallback,useEffect,useMemo,useState} from "react";

type Member={id:string;name:string;active:boolean;positionTitle:string|null;total:number;briefed:number;accepted:number;progress:number;review:number;completed:number};
type Task={id:string;title:string;status:string;ownerId:string;ownerName:string;updatedAt:string};
type Report={positionReady:boolean;members:Member[];tasks:Task[];total:number;page:number;pageSize:number};
const names:Record<string,string>={"BRIEFED":"Tanımlandı","ACCEPTED":"Kabul Edildi","IN PROGRESS":"Devam Ediyor","FOUNDER REVIEW":"Kurucu İncelemesi","COMPLETED":"Tamamlandı"};
const sum=(rows:Member[],k:keyof Member)=>rows.reduce((n,m)=>n+Number(m[k]||0),0);

export default function AssignmentReportPanel(){
 const [owner,setOwner]=useState("all");
 const [page,setPage]=useState(1);
 const [data,setData]=useState<Report|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const load=useCallback(async()=>{
  setLoading(true);setError("");
  try{
   const r=await fetch("/api/cc/assignment-report?owner="+encodeURIComponent(owner)+"&page="+page,{credentials:"same-origin",cache:"no-store"});
   const v=await r.json();if(!r.ok)throw Error(v.error||"Rapor okunamadı");
   setData(v);
  }catch(e){setError(e instanceof Error?e.message:"Rapor okunamadı");}
  finally{setLoading(false);}
 },[owner,page]);
 useEffect(()=>{void load()},[load]);
 const grouped=useMemo(()=>{
  const groups=new Map<string,Member[]>();
  for(const m of data?.members||[]){
   const key=m.positionTitle?.trim()||"Pozisyon atanmamış";
   groups.set(key,[...(groups.get(key)||[]),m]);
  }
  return [...groups].sort((a,b)=>a[0].localeCompare(b[0],"tr"));
 },[data]);
 return <section className="panel stack">
  <h2>Görev Dağılımı / İş Yükü</h2>
  <div className="alert small">Sadece Kurucuya açık operasyonel görünüm. Contributor rolü ve pozisyon birbirinden bağımsızdır. Bu rapor canonical VDCP veya VYREN lifecycle durumunu değiştirmez.</div>
  <div className="row" style={{gap:8,flexWrap:"wrap"}}>
   <button onClick={()=>void load()} disabled={loading}>{loading?"Yenileniyor...":"Raporu Yenile"}</button>
  </div>
  {error&&<p role="alert" className="alert">{error}</p>}
  {data&&<div className="card stack">
   <h3>Genel İş Yükü</h3>
   <p>Aktif görev: <b>{sum(data.members,"total")}</b> · Tanımlandı: <b>{sum(data.members,"briefed")}</b> · Kabul edildi: <b>{sum(data.members,"accepted")}</b> · Devam ediyor: <b>{sum(data.members,"progress")}</b> · Kurucu incelemesi: <b>{sum(data.members,"review")}</b> · Tamamlandı (arşivlenmemiş): <b>{sum(data.members,"completed")}</b></p>
   <p className="small muted">Sayılar tüm aktif görev kayıtlarından hesaplanır, 250 görev sınırına tabi değildir. Ayrıntılar sayfalıdır.</p>
  </div>}
  {data&&<div className="stack">
   <h3>Pozisyona ve Kişiye Göre</h3>
   {!data.positionReady&&<div className="alert small">Pozisyon adlarını göstermek için yalnızca Preview Neon üzerinde migration 007 uygulanmalıdır. Kişi bazlı görev raporu şimdiden çalışır; erişim rolleri değişmez.</div>}
   {grouped.length===0&&<p>Henüz kayıtlı Contributor bulunmuyor.</p>}
   {grouped.map(([position,members])=><div key={position} className="card stack">
    <div className="row between"><b>{position}</b><span className="badge">{sum(members,"total")} görev · {members.length} kişi</span></div>
    {members.map(m=><div key={m.id} className="panel stack">
     <div className="row between"><b>{m.name}</b><span className={m.active?"badge good":"badge warn"}>{m.active?"Aktif hesap":"Erişim kapalı"}</span></div>
     <p className="small">Toplam: <b>{m.total}</b> · Tanımlandı: {m.briefed} · Kabul: {m.accepted} · Devam: {m.progress} · İnceleme: {m.review} · Tamamlanan: {m.completed}</p>
     <button disabled={loading} onClick={()=>{setOwner(m.id);setPage(1);}}>Bu Kişinin Görevlerini Göster</button>
    </div>)}
   </div>)}
   <div className="card stack">
    <h3>Görev Ayrıntıları</h3>
    <div className="field"><label>Görev sahibi</label><select value={owner} onChange={e=>{setOwner(e.target.value);setPage(1);}}>
     <option value="all">Tüm Contributor hesapları</option>
     {data.members.map(m=><option key={m.id} value={m.id}>{m.name}{m.positionTitle?" · "+m.positionTitle:""}</option>)}
    </select></div>
    <p className="small muted">{data.total} görev · Sayfa {page} / {Math.max(1,Math.ceil(data.total/data.pageSize))}</p>
    {data.tasks.length===0&&<p>Bu kapsamda aktif görev bulunmuyor.</p>}
    {data.tasks.map(t=><div key={t.id} className="panel stack">
     <b>{t.title}</b>
     <p className="small muted">{t.ownerName} · {names[t.status]||t.status} · Son güncelleme: {new Date(t.updatedAt).toLocaleString("tr-TR")}</p>
    </div>)}
    <div className="row" style={{gap:8}}>
     <button disabled={loading||page<=1} onClick={()=>setPage(p=>p-1)}>Önceki</button>
     <button disabled={loading||page*data.pageSize>=data.total} onClick={()=>setPage(p=>p+1)}>Sonraki</button>
    </div>
   </div>
  </div>}
 </section>;
}
