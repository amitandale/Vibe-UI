export function buildSseUrl(agentBase, type, id) {
  const base = String(agentBase || '').replace(/\/$/, '');
  const t = encodeURIComponent(type || 'llm');
  const i = encodeURIComponent(String(id || ''));
  return `${base}/api/sse?type=${t}&id=${i}`;
}

export function buildComposeUrl(agentBase) {
  const base = String(agentBase || '').replace(/\/$/, '');
  return `${base}/api/llm/compose-pr`;
}

export function buildConfigCheckUrl(agentBase) {
  const base = String(agentBase || '').replace(/\/$/, '');
  return `${base}/api/llm/config/check`;
}
