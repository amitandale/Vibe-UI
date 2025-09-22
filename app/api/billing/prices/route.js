// app/api/billing/prices/route.js
import crypto from 'node:crypto';

function base(){ return (process.env.ORCH_URL || 'http://127.0.0.1').replace(/\/$/, ''); }
function sigEmpty(){ const s = process.env.VIBE_HMAC_SECRET || ''; return s ? crypto.createHmac('sha256', s).update('').digest('hex') : ''; }

export async function GET(){
  try {
    const r = await fetch(base() + '/app/api/billing/prices', {
      cache: 'no-store',
      headers: { 'x-vibe-kid':'ui', 'x-signature': sigEmpty() }
    });
    const body = await r.text();
    return new Response(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
  } catch {
    return Response.json({ ok:false, code:'UPSTREAM_UNAVAILABLE' }, { status: 503 });
  }
}
