"use client";
import {useState} from "react";

export type TaskSubmission = { id:string; body:string; url?:string; by:string; at:string };
export type DeliveryTask = {
  id:string; title:string; status:string; owner:string;
  draft?:string; draftUrl?:string;
  submissions?:TaskSubmission[]; feedback?:string; reviewedAt?:string;
};
type Props = {
  task:DeliveryTask; isFounder:boolean; isOwner:boolean; turkish:boolean;
  onDraft:(body:string,url:string)=>void;
  onSubmit:()=>void;
  onApprove:()=>void;
  onRevision:(reason:string)=>void;
};
export default function TaskDelivery({task,isFounder,isOwner,turkish,onDraft,onSubmit,onApprove,onRevision}:Props){
 const [revisionReason,setRevisionReason]=useState("");
 const [showHistory,setShowHistory]=useState(false);
 const tx=(tr:string,en:string)=>turkish?tr:en;
 const history=task.submissions||[];
 const latest=history[history.length-1];
 const draft=task.draft||"";
 const url=task.draftUrl||"";
 const validText=draft.trim().length>=30;
 const validUrl=!url.trim()||/^https:\/\//i.test(url.trim());
 const isEditor=isOwner&&task.status==="IN PROGRESS";
 const reviewing=isFounder&&task.status==="FOUNDER REVIEW";
 const isLegacy=task.status==="COMPLETED"&&!latest;
 return <section className="deliverySection stack" aria-label={tx("Teslim ve değerlendirme","Delivery and review")}>
   <div className="row between">
     <h3>{tx("Görev Çıktısı ve Teslim","Task Deliverable & Submission")}</h3>
     <span className="badge">{latest?tx(history.length+". teslim kaydı",history.length+" submission(s)"):tx("Çıktı kaydı yok","No deliverable on record")}</span>
   </div>
   {task.feedback&&<div className="alert" role="status"><b>{tx("Kurucu revizyon notu","Founder revision feedback")}</b><p style={{whiteSpace:"pre-wrap",marginTop:5}}>{task.feedback}</p></div>}
   {isEditor&&<div className="stack">
     <div className="field"><label htmlFor={"report-"+task.id}>{tx("Yapılan çalışma / rapor / teslim açıklaması *","Work summary / report / deliverable description *")}</label>
       <textarea id={"report-"+task.id} rows={6} maxLength={10000} value={draft} onChange={e=>onDraft(e.target.value,url)} placeholder={tx("Ne yaptınız? Hangi sonuca ulaştınız? Teslim edilen somut çıktı nedir?","What was done? What did you find? What concrete output are you delivering?")}/></div>
     <div className="field"><label htmlFor={"url-"+task.id}>{tx("Kanıt veya doküman bağlantısı (isteğe bağlı)","Evidence or document link (optional)")}</label>
       <input id={"url-"+task.id} type="url" placeholder="https://..." maxLength={2000} value={url} onChange={e=>onDraft(draft,e.target.value)}/></div>
     <p className="small muted">{tx("En az 30 karakterlik anlamlı bir açıklama gereklidir. Raporu yazmadan yalnızca düğmeye basarak teslim mümkün değil.","A meaningful description of at least 30 characters is required. Empty submissions are blocked.")} {draft.trim().length}/30</p>
     {!validUrl&&<p className="danger small">{tx("Bağlantı https:// ile başlamalı.","The link must start with https://.")}</p>}
     <div className="row"><button className="primary" disabled={!validText||!validUrl} onClick={onSubmit}>{tx("Çıktıyı Kurucu İncelemesine Gönder","Submit Deliverable for Founder Review")}</button></div>
     <p className="small muted">{tx("Bu bir tarayıcı demosudur. Gizli bilgi ve gerçek müşteri/sağlayıcı dokümanı eklemeyin. Dosya yükleme henüz desteklenmiyor.","This is a browser-only demo. Do not add confidential data or real provider documents. File uploads are not supported yet.")}</p>
   </div>}
   {latest&&<div className="card stack" style={{background:"#101b29"}}>
     <div className="row between"><b>{tx("Son teslim edilen çıktı","Most recent submitted deliverable")}</b><span className="small muted">{new Date(latest.at).toLocaleString(turkish?"tr-TR":"en-GB")}</span></div>
     <p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{latest.body}</p>
     {latest.url&&<a style={{color:"#93c9ff",overflowWrap:"anywhere"}} href={latest.url} target="_blank" rel="noopener noreferrer">{tx("Kanıt / doküman bağlantısını aç","Open evidence/document link")}</a>}
     <p className="small muted">{tx("Gönderen","Submitted by")}: {latest.by}</p>
   </div>}
   {reviewing&&<div className="stack">
     {!latest?<div className="alert" role="alert">{tx("Önceki demo kaydında somut çıktı bulunmuyor. Bu görev doğrudan onaylanamaz; revizyon isteyerek rapor talep edin.","This earlier demo submission has no deliverable. Request a revision; approval is blocked.")}</div>:<p className="small muted">{tx("Yukarıdaki teslimi inceleyin. Bu operasyon incelemesi protocol veya ekonomik hak onayı değildir.","Review the output above. This is an operational review, not protocol or economic approval.")}</p>}
     {latest&&<button className="primary" onClick={onApprove}>{tx("Teslimi Kabul Et ve Tamamla","Accept Deliverable and Complete")}</button>}
     <div className="field"><label htmlFor={"reason-"+task.id}>{tx("Revizyon gerekçesi *","Revision reason *")}</label><textarea id={"reason-"+task.id} rows={3} maxLength={3000} value={revisionReason} onChange={e=>setRevisionReason(e.target.value)} placeholder={tx("Neyin eksik olduğunu ve neyin düzeltilmesini istediğinizi açıklayın.","Explain what is missing and what should be changed.")}/></div>
     <button disabled={revisionReason.trim().length<10} onClick={()=>{onRevision(revisionReason.trim());setRevisionReason("")}}>{tx("Gerekçeli Revizyon İste","Request Revision with Reason")}</button>
   </div>}
   {isLegacy&&<div className="alert small">{tx("Bu görev eski demo sürümünde çıktı olmadan tamamlandı. Tamamlanma durumu korunmuştur; teslim kanıtı varmış gibi gösterilmez.","This task was completed in the earlier demo without a deliverable. Its historical state is preserved; no evidence is fabricated.")}</div>}
   {history.length>1&&<><button onClick={()=>setShowHistory(!showHistory)}>{showHistory?tx("Önceki teslimleri gizle","Hide earlier submissions"):tx("Önceki teslimleri göster ("+(history.length-1)+")","Show earlier submissions ("+(history.length-1)+")")}</button>{showHistory&&history.slice(0,-1).reverse().map(s=><div className="card stack" key={s.id}><p className="small muted">{new Date(s.at).toLocaleString(turkish?"tr-TR":"en-GB")}</p><p style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{s.body}</p>{s.url&&<a href={s.url} target="_blank" rel="noopener noreferrer" style={{color:"#93c9ff"}}>{tx("Bağlantı","Link")}</a>}</div>)}</>}
  </section>;
}
