// tests/ui/LlmSettings.render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import LlmSettingsClient from '../../app/settings/LlmSettingsClient.mjs';

test('renders provider and model selectors and password input', () => {
  const html = renderToString(React.createElement(LlmSettingsClient));
  assert.ok(html.includes('Provider'));
  assert.ok(html.includes('Model'));
  assert.ok(html.includes('type="password"'));
  // Providers are present as labels in static markup
  assert.ok(html.includes('Perplexity'));
  assert.ok(html.includes('Anthropic'));
  assert.ok(html.includes('OpenAI'));
  assert.ok(html.includes('Grok'));
});

test('does not echo key value in markup', () => {
  const html = renderToString(React.createElement(LlmSettingsClient));
  assert.ok(!html.includes('secret'));
});
