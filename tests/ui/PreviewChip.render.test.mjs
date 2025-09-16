// tests/ui/PreviewChip.render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { PreviewChip } from '../../components/PreviewChip.mjs';

test('renders link when url provided', () => {
  const html = renderToString(React.createElement(PreviewChip, { url:'https://x.example' }));
  assert.ok(html.includes('href="https://x.example"'));
});

test('renders placeholder when no url', () => {
  const html = renderToString(React.createElement(PreviewChip, { url:null }));
  assert.ok(html.includes('no preview'));
});
