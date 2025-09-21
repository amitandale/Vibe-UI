// tests/proxy.orch.route.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

// Import route handlers from Next App Router file
import * as route from '../app/proxy/orch/[...path]/route.mjs';

test('proxy signs HMAC and forwards headers correctly (GET)', async () => {
  process.env.ORCH_BASE = 'http://127.0.0.1';
  process.env.VIBE_HMAC_SECRET = 'secret';
  process.env.VIBE_KID = 'ui';

  // Monkey-patch global fetch to capture request
  const calls = [];
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init={}) => {
    calls.push({ url, init });
    // Return a simple JSON response
    const body = JSON.stringify({ ok: true, echoed: { url, initHeaders: init.headers } });
    return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } });
  };

  try {
    const reqUrl = 'http://localhost/proxy/orch/app/api/billing/summary?projectId=p1';
    const req = new Request(reqUrl, { method: 'GET', headers: { 'authorization':'x', 'cookie':'y' } });
    const res = await route.GET(req, { params: { path: ['app','api','billing','summary'] } });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    // Target URL should be ORCH_BASE + original path and query
    assert.equal(String(url), 'http://127.0.0.1/app/api/billing/summary?projectId=p1');

    // Headers: has x-vibe-kid, x-signature, x-forwarded-for, no cookie/authorization
    assert.equal(init.headers['x-vibe-kid'], 'ui');
    assert.ok(typeof init.headers['x-signature'] === 'string' && init.headers['x-signature'].length > 0);
    assert.equal(init.headers['x-forwarded-for'], '127.0.0.1');
    assert.equal(init.headers['authorization'], undefined);
    assert.equal(init.headers['cookie'], undefined);
  } finally {
    globalThis.fetch = origFetch;
    delete process.env.ORCH_BASE;
    delete process.env.VIBE_HMAC_SECRET;
    delete process.env.VIBE_KID;
  }
});

test('proxy signs body for POST', async () => {
  process.env.ORCH_BASE = 'http://127.0.0.1';
  process.env.VIBE_HMAC_SECRET = 'secret';
  process.env.VIBE_KID = 'ui';

  const calls = [];
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init={}) => { calls.push({ url, init }); return new Response('{}', { status:200 }); };

  try {
    const body = JSON.stringify({ scope:'project', scopeId:'p1', hardUsd: 5, period:'month' });
    const req = new Request('http://localhost/proxy/orch/app/api/billing/budgets', { method: 'POST', body, headers: { 'content-type':'application/json' } });
    await route.POST(req, { params: { path: ['app','api','billing','budgets'] } });
    const { init } = calls[0];
    // Signature must be a hex string
    assert.ok(/^[0-9a-f]+$/.test(init.headers['x-signature']));
    // Content-type preserved
    assert.equal(init.headers['content-type'], 'application/json');
  } finally {
    globalThis.fetch = origFetch;
    delete process.env.ORCH_BASE;
    delete process.env.VIBE_HMAC_SECRET;
    delete process.env.VIBE_KID;
  }
});
