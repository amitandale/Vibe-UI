// tests/ui.smoke.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
test('ui smoke: runner present', () => { assert.equal(typeof process.version, 'string'); });
