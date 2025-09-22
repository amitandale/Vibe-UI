import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as route from '../app/api/llm/credentials/route.js';

test('credentials POST never echoes key', async () => {
  // Mock global fetch
  global.fetch = async (_url, opts) => {
    const b = JSON.parse(opts.body);
    // If key appears in response body, test will fail; we simulate orchestrator ok
    return new Response(JSON.stringify({ ok:true, received: !!b.apiKey }), { status: 200, headers:{'content-type':'application/json'} });
  };
  const req = new Request('http://x', { method:'POST', body: JSON.stringify({ provider:'openai', model:'gpt-4o', apiKey:'SECRET' }) });
  const res = await route.POST(req);
  const txt = await res.text();
  assert.ok(!txt.includes('SECRET'));
  assert.equal(res.status, 200);
});
