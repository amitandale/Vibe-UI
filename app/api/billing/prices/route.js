export async function GET(){ 
  const url = process.env.ORCH_URL;
  if (!url) return Response.json({ ok:false, error:'ORCH_URL missing' }, { status: 500 });
  const r = await fetch(url + '/app/api/billing/prices', { cache: 'no-store' });
  const body = await r.text();
  return new Response(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
