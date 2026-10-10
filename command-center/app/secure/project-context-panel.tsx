"use client";
import {useState} from "react";

type Source={id:string;title:string;basis:string;purpose:string;boundary:string};
const sources:Source[]=[
 {id:"MASTER",title:"Master Project Status",
  basis:"İncelenen referans: 2026-10-06. Daha yeni proje Master sürümü ve scoped güncellemeler ayrı doğrulanmalı.",
  purpose:"VYREN projesinin genel durumu, tamamlanan işler, eksik uygulama adımları ve sıradaki gerçek yürütme noktası.",
  boundary:"Operasyonel Command Center özeti, Master'ın kendisi değildir."},
 {id:"LC",title:"Launch Lifecycle Decision Ledger",
  basis:"İncelenen referans: 2026-10-06; LC-36 kapsamlı kayıt görüldü. Daha yeni LC overlay/supersession kontrolü gerekli.",
  purpose:"Genesis, ACTIVE/TGE, MARKET_OPEN ayrımı; yasal ve üretim kanıtlarının hangi aşamada gerekeceği.",
  boundary:"Yeni bir LC kararı varsayılamaz. Omission is not supersession; scoped override açık doğrulanır."},
 {id:"GNR",title:"GNR-STD-001 — Full-Scope Non-Regression",
  basis:"Doğrulanan kaynak: v1.3, GLOBAL / ACTIVE / CANONICAL (2026-10-11 inceleme bağlamı).",
  purpose:"Hak, ekonomik özgürlük, güvenlik, mülkiyet, continuity/recovery ve fiili kullanılabilirliğin birlikte korunması.",
  boundary:"No-Self-Lock, Solution Duty, replaceable implementation ve affirmative protection korunur; tek ekran PASS yetkisi vermez."},
 {id:"FFA",title:"FFA / Founder Hakları ve Ekonomik Mimari",
  basis:"Rev4.6 sealed mimari sınırı; geçerli madde ve tam belge bu ekranda bağlı veya doğrulanmış değil.",
  purpose:"Kurucu/FOW hakları, ekonomik semantik ve protokol governance yetkisi ayrımında controlling FFA metnine başvurmak.",
  boundary:"Uygulama formu veya operasyonel görev, bu hakları değiştirmez; bağımsız hakları başka işe bağlamaz."},
 {id:"VDCP",title:"VDCP-PAR-01 — Development Control Plane",
  basis:"İncelenen kaynak: 2026-10-06 REV3; ACTIVE PARALLEL WORKSTREAM / NON-BLOCKING BY DEFAULT.",
  purpose:"Maddi geliştirme/onarım/değişiklikleri intake, öncelik, iş paketi, teslim, kanıt, objektif inceleme ve kabul süreçlerinde izlemek.",
  boundary:"VDCP uygulaması constitutional authority veya kendiliğinden Genesis/ACTIVE engeli oluşturmaz."},
 {id:"EVIDENCE",title:"Canlı Uygulama ve Kanıt Kaynakları",
  basis:"Bu modülde dış kanıt deposu, production gate veya güncel provider teyidi bağlı değil.",
  purpose:"Gerçek runtime, deployment, hukuk, provider, güvenlik ve kabul kanıtlarının ayrı doğrulanması.",
  boundary:"PENDING kanıt otomatik PASS olamaz. Test ekranı veya dış temas kaydı yasal onay değildir."}
];

