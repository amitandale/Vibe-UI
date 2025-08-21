// tests/wizard.byor.submit.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createByorPR } from '../lib/byor.api.mjs';

test('createByorPR returns PR url and required checks', async () => {
  const ciUrl = 'https://ci.example';
  const payload = { owner:'acme', repo:'demo', provider:'vercel', stackId:'node-basic' };
  const fetchImpl = async (url, opts) => ({
    ok: true,
    async json(){ return { ok:true, pr:{ url:'https://github.com/acme/demo/pull/1' }, requiredChecks:['vibe/policy-ok','vibe/tests','vibe/coverage'] }; }
  });
  const r = await createByorPR(ciUrl, payload, fetchImpl);
  assert.equal(r.prUrl, 'https://github.com/acme/demo/pull/1');
  assert.ok(r.requiredChecks.includes('vibe/policy-ok'));
});
