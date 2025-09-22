// app/api/billing/summary/route.mjs
import { callOrch } from '../../../../lib/proxy/orch.mjs';

function json(status, obj){ return new Response(JSON.stringify(obj), { status, headers:{ 'content-type':'application/json' } }); }

export async function GET(req){
  const url = new URL(req.url);
  const r = await callOrch({ method:'GET', path:'/app/api/billing/summary', query: Object.fromEntries(url.searchParams.entries()) });
  return json(r.status, r.data);
}
