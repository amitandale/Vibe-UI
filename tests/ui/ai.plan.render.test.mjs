import test from 'node:test';
import assert from 'node:assert/strict';
import { ssrPlanHtml, buildCompose } from '../../app/projects/[id]/ai/plan/testshim.mjs';

test('SSR renders plan area', async () => {
  const html = ssrPlanHtml();
  assert.match(html, />Save Plan</);
  assert.match(html, /id="plan-list"/);
  assert.match(html, />Create PR</);
});

test('Create PR button would POST to compose endpoint', async () => {
  const url = buildCompose('https://agent.example.com/');
  assert.equal(url, 'https://agent.example.com/api/llm/compose-pr');
});
