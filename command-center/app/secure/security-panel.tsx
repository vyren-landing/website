"use client";
import {useState} from "react";

type Verdict="pass"|"fail"|"inconclusive";
type Check={key:string;name:string;verdict:Verdict;details:string};
const emptyTaskId="00000000-0000-0000-0000-000000000000";
const deniedMessage="Yalnızca Kurucu işlem yapabilir";
const checks=[
 {key:"read-audit",name:"Audit history access is blocked",method:"GET",path:"/api/cc?view=audit",expected:"Yalnızca Kurucu erişebilir"},
 {key:"read-archive",name:"Archive access is blocked",method:"GET",path:"/api/cc?view=archive",expected:"Yalnızca Kurucu erişebilir"},
 {key:"create",name:"Unauthorized task creation is blocked",method:"POST",path:"/api/cc",operation:"create",expected:"Yalnızca Kurucu görev oluşturabilir"},
 {key:"approve",name:"Unauthorized report approval is blocked",method:"POST",path:"/api/cc",operation:"approve",expected:deniedMessage},
 {key:"revise",name:"Unauthorized revision requests are blocked",method:"POST",path:"/api/cc",operation:"revise",expected:deniedMessage},
 {key:"archive",name:"Unauthorized archiving is blocked",method:"POST",path:"/api/cc",operation:"archive",expected:deniedMessage},
 {key:"restore",name:"Unauthorized restoration is blocked",method:"POST",path:"/api/cc",operation:"restore",expected:deniedMessage},
] as const;

// These four requests are strictly GET and use the same read-only actor lookup
// as the protected Founder endpoints. A denied response is the expected PASS.
const moduleChecks=[
 {key:"workstreams",name:"Workstream access is blocked",path:"/api/cc/workstreams"},
 {key:"opportunities",name:"Opportunity access is blocked",path:"/api/cc/opportunities"},
 {key:"team",name:"Team and invitation access is blocked",path:"/api/cc/team"},
 {key:"module-health",name:"Module health access is blocked",path:"/api/cc/module-health"}
] as const;

