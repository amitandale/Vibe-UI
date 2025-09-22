import crypto from 'node:crypto';
const getSigEmpty = ()=>{ const s = process.env.VIBE_HMAC_SECRET || ''; return s ? crypto.createHmac('sha256', s).update('').digest('hex') : ''; };
export async function GET(){ 
  const url = process.env.ORCH_URL;
  if (!url) return Response.json({ ok:false, error:'ORCH_URL missing' }, { status: 500 });
  const r = await fetch(url + '/app/api/billing/summary', {  cache: 'no-store' , headers: { 'x-vibe-kid':'ui', 'x-signature': getSigEmpty() } });
  const body = await r.text();
  return new Response(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
