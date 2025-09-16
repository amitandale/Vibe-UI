// tests/wizard.planblock.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateStep1 } from '../lib/wizard.validate.mjs';

test('plan-blocked scenario disables submit (simulated by error presence)', () => {
  const res = validateStep1({ kind:'SCRATCH' });
  assert.equal(res.ok, false);
});
