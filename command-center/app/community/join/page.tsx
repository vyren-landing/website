import Link from "next/link";
import {headers} from "next/headers";
import {communityEnabled} from "../../../lib/phase2";
import JoinClient from "./join-client";

export const dynamic="force-dynamic";
export const runtime="nodejs";
export default async function CommunityJoinPage(){
 const enabled=communityEnabled();
 let configuredOrigin:string|undefined;
 try{configuredOrigin=new URL(process.env.BETTER_AUTH_URL||"").origin;}catch{}
 const h=await headers();
 const actualHost=h.get("host");
 const target=configuredOrigin&&actualHost&&new URL(configuredOrigin).host!==actualHost?configuredOrigin+"/community/join":null;
 return <main className="cc-community cc-community-join-layout">
  <div className="cc-community-inner">
   <header className="cc-community-header"><Link className="cc-community-brand" href="/community"><strong>VYREN</strong><span>Community</span></Link></header>
   <section className="cc-community-join-shell">
    <p className="cc-community-kicker">VOLUNTARY PARTICIPATION</p>
    {target?<><h1>Use the official Preview sign-in address</h1>
      <p>Sign-in must be completed on the configured fixed address to protect your session.</p>
      <a className="cc-community-action" href={target}>Continue to the correct address →</a></>:
     !enabled?<><h1>Community membership is being prepared</h1>
      <p>Public registration has not yet been enabled. You can still explore topics and verified project sources.</p>
      <Link className="cc-community-action" href="/community">Return to Community →</Link></>:
     <JoinClient/>}
   </section>
  </div>
 </main>;
}
