// A shared, text-labelled status indicator for operational UI only.
// Presentation does not authorize, approve or alter any workflow state.
type Tone="neutral"|"info"|"success"|"warning"|"danger";
const palette:Record<string,Tone>={
 "BRIEFED":"neutral","ACCEPTED":"info","IN PROGRESS":"info","IN_PROGRESS":"info",
 "FOUNDER REVIEW":"warning","COMPLETED":"success","DONE":"success",
 "BLOCKED":"danger","DEFERRED":"warning","TODO":"neutral",
 "ACTIVE":"success","PAUSED":"warning","ARCHIVED":"neutral",
 "RESEARCH":"neutral","QUALIFIED":"info","CONTACTED":"info",
 "REPLY_RECEIVED":"info","DISCUSSION":"info","PROPOSAL":"info",
 "INTERNAL_REVIEW":"warning","WAITING_EXTERNAL":"warning",
 "DORMANT":"neutral","CLOSED":"neutral","CANCELLED":"neutral",
 "PENDING":"warning","REVOKED":"neutral","DISABLED":"danger",
 "UNREGISTERED":"neutral"
};
export default function StatusPill({status,label}:{status:string;label?:string}){
 return <span className="cc-status-pill" data-tone={palette[status]||"neutral"}>
  {label||status}
 </span>;
}
