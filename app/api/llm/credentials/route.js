export async function POST(req){
  const { provider, model, apiKey } = await req.json();
  const url = process.env.ORCH_URL;
  if (!url) return Response.json({ ok:false, error:'ORCH_URL missing' }, { status: 500 });
  // forward without logging secrets
  const res = await fetch(url + '/app/api/llm/credentials', {
    method: 'POST',
    headers: { 'content-type':'application/json' },
    body: JSON.stringify({ provider, model, apiKey })
  });
  // force non-echo
  const ok = res.ok;
  return Response.json({ ok }, { status: ok ? 200 : 502 });
}
