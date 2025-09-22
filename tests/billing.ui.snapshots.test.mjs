// tests/billing.ui.snapshots.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { computeIndicators } from '../lib/billing/uiStates.js';

test('empty state', () => {
  const s = computeIndicators({ limits:{ soft:0, hard:0 }, usageUsd:0 });
  assert.deepEqual(s, { softCap:false, hardCap:false, percent:0 });
});

test('near soft cap', () => {
  const s = computeIndicators({ limits:{ soft:100, hard:200 }, usageUsd:120 });
  assert.equal(s.softCap, true);
  assert.equal(s.hardCap, false);
  assert.equal(typeof s.percent, 'number');
});

test('over hard cap', () => {
  const s = computeIndicators({ limits:{ soft:100, hard:200 }, usageUsd:250 });
  assert.equal(s.hardCap, true);
  assert.equal(s.percent, 100);
});
