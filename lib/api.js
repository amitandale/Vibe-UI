export async function api(path, opts = {}) {
  const base = process.env.NEXT_PUBLIC_CI_URL;
  const res = await fetch(`${base}${path}`, { ...opts, headers: { 'content-type': 'application/json', ...(opts.headers||{}) }, cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}