// app/api/billing/budgets/route.js
import crypto from 'node:crypto';

function base(){ return (process.env.ORCH_URL || 'http://127.0.0.1').replace(/\/$/, ''); }
function sigEmpty(){ const s = process.env.VIBE_HMAC_SECRET || ''; return s ? crypto.createHmac('sha256', s).update('').digest('hex') : ''; }

export async function GET(req){
  try {
    const u = new URL(req.url);
    const qs = u.search ? u.search : '';
    const r = await fetch(base() + '/app/api/billing/budgets' + qs, {
      cache: 'no-store',
      headers: { 'x-vibe-kid':'ui', 'x-signature': sigEmpty() }
    });
    const body = await r.text();
    return new Response(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
  } catch {
    return Response.json({ ok:false, code:'UPSTREAM_UNAVAILABLE' }, { status: 503 });
  }
}

export async function POST(req){
  try {
    const bodyStr = await req.text();
    const secret = process.env.VIBE_HMAC_SECRET || '';
    const sig = secret ? crypto.createHmac('sha256', secret).update(bodyStr).digest('hex') : '';
    const r = await fetch(base() + '/app/api/billing/budgets', {
      method: 'POST',
      headers: { 'content-type':'application/json', 'x-vibe-kid':'ui', 'x-signature': sig },
      body: bodyStr,
      cache: 'no-store'
    });
    const body = await r.text();
    return new Response(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
  } catch {
    return Response.json({ ok:false, code:'UPSTREAM_UNAVAILABLE' }, { status: 503 });
  }
}
