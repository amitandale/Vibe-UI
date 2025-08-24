import test from 'node:test';
import assert from 'node:assert/strict';
import { ssrFormHtml, buildSseUrl, buildComposeUrl } from '../../app/projects/[id]/ai/testshim.mjs';

test('renders SSR form markup with expected fields', async () => {
  const html = ssrFormHtml();
  assert.match(html, /id="ai-prompt"/);
  assert.match(html, /id="ai-roster"/);
  assert.match(html, /id="ai-ticket"/);
  assert.match(html, /id="ai-maxsteps"/);
  assert.match(html, />Create PR</);
});

test('SSE subscribe URL shape is correct', async () => {
  const url = buildSseUrl('https://agent.example.com', 'llm', 'run_123');
  assert.equal(url, 'https://agent.example.com/api/sse?type=llm&id=run_123');
});

test('compose POST URL is correct', async () => {
  const url = buildComposeUrl('https://agent.example.com/');
  assert.equal(url, 'https://agent.example.com/api/llm/compose-pr');
});
