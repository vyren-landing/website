"use client";
import {useCallback,useEffect,useState} from "react";

type Member={
 id:string;name:string;joinedAt:string;wantsToContribute:boolean;
 directGrantActive:boolean|null;existingRole:string|null;existingActive:boolean|null
};
export default function CommunityMembersPanel(){
 const [members,setMembers]=useState<Member[]>([]);
 const [enabled,setEnabled]=useState(false);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState("");
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const load=useCallback(async()=>{
  try{
   const response=await fetch("/api/cc/community-members",{credentials:"same-origin",cache:"no-store"});
   if(response.status===503){setEnabled(false);return;}
   const value=await response.json();
   if(!response.ok)throw Error(value.error||"Üye listesi alınamadı");
   setMembers(value.members||[]);setEnabled(true);setError("");
  }catch(e){setError(e instanceof Error?e.message:"Üye listesi alınamadı");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void load()},[load]);
 async function change(member:Member,operation:"grant"|"revoke"){
  if(!window.confirm(operation==="grant"
   ?member.name+" için Contributor çalışma alanı erişimi açılsın mı?"
   :member.name+" için Contributor erişimi kapatılsın mı? Görev ve teslim geçmişi korunacak."))return;
  setBusy(member.id);setError("");setMessage("");
  try{
   const response=await fetch("/api/cc/community-members",{
    method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({operation,id:member.id})
   });
   const value=await response.json();
   if(!response.ok)throw Error(value.error||"İşlem yapılamadı");
   setMessage(operation==="grant"?"Contributor yetkisi verildi.":"Contributor yetkisi kaldırıldı.");
   await load();
  }catch(e){setError(e instanceof Error?e.message:"İşlem yapılamadı");}
  finally{setBusy("");}
 }
 if(loading)return <section className="panel stack"><h3>Topluluk Üyeleri</h3><p className="small muted">Üye kayıtları kontrol ediliyor…</p></section>;
 if(!enabled&&!error)return null;
 return <section className="panel stack">
  <div className="cc-list-toolbar">
   <div><h2>Topluluk Üyeleri</h2><p className="small muted">Katılmış üyeler arasından Contributor erişimini doğrudan yönetin.</p></div>
   <button disabled={!!busy} onClick={()=>void load()}>Yenile</button>
  </div>
  {error&&<p role="alert" className="alert">{error}</p>}
  {message&&<p role="status" className="alert">{message}</p>}
  {members.length===0&&<p className="small muted">Henüz topluluk üyeliği bulunmuyor.</p>}
  {members.map(member=>{
   const legacy=member.existingRole==="Contributor"&&member.directGrantActive===null;
   const active=member.directGrantActive===true;
   const revoked=member.directGrantActive===false;
   return <article className="card stack" key={member.id}>
    <div className="row between"><b>{member.name}</b>
     <span className="badge">{legacy?"Mevcut Contributor":active?"Contributor":revoked?"Yetki kapalı":"Topluluk Üyesi"}</span>
    </div>
    <p className="small muted">{member.wantsToContribute?"Gönüllü katkıya açık":"Katkı tercihi belirtilmedi"} · Üyelik: {new Date(member.joinedAt).toLocaleDateString("tr-TR")}</p>
    {!legacy&&<div><button className={active?"":"primary"} disabled={!!busy}
      onClick={()=>void change(member,active?"revoke":"grant")}>{active?"Contributor Yetkisini Kaldır":"Contributor Yetkisi Ver"}</button></div>}
    {legacy&&<p className="small muted">Bu hesap mevcut davetli Contributor yönetimi üzerinden kontrol edilir.</p>}
   </article>;
  })}
 </section>;
}
