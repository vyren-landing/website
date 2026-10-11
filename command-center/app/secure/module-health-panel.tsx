"use client";
import {useState} from "react";
type Scan={scope:string;schema?:Record<string,boolean>;counts?:Record<string,number>;allChecksPassed:boolean;checkedAt:string;reason?:string;caveat?:string};
const names:Record<string,string>={workstreams:"Çalışma alanları",workstreamEvents:"Çalışma alanı geçmişi",opportunities:"Fırsatlar",opportunityEvents:"Fırsat geçmişi",invites:"Davetler",pendingInvites:"Bekleyen davetler",activeInvites:"Aktif davetler",revokedInvites:"Kapatılan davetler",duplicateStreamRevisions:"Tekrarlayan çalışma alanı revizyonu",duplicateOpportunityRevisions:"Tekrarlayan fırsat revizyonu",orphanStreamEvents:"Yetim çalışma alanı geçmişi",orphanOpportunityEvents:"Yetim fırsat geçmişi",invalidInviteLinks:"Tutarsız davet bağlantısı"};
export default function ModuleHealthPanel(){
 const [data,setData]=useState<Scan|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function check(){
  setBusy(true);setError("");setData(null);
  try{
   const r=await fetch("/api/cc/module-health",{credentials:"same-origin",cache:"no-store"});
   const x=await r.json();if(!r.ok)throw Error(x.error||"Kontrol çalıştırılamadı");
   setData(x);
  }catch(e){setError(e instanceof Error?e.message:"Kontrol çalıştırılamadı");}
  finally{setBusy(false);}
 }
 return <section className="panel stack"><h2>Modül Sağlık Kontrolü</h2>
 <p className="small muted">Kurucuya özel, salt okunur kontrol. Çalışma alanları, fırsatlar ve davet kayıtlarının şemasını ve referans tutarlılığını inceler. Kullanıcı verisi veya davet e-postası gösterilmez.</p>
 <button className="primary" disabled={busy} onClick={()=>void check()}>{busy?"Kontrol ediliyor...":"Modül Kontrollerini Çalıştır"}</button>
 {error&&<p role="alert" className="alert">{error}</p>}
 {data&&<div className="card stack">
 <div className="row between"><b>{data.allChecksPassed?"Yapısal Kontroller PASS":"İnceleme gerekli"}</b><span className={data.allChecksPassed?"badge good":"badge warn"}>{data.allChecksPassed?"PASS":"CHECK"}</span></div>
 <p className="small muted">Son kontrol: {new Date(data.checkedAt).toLocaleString("tr-TR")}</p>
 {data.schema&&Object.entries(data.schema).map(([k,v])=><p className="small" key={k}>{k}: <b>{v?"Hazır":"Eksik"}</b></p>)}
 {data.counts&&Object.entries(data.counts).map(([k,v])=><p className="small" key={k}>{names[k]||k}: <b>{v}</b></p>)}
 {data.caveat&&<p className="small muted">{data.caveat}</p>}
 </div>}</section>;
}
