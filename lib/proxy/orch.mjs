// lib/proxy/orch.mjs
import { signBodyHex } from '../security/hmac.client.mjs';

/** Build orchestrator URL on localhost. */
export function orchUrl(path){
  const base = process.env.ORCH_URL || 'http://127.0.0.1';
  return base.replace(/\/$/, '') + path;
}

/** Fetch with HMAC headers and timeout. */
export async function callOrch({ method='GET', path, query=null, body=null, kid='ui', timeoutMs=5000 }){
  const url = new URL(orchUrl(path));
  if (query && typeof query === 'object'){
    for (const [k,v] of Object.entries(query)){
      if (v != null) url.searchParams.set(k, String(v));
    }
  }
  const jsonBody = body ? JSON.stringify(body) : undefined;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url.toString(), {
      method,
      headers: {
        'content-type': 'application/json',
        'x-vibe-kid': kid,
        'x-signature': signBodyHex(method === 'GET' ? '' : (jsonBody || '')),
      },
      body: jsonBody,
      signal: controller.signal,
    });
    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch { data = { ok:false, raw:text }; }
    return { status: res.status, data };
  } catch (e){
    return { status: 503, data: { ok:false, code:'UPSTREAM_UNAVAILABLE' } };
  } finally {
    clearTimeout(t);
  }
}
