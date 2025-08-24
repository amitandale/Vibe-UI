'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { buildComposeUrl } from '../../../../../lib/ai/prPanel.mjs';

export default function PlanPanel({ projectId }: { projectId: string }) {
  const agentBase = process.env.NEXT_PUBLIC_AGENT_BASE_URL || '';
  const [prompt, setPrompt] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const u = `${agentBase.replace(/\/$/, '')}/api/plan/list?projectId=${encodeURIComponent(projectId)}`;
    const r = await fetch(u, { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      setList(j.items || []);
    }
  }, [agentBase, projectId]);

  useEffect(() => { refresh().catch(()=>{}); }, [refresh]);

  const onSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const u = `${agentBase.replace(/\/$/, '')}/api/plan/create`;
      const r = await fetch(u, {
        method: 'POST',
        headers: { 'content-type':'application/json' },
        body: JSON.stringify({ projectId, prompt })
      });
      if (!r.ok) throw new Error('Create failed');
      setPrompt('');
      await refresh();
    } catch (e:any) {
      setError(e?.message || 'Unknown error');
    }
  }, [agentBase, projectId, prompt, refresh]);

  const onCreatePr = useCallback(async (item: any) => {
    setCreating(true);
    setError(null);
    try {
      const u = buildComposeUrl(agentBase);
      const r = await fetch(u, {
        method: 'POST',
        headers: { 'content-type':'application/json' },
        body: JSON.stringify({ prompt: item.prompt, ticket: item.id, roster: undefined })
      });
      if (!r.ok) throw new Error('Compose failed');
      const j = await r.json();
      setLastRunId(String(j.id || ''));
    } catch (e:any) {
      setError(e?.message || 'Unknown error');
    } finally {
      setCreating(false);
    }
  }, [agentBase]);

  return (
    <div className="space-y-4">
      <form onSubmit={onSave} className="space-y-2 border rounded-xl p-4">
        <label className="font-medium">Plan item (prompt)</label>
        <textarea className="border rounded p-2 min-h-[120px]" required
          value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Describe one concrete change you'd like to implement..." />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Plan</button>
          {lastRunId && <span className="text-sm text-gray-600">Last run id: {lastRunId}</span>}
        </div>
        {error && <div className="text-red-600 text-sm">Error: {error}</div>}
      </form>

      <div className="border rounded-xl p-4">
        <div className="font-semibold mb-2">Plan items</div>
        {list.length === 0 ? (
          <div className="text-gray-500 text-sm">No plan items yet.</div>
        ) : (
          <ul className="space-y-2">
            {list.map(it => (
              <li key={it.id} className="flex items-center justify-between gap-2 border rounded p-2">
                <div className="text-sm">
                  <div className="font-medium">{it.title || it.id}</div>
                  <div className="text-gray-600">{it.prompt}</div>
                </div>
                <button onClick={() => onCreatePr(it)}
                  disabled={creating}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50">
                  {creating ? 'Creating…' : 'Create PR'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
