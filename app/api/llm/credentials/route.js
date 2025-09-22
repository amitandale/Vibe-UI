export async function POST(req){
  const { provider, model, apiKey } = await req.json().catch(() => ({}));
  if (!provider || !model || typeof apiKey !== 'string' || apiKey.length === 0){
    return Response.json({ ok:false, error:'invalid_input' }, { status: 400 });
  }

  const url = process.env.ORCH_URL;

  // If orchestrator URL not configured, accept write-only locally.
  if (!url){
    // Do not echo the key. Return optimistic ok.
    return Response.json({ ok:true }, { status: 200, headers: { 'x-orch-forwarded':'false' } });
  }

  // Forward without logging or echoing secrets in the response
  const res = await fetch(url + '/app/api/llm/credentials', {
    method: 'POST',
    headers: { 'content-type':'application/json' },
    body: JSON.stringify({ provider, model, apiKey })
  }).catch(() => null);

  if (!res){
    return Response.json({ ok:false, error:'upstream_unreachable' }, { status: 502 });
  }

  // Only return status. Never echo key or upstream body.
  return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502, headers: { 'x-orch-forwarded':'true' } });
}
