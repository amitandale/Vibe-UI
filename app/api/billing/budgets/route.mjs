// app/api/billing/budgets/route.mjs
import { callOrch } from '../../../../lib/proxy/orch.mjs';

function json(status, obj){ return new Response(JSON.stringify(obj), { status, headers:{ 'content-type':'application/json' } }); }

export async function GET(req){
  const url = new URL(req.url);
  const r = await callOrch({ method:'GET', path:'/app/api/billing/budgets', query: Object.fromEntries(url.searchParams.entries()) });
  return json(r.status, r.data);
}

export async function POST(req){
  let body = {};
  try { body = await req.json(); } catch {}
  const r = await callOrch({ method:'POST', path:'/app/api/billing/budgets', body });
  return json(r.status, r.data);
}
