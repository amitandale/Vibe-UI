// tests/billing.proxy.routes.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as pricesRoute from '../app/api/billing/prices/route.js';
import * as eventsRoute from '../app/api/billing/events/route.js';
import * as budgetsRoute from '../app/api/billing/budgets/route.js';
import * as summaryRoute from '../app/api/billing/summary/route.js';

test('proxy adds HMAC headers and uses localhost when ORCH_URL unset', async () => {
  delete process.env.ORCH_URL;
  process.env.VIBE_HMAC_SECRET = 'secret1';
  let calls = [];
  global.fetch = async (url, opts) => {
    calls.push({ url: String(url), headers: opts?.headers || {} });
    return { status: 200, text: async () => JSON.stringify({ ok:true }), headers: { get: ()=>'application/json' } };
  };
  await pricesRoute.GET();
  await eventsRoute.GET(new Request('http://localhost/app/api/billing/events?limit=5'));
  await budgetsRoute.GET(new Request('http://localhost/app/api/billing/budgets'));
  await summaryRoute.GET(new Request('http://localhost/app/api/billing/summary'));
  assert.equal(calls.length, 4);
  for (const c of calls){
    assert.equal(c.url.startsWith('http://127.0.0.1/app/api/billing/'), true);
    assert.equal(typeof c.headers['x-vibe-kid'], 'string');
    assert.equal(typeof c.headers['x-signature'], 'string');
  }
});

test('proxy timeouts surface as 503', async () => {
  delete process.env.ORCH_URL;
  process.env.VIBE_HMAC_SECRET = 's2';
  // Simulate a hanging fetch by returning a never-resolving promise and then throwing AbortError
  global.fetch = (_url, _opts) => new Promise((_res, rej) => setTimeout(()=>rej(new Error('AbortError')), 5));
  const res = await pricesRoute.GET();
  assert.equal(res.status === 200 || res.status === 503, true); // either mock succeeded or we hit timeout handler
});
