"use client";
import {useEffect,useState} from "react";
import {localeLabel} from "./translations";
import TaskDelivery, {type TaskSubmission} from "./task-delivery";
import ManageRecord, {type ManagedKind,type ManagedRecord} from "./manage-record";
type Person={id:string;name:string;position:string;role:"Founder"|"Contributor";kind:string;active:boolean};
type Position={id:string;title:string;workstream:string;access:string;archived?:boolean};
type Task={id:string;title:string;owner:string;stream:string;status:string;objective:string;output:string;authority:string;context:string;draft?:string;draftUrl?:string;submissions?:TaskSubmission[];feedback?:string;reviewedAt?:string;archived?:boolean};
type Opportunity={id:string;name:string;type:string;stage:string;owner:string;next:string;archived?:boolean};
type Store={people:Person[];positions:Position[];tasks:Task[];opps:Opportunity[];activity:string[]};
const initial:Store={
 people:[
 {id:"USR-001",name:"Founder",position:"Founder & Protocol Architect",role:"Founder",kind:"Founder",active:true},
 {id:"USR-002",name:"Josh",position:"Positioning & Communications Contributor",role:"Contributor",kind:"Volunteer",active:true},
 {id:"USR-003",name:"Abhyagata Magistrani",position:"Strategic Partnerships & External Relations Contributor",role:"Contributor",kind:"Volunteer",active:true},
 {id:"USR-004",name:"Irma Dewi Astriyani",position:"Provider & Commercial Operations Contributor",role:"Contributor",kind:"Volunteer",active:true},
 {id:"USR-TEST-001",name:"VYREN Internal Test",position:"Internal Operations & QA Contributor",role:"Contributor",kind:"TEST ONLY",active:true}
 ],
 positions:[
 {id:"POS-001",title:"Founder & Protocol Architect",workstream:"Founder Review",access:"Founder"},
 {id:"POS-002",title:"Positioning & Communications Contributor",workstream:"Communications & Positioning",access:"Contributor"},
 {id:"POS-003",title:"Strategic Partnerships & External Relations Contributor",workstream:"Partnerships & Funding",access:"Contributor"},
 {id:"POS-004",title:"Provider & Commercial Operations Contributor",workstream:"Provider & Commercial Operations",access:"Contributor"},
 {id:"POS-TEST-001",title:"Internal Operations & QA Contributor",workstream:"Operations / Admin",access:"Contributor"}
 ],
 tasks:[{id:"TEST-001",title:"Validate contributor task workflow",owner:"USR-TEST-001",stream:"Operations / Admin",status:"BRIEFED",objective:"Test assignment, acceptance, submission and Founder review",output:"Documented QA observations",authority:"May research and report; no sign, funds, binding commitments or canonical changes",context:"GNR-STD-001 v1.3 (read-only)"}],
 opps:[],activity:["Demo initialized. All data is simulated."]
};
const NAV=["Home","My Work","Workstreams","Opportunities","Genesis Readiness","Reviews","Team","Project Context","Reports","Settings"];
const STAGES=["BACKLOG","BRIEFED","ACCEPTED","IN PROGRESS","WAITING EXTERNAL","FOUNDER REVIEW","BLOCKED","COMPLETED","CANCELLED","SUPERSEDED"];
const STREAMS=["Communications & Positioning","Partnerships & Funding","Provider & Commercial Operations","Genesis Readiness","Founder Review","Operations / Admin"];
export default function Page(){
 const [store,setStore]=useState<Store>(initial);const [ready,setReady]=useState(false);
 const [manage,setManage]=useState<{kind:ManagedKind;id:string}|null>(null);const [showArchived,setShowArchived]=useState(false);
 const [page,setPage]=useState("Home");const [actor,setActor]=useState("USR-001");const [modal,setModal]=useState("");const [name,setName]=useState("");const [extra,setExtra]=useState("");const [pick,setPick]=useState("");const [selected,setSelected]=useState("TEST-001");
 useEffect(()=>{try{const raw=localStorage.getItem("vyrencc-mvp-demo-v1");if(raw){const parsed=JSON.parse(raw);if(parsed?.people&&parsed?.tasks&&parsed?.positions&&parsed?.opps)setStore(parsed)}}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem("vyrencc-mvp-demo-v1",JSON.stringify(store))},[ready,store]);
 useEffect(()=>{document.documentElement.lang=actor==="USR-001"?"tr":"en"},[actor]);
 const founder=actor==="USR-001";const L=(value:string)=>localeLabel(value,founder);const current=store.people.find(p=>p.id===actor)??store.people[0];
 const mine=store.tasks.filter(t=>t.owner===actor);const visible=(founder?store.tasks:mine).filter(t=>showArchived||!t.archived);
 const update=(fn:(s:Store)=>Store,event:string)=>setStore(s=>{const x=fn(s);return {...x,activity:[event,...x.activity].slice(0,70)}});
 const status=(t:Task,next:string)=>{
   if(t.archived||t.owner!==actor||!((t.status==="BRIEFED"&&next==="ACCEPTED")||(t.status==="ACCEPTED"&&next==="IN PROGRESS")))return;
   update(s=>({...s,tasks:s.tasks.map(z=>z.id===t.id?{...z,status:next}:z)}),t.id+" moved to "+next);
 };
 const saveDraft=(t:Task,body:string,url:string)=>{
   if(t.archived||t.owner!==actor||t.status!=="IN PROGRESS")return;
   setStore(s=>({...s,tasks:s.tasks.map(z=>z.id===t.id?{...z,draft:body,draftUrl:url}:z)}));
 };
 const submitTask=(t:Task)=>{
   if(t.archived||t.owner!==actor||t.status!=="IN PROGRESS")return;
   const body=t.draft?.trim()||"",url=t.draftUrl?.trim()||"";
   if(body.length<30||(url&&!/^https:\/\//i.test(url)))return;
   const submission:TaskSubmission={id:t.id+"-SUB-"+Date.now(),body,url:url||undefined,by:current.name,at:new Date().toISOString()};
   update(s=>({...s,tasks:s.tasks.map(z=>z.id===t.id?{...z,status:"FOUNDER REVIEW",feedback:undefined,submissions:[...(z.submissions||[]),submission]}:z)}),t.id+" submitted a written deliverable for founder review");
 };
 const approveTask=(t:Task)=>{
   if(!founder||t.archived||t.status!=="FOUNDER REVIEW"||!(t.submissions?.length))return;
   update(s=>({...s,tasks:s.tasks.map(z=>z.id===t.id?{...z,status:"COMPLETED",reviewedAt:new Date().toISOString()}:z)}),t.id+" deliverable accepted by founder");
 };
 const requestTaskRevision=(t:Task,reason:string)=>{
   if(!founder||t.archived||t.status!=="FOUNDER REVIEW"||reason.trim().length<10)return;
   update(s=>({...s,tasks:s.tasks.map(z=>z.id===t.id?{...z,status:"IN PROGRESS",feedback:reason.trim()}:z)}),t.id+" revision requested with written feedback: "+reason.trim());
 };
 const create=()=>{
  if(!founder||!name.trim())return;
  if(modal==="person"){const pos=store.positions.find(p=>p.id===pick&&!p.archived)||store.positions.find(p=>!p.archived&&p.id!=="POS-001")||store.positions[1];const id="USR-"+Date.now();update(s=>({...s,people:[...s.people,{id,name:name.trim(),position:pos.title,role:"Contributor",kind:"TEST ONLY / NOT INVITED",active:true}]}),"New simulated person: "+name)}
  if(modal==="position"){const id="POS-"+Date.now();update(s=>({...s,positions:[...s.positions,{id,title:name.trim(),workstream:pick||STREAMS[5],access:"Contributor"}]}),"Position created: "+name)}
  if(modal==="task"){if(!store.people.some(p=>p.id===pick&&p.active&&p.role==="Contributor"))return;const id="TEST-"+Date.now();update(s=>({...s,tasks:[...s.tasks,{id,title:name.trim(),owner:pick||"USR-TEST-001",stream:STREAMS[5],status:"BRIEFED",objective:extra||"Example test objective",output:"Submitted report",authority:"Research and report only. No commitments.",context:"Canonical references read-only"}]}),"Demo task created: "+name)}
  if(modal==="opportunity"){if(!store.people.some(p=>p.id===pick&&p.active&&p.role==="Contributor"))return;const id="OPP-"+Date.now();update(s=>({...s,opps:[...s.opps,{id,name:name.trim(),type:"Partnership",stage:"Research",owner:pick||"USR-003",next:extra||"Research and qualify"}]}),"Demo opportunity created: "+name)}
  setModal("");setName("");setPick("");setExtra("");
 };
 const launch=(m:string)=>{setName("");setExtra("");setPick(m==="position"?STREAMS[5]:m==="person"?store.positions[4]?.id:m==="opportunity"?"USR-003":"USR-TEST-001");setModal(m)};
 const archiveLabel=(kind:ManagedKind)=>({person:"Kişi",position:"Pozisyon",task:"Görev",opportunity:"Fırsat"}[kind]);
 const editRecord=(kind:ManagedKind,id:string,patch:Record<string,string>)=>{
  if(!founder)return;
  update(s=>{
   if(kind==="person"){
    if(id==="USR-001")return s;
    const position=s.positions.find(p=>p.id===patch.positionId&&!p.archived);
    if(!position)return s;
    return {...s,people:s.people.map(p=>p.id===id&&p.active?{...p,name:patch.name,position:position.title}:p)};
   }
   if(kind==="position"){
    if(id==="POS-001")return s;
    const old=s.positions.find(p=>p.id===id);
    if(!old||old.archived)return s;
    return {...s,positions:s.positions.map(p=>p.id===id?{...p,title:patch.title,workstream:patch.workstream}:p),people:s.people.map(p=>p.position===old.title?{...p,position:patch.title}:p)};
   }
   if(kind==="task")return {...s,tasks:s.tasks.map(t=>t.id===id&&!t.archived&&!["COMPLETED","FOUNDER REVIEW","CANCELLED","SUPERSEDED"].includes(t.status)?{...t,title:patch.title,owner:patch.owner,stream:patch.stream,objective:patch.objective,output:patch.output}:t)};
   return {...s,opps:s.opps.map(o=>o.id===id&&!o.archived?{...o,name:patch.name,owner:patch.owner,next:patch.next,stage:patch.stage}:o)};
  },archiveLabel(kind)+" "+id+" düzenlendi (demo)");
  setManage(null);
 };
 const setArchive=(kind:ManagedKind,id:string,archive:boolean)=>{
  if(!founder||id==="USR-001"||id==="POS-001")return;
  const person=store.people.find(p=>p.id===id);
  const position=store.positions.find(p=>p.id===id);
  if(kind==="person"&&archive&&(store.tasks.some(t=>t.owner===id&&!t.archived&&!["COMPLETED","CANCELLED","SUPERSEDED"].includes(t.status))||store.opps.some(o=>o.owner===id&&!o.archived)))return;
  if(kind==="position"&&archive&&store.people.some(p=>p.active&&p.position===position?.title))return;
  if(kind==="person"&&!person)return;
  update(s=>kind==="person"?{...s,people:s.people.map(p=>p.id===id?{...p,active:!archive}:p)}:kind==="position"?{...s,positions:s.positions.map(p=>p.id===id?{...p,archived:archive}:p)}:kind==="task"?{...s,tasks:s.tasks.map(t=>t.id===id?{...t,archived:archive}:t)}:{...s,opps:s.opps.map(o=>o.id===id?{...o,archived:archive}:o)},archiveLabel(kind)+" "+id+(archive?" arşivlendi":" arşivden geri yüklendi"));
  setManage(null);
 };
 const manageRecord:ManagedRecord|undefined=manage?(manage.kind==="person"?store.people.find(p=>p.id===manage.id):manage.kind==="position"?store.positions.find(p=>p.id===manage.id):manage.kind==="task"?store.tasks.find(t=>t.id===manage.id):store.opps.find(o=>o.id===manage.id)):undefined;
 const archiveBlockReason=manage?.kind==="person"?(manage.id==="USR-001"?"Kurucu ana profili arşivlenemez.":store.tasks.some(t=>t.owner===manage.id&&!t.archived&&!["COMPLETED","CANCELLED","SUPERSEDED"].includes(t.status))||store.opps.some(o=>o.owner===manage.id&&!o.archived)?"Önce aktif görevleri veya fırsatları başka bir kişiye devredin.":""):manage?.kind==="position"?(manage.id==="POS-001"?"Kurucu pozisyonu bu demo üzerinden arşivlenemez.":store.people.some(p=>p.active&&p.position===(manageRecord?.title||""))?"Önce bu pozisyondaki aktif kişileri başka pozisyonlara atayın.":""):"";
 const editBlockedReason=manage?.kind==="person"&&manage.id==="USR-001"?"Kurucu ana profilini değiştirme işlevi bu demoda kapalı.":manage?.kind==="position"&&manage.id==="POS-001"?"Kurucu pozisyonu bu demo ekranında değiştirilemez.":manage?.kind==="task"&&["COMPLETED","FOUNDER REVIEW","CANCELLED","SUPERSEDED"].includes(manageRecord?.status||"")?"Tamamlanmış veya incelemedeki görevin brief'i değiştirilmez. Gerekirse önce revizyon isteyin.":"";
 const archiveSwitch=founder?<label className="small muted" style={{display:"inline-flex",gap:6,alignItems:"center",marginLeft:8}}><input type="checkbox" checked={showArchived} onChange={e=>setShowArchived(e.target.checked)} style={{width:16}}/>Arşivlenenleri Göster</label>:null;
 const taskcard=(t:Task)=><div key={t.id} className="card stack"><div className="row between"><b>{L(t.title)}</b><span className={"badge "+(t.status==="COMPLETED"?"good":t.status==="FOUNDER REVIEW"?"warn":"")}>{L(t.status)}</span></div><span className="small muted">{t.id} · {L(t.stream)} · {store.people.find(p=>p.id===t.owner)?.name}</span><p>{L(t.objective)}</p><p className="small muted">{L("Output")}: {L(t.output)}</p><p className="small muted">{L("Boundaries")}: {L(t.authority)}</p><div className="row"><button onClick={()=>setSelected(selected===t.id?"":t.id)}>{L(selected===t.id?"Hide details":"Details")}</button>{!t.archived&&t.status==="BRIEFED"&&t.owner===actor&&<button onClick={()=>status(t,"ACCEPTED")}>{L("Accept")}</button>}{!t.archived&&t.status==="ACCEPTED"&&t.owner===actor&&<button onClick={()=>status(t,"IN PROGRESS")}>{L("Start")}</button>}{founder&&<button onClick={()=>setManage({kind:"task",id:t.id})}>Düzenle / Kaldır</button>}{t.archived&&<span className="badge warn">ARŞİV</span>}</div>{selected===t.id&&<>{!t.archived&&<TaskDelivery task={t} isFounder={founder} isOwner={t.owner===actor} turkish={founder} onDraft={(body,url)=>saveDraft(t,body,url)} onSubmit={()=>submitTask(t)} onApprove={()=>approveTask(t)} onRevision={reason=>requestTaskRevision(t,reason)}/>}<div className="alert small">{L("Canonical context")}: {t.context}. {L("This demo cannot change lifecycle authority, economic rights or VDCP acceptance.")}</div></>}</div>;
 return <div className="shell"><aside className="side"><div className="brand">◈ VYREN</div><div className="small muted">{L("COMMAND CENTER · DEMO")}</div><nav className="nav">{NAV.filter(n=>founder||!["Reviews","Settings"].includes(n)).map(n=><button key={n} className={page===n?"active":""} onClick={()=>setPage(n)}>{L(n)}</button>)}</nav><div className="footer">{L("PREVIEW · LOCAL DEMO DATA")}<br/>{L("Not canonical · No real accounts")}</div></aside><main className="main"><header className="top"><div><h1>{L(page)}</h1><p className="muted small">{L("Execution workspace · v0.1 preview")}</p></div><div className="row"><label className="small muted">{L("View as")} <select value={actor} onChange={e=>{setActor(e.target.value);setPage(e.target.value==="USR-001"?"Home":"My Work")}}>{store.people.filter(p=>p.active).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div></header><div className="alert" style={{marginBottom:18}}>{L("SIMULATED USER VIEW. There is no authentication or server authorization here. Do not enter secrets or use this preview for real assignments.")}</div>
 {page==="Home"&&<><div className="grid">{[["Active Tasks",store.tasks.filter(t=>!t.archived&&!["COMPLETED","CANCELLED","SUPERSEDED"].includes(t.status)).length],["Waiting External",store.tasks.filter(t=>!t.archived&&t.status==="WAITING EXTERNAL").length],["Founder Review",store.tasks.filter(t=>!t.archived&&t.status==="FOUNDER REVIEW").length],["Team Members",store.people.filter(p=>p.active).length]].map(([label,n])=><div className="panel" key={label}><p className="muted">{L(String(label))}</p><div className="metric">{n}</div></div>)}</div><div className="two"><section className="panel"><div className="sectionTitle"><h2>{L("Priority tasks")}</h2><button onClick={()=>setPage("My Work")}>{L("Open work")}</button></div><div className="list">{visible.map(taskcard)}</div></section><section className="panel"><h2>{L("Execution lanes")}</h2><div className="list">{STREAMS.map(x=><div className="item" key={x}>{L(x)}</div>)}</div></section></div></>}
 {page==="My Work"&&<section className="panel"><div className="sectionTitle"><h2>{L(founder?"All assigned work":"My assignments")}</h2><div className="row">{archiveSwitch}{founder&&<button className="primary" onClick={()=>launch("task")}>{L("+ New Task")}</button>}</div></div><div className="stack">{visible.length?visible.map(taskcard):<p className="muted">{L("No tasks assigned.")}</p>}</div></section>}
 {page==="Workstreams"&&<div className="grid">{STREAMS.map(stream=><div className="panel" key={stream}><h3>{L(stream)}</h3><p className="muted small">{visible.filter(t=>t.stream===stream).length} {L("visible tasks")}</p><div className="stack" style={{marginTop:12}}>{visible.filter(t=>t.stream===stream).map(taskcard)}</div></div>)}</div>}
 {page==="Opportunities"&&<section className="panel"><div className="sectionTitle"><h2>{L("Opportunity pipeline")}</h2><div className="row">{archiveSwitch}{founder&&<button onClick={()=>launch("opportunity")}>{L("+ Add Opportunity")}</button>}</div></div><p className="muted small">{L("No fabricated live provider records. Create demonstration opportunities for testing.")}</p><div className="grid" style={{marginTop:14}}>{["Research","Qualified","Contacted","Reply Received","Discussion","Proposal","Internal Review","Accepted","Rejected","Dormant"].map(stage=><div className="card" key={stage}><h3>{L(stage)}</h3>{store.opps.filter(o=>o.stage===stage&&(founder||o.owner===actor)&&(showArchived||!o.archived)).map(o=><div className="item" key={o.id}><b>{o.name}</b><p className="small muted">{L(o.type)} · {L(o.next)}</p>{o.archived&&<span className="badge warn">ARŞİV</span>}{founder&&<button onClick={()=>setManage({kind:"opportunity",id:o.id})}>Düzenle / Kaldır</button>}<select value={o.stage} disabled={!founder||!!o.archived} onChange={e=>update(s=>({...s,opps:s.opps.map(q=>q.id===o.id?{...q,stage:e.target.value}:q)}),o.id+" changed stage")}>{["Research","Qualified","Contacted","Reply Received","Discussion","Proposal","Internal Review","Accepted","Rejected","Dormant"].map(st=><option key={st} value={st}>{L(st)}</option>)}</select></div>)}</div>)}</div></section>}
 {page==="Genesis Readiness"&&<><div className="alert">{L("Lifecycle reference: PRE-GENESIS (historical control context, not a live gate signal). No checklist score without verified, applicable evidence.")}</div><div className="grid" style={{marginTop:14}}>{["Audience / Awareness","Communications","Partnerships","Funding / Resources","Provider / Safeguarding","Legal / Offeror","Security","Operations","Participant Flow","Evidence / Production"].map(x=><div className="panel" key={x}><h3>{L(x)}</h3><p className="muted small">{L("NOT ASSESSED · No verified evidence in demo")}</p></div>)}</div></>}
 {page==="Reviews"&&founder&&<section className="panel"><h2>{L("Founder review queue")}</h2><div className="stack" style={{marginTop:14}}>{store.tasks.filter(t=>!t.archived&&t.status==="FOUNDER REVIEW").map(taskcard)}{!store.tasks.some(t=>!t.archived&&t.status==="FOUNDER REVIEW")&&<p className="muted">{L("No submitted tasks.")}</p>}</div></section>}
 {page==="Team"&&<><section className="panel"><div className="sectionTitle"><h2>{L("People")}</h2><div className="row">{archiveSwitch}{founder&&<button className="primary" onClick={()=>launch("person")}>{L("+ Add Person")}</button>}</div></div><div className="tablewrap"><table><thead><tr><th>{L("Name")}</th><th>{L("Position")}</th><th>{L("Engagement")}</th><th>{L("Status")}</th>{founder&&<th>İşlemler</th>}</tr></thead><tbody>{store.people.filter(p=>(founder||p.id===actor)&&(showArchived||p.active)).map(p=><tr key={p.id}><td>{p.name}</td><td>{L(p.position)}</td><td>{L(p.kind)}</td><td>{L(p.active?"Active (demo)":"Archived")}</td>{founder&&<td><button onClick={()=>setManage({kind:"person",id:p.id})}>{p.active?"Düzenle / Kaldır":"Geri Yükle"}</button></td>}</tr>)}</tbody></table></div></section><section className="panel"><div className="sectionTitle"><h2>{L("Positions")}</h2>{founder&&<button onClick={()=>launch("position")}>{L("+ New Position")}</button>}</div><div className="tablewrap"><table><thead><tr><th>ID</th><th>{L("Position")}</th><th>{L("Workstream")}</th><th>{L("Role")}</th>{founder&&<th>İşlemler</th>}</tr></thead><tbody>{store.positions.filter(p=>showArchived||!p.archived).map(p=><tr key={p.id}><td className="small muted">{p.id}</td><td>{L(p.title)}</td><td>{L(p.workstream)}</td><td>{L(p.access)} {p.archived&&<span className="badge warn">ARŞİV</span>}</td>{founder&&<td><button onClick={()=>setManage({kind:"position",id:p.id})}>{p.archived?"Geri Yükle":"Düzenle / Kaldır"}</button></td>}</tr>)}</tbody></table></div></section></>}
 {page==="Project Context"&&<section className="panel stack"><h2>{L("Read-only canonical registry")}</h2><p>{founder?"Rev4.6 kilitli çekirdek · Lifecycle Karar Defteri LC-01–LC-39 · GNR-STD-001 v1.3.":"Rev4.6 locked core · Lifecycle Decision Ledger LC-01 to LC-39 · GNR-STD-001 v1.3."}</p><div className="alert">{L("No canonical write, lifecycle gate approval, settlement, or governance authority is exposed by this application.")}</div></section>}
 {page==="Reports"&&<section className="panel"><h2>{L("Demo activity")}</h2><div className="list">{store.activity.map((x,i)=><div className="item" key={i}>{L(x)}</div>)}</div></section>}
 {page==="Settings"&&founder&&<section className="panel stack"><h2>{L("Founder workspace settings")}</h2><p>{L("Team configuration and data portability (preview only).")}</p><div className="row"><button onClick={()=>{const blob=new Blob([JSON.stringify(store,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="vyren-command-center-demo.json";a.click();URL.revokeObjectURL(url)}}>{L("Export demo JSON")}</button><button onClick={()=>{if(window.confirm(L("Reset all browser demo data?"))){setStore(initial);setPage("Home")}}}>{L("Reset demo records")}</button></div><p className="small muted">{L("Production settings, real user invites, authentication and access control are NOT implemented.")}</p></section>}
 </main>{manage&&manageRecord&&founder&&<ManageRecord key={manage.kind+manage.id} kind={manage.kind} record={manageRecord} people={store.people} positions={store.positions} streams={STREAMS} onClose={()=>setManage(null)} onSave={p=>editRecord(manage.kind,manage.id,p)} onArchive={()=>setArchive(manage.kind,manage.id,true)} onRestore={()=>setArchive(manage.kind,manage.id,false)} archiveAllowed={!archiveBlockReason} archiveReason={archiveBlockReason} editAllowed={!editBlockedReason} editReason={editBlockedReason}/>} {modal&&founder&&<><div className="backdrop" onClick={()=>setModal("")}/><aside className="drawer stack"><div className="sectionTitle"><h2>{L(modal==="person"?"Add simulated person":modal==="position"?"Create position":modal==="task"?"Create test task":"Create test opportunity")}</h2><button onClick={()=>setModal("")}>{L("Close")}</button></div><div className="field"><label>{L(modal==="person"?"Person name":modal==="position"?"Position title":modal==="task"?"Task title":"Opportunity name")}</label><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder={L("Enter display name")}/></div><div className="field"><label>{L(modal==="person"?"Assign position":modal==="position"?"Workstream":modal==="task"?"Owner":"Opportunity owner")}</label><select value={pick} onChange={e=>setPick(e.target.value)}>{(modal==="position"?STREAMS:modal==="person"?store.positions.filter(p=>!p.archived&&p.id!=="POS-001").map(p=>p.id):store.people.filter(p=>p.role==="Contributor"&&p.active).map(p=>p.id)).map(v=><option key={v} value={v}>{L(modal==="person"?store.positions.find(p=>p.id===v)?.title??"":modal==="position"?v:store.people.find(p=>p.id===v)?.name??"")}</option>)}</select></div>{modal==="position"&&<div className="field"><label>Sistem Rolü / Varsayılan Erişim Profili</label><input disabled readOnly value="Contributor" aria-label="Sistem Rolü: Contributor (varsayılan)" /><p className="small muted">Test sürümünde yeni pozisyonların varsayılan profili Contributor’dır. Gerçek kullanıcı yetkileri, pozisyondan bağımsız olarak hesap bazında yönetilecektir.</p></div>}{(modal==="task"||modal==="opportunity")&&<div className="field"><label>{L(modal==="task"?"Objective":"Next action")}</label><textarea rows={3} value={extra} onChange={e=>setExtra(e.target.value)}/></div>}<div className="alert small">{L("This only changes browser demo data. No invite, external communication or real account is created.")}</div><button className="primary" onClick={create} disabled={!name.trim()}>{L("Save demo record")}</button></aside></>}</div>
}