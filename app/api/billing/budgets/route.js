import crypto from 'node:crypto';
const getSigEmpty = ()=>{ const s = process.env.VIBE_HMAC_SECRET || ''; return s ? crypto.createHmac('sha256', s).update('').digest('hex') : ''; };
export async function GET(){ 
  const base = process.env.ORCH_URL || 'http://127.0.0.1';
const r = await fetch(base + '/app/api/billing/budgets', { cache: 'no-store' }, { headers: { 'x-vibe-kid':'ui', 'x-signature': getSigEmpty() } });
  const body = await r.text();
  return new Response(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
export async function POST(req){
  const bodyStr = await req.text();
  const secret = process.env.VIBE_HMAC_SECRET || '';
  const sig = secret ? crypto.createHmac('sha256', secret).update(bodyStr).digest('hex') : '';
  const base = process.env.ORCH_URL || 'http://127.0.0.1';
const r = await fetch(base + '/app/api/billing/budgets', {
    method: 'POST',
    headers: { 'content-type':'application/json', 'x-vibe-kid':'ui', 'x-signature': sig },
    body: bodyStr
  });
  const body = await r.text();
  return new Response(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
