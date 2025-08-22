// tests/meter.coverage.api.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeMeterStore } from '../lib/meter/store.mjs';
import { postMeterHit, getMeterRollup } from '../lib/routes/meter.api.mjs';
import { parseLcovSummary } from '../lib/coverage/ingest.mjs';
import { postCoverageIngestLcov, getCoverageSummary, postCoverageSummary } from '../lib/routes/coverage.api.mjs';

test('meter: record + 3-day rollup', async () => {
  const store = makeMeterStore();
  await postMeterHit({ body:{ projectId:'p1', kind:'endpoint' }, injectedStore:store });
  await postMeterHit({ body:{ projectId:'p1', kind:'endpoint' }, injectedStore:store });
  const r = await getMeterRollup({ query:{ projectId:'p1', kind:'endpoint', days:3 }, injectedStore:store });
  assert.equal(r.ok, true);
  assert.equal(r.days.length, 3);
  assert.ok(r.days.some(d => d.count >= 2));
});

test('coverage: ingest LCOV and get summary', async () => {
  const lcov = [
    'TN:',
    'SF:fileA.js',
    'FNF:2',
    'FNH:1',
    'LF:10',
    'LH:8',
    'BRF:4',
    'BRH:2',
    'end_of_record'
  ].join('\n');
  const store = makeMeterStore();
  const ing = await postCoverageIngestLcov({ body:{ projectId:'p1', lcov }, injectedStore:store });
  assert.equal(ing.ok, true);
  assert.equal(ing.summary.lines.pct, 80);
  const got = await getCoverageSummary({ query:{ projectId:'p1' }, injectedStore:store });
  assert.equal(got.ok, true);
  assert.equal(got.summary.functions.pct, 50);
});

test('coverage: accept pre-computed summary (from n8n)', async () => {
  const sum = { lines:{hit:90,found:100,pct:90}, functions:{hit:45,found:50,pct:90}, branches:{hit:0,found:0,pct:0}, statements:{hit:90,found:100,pct:90}, pct:90 };
  const store = makeMeterStore();
  const set = await postCoverageSummary({ body:{ projectId:'p2', summary: sum }, injectedStore:store });
  assert.equal(set.ok, true);
  const got = await getCoverageSummary({ query:{ projectId:'p2' }, injectedStore:store });
  assert.equal(got.summary.pct, 90);
});
