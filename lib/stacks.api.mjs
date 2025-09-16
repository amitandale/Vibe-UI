// lib/stacks.api.mjs
export async function fetchStacks(ciUrl, fetchImpl = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!ciUrl) throw new Error('NEXT_PUBLIC_CI_URL required');
  if (!fetchImpl) throw new Error('fetch not available');
  const r = await fetchImpl(`${ciUrl}/api/stacks`, { headers: { 'accept':'application/json' } });
  if (!r.ok) throw new Error(`CI error ${r.status}`);
  const j = await r.json();
  if (!j || !j.ok || !Array.isArray(j.stacks)) throw new Error('Bad stacks payload');
  return j.stacks;
}
