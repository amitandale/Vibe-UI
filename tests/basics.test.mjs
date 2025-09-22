// Node test runner
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadModelConfig } from '../lib/models.js';
import { computeIndicators } from '../lib/billing/uiStates.js';

test('loadModelConfig merges override when present', async () => {
  const cfg = await loadModelConfig();
  assert.ok(cfg.providers.openai.includes('gpt-4o'));
});

test('computeIndicators flags near/over caps', () => {
  const s1 = computeIndicators({ limits:{soft:50, hard:100}, usageUsd: 40 });
  assert.equal(s1.softCap, false);
  assert.equal(s1.hardCap, false);

  const s2 = computeIndicators({ limits:{soft:50, hard:100}, usageUsd: 50 });
  assert.equal(s2.softCap, true);
  assert.equal(s2.hardCap, false);

  const s3 = computeIndicators({ limits:{soft:50, hard:100}, usageUsd: 150 });
  assert.equal(s3.softCap, true);
  assert.equal(s3.hardCap, true);
});
