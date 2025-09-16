export function composeRequiredChecks({ stack, provider }) {
  const base = ['vibe/policy-ok','vibe/tests','vibe/coverage'];
  if (stack && stack.flags && stack.flags.e2e) base.push('vibe/e2e');
  return base;
}
