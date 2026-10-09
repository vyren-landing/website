"use client";
import {useState} from "react";

type Verdict="pass"|"fail"|"inconclusive";
type Check={key:string;name:string;verdict:Verdict;details:string};
const emptyTaskId="00000000-0000-0000-0000-000000000000";
const deniedMessage="Yalnızca Kurucu işlem yapabilir";
const checks=[
 {key:"read-audit",name:"İşlem Geçmişi okuma engeli",method:"GET",path:"/api/cc?view=audit",expected:"Yalnızca Kurucu erişebilir"},
 {key:"read-archive",name:"Arşiv okuma engeli",method:"GET",path:"/api/cc?view=archive",expected:"Yalnızca Kurucu erişebilir"},
 {key:"create",name:"İzinsiz görev oluşturma engeli",method:"POST",path:"/api/cc",operation:"create",expected:"Yalnızca Kurucu görev oluşturabilir"},
 {key:"approve",name:"İzinsiz rapor onayı engeli",method:"POST",path:"/api/cc",operation:"approve",expected:deniedMessage},
 {key:"revise",name:"İzinsiz revizyon talebi engeli",method:"POST",path:"/api/cc",operation:"revise",expected:deniedMessage},
 {key:"archive",name:"İzinsiz arşivleme engeli",method:"POST",path:"/api/cc",operation:"archive",expected:deniedMessage},
 {key:"restore",name:"İzinsiz geri getirme engeli",method:"POST",path:"/api/cc",operation:"restore",expected:deniedMessage},
] as const;

export default function SecurityPanel({actorId}:{actorId:string}){
 const [running,setRunning]=useState(false);
 const [results,setResults]=useState<Check[]>([]);
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
      details:passed?"HTTP 403 - Sunucu erişimi engelledi":`Beklenmeyen yanıt: HTTP ${response.status}, ${typeof data?.error==="string"?data.error:"Yanıt doğrulanamadı"}`
     });
    }catch(e){collected.push({key:check.key,name:check.name,verdict:"fail",details:e instanceof Error?e.message:"İstek başarısız"});}
    setResults([...collected]);
   }
   try{
    const response=await fetch("/api/cc?view=active",{cache:"no-store",credentials:"same-origin"});
    const data=await response.json();
    const tasks=Array.isArray(data?.tasks)?data.tasks:null;
    const verdict:Verdict=!response.ok||!tasks?"fail":tasks.length===0?"inconclusive":tasks.every((task:{ownerId?:string})=>task.ownerId===actorId)?"pass":"fail";
    collected.push({
     key:"read-scope",name:"Yalnızca kendi görevlerini görme",
     verdict,
     details:verdict==="pass"?`${tasks?.length||0} aktif görevde sahiplik sınırı doğrulandı`:verdict==="inconclusive"?"Aktif görev bulunmadığı için kapsam testi sonuçsuz":`Beklenmeyen kapsam veya HTTP ${response.status}`
    });
   }catch(e){collected.push({key:"read-scope",name:"Yalnızca kendi görevlerini görme",verdict:"fail",details:e instanceof Error?e.message:"İstek başarısız"});}
   setResults([...collected]);
  }finally{setRunning(false);}
 };
 const passed=results.filter(r=>r.verdict==="pass").length;
 const failed=results.filter(r=>r.verdict==="fail").length;
 const pending=results.filter(r=>r.verdict==="inconclusive").length;
 return <section className="panel stack">
  <h2>Yetki Güvenliği Testi</h2>
  <p className="small muted">Bu testler mevcut oturumun sunucudan aldığı izinleri kontrol eder. Test istekleri geçersiz örnek veriler kullanır; görev, rapor, arşiv veya işlem geçmişi oluşturmaz ya da değiştirmez.</p>
  <button className="primary" disabled={running} onClick={()=>void execute()}>{running?"Yetkiler kontrol ediliyor...":"Güvenlik Testlerini Çalıştır"}</button>
  {results.length>0&&<div className="stack" aria-live="polite">
   <p className="small">Başarılı: {passed} · Başarısız: {failed} · Sonuçsuz: {pending}{running?" · Test sürüyor":""}</p>
   {results.map(result=><div key={result.key} className="card stack">
    <div className="row between">
     <b>{result.name}</b>
     <span className={result.verdict==="pass"?"badge good":"badge warn"}>{result.verdict==="pass"?"PASS":result.verdict==="fail"?"FAIL":"SONUÇSUZ"}</span>
    </div>
    <p className="small muted">{result.details}</p>
   </div>)}
  </div>}
  <p className="small muted">Bu bir erişim yetkisi regresyon testidir; bağımsız sızma testi veya tam güvenlik denetimi yerine geçmez.</p>
 </section>;
}
