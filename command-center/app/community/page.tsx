import type {Metadata} from "next";
import Link from "next/link";
import {communityEnabled} from "../../lib/phase2";

export const metadata:Metadata={
 title:"VYREN Community | Preview",
 description:"A welcoming space for VYREN questions, ideas, open discussion and voluntary contributions. Preview in preparation.",
 robots:{index:false,follow:false}
};

const topics=[
 {title:"General",detail:"Meet people, exchange perspectives and start a thoughtful conversation.",tag:"Community"},
 {title:"Technology & Web3",detail:"Explore software, blockchain architecture, AI and technical research.",tag:"Technology"},
 {title:"Crypto & Ecosystem",detail:"Discuss developments across the broader crypto and decentralized technology ecosystem.",tag:"Ecosystem"},
 {title:"VYREN Q&A",detail:"Ask questions about VYREN and find links to verified project information.",tag:"Questions"},
 {title:"Ideas & Contributions",detail:"Share constructive suggestions and discover ways to contribute voluntarily.",tag:"Ideas"}
] as const;

const resources=[
 {title:"Understand the protocol",href:"https://vyren.io/protocol",detail:"How VYREN describes its rules and authority boundaries."},
 {title:"Explore the ecosystem",href:"https://vyren.io/ecosystem",detail:"Read about the ecosystem and its developing capabilities."},
 {title:"Check project status",href:"https://vyren.io/status",detail:"See the current published project state and what remains pending."}
] as const;

export const dynamic="force-dynamic";
export default function CommunityPage(){
 const membershipOpen=communityEnabled();
 return <main className="cc-community" id="top">
  <header className="cc-community-header">
   <Link className="cc-community-brand" href="/community" aria-label="VYREN Community home"><strong>VYREN</strong><span>Community</span></Link>
   <nav className="cc-community-nav" aria-label="Community navigation">
    <a href="#discussions">Discussions</a>
    <a href="#learn">Learn VYREN</a>
    <a href="#contribute">Contribute</a>
    <Link className="cc-community-workspace-link" href="/secure">Team sign-in</Link>
   </nav>
  </header>
  <div className="cc-community-inner">
   <section className="cc-community-hero" aria-labelledby="community-heading">
    <div className="cc-community-hero-copy">
     <p className="cc-community-kicker">DISCOVER · DISCUSS · CONTRIBUTE</p>
     <h1 id="community-heading">A place to connect around VYREN.</h1>
     <p className="cc-community-lead">Explore ideas, ask questions, share what you're learning and find ways to contribute to a growing ecosystem. Participation is voluntary.</p>
     <div className="cc-community-hero-actions">
      <a className="cc-community-action" href="#discussions">Explore topics <span aria-hidden="true">→</span></a>
      <a className="cc-community-action cc-community-action-quiet" href="#learn">Learn about VYREN</a>
     </div>
    </div>
    <aside className="cc-community-notice" aria-label="Preview availability">
     <p className="cc-community-notice-label">EARLY PREVIEW</p>
     <h2>Community space in preparation</h2>
     <p>{membershipOpen?"Community membership is available in this Preview using Google sign-in. LinkedIn, posts and comments are not active yet.":"Topics and verified learning links are available to explore. Public registration, LinkedIn sign-in, posts and comments are not active yet."}</p>
     {membershipOpen&&<Link className="cc-community-action cc-community-join-link" href="/community/join">Join Community →</Link>}
     <p className="cc-community-notice-foot">The existing approved team workspace remains separate and protected.</p>
    </aside>
   </section>
   <section id="discussions" className="cc-community-section" aria-labelledby="discussion-heading">
    <div className="cc-community-heading"><div><p className="cc-community-kicker">COMMUNITY</p><h2 id="discussion-heading">Find your conversation</h2></div><p>Everyone will be welcome to learn and participate when community posting opens.</p></div>
    <div className="cc-community-topics">
     {topics.map((topic)=><article className="cc-community-topic" key={topic.title}>
      <span className="cc-community-topic-tag">{topic.tag}</span>
      <h3>{topic.title}</h3>
      <p>{topic.detail}</p>
     </article>)}
    </div>
    <p className="cc-community-empty">Community posts are not open in this Preview. No sample activity or member participation is shown as real.</p>
   </section>
   <section id="learn" className="cc-community-section" aria-labelledby="learn-heading">
    <div className="cc-community-heading"><div><p className="cc-community-kicker">LEARN VYREN</p><h2 id="learn-heading">Start with verified sources</h2></div><p>Official project information stays on the VYREN website. Member discussions do not replace it.</p></div>
    <div className="cc-community-resource-list">
     {resources.map(item=><a className="cc-community-resource" href={item.href} target="_blank" rel="noopener noreferrer" key={item.title}>
      <span><strong>{item.title}</strong><small>{item.detail}</small></span>
      <span aria-hidden="true">↗</span>
     </a>)}
    </div>
   </section>
   <section id="contribute" className="cc-community-section cc-community-contribute" aria-labelledby="contribute-heading">
    <div>
     <p className="cc-community-kicker">VOLUNTARY CONTRIBUTION</p>
     <h2 id="contribute-heading">Have an idea? Want to help?</h2>
     <p>Questions, research, content, feedback, development ideas and practical help can all be valuable. You won't need a formal team role just to take part in the community.</p>
     <p>Once the contribution features open, members will be able to express interest and propose ideas. Approved team contributors will collaborate in their private workspace.</p>
    </div>
    <div className="cc-community-next">
     <strong>What comes next</strong>
     <p>Member sign-in, simple posts and comments, an ideas/contribution path and private team discussions are being added in stages.</p>
     <Link href="/secure">Already on the approved team? Open your workspace <span aria-hidden="true">→</span></Link>
    </div>
   </section>
   <footer className="cc-community-footer">
    <span>VYREN Community · Preview</span>
    <span>Community discussions and proposals do not create protocol governance or financial entitlements.</span>
    <a href="#top">Back to top ↑</a>
   </footer>
  </div>
 </main>;
}
