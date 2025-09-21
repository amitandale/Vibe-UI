// lib/orchestrator.client.mjs
const base = '/proxy/orch';

async function getJson(path){
  const res = await fetch(`${base}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}
async function postJson(path, body){
  const res = await fetch(`${base}${path}`, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json();
}

export async function listBudgets({ projectId, prId } = {}){
  const q = new URLSearchParams();
  if (projectId) q.set('projectId', projectId);
  if (prId) q.set('prId', prId);
  return getJson(`/app/api/billing/budgets?${q}`);
}
export async function upsertBudget(b){
  return postJson(`/app/api/billing/budgets`, b);
}
export async function getSummary({ projectId, prId, provider, model, estIn }={}){
  const q = new URLSearchParams();
  if (projectId) q.set('projectId', projectId);
  if (prId) q.set('prId', prId);
  if (provider) q.set('provider', provider);
  if (model) q.set('model', model);
  if (estIn != null) q.set('estIn', String(estIn));
  return getJson(`/app/api/billing/summary?${q}`);
}
export async function getEvents({ prId, limit=200 }={}){
  const q = new URLSearchParams();
  if (prId) q.set('prId', prId);
  q.set('limit', String(limit));
  return getJson(`/app/api/billing/events?${q}`);
}
export async function getPrices(){
  return getJson(`/app/api/billing/prices`);
}
