import test from 'node:test';
import assert from 'node:assert/strict';

async function api(path, opts = {}) {
  const base = process.env.NEXT_PUBLIC_CI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_CI_URL missing");
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(opts.headers||{}) },
    cache: 'no-store',
  });
  const ct = res.headers.get('content-type')||'';
  if (!res.ok) {
    const msg = ct.includes('application/json') ? JSON.stringify(await res.json()) : await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return ct.includes('application/json') ? res.json() : res.text();
}

test('api fails without NEXT_PUBLIC_CI_URL', async () => {
  const prev = process.env.NEXT_PUBLIC_CI_URL;
  delete process.env.NEXT_PUBLIC_CI_URL;
  await assert.rejects(() => api('/x'), /NEXT_PUBLIC_CI_URL/);
  if (prev) process.env.NEXT_PUBLIC_CI_URL = prev;
});

test('api composes URL and returns JSON', async () => {
  process.env.NEXT_PUBLIC_CI_URL = 'https://ci.example.com';
  globalThis.fetch = async (url, opts) => {
    return new Response(JSON.stringify({ ok:true, url }), { status:200, headers:{ 'content-type':'application/json' } });
  };
  const out = await api('/hello', { method:'POST', body:'{}' });
  assert.equal(out.ok, true);
  assert.equal(out.url, 'https://ci.example.com/hello');
});
