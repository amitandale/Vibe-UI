// lib/byor.api.mjs
export async function createByorPR(ciUrl, payload, fetchImpl = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!ciUrl) throw new Error('NEXT_PUBLIC_CI_URL required');
  if (!payload || !payload.owner || !payload.repo || !payload.provider || !payload.stackId)
    throw new Error('payload invalid');
  if (!fetchImpl) throw new Error('fetch not available');
  const r = await fetchImpl(`${ciUrl}/api/projects/byor`, {
    method:'POST',
    headers:{ 'content-type':'application/json' },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`CI error ${r.status}`);
  const j = await r.json();
  if (!j.ok || !j.pr || !j.pr.url) throw new Error('bad BYOR response');
  return { prUrl: j.pr.url, requiredChecks: j.requiredChecks || [] };
}
