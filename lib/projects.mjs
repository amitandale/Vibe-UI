// lib/projects.mjs
export async function createProject(ciUrl, payload, fetchImpl = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!ciUrl) throw new Error('NEXT_PUBLIC_CI_URL required');
  if (!fetchImpl) throw new Error('fetch not available');
  const r = await fetchImpl(`${ciUrl}/api/projects`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`CI error ${r.status}`);
  const j = await r.json();
  if (!j || !j.ok) throw new Error('CI response invalid');
  return j;
}
