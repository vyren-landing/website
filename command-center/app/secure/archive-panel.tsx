"use client";
import {useCallback,useEffect,useState} from "react";

type Delivery={id:string;submitterName:string;body:string;evidenceUrl:string|null;createdAt:string};
type Review={decision:string;reason:string|null;reviewerName:string;createdAt:string};
type ArchivedTask={id:string;title:string;objective:string;expectedOutput:string;ownerName:string;status:string;archivedAt:string|null;submissions:Delivery[];reviews:Review[]};
const timestamp=(v:string)=>new Date(v).toLocaleString("tr-TR");

export default function ArchivePanel({onRestore}:{onRestore:()=>void}){
 const [tasks,setTasks]=useState<ArchivedTask[]>([]);
 const [opened,setOpened]=useState<string|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const reload=useCallback(async()=>{
  setLoading(true);
  try{
   const response=await fetch("/api/cc?view=archive",{credentials:"same-origin",cache:"no-store"});
   const body=await response.json();
   if(!response.ok)throw new Error(body.error||"Arşive erişilemedi");
   setTasks(body.tasks||[]);setError("");
  }catch(e){setError(e instanceof Error?e.message:"Arşive erişilemedi");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void reload()},[reload]);
 const restore=async(id:string)=>{
  if(!window.confirm("Görevi raporları ve onayları korunarak aktif listeye geri getir?"))return;
  setBusy(true);setError("");
  try{
   const response=await fetch("/api/cc",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({operation:"restore",id})});
   const body=await response.json();
   if(!response.ok)throw new Error(body.error||"Geri getirme başarısız");
   await reload();onRestore();
  }catch(e){setError(e instanceof Error?e.message:"Geri getirme başarısız");}
  finally{setBusy(false);}
 };
 return <section className="panel stack">
  <h2>Görev Arşivi</h2>
  <p className="small muted">Arşivleme silme değildir. Teslimler ve incelemeler korunur; görevler tamamlanmış halde geri getirilebilir.</p>
  <button disabled={loading||busy} onClick={()=>void reload()}>Arşivi Yenile</button>
  {error&&<div className="alert" role="alert">{error}</div>}
  {loading&&<p>Yükleniyor...</p>}
  {!loading&&tasks.length===0&&<p>Arşivlenmiş görev bulunmuyor.</p>}
  {tasks.map(task=><article key={task.id} className="card stack">
   <div className="row between"><b>{task.title}</b><span className="badge">Tamamlandı · Arşiv</span></div>
   <p>{task.objective}</p>
   <p className="small muted">Sorumlu: {task.ownerName} · Beklenen çıktı: {task.expectedOutput}</p>
   {task.archivedAt&&<p className="small muted">Arşivlenme: {timestamp(task.archivedAt)}</p>}
   <button onClick={()=>setOpened(opened===task.id?null:task.id)}>{opened===task.id?"Ayrıntıları Gizle":"Tüm Teslim ve Onayları Göster"}</button>
   {opened===task.id&&<div className="stack">
    <h3>Teslimler</h3>
    {task.submissions.map(sub=><div key={sub.id} className="panel stack">
     <b>{sub.submitterName} · {timestamp(sub.createdAt)}</b>
     <p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{sub.body}</p>
     {sub.evidenceUrl&&<a href={sub.evidenceUrl} target="_blank" rel="noopener noreferrer">Kanıt Bağlantısı</a>}
    </div>)}
    <h3>Kurucu İncelemeleri</h3>
    {task.reviews.map((review,index)=><div key={index} className="panel stack">
     <b>{review.decision==="APPROVE"?"Onaylandı":"Revizyon İstendi"} · {review.reviewerName} · {timestamp(review.createdAt)}</b>
     {review.reason&&<p style={{whiteSpace:"pre-wrap"}}>{review.reason}</p>}
    </div>)}
    <button className="primary" disabled={busy} onClick={()=>void restore(task.id)}>Aktif Görevlere Geri Getir</button>
   </div>}
  </article>)}
 </section>;
}
