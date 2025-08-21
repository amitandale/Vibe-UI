// lib/wizard.validate.mjs
export function validateStep1({ kind, runtime_provider, stack_profile }) {
  const errors = {};
  const out = { kind: kind ?? 'SCRATCH', runtime_provider: runtime_provider ?? null, stack_profile: null };

  if (out.kind !== 'SCRATCH' && out.kind !== 'SUPABASE') {
    errors.kind = 'Choose Scratch or Supabase';
  }
  if (out.kind === 'SCRATCH') {
    if (!runtime_provider || (runtime_provider !== 'vercel' && runtime_provider !== 'gcp')) {
      errors.runtime_provider = 'Choose Vercel or GCP';
    } else {
      out.runtime_provider = runtime_provider;
    }
    if (stack_profile != null && String(stack_profile).trim()) {
      const s = String(stack_profile).trim();
      if (s.length > 64) errors.stack_profile = 'Max 64 chars';
      out.stack_profile = s;
    }
  } else {
    out.runtime_provider = runtime_provider ?? null;
  }

  return { ok: Object.keys(errors).length === 0, errors, value: out };
}
