// lib/meter/store.mjs
// Minimal meter store: record per-day counts and fetch rollups.
// Adapter interface mirrors a DB; in tests we keep it in memory.

function ymd(ts){
  const d = new Date(ts);
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}

export function makeMeterStore(){
  const idx = new Map(); // key: projectId|kind|YYYY-MM-DD -> count
  const latestCoverage = new Map(); // key: projectId -> coverage summary
  return {
    async record({ projectId, kind, ts = Date.now() }){
      const key = `${projectId}|${kind}|${ymd(ts)}`;
      const n = (idx.get(key) || 0) + 1;
      idx.set(key, n);
      return { ok:true, count:n };
    },
    async rollup({ projectId, kind, days = 7, now = Date.now() }){
      const out = [];
      for (let i=days-1; i>=0; i--){
        const dayTs = now - i*24*60*60*1000;
        const dayKey = ymd(dayTs);
        const key = `${projectId}|${kind}|${dayKey}`;
        out.push({ day: dayKey, count: idx.get(key) || 0 });
      }
      return { ok:true, days: out };
    },
    async setCoverage({ projectId, summary }){
      latestCoverage.set(projectId, summary);
      return { ok:true };
    },
    async getCoverage({ projectId }){
      const summary = latestCoverage.get(projectId) || null;
      return { ok:true, summary };
    }
  };
}
