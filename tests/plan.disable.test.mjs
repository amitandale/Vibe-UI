
import test from 'node:test';
import assert from 'node:assert/strict';
import { isActionDisabled } from '../app/lib/plan.mjs';

for (const st of ['PAST_DUE','TERMINATED','GRACE']) {
  test(`plan ${st} disables actions`, () => {
    assert.equal(isActionDisabled(st), true);
  });
}
test('ACTIVE allows actions', () => {
  assert.equal(isActionDisabled('ACTIVE'), false);
});
