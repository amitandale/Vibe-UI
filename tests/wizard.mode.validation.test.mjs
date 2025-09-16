// tests/wizard.mode.validation.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateStep1 } from '../lib/wizard.validate.mjs';

test('Scratch requires provider; allows stack_profile', () => {
  const res1 = validateStep1({ kind:'SCRATCH' });
  assert.equal(res1.ok, false);
  const res2 = validateStep1({ kind:'SCRATCH', runtime_provider:'vercel', stack_profile:'node-basic' });
  assert.equal(res2.ok, true);
  assert.equal(res2.value.runtime_provider, 'vercel');
  assert.equal(res2.value.stack_profile, 'node-basic');
});

test('Supabase ignores stack_profile and can omit provider', () => {
  const res = validateStep1({ kind:'SUPABASE', stack_profile:'x' });
  assert.equal(res.ok, true);
  assert.equal(res.value.stack_profile, null);
});
