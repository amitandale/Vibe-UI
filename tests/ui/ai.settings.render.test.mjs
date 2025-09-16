import test from 'node:test';
import assert from 'node:assert/strict';
import { ssrHtml, buildConfigCheckUrl } from '../../app/projects/[id]/settings/ai/testshim.mjs';

test('SSR renders settings shell', async () => {
  const html = ssrHtml();
  assert.match(html, />Run check</);
});

test('config check URL shape', async () => {
  const url = buildConfigCheckUrl('https://agent.example.com/');
  assert.equal(url, 'https://agent.example.com/api/llm/config/check');
});
