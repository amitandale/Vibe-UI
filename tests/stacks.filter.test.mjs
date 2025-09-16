// tests/stacks.filter.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterStacksByProvider } from '../lib/wizard.stacks.mjs';

const sample = [
  { id:'a', providersSupported:['vercel','gcp'] },
  { id:'b', providersSupported:['gcp'] },
  { id:'c', providersSupported:['vercel'] },
];

test('filterStacksByProvider: vercel', () => {
  const out = filterStacksByProvider(sample, 'vercel').map(s=>s.id).sort();
  assert.deepEqual(out, ['a','c']);
});

test('filterStacksByProvider: gcp', () => {
  const out = filterStacksByProvider(sample, 'gcp').map(s=>s.id).sort();
  assert.deepEqual(out, ['a','b']);
});

test('filterStacksByProvider: none', () => {
  const out = filterStacksByProvider(sample, null).map(s=>s.id).sort();
  assert.deepEqual(out, ['a','b','c']);
});
