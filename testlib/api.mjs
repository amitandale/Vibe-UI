export async function api(path, opts = {}) {
  const base = process.env.NEXT_PUBLIC_CI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_CI_URL missing");
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(opts.headers||{}) },
    cache: 'no-store',
    credentials: 'include',
  });
  const ct = res.headers.get('content-type')||'';
  if (!res.ok) {
    const msg = ct.includes('application/json') ? JSON.stringify(await res.json()) : await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return ct.includes('application/json') ? res.json() : res.text();
}
