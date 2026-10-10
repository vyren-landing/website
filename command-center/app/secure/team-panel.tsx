"use client";
import {useCallback,useEffect,useState} from "react";

type Member={id:string;name:string;role:string;active:boolean;createdAt:string};
type Invite={id:string;email:string;status:"PENDING"|"ACTIVE"|"REVOKED";memberId:string|null;createdAt:string;updatedAt:string};
type TeamData={members:Member[];invites:Invite[]};
const date=(value:string)=>new Date(value).toLocaleString("tr-TR");

export default function TeamPanel({onChange}:{onChange:()=>void}){
 const [data,setData]=useState<TeamData|null>(null);
 const [email,setEmail]=useState("");
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const load=useCallback(async()=>{
  setLoading(true);
  try{
   const response=await fetch("/api/cc/team",{credentials:"same-origin",cache:"no-store"});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"Ekip kayıtlarına erişilemedi");
   setData(result);setError("");
  }catch(e){setError(e instanceof Error?e.message:"Ekip kayıtlarına erişilemedi");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void load()},[load]);
 const act=async(operation:string,fields:Record<string,string>,confirmation?:string)=>{
  if(confirmation&&!window.confirm(confirmation))return;
  setBusy(true);setError("");setMessage("");
  try{
   const response=await fetch("/api/cc/team",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({operation,...fields})});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"Ekip işlemi başarısız");
   if(operation==="invite")setEmail("");
   setMessage(operation==="invite"?"Davet erişim kaydı oluşturuldu. E-posta gönderilmedi.":"İşlem başarıyla kaydedildi.");
   await load();
   onChange();
  }catch(e){setError(e instanceof Error?e.message:"Ekip işlemi başarısız");}
  finally{setBusy(false);}
 };
 return <section className="panel stack">
  <h2>Ekip Yönetimi</h2>
  <p className="small muted">Bu bölüm yalnızca Kurucu içindir. Davetler Google üzerinden doğrulanır ve Contributor yetkisi verir. Founder kimliği ve hakları bu ekrandan değiştirilemez.</p>
  {error&&<div className="alert" role="alert">{error}</div>}
  {message&&<div className="alert" role="status">{message}</div>}
  <button disabled={loading||busy} onClick={()=>void load()}>Ekip Listesini Yenile</button>
  <div className="card stack">
   <h3>Google Contributor İçin Davet Kaydı</h3>
   <p className="small muted">Bu işlem otomatik e-posta göndermez. Davet edilen hesap ayrıca Google Cloud OAuth Testing → Test users listesinde bulunmalıdır. Hesap ilk doğrulanmış girişinde bağlanır.</p>
   <div className="field">
    <label htmlFor="cc-team-email">Davet edilecek Google e-posta adresi</label>
    <input id="cc-team-email" type="email" autoComplete="off" value={email} maxLength={254} placeholder="ornek@gmail.com" onChange={e=>setEmail(e.target.value)}/>
   </div>
   <button className="primary" disabled={busy||loading||email.trim().length<5} onClick={()=>void act("invite",{email})}>Erişim Daveti Oluştur</button>
  </div>
  <h3>Mevcut Contributor Hesapları</h3>
  {loading&&!data&&<p>Yükleniyor...</p>}
  {data?.members.length===0&&<p>Henüz kayıtlı Contributor yok.</p>}
  {data?.members.map(member=><article key={member.id} className="card stack">
   <div className="row between"><b>{member.name}</b><span className={member.active?"badge good":"badge warn"}>{member.active?"Erişim Açık":"Erişim Kapalı"}</span></div>
   <p className="small muted">Üye: {member.id.slice(0,14)}… · Oluşturulma: {date(member.createdAt)}</p>
   {member.active
    ?<button disabled={busy} onClick={()=>void act("disable_member",{id:member.id},"Bu Contributor'ın erişimini hemen kapatıp aktif oturumlarını sonlandırmak istiyor musunuz? Görevleri ve teslim geçmişi silinmez.")}>Erişimi Kapat</button>
    :<button disabled={busy} onClick={()=>void act("enable_member",{id:member.id},"Bu Contributor'ın erişimini yeniden açmak istiyor musunuz?")}>Erişimi Yeniden Aç</button>}
  </article>)}
  <h3>Google Davetleri</h3>
  {data?.invites.length===0&&<p>Henüz Google davet kaydı yok.</p>}
  {data?.invites.map(invite=><article key={invite.id} className="card stack">
   <div className="row between">
    <b style={{overflowWrap:"anywhere"}}>{invite.email}</b>
    <span className="badge">{invite.status==="PENDING"?"Giriş Bekleniyor":invite.status==="ACTIVE"?"Aktif":"İptal Edildi"}</span>
   </div>
   <p className="small muted">Davet tarihi: {date(invite.createdAt)} · {invite.memberId?"Google hesabıyla eşleşti":"Henüz eşleşmedi"}</p>
   {invite.status==="PENDING"&&<button disabled={busy} onClick={()=>void act("revoke_invite",{id:invite.id},"Davet kaydını iptal etmek istiyor musunuz?")}>Daveti İptal Et</button>}
   {invite.status==="REVOKED"&&<button disabled={busy} onClick={()=>void act("reactivate_invite",{id:invite.id},"Bu Google davetini yeniden etkinleştirmek istiyor musunuz? Bağlı hesap varsa yalnızca aynı Google kimliği yeniden erişebilir.")}>Daveti Yeniden Etkinleştir</button>}
   {invite.status==="ACTIVE"&&<button disabled={busy} onClick={()=>void act("revoke_invite",{id:invite.id},"Davetin bağlı olduğu Contributor'ın erişimi kapatılacak ve oturumları sonlandırılacak. Devam?")}>Bağlı Hesabın Erişimini Kapat</button>}
  </article>)}
  <p className="small muted">Erişim kapatma yalnızca operasyonel çalışma alanını etkiler. Kurucu yetkileri, governance, FFA, treasury ve canonical kararlar bu modülden değiştirilemez.</p>
 </section>;
}
