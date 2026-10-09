"use client";
import {useState} from "react";
import {createAuthClient} from "better-auth/react";
const client=createAuthClient();
export function SignIn({name,googleEnabled=false}:{name?:string;googleEnabled?:boolean}){
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
  <button className="primary" disabled={busy} onClick={()=>void start("github")}>GitHub ile giriş yap</button>
  {googleEnabled&&<button disabled={busy} onClick={()=>void start("google")}>Google ile giriş yap (test Contributor)</button>}
  {error&&<p role="alert">{error}</p>}
 </div>;
}
export function SignOut(){return <button onClick={async()=>{await client.signOut();window.location.assign("/secure");}}>Çıkış Yap</button>;}
