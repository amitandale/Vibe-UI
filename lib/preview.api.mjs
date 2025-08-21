// lib/preview.api.mjs
export async function fetchPreview(ciUrl, projectId, fetchImpl = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!ciUrl) throw new Error('NEXT_PUBLIC_CI_URL required');
  if (!projectId) throw new Error('projectId required');
  if (!fetchImpl) throw new Error('fetch not available');
  const r = await fetchImpl(`${ciUrl}/api/projects/${projectId}/preview`, { headers:{ 'accept':'application/json' } });
  if (!r.ok) throw new Error(`CI error ${r.status}`);
  const j = await r.json();
  if (!j || !('ok' in j)) throw new Error('bad preview payload');
  return j.previewUrl || null;
}
