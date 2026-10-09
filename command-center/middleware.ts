import {NextRequest,NextResponse} from "next/server";
/** Prevent browser-only demo from being used as real authorization after activation. */
export function middleware(req:NextRequest){
 if(process.env.CC_LIVE_ENABLED==="true"&&req.nextUrl.pathname==="/"){
  return NextResponse.redirect(new URL("/secure",req.url));
 }
 return NextResponse.next();
}
export const config={matcher:["/"]};
