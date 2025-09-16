import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StackChecksPreview } from '../../components/StackChecksPreview.mjs';
test('StackChecksPreview lists required checks', () => {
  const html = renderToString(React.createElement(StackChecksPreview, { checks: ['vibe/policy-ok','vibe/tests','vibe/coverage'] }));
  assert.ok(html.includes('vibe/policy-ok'));
  assert.ok(html.includes('vibe/tests'));
  assert.ok(html.includes('vibe/coverage'));
});
