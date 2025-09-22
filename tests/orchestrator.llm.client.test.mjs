// tests/orchestrator.llm.client.test.mjs
import { test } from 'node:test';
import { assert, mock, resetMocks, fetch as tFetch } from './_harness.mjs';
import { getLlmConfig, setLlmCredentials } from '../lib/orchestrator.client.mjs';

test('GET /app/api/llm/config is called via proxy', async () => {
  resetMocks();
  globalThis.fetch = tFetch;
  mock('/proxy/orch/app/api/llm/config', { status:200, body: JSON.stringify({ provider:'perplexity', model:'pplx-7b-online' }) });
  const cfg = await getLlmConfig();
  assert.equal(cfg.provider, 'perplexity');
  assert.equal(cfg.model, 'pplx-7b-online');
});

test('POST /app/api/llm/credentials sends write-only key and model', async () => {
  resetMocks();
  globalThis.fetch = tFetch;
  const body = { ok:true };
  mock('/proxy/orch/app/api/llm/credentials', { status:200, body: JSON.stringify(body) });
  const res = await setLlmCredentials({ provider:'openai', apiKey:'sk-xxx', model:'gpt-4o' });
  assert.equal(res.ok, true);
});