const bootstrap=`VYREN Rev4.6 projesinin güncel controlling durumunu gerçek Project/Library/canonical belgelere dayanarak doğrula.
1. En yeni Master Project Status, Launch Lifecycle Decision Ledger, GNR-STD-001 current canonical, FFA controlling belgeleri ve VDCP current spec kaynaklarını bul.
2. Açık scoped SUPERSEDES/override'ları, authority sırasını ve önceki LOCKED/CLOSED kararları koru. Eski kopyayı otomatik güncel kabul etme; omission is not supersession.
3. Gerçek sıradaki incomplete execution point'i belirle. Yalnızca gerçek kanıt varsa PASS de; bilinmeyeni PENDING bırak.
4. GNR v1.3'ün No-Self-Lock, Solution Duty ve Affirmative Rights-Protection/Security Duty ilkelerini tam kapsam uygula.
5. Command Center operasyonel verilerini canonical Master/LC/FFA/VDCP kararlarından ayrı tut; UI kaydı canonical karar veya launch gate üretmez.
6. Her bulguda doğrulanmış kaynak/sürüm ve eksik veri sınırını açık belirt. Gerekçesiz eski işi yeniden açma.`;

export default function ProjectContextPanel(){
 const [query,setQuery]=useState("");
 const [copied,setCopied]=useState(false);
 const [error,setError]=useState("");
 const selected=sources.filter(s=>(s.id+" "+s.title+" "+s.purpose).toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));
 const copy=async()=>{
  setCopied(false);setError("");
  try{await navigator.clipboard.writeText(bootstrap);setCopied(true);}
  catch{setError("Panoya otomatik kopyalama kullanılamıyor. Bu işlem herhangi bir proje kaydını değiştirmedi.");}
 };
 return <section className="panel stack">
  <h2>Proje Bağlamı ve Canonical Kaynak Rehberi</h2>
  <div className="alert small">Bu liste bir belge yönlendirme rehberidir. Master, LC Ledger, GNR, FFA ve VDCP belgelerinin kopyası veya güncel senkronize hali değildir. Kaynaklar GitHub'a aktarılmaz; buradan hiçbir canonical karar, PASS, TGE, MARKET_OPEN veya Founder hakkı değiştirilemez.</div>
  <p className="small muted">Bir karar vermeden önce en yeni controlling belgenin tam metni ve scoped supersession kontrol edilmelidir. Aşağıdaki tarihler, uygulamanın otomatik kontrol tarihi değil daha önce incelenmiş kaynakların referans tarihidir.</p>
  <div className="card stack">
   <h3>Hangi soruda hangi kaynağı kullanmalıyız?</h3>
   <div className="field"><label htmlFor="cc-context-search">Kaynak ara</label>
    <input id="cc-context-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Master, Lifecycle, GNR, FFA, VDCP..."/>
   </div>
   {selected.length===0&&<p>Aramayla eşleşen kaynak yok.</p>}
   {selected.map(s=><article key={s.id} className="panel stack">
    <div className="row between"><b>{s.title}</b><span className="badge">{s.id}</span></div>
    <p><b>Ne zaman kullanılır?</b> {s.purpose}</p>
    <p className="small muted"><b>Kaynak doğrulama sınırı:</b> {s.basis}</p>
    <p className="small muted"><b>Yetki sınırı:</b> {s.boundary}</p>
   </article>)}
  </div>
  <div className="card stack">
   <h3>Güncel proje bağlamını doğrulat</h3>
   <p>Yeni bir ChatGPT/Work çalışmasında aşağıdaki istemi kullanarak en son canonical dosyaları, LC override'larını ve eksik yürütme noktasını kaynaklardan yeniden doğrulatabilirsiniz. Bu kopyalama işlemi hiçbir projeyi değiştirmez.</p>
   <button className="primary" onClick={()=>void copy()}>Kaynak Kontrol İstemini Kopyala</button>
   {copied&&<p role="status" className="small">İstem panoya kopyalandı. Güncel belgelerin doğrulaması, istemin çalıştırıldığı ortamda ayrıca yapılmalıdır.</p>}
   {error&&<p role="alert">{error}</p>}
  </div>
  <p className="small muted">Bu ilk sürüm salt-okunur kaynak navigasyonudur. Belgeler uygulamadan açılamaz; sürüm/hash/evidence senkronizasyonu yoktur. Gerçek canonical kaynak deposu bağlantısı ve erişim yetkileri ayrıca nitelendirilmeden canlı senkronizasyon iddia edilmez.</p>
 </section>;
}
