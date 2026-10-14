"use client";
import {useState} from "react";
import {createAuthClient} from "better-auth/react";
const client=createAuthClient();
export function SignIn({name,googleEnabled=false,canonicalLoginUrl}:{name?:string;googleEnabled?:boolean;canonicalLoginUrl?:string}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const start=async(provider:"github"|"google")=>{
  setBusy(true);setError("");
  try{
   const r=await client.signIn.social({provider,callbackURL:"/secure"});
   if(r.error)setError(provider==="google"?"Google giriş işlemi tamamlanamadı.":"GitHub giriş işlemi başlatılamadı.");
  }catch{setError("Giriş işlemi şu anda kullanılamıyor.");}
  finally{setBusy(false);}
 };
 return <div className="panel stack" style={{maxWidth:580}}>
  <h2>VYREN Command Center — Güvenli Giriş</h2>
  <p>Yalnızca Founder tarafından onaylanmış hesaplar erişebilir. Google veya GitHub ile giriş yapmak tek başına yetki vermez.</p>
  {name&&<p className="muted">Giriş yapıldı, fakat bu hesap yetkilendirilmiş ekip listesinde değil.</p>}
  {canonicalLoginUrl?<div className="stack">
   <p>Bu Preview dağıtım adresi OAuth için tanımlı giriş adresi değil. Google veya GitHub girişini sabit Command Center adresinden başlatın.</p>
   <a className="button primary" href={canonicalLoginUrl}>Doğru Command Center giriş adresine geç</a>
  </div>:<>
   <button className="primary" disabled={busy} onClick={()=>void start("github")}>GitHub ile giriş yap</button>
   {googleEnabled&&<button disabled={busy} onClick={()=>void start("google")}>Google ile giriş yap (onaylı Contributor)</button>}
  </>}
  {error&&<p role="alert">{error}</p>}
 </div>;
}
export function SignOut({language="tr"}:{language?:"tr"|"en"}){return <button onClick={async()=>{await client.signOut();window.location.assign("/secure");}}>{language==="tr"?"Çıkış Yap":"Sign Out"}</button>;}
