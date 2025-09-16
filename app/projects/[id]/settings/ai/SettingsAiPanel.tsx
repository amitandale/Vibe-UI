'use client';
import React, { useCallback, useState } from 'react';
import { buildConfigCheckUrl } from '../../../../../lib/ai/prPanel.mjs';

type CheckResult = null | {
  ok: boolean;
  claude: {
    tokenPresent: boolean;
    cliFound: boolean;
    cliPath: string;
    probe: { ok: boolean; detail: string; };
  };
  roster: string[];
};

export default function SettingsAiPanel({ projectId }: { projectId: string }) {
  const [checking, setChecking] = useState(false);
  const [res, setRes] = useState<CheckResult>(null);
  const [error, setError] = useState<string| null>(null);

  const agentBase = process.env.NEXT_PUBLIC_AGENT_BASE_URL || '';

  const onCheck = useCallback(async () => {
    setChecking(true); setError(null);
    try {
      const url = buildConfigCheckUrl(agentBase);
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error('Check failed');
      const j = await r.json();
      setRes(j);
    } catch (e:any) {
      setError(e?.message || 'Unknown error');
    } finally {
      setChecking(false);
    }
  }, [agentBase]);

  return (
    <div className="space-y-4 border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">Claude readiness</div>
        <button onClick={onCheck} disabled={checking}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
          {checking ? 'Checking…' : 'Run check'}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">Error: {error}</div>}

      {res && (
        <div className="text-sm space-y-2">
          <div>Token: {res.claude.tokenPresent ? 'present ✅' : 'missing ❌'}</div>
          <div>CLI Path: {res.claude.cliPath} — {res.claude.cliFound ? 'found ✅' : 'not found ❌'}</div>
          <div>Probe: {res.claude.probe.ok ? `ok ✅ (${res.claude.probe.detail})` : `failed ❌ (${res.claude.probe.detail})`}</div>
          <div>Roster defaults: {res.roster && res.roster.length ? res.roster.join(', ') : '—'}</div>
          <div className="mt-2 font-medium">Overall: {res.ok ? 'Ready ✅' : 'Not ready ❌'}</div>
        </div>
      )}
    </div>
  );
}
