// tests/wizard.byor.requiredChecks.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ByorResult } from '../components/ByorResult.mjs';

test('ByorResult renders PR url and checks', () => {
  const html = renderToString(React.createElement(ByorResult, { prUrl:'https://github.com/acme/demo/pull/1', requiredChecks:['vibe/policy-ok','vibe/tests','vibe/coverage'] }));
  assert.ok(html.includes('https://github.com/acme/demo/pull/1'));
  assert.ok(html.includes('vibe/policy-ok'));
  assert.ok(html.includes('vibe/coverage'));
});
