// tests/events.store.sse.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeMemoryStore } from '../lib/events/store.mjs';
import { renderSse } from '../lib/routes/events.sse.mjs';
import { postRunsEvents, getRunsEvents } from '../lib/routes/events.api.mjs';

test('append + list events via API', async () => {
  const store = makeMemoryStore();
  let r = await postRunsEvents({ body:{ projectId:'p1', runId:'runA', events:[{ type:'log', data:{ msg:'hi' } }] }, store });
  assert.equal(r.ok, true);
  const list = await getRunsEvents({ query:{ runId:'runA', limit:10 }, store });
  assert.equal(list.ok, true);
  assert.equal(list.events.length, 1);
  assert.equal(list.events[0].type, 'log');
});

test('SSE renders data lines', async () => {
  const s = renderSse([{ type:'log', data:{ msg:'a' } }, { type:'done', data:{ ok:true } }]);
  assert.match(s, /data: /);
  const lines = s.trim().split("\n\n");
  assert.equal(lines.length, 2);
});
