// app/api/billing/prices/route.mjs
import { callOrch } from '../../../../lib/proxy/orch.mjs';

function json(status, obj){ return new Response(JSON.stringify(obj), { status, headers:{ 'content-type':'application/json' } }); }

export async function GET(){
  const r = await callOrch({ method:'GET', path:'/app/api/billing/prices' });
  return json(r.status, r.data);
}
