// lib/events/store.mjs
// A minimal events store that can be backed by DB; for tests we use an in-memory adapter.
// Shape is portable so a DB adapter can implement the same interface.

export function makeMemoryStore(){
  const eventsByRun = new Map(); // key: runId, value: array of events
  return {
    async append({ projectId, runId, events }){
      const key = runId || projectId; // fall back to project-level if runId absent
      const arr = eventsByRun.get(key) || [];
      for (const e of events) {
        // normalize event shape: { ts, type, data }
        arr.push({ ts: e.ts || Date.now(), type: e.type || e.t || 'event', data: e.data ?? e });
      }
      eventsByRun.set(key, arr);
      return { ok:true, appended: events.length };
    },
    async list({ runId, limit = 1000 }){
      const arr = eventsByRun.get(runId) || [];
      return arr.slice(-limit);
    },
  };
}
