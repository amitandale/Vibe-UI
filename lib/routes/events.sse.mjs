// lib/routes/events.sse.mjs
// SSE helper. We output simple `data: <json>\n\n` lines.
export function serializeEvent(e){
  const json = JSON.stringify(e);
  if (json.length > 64 * 1024) throw new Error('payload too large');
  return `data: ${json}\n\n`;
}

export function renderSse(events){
  return events.map(serializeEvent).join('');
}
