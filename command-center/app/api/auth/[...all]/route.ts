import {NextRequest} from "next/server";
import {toNextJsHandler} from "better-auth/next-js";
import {getAuth} from "../../../../lib/phase2";

export const runtime="nodejs";
const unavailable=()=>Response.json({error:"Authentication setup is pending"},{status:503});
export async function GET(req:NextRequest){const a=getAuth();return a?toNextJsHandler(a).GET(req):unavailable();}
export async function POST(req:NextRequest){const a=getAuth();return a?toNextJsHandler(a).POST(req):unavailable();}
