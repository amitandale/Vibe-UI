import test from 'node:test';
import assert from 'node:assert/strict';

// Test-only clone of the UI api helper (same semantics)
async function api(path, opts = {}) {
  const base = process.env.NEXT_PUBLIC_CI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_CI_URL missing");
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(opts.headers||{}) },
    cache: 'no-store',
    credentials: 'include',
  });
  const ct = res.headers.get('content-type')||'';
  if (!res.ok) {
    const msg = ct.includes('application/json') ? JSON.stringify(await res.json()) : await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return ct.includes('application/json') ? res.json() : res.text();
}

test('api: propagates non-JSON error body', async () => {
  process.env.NEXT_PUBLIC_CI_URL = 'https://ci.example.com';
  globalThis.fetch = async () => new Response('Bad Things', { status: 500, headers: { 'content-type': 'text/plain' } });
  await assert.rejects(() => api('/boom'), /Bad Things/);
});

test('api: handles successful text response', async () => {
  process.env.NEXT_PUBLIC_CI_URL = 'https://ci.example.com';
  globalThis.fetch = async () => new Response('OK', { status: 200, headers: { 'content-type': 'text/plain' } });
  const out = await api('/ok');
  assert.equal(out, 'OK');
});

test('api: forwards custom headers', async () => {
  process.env.NEXT_PUBLIC_CI_URL = 'https://ci.example.com';
  let seen = null;
  globalThis.fetch = async (url, opts) => {
    seen = opts.headers['x-custom'];
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  await api('/h', { headers: { 'x-custom': '123' } });
  assert.equal(seen, '123');
});
