import test from 'node:test';
import assert from 'node:assert/strict';

import { api } from '../lib/api.js';

test('api throws if NEXT_PUBLIC_CI_URL missing', async () => {
  const old = process.env.NEXT_PUBLIC_CI_URL;
  delete process.env.NEXT_PUBLIC_CI_URL;
  await assert.rejects(() => api('/x'), /NEXT_PUBLIC_CI_URL/);
  if (old) process.env.NEXT_PUBLIC_CI_URL = old;
});

test('api composes URL and forwards headers', async () => {
  process.env.NEXT_PUBLIC_CI_URL = 'https://ci.example.com';
  let called = false;
  globalThis.fetch = async (url, opts) => {
    called = true;
    assert.equal(url, 'https://ci.example.com/hello');
    assert.equal(opts.headers['content-type'], 'application/json');
    return new Response(JSON.stringify({ ok:true }), { status:200, headers:{ 'content-type':'application/json' } });
  };
  const r = await api('/hello', { method:'POST', body: '{}' });
  assert.equal(r.ok, true);
  assert.equal(called, true);
});
