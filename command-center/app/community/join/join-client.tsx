"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {createAuthClient} from "better-auth/react";
const authClient=createAuthClient();
type Membership={signedIn:boolean;joined:boolean;profile?:{displayName:string;wantsToContribute:boolean}|null};
export default function JoinClient(){
 const [status,setStatus]=useState<Membership|null>(null);
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [agree,setAgree]=useState(false);
 const [volunteer,setVolunteer]=useState(false);
 const [error,setError]=useState("");
 useEffect(()=>{void (async()=>{try{
  const r=await fetch("/api/community/membership",{cache:"no-store",credentials:"same-origin"});
  const x=await r.json();
  if(!r.ok)throw Error(x.error||"Membership is unavailable");
  setStatus(x);
 }catch(e){setError(e instanceof Error?e.message:"Membership is unavailable");}
 finally{setLoading(false);}})()},[]);
 const login=async()=>{setBusy(true);setError("");try{
  const result=await authClient.signIn.social({provider:"google",callbackURL:"/community/join"});
  if(result.error)throw Error("Google sign-in was not completed");
 }catch(e){setError(e instanceof Error?e.message:"Google sign-in is unavailable");setBusy(false);}};
 const join=async()=>{setBusy(true);setError("");try{
  const r=await fetch("/api/community/membership",{
   method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({agreeToCommunityRules:agree,wantsToContribute:volunteer})
  });
  const x=await r.json();
  if(!r.ok)throw Error(x.error||"Unable to join");
  setStatus(v=>({signedIn:true,joined:true,profile:{displayName:v?.profile?.displayName||"Member",wantsToContribute:volunteer}}));
 }catch(e){setError(e instanceof Error?e.message:"Unable to join");}
 finally{setBusy(false);}};
 return <div className="cc-community-join-panel">
  {loading?<p>Checking your membership…</p>:
   status?.joined?<><h2>You're part of the community.</h2>
    <p>Your membership is active. Public discussions and contribution features are being prepared. Community membership does not grant access to private team work.</p>
    <div className="row"><Link className="cc-community-action" href="/community">Back to Community →</Link><button disabled={busy} onClick={async()=>{setBusy(true);try{await authClient.signOut();window.location.assign("/community");}catch{setError("Sign-out is unavailable right now");setBusy(false);}}}>Sign out</button></div>
   </>:status?.signedIn?<><h2>Join the VYREN Community</h2>
    <p>Connect with people interested in VYREN, Web3 and technology. Taking on team tasks is entirely optional.</p>
    <label className="cc-community-check"><input type="checkbox" checked={volunteer} onChange={e=>setVolunteer(e.target.checked)}/> I'm interested in contributing voluntarily.</label>
    <label className="cc-community-check"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/> I understand that this community is for discussion and voluntary contribution; posts and ideas do not grant protocol authority, compensation, financial rights or automatic team access. I agree to respectful community conduct.</label>
    <button className="primary" disabled={!agree||busy} onClick={()=>void join()}>Join Community</button>
   </>:<><h2>Join with Google</h2>
    <p>Google sign-in is available for this first Preview phase. LinkedIn sign-in will follow after the provider configuration is tested.</p>
    <button className="primary" disabled={busy} onClick={()=>void login()}>Continue with Google</button>
   </>}
  {error&&<p role="alert" className="alert">{error}</p>}
 </div>;
}
