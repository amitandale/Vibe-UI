// lib/routes/coverage.api.mjs
import { makeMeterStore } from '../meter/store.mjs';
import { parseLcovSummary } from '../coverage/ingest.mjs';
const store = makeMeterStore(); // in prod, inject shared DB adapter

export async function postCoverageSummary({ body, injectedStore = store }){
  const { projectId, summary } = body || {};
  if (!projectId || !summary) return { ok:false, error:'projectId and summary required' };
  await injectedStore.setCoverage({ projectId, summary });
  return { ok:true };
}

export async function postCoverageIngestLcov({ body, injectedStore = store }){
  const { projectId, lcov } = body || {};
  if (!projectId || !lcov) return { ok:false, error:'projectId and lcov required' };
  const summary = parseLcovSummary(lcov);
  await injectedStore.setCoverage({ projectId, summary });
  return { ok:true, summary };
}

export async function getCoverageSummary({ query, injectedStore = store }){
  const { projectId } = query || {};
  if (!projectId) return { ok:false, error:'projectId required' };
  return injectedStore.getCoverage({ projectId });
}
