// tests/ui.smoke.test.mjs
import { test, strict as assert } from 'node:test';
test('ui smoke: runner present', () => { assert.equal(typeof process.version, 'string'); });