export default function SecurityPanel({actorId}:{actorId:string}){
 const [running,setRunning]=useState(false);
 const [results,setResults]=useState<Check[]>([]);
 const [moduleRunning,setModuleRunning]=useState(false);
 const [moduleResults,setModuleResults]=useState<Check[]>([]);
 const [crossRunning,setCrossRunning]=useState(false);
 const [crossResults,setCrossResults]=useState<Check[]>([]);
 const execute=async()=>{
  if(running)return;
  setRunning(true);setResults([]);
  const collected:Check[]=[];
  try{
   for(const check of checks){
    try{
     const isPost=check.method==="POST";
     const response=await fetch(check.path,{
      method:check.method,cache:"no-store",credentials:"same-origin",
      ...(isPost?{headers:{"Content-Type":"application/json"},body:JSON.stringify({
       operation:"operation" in check?check.operation:undefined,
       id:emptyTaskId,
       // Invalid fields ensure no task could be created even if the role check regressed.
       title:"",objective:"",ownerId:"",expectedOutput:""
      })}:{})
     });
     const data=await response.json();
     const passed=response.status===403&&data?.error===check.expected;
     collected.push({
      key:check.key,name:check.name,verdict:passed?"pass":"fail",
      details:passed?"HTTP 403 - Server denied access as expected":`Unexpected response: HTTP ${response.status}, expected server denial did not match`
     });
    }catch(e){collected.push({key:check.key,name:check.name,verdict:"fail",details:e instanceof Error?e.message:"Request failed"});}
    setResults([...collected]);
   }
   try{
    const response=await fetch("/api/cc?view=active",{cache:"no-store",credentials:"same-origin"});
    const data=await response.json();
    const tasks=Array.isArray(data?.tasks)?data.tasks:null;
    const verdict:Verdict=!response.ok||!tasks?"fail":tasks.length===0?"inconclusive":tasks.every((task:{ownerId?:string})=>task.ownerId===actorId)?"pass":"fail";
    collected.push({
     key:"read-scope",name:"Only assigned tasks are visible",
     verdict,
     details:verdict==="pass"?`Ownership boundary verified for ${tasks?.length||0} active tasks`:verdict==="inconclusive"?"No active tasks; scope check inconclusive":`Unexpected task scope or HTTP ${response.status}`
    });
   }catch(e){collected.push({key:"read-scope",name:"Only assigned tasks are visible",verdict:"fail",details:e instanceof Error?e.message:"Request failed"});}
   setResults([...collected]);
  }finally{setRunning(false);}
 };
 const executeModuleChecks=async()=>{
  if(running||crossRunning||moduleRunning)return;
  setModuleRunning(true);setModuleResults([]);
  const collected:Check[]=[];
  try{
   for(const check of moduleChecks){
    try{
     const response=await fetch(check.path,{method:"GET",cache:"no-store",credentials:"same-origin"});
     const body=await response.json();
     const denied=response.status===403&&body?.error==="Yalnızca Kurucu erişebilir";
     collected.push({
      key:check.key,name:check.name,verdict:denied?"pass":"fail",
      details:denied?"HTTP 403 - Founder-only module denied access as expected":
       `Unexpected response: HTTP ${response.status}, expected server denial did not match`
     });
    }catch(e){
     collected.push({key:check.key,name:check.name,verdict:"fail",
      details:e instanceof Error?e.message:"Check request failed"});
    }
    setModuleResults([...collected]);
   }
  }finally{setModuleRunning(false);}
 };
 const executeCross=async()=>{
  if(running||crossRunning)return;
  setCrossRunning(true);setCrossResults([]);
  const collected:Check[]=[];
  const actions=[
   {key:"accept",name:"Accept another Contributor's task"},
   {key:"start",name:"Start another Contributor's task"},
   {key:"submit",name:"Submit a report for another Contributor's task"}
  ];
  try{
   for(const action of actions){
    try{
     const response=await fetch("/api/cc",{
      method:"POST",credentials:"same-origin",cache:"no-store",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({operation:"ownership_security_test",testAction:action.key})
     });
     const body=await response.json();
     const denied=response.status===403&&body?.error==="Başka Contributor görevinde işlem yapılamaz";
     const inconclusive=response.status===404&&body?.error==="Başka Contributor'a ait aktif izolasyon test görevi bulunamadı";
     collected.push({
      key:action.key,name:action.name,
      verdict:denied?"pass":inconclusive?"inconclusive":"fail",
      details:denied?"HTTP 403 - Server ownership policy denied this action as expected":inconclusive?
       "No active CC-ISOLATION task owned by another Contributor":
       `Unexpected response: HTTP ${response.status}, expected server denial did not match`
     });
    }catch(e){
     collected.push({key:action.key,name:action.name,verdict:"fail",details:e instanceof Error?e.message:"Request failed"});
    }
    setCrossResults([...collected]);
   }
  }finally{setCrossRunning(false);}
 };
 const modulePass=moduleResults.filter(r=>r.verdict==="pass").length;
 const moduleFail=moduleResults.filter(r=>r.verdict==="fail").length;
 const crossPass=crossResults.filter(r=>r.verdict==="pass").length;
 const crossFail=crossResults.filter(r=>r.verdict==="fail").length;
 const crossUnknown=crossResults.filter(r=>r.verdict==="inconclusive").length;
 const passed=results.filter(r=>r.verdict==="pass").length;
 const failed=results.filter(r=>r.verdict==="fail").length;
 const pending=results.filter(r=>r.verdict==="inconclusive").length;
 return <section className="panel stack">
  <h2>Access Security Tests</h2>
  <p className="small muted">These checks verify permissions enforced by the server for the current session. They use invalid sample inputs and do not create or modify tasks, reports, archives, or audit history.</p>
  <button className="primary" disabled={running} onClick={()=>void execute()}>{running?"Checking permissions...":"Run Security Tests"}</button>
  {results.length>0&&<div className="stack" aria-live="polite">
   <p className="small">Passed: {passed} · Failed: {failed} · Inconclusive: {pending}{running?" · Running":""}</p>
   {results.map(result=><div key={result.key} className="card stack">
    <div className="row between">
     <b>{result.name}</b>
     <span className={result.verdict==="pass"?"badge good":"badge warn"}>{result.verdict==="pass"?"PASS":result.verdict==="fail"?"FAIL":"INCONCLUSIVE"}</span>
    </div>
    <p className="small muted">{result.details}</p>
   </div>)}
  </div>}
  <div className="card stack">
   <h3>Founder Module Access Isolation</h3>
   <p className="small muted">Uses the Contributor session to send read-only GET requests to Workstreams, Opportunities, Team Management and Module Health. All four requests should be denied with HTTP 403. No records, invitations or tasks are changed.</p>
   <button className="primary" disabled={running||crossRunning||moduleRunning} onClick={()=>void executeModuleChecks()}>
    {moduleRunning?"Checking module access...":"Test Module Access"}
   </button>
   {moduleResults.length>0&&<div className="stack" aria-live="polite">
    <p className="small">Passed: {modulePass} · Failed: {moduleFail}{moduleRunning?" · Running":""}</p>
    {moduleResults.map(result=><div className="card stack" key={result.key}>
     <div className="row between"><b>{result.name}</b><span className={result.verdict==="pass"?"badge good":"badge warn"}>{result.verdict==="pass"?"PASS":"FAIL"}</span></div>
     <p className="small muted">{result.details}</p>
    </div>)}
   </div>}
  </div>
  <div className="card stack">
   <h3>Cross-Contributor Action Permissions</h3>
   <p className="small muted">Checks the server-side ownership rule for accepting, starting and submitting a report on an active CC-ISOLATION test task assigned to another Contributor. It does not reveal that user's task details or modify tasks or reports.</p>
   <button className="primary" disabled={running||crossRunning} onClick={()=>void executeCross()}>
    {crossRunning?"Checking cross-user permissions...":"Test Cross-Contributor Permissions"}
   </button>
   {crossResults.length>0&&<div className="stack" aria-live="polite">
    <p className="small">Passed: {crossPass} · Failed: {crossFail} · Inconclusive: {crossUnknown}</p>
    {crossResults.map(result=><div className="card stack" key={result.key}>
     <div className="row between"><b>{result.name}</b><span className={result.verdict==="pass"?"badge good":"badge warn"}>{result.verdict==="pass"?"PASS":result.verdict==="fail"?"FAIL":"INCONCLUSIVE"}</span></div>
     <p className="small muted">{result.details}</p>
    </div>)}
   </div>}
  </div>
  <p className="small muted">These are authorization regression checks, not an independent penetration test or full security audit. Cross-Contributor checks verify the same server-side ownership rule without changing real tasks.</p>
 </section>;
}
