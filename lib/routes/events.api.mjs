// lib/routes/events.api.mjs
// Pure functions representing vibe-ui API surface for events.
import { makeMemoryStore } from '../events/store.mjs';
const defaultStore = makeMemoryStore(); // in prod, inject a DB-backed store.

export async function postRunsEvents({ body, store = defaultStore }){
  const { projectId, runId, events } = body || {};
  if (!projectId) return { ok:false, error:'projectId required' };
  if (!Array.isArray(events) || events.length === 0) return { ok:false, error:'events required' };
  const out = await store.append({ projectId, runId, events });
  return out;
}

export async function getRunsEvents({ query, store = defaultStore }){
  const { runId, limit } = query || {};
  if (!runId) return { ok:false, error:'runId required' };
  const events = await store.list({ runId, limit: Number(limit) || 100 });
  return { ok:true, events };
}
