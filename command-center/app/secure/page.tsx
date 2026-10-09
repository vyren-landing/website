import {headers} from "next/headers";
import {getActor,getAuth,phase2Configured} from "../../lib/phase2";
import {SignIn,SignOut} from "./sign-in";
import SecureWorkspace from "./workspace";

export const dynamic="force-dynamic";
export const runtime="nodejs";
export default async function SecurePage(){
 if(!phase2Configured())return <main className="main"><div className="panel stack" style={{maxWidth:700}}>
  <h1>Command Center — Aşama 2 Hazırlanıyor</h1>
  <p>Gerçek giriş ve veritabanı henüz etkinleştirilmedi. Verilerinizin korunması için bu alan güvenli biçimde kapalı tutuluyor.</p>
  <p className="muted">Gerekenler: ayrı PostgreSQL veritabanı, GitHub OAuth uygulaması, Vercel gizli ortam değişkenleri ve veritabanı migration kontrolü.</p>
  <p>Önceki demo kullanılabilir; ancak gerçek kullanıcı ve yetki denemeleri bu sayfada yapılmamalıdır.</p>
 </div></main>;
 let actor;
 try{actor=await getActor();}
 catch{return <main className="main"><div className="panel stack"><h1>Kurulum Doğrulanamadı</h1><p>Veritabanı şeması veya bağlantısı henüz hazır değil. Yetkisiz geçişe izin verilmedi.</p></div></main>;}
 if(!actor){
  const auth=getAuth();
  let signedIn=false;
  try{signedIn=!!(await auth?.api.getSession({headers:await headers()}));}catch{}
  return <main className="main"><SignIn name={signedIn?"unauthorized":undefined}/></main>;
 }
 return <div className="shell"><aside className="side"><div className="brand">◈ VYREN</div><div className="small muted">COMMAND CENTER · SECURE</div><p style={{marginTop:24}}>{actor.name}</p><p className="small muted">Rol: {actor.role==="Founder"?"Kurucu":"Katkı Sağlayan"}</p><div className="footer"><SignOut/> <p className="small muted">Operational execution only. No canonical authority.</p></div></aside>
 <main className="main"><header className="top"><div><h1>Güvenli Çalışma Alanı</h1><p className="muted">Ortak PostgreSQL · Sunucu tarafı yetkilendirme</p></div></header><SecureWorkspace actor={actor}/></main></div>;
}
