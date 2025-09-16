
import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseTransport } from '../app/lib/runtime.mjs';

test('serverless -> poll', () => {
  process.env.PROFILE = 'serverless';
  assert.equal(chooseTransport(), 'poll');
});

test('longrun -> sse', () => {
  process.env.PROFILE = 'longrun';
  assert.equal(chooseTransport(), 'sse');
});
