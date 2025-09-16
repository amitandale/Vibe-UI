// lib/wizard.stacks.mjs
export function filterStacksByProvider(stacks, provider) {
  if (!provider) return stacks.slice();
  return stacks.filter(s => Array.isArray(s.providersSupported) && s.providersSupported.includes(provider));
}
