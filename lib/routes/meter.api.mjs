// lib/routes/meter.api.mjs
import { makeMeterStore } from '../meter/store.mjs';
const store = makeMeterStore(); // in prod, inject DB adapter

export async function postMeterHit({ body, injectedStore = store }){
  const { projectId, kind, ts } = body || {};
  if (!projectId || !kind) return { ok:false, error:'projectId and kind required' };
  return injectedStore.record({ projectId, kind, ts });
}

export async function getMeterRollup({ query, injectedStore = store }){
  const { projectId, kind, days } = query || {};
  if (!projectId || !kind) return { ok:false, error:'projectId and kind required' };
  const n = Number(days) || 7;
  return injectedStore.rollup({ projectId, kind, days:n });
}
