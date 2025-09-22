// lib/proxy/orch.js
import crypto from 'crypto';

/** Base URL for orchestrator on localhost unless ORCH_URL overrides. */
export function baseUrl(){
  const u = process.env.ORCH_URL || 'http://127.0.0.1';
  return u.replace(/\/$/,''); 
}

export function signHex(body=''){
  const secret = process.env.VIBE_HMAC_SECRET || '';
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

/** Proxy fetch with HMAC and timeout. */
export async function proxyFetch({ method='GET', path, query=null, bodyStr=null, kid='ui', timeoutMs=5000 }){
  const u = new URL(baseUrl() + path);
  if (query && typeof query === 'object'){
    for (const [k,v] of Object.entries(query)){
      if (v != null) u.searchParams.set(k, String(v));
    }
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(u.toString(), {
      method,
      headers: {
        'content-type': 'application/json',
        'x-vibe-kid': kid,
        'x-signature': signHex(method === 'GET' ? '' : (bodyStr || '')),
      },
      body: method === 'GET' ? undefined : (bodyStr || ''),
      cache: 'no-store',
      signal: controller.signal,
    });
    const text = await res.text();
    return new Response(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
  } catch (e){
    return Response.json({ ok:false, code:'UPSTREAM_UNAVAILABLE' }, { status: 503 });
  } finally {
    clearTimeout(t);
  }
}
