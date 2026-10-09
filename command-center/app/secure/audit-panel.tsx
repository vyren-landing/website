"use client";
import {useCallback,useEffect,useState} from "react";

type AuditEvent={id:string;action:string;actorName:string;taskTitle:string;targetId:string;createdAt:string};
type HistoryPage={audit:AuditEvent[];nextCursor:string|null};
const descriptions:Record<string,string>={create:"Görev Oluşturuldu",accept:"Görev Kabul Edildi",start:"Görev Başlatıldı",submit:"Rapor Teslim Edildi",approve:"Rapor Onaylandı",revise:"Revizyon İstendi",archive:"Görev Arşivlendi",restore:"Görev Geri Getirildi"};

export default function AuditPanel(){
 const [events,setEvents]=useState<AuditEvent[]>([]);
 const [cursor,setCursor]=useState<string|null>(null);
 const [loading,setLoading]=useState(false);
 const [initialized,setInitialized]=useState(false);
 const [error,setError]=useState("");
 const load=useCallback(async(before?:string)=>{
  setLoading(true);setError("");
  try{
   const route=before?"/api/cc?view=audit&before="+encodeURIComponent(before):"/api/cc?view=audit";
   const response=await fetch(route,{credentials:"same-origin",cache:"no-store"});
   const data:HistoryPage=await response.json();
   if(!response.ok)throw new Error((data as HistoryPage & {error?:string}).error||"İşlem geçmişine erişilemedi");
   setEvents(old=>before?[...old,...data.audit]:data.audit);
   setCursor(data.nextCursor);setInitialized(true);
  }catch(e){setError(e instanceof Error?e.message:"İşlem geçmişine erişilemedi");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void load()},[load]);
 return <section className="panel stack">
  <h2>İşlem Geçmişi</h2>
  <p className="small muted">Oluşturma, kabul, başlatma, teslim, onay, revizyon ve arşiv işlemleri sunucuda tarihçelenir. Yalnızca Kurucu görüntüleyebilir.</p>
  <button disabled={loading} onClick={()=>void load()}>İşlem Geçmişini Yenile</button>
  {error&&<div className="alert" role="alert">{error}</div>}
  {loading&&!initialized&&<p>Yükleniyor...</p>}
  {initialized&&events.length===0&&<p>İşlem kaydı bulunmuyor.</p>}
  {events.map(entry=><article key={entry.id} className="card stack">
   <div className="row between"><b>{descriptions[entry.action]||entry.action}</b><span className="small muted">{new Date(entry.createdAt).toLocaleString("tr-TR")}</span></div>
   <p className="small">{entry.actorName} · {entry.taskTitle}</p>
  </article>)}
  {cursor&&<button disabled={loading} onClick={()=>void load(cursor)}>{loading?"Yükleniyor...":"Daha Eski Kayıtları Göster"}</button>}
 </section>;
}
