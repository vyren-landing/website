"use client";
import {useState} from "react";
import {createAuthClient} from "better-auth/react";
const client=createAuthClient();
export function SignIn({name}:{name?:string}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 return <div className="panel stack" style={{maxWidth:580}}>
  <h2>VYREN Command Center — Güvenli Giriş</h2>
  <p>Yalnızca önceden onaylanmış Founder ve test hesapları erişebilir. GitHub ile giriş yapılması tek başına yetki vermez.</p>
  {name&&<p className="muted">Giriş yapıldı, fakat bu hesap yetkilendirilmiş ekip listesinde değil.</p>}
  <button className="primary" disabled={busy} onClick={async()=>{
   setBusy(true);setError("");
   try{const r=await client.signIn.social({provider:"github",callbackURL:"/secure"});if(r.error)setError("GitHub giriş işlemi başlatılamadı.");}
   catch{setError("Giriş işlemi şu anda kullanılamıyor.");}
   finally{setBusy(false);}
  }}>GitHub ile giriş yap</button>
  {error&&<p role="alert">{error}</p>}
 </div>;
}
export function SignOut(){return <button onClick={async()=>{await client.signOut();window.location.assign("/secure");}}>Çıkış Yap</button>;}
