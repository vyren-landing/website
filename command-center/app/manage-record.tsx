"use client";
import {useState} from "react";

export type ManagedKind="person"|"position"|"task"|"opportunity";
export type ManagedRecord={
 id:string;name?:string;title?:string;position?:string;workstream?:string;
 stream?:string;owner?:string;status?:string;objective?:string;output?:string;
 next?:string;stage?:string;type?:string;kind?:string;active?:boolean;archived?:boolean;
 role?:string;
};
type Option={id:string;name?:string;active?:boolean;title?:string;archived?:boolean};
type Props={
 kind:ManagedKind; record:ManagedRecord; people:Option[];positions:Option[];streams:string[];
 onClose:()=>void; onSave:(patch:Record<string,string>)=>void;onArchive:()=>void;onRestore:()=>void;
 archiveAllowed:boolean; archiveReason?:string; editAllowed:boolean;editReason?:string;
};
export default function ManageRecord({kind,record,people,positions,streams,onClose,onSave,onArchive,onRestore,archiveAllowed,archiveReason,editAllowed,editReason}:Props){
 const [name,setName]=useState(record.name||record.title||"");
 const [position,setPosition]=useState(positions.find(x=>x.title===record.position)?.id||"");
 const [stream,setStream]=useState(record.workstream||record.stream||streams[5]);
 const [owner,setOwner]=useState(record.owner||"");
 const [objective,setObjective]=useState(record.objective||"");
 const [output,setOutput]=useState(record.output||"");
 const [next,setNext]=useState(record.next||"");
 const [stage,setStage]=useState(record.stage||"Research");
 const [problem,setProblem]=useState("");
 const archived=kind==="person"?record.active===false:!!record.archived;
 const label={person:"Kişiyi Yönet",position:"Pozisyonu Yönet",task:"Görevi Yönet",opportunity:"Fırsatı Yönet"}[kind];
 const save=()=>{
  if(!editAllowed)return;
  if(name.trim().length<2){setProblem("Ad veya başlık en az 2 karakter olmalı.");return;}
  if(kind==="person"){if(!position){setProblem("Pozisyon seçilmelidir.");return;}onSave({name:name.trim(),positionId:position});return;}
  if(kind==="position"){onSave({title:name.trim(),workstream:stream});return;}
  if(kind==="task"){if(!owner){setProblem("Sorumlu seçilmelidir.");return;}if(objective.trim().length<3){setProblem("Görev amacı belirtilmelidir.");return;}onSave({title:name.trim(),owner,stream,objective:objective.trim(),output:output.trim()});return;}
  if(!owner){setProblem("Sorumlu seçilmelidir.");return;}onSave({name:name.trim(),owner,next:next.trim(),stage});
 };
 return <><div className="backdrop" onClick={onClose}></div><aside className="drawer stack" role="dialog" aria-modal="true" aria-label={label}>
  <div className="sectionTitle"><h2>{label}</h2><button onClick={onClose}>Kapat</button></div>
  <p className="small muted">Kayıt ID: {record.id}. Düzenlemeler yalnızca tarayıcı demosunda saklanır.</p>
  {archived&&<div className="alert">Bu kayıt arşivde. Yeniden kullanmak için geri yükleyin.</div>}
  <div className="field"><label htmlFor="editRecordName">{kind==="person"?"Kişi adı":kind==="position"?"Pozisyon adı":kind==="task"?"Görev başlığı":"Fırsat adı"}</label><input id="editRecordName" value={name} disabled={!editAllowed||archived} maxLength={150} onChange={e=>setName(e.target.value)}/></div>
  {kind==="person"&&<div className="field"><label htmlFor="editPosition">Atanan pozisyon</label><select id="editPosition" disabled={!editAllowed||archived} value={position} onChange={e=>setPosition(e.target.value)}>{positions.filter(p=>!p.archived||p.id===position).map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select><p className="small muted">Pozisyon değişikliği tamamlanmış görevleri silmez. Sistem rolünü değiştirmez.</p></div>}
  {kind==="position"&&<div className="field"><label htmlFor="editStream">Çalışma alanı</label><select id="editStream" disabled={!editAllowed||archived} value={stream} onChange={e=>setStream(e.target.value)}>{streams.map(s=><option key={s} value={s}>{s}</option>)}</select></div>}
  {kind==="task"&&<><div className="field"><label htmlFor="editTaskOwner">Sorumlu</label><select id="editTaskOwner" disabled={!editAllowed||archived} value={owner} onChange={e=>setOwner(e.target.value)}>{people.filter(p=>p.active&&p.id!=="USR-001").map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div className="field"><label htmlFor="editTaskStream">Çalışma alanı</label><select id="editTaskStream" disabled={!editAllowed||archived} value={stream} onChange={e=>setStream(e.target.value)}>{streams.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div className="field"><label htmlFor="editObjective">Amaç</label><textarea id="editObjective" rows={3} disabled={!editAllowed||archived} maxLength={3000} value={objective} onChange={e=>setObjective(e.target.value)}/></div><div className="field"><label htmlFor="editOutput">Beklenen çıktı</label><textarea id="editOutput" rows={2} disabled={!editAllowed||archived} maxLength={2000} value={output} onChange={e=>setOutput(e.target.value)}/></div></>}
  {kind==="opportunity"&&<><div className="field"><label htmlFor="editOppOwner">Sorumlu</label><select id="editOppOwner" disabled={!editAllowed||archived} value={owner} onChange={e=>setOwner(e.target.value)}>{people.filter(p=>p.active&&p.id!=="USR-001").map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div className="field"><label htmlFor="editOppStage">Aşama</label><select id="editOppStage" disabled={!editAllowed||archived} value={stage} onChange={e=>setStage(e.target.value)}>{["Research","Qualified","Contacted","Reply Received","Discussion","Proposal","Internal Review","Accepted","Rejected","Dormant"].map(s=><option key={s} value={s}>{s}</option>)}</select></div><div className="field"><label htmlFor="editNext">Sonraki işlem</label><textarea id="editNext" rows={3} disabled={!editAllowed||archived} value={next} maxLength={2000} onChange={e=>setNext(e.target.value)}/></div></>}
  {problem&&<p className="danger small" role="alert">{problem}</p>}
  {!editAllowed&&!archived&&<div className="alert small">{editReason||"Bu kaydın mevcut durumunda düzenlemeye izin verilmiyor."}</div>}
  {!archived&&<button className="primary" disabled={!editAllowed} onClick={save}>Değişiklikleri Kaydet</button>}
  <div className="panel stack">
   <h3>{archived?"Arşivden Geri Al":"Kaldır / Arşivle"}</h3>
   <p className="small muted">Kalıcı silme uygulanmaz. Görev, teslim ve işlem geçmişi korunur.</p>
   {archived?<button onClick={onRestore}>Arşivden Geri Yükle</button>:<><button disabled={!archiveAllowed} onClick={()=>{if(window.confirm("Bu kaydı arşivlemek istiyor musunuz? Geçmiş veriler korunacak."))onArchive()}}>Kaldır (Arşivle)</button>{!archiveAllowed&&<p className="small muted">{archiveReason||"Bu kayıt şu anda arşivlenemez."}</p>}</>}
  </div>
  <div className="alert small">Bu demo gerçek erişim yetkilerini, hukuki imzaları veya VYREN canonical kararlarını değiştirmez.</div>
 </aside></>;
}
