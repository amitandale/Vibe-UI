
export function chooseTransport() {
  const p = String(process.env.PROFILE||'serverless').toLowerCase();
  return p === 'serverless' ? 'poll' : 'sse';
}
