import test from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../testlib/api.mjs';

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
