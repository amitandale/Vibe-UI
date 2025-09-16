'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildSseUrl, buildComposeUrl } from '../../../../lib/ai/prPanel.mjs';

type RunStatus = 'IDLE' | 'RUNNING' | 'DONE' | 'ERROR';

export default function CreateAiPrPanel({ projectId }: { projectId: string }) {
  const [prompt, setPrompt] = useState('');
  const [roster, setRoster] = useState(''); // comma-separated slugs
  const [ticket, setTicket] = useState('');
  const [maxSteps, setMaxSteps] = useState<number>(30);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<RunStatus>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);

  const agentBase = process.env.NEXT_PUBLIC_AGENT_BASE_URL || '';

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPrUrl(null);
    setLogs([]);
    setStatus('RUNNING');
    setRunId(null);
    try {
      const body = {
        prompt,
        roster: roster ? roster.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        ticket: ticket || undefined,
        maxSteps: Number.isFinite(maxSteps) ? maxSteps : 30
      };
      const url = buildComposeUrl(agentBase);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const t = await res.text().catch(()=>'error');
        throw new Error(`Compose failed: ${res.status} ${t}`);
      }
      const data = await res.json();
      if (!data || !data.id) throw new Error('Malformed response (missing id)');
      setRunId(String(data.id));
    } catch (e: any) {
      setStatus('ERROR');
      setError(e?.message || 'Unknown error');
    }
  }, [prompt, roster, ticket, maxSteps, agentBase]);

  // Subscribe to SSE logs once we have a runId
  useEffect(() => {
    if (!runId) return;
    const url = buildSseUrl(agentBase, 'llm', runId);
    const es = new EventSource(url);
    const onMsg = (ev: MessageEvent) => {
      try {
        const j = JSON.parse(ev.data);
        if (j && j.message) {
          setLogs(prev => prev.concat([String(j.message)]));
        } else {
          setLogs(prev => prev.concat([String(ev.data)]));
        }
      } catch {
        setLogs(prev => prev.concat([String(ev.data)]));
      }
    };
    const onErr = () => {
      // Keep listening; status poll will finalize
    };
    es.addEventListener('message', onMsg);
    es.addEventListener('error', onErr);
    return () => {
      es.removeEventListener('message', onMsg as any);
      es.removeEventListener('error', onErr as any);
      es.close();
    };
  }, [runId, agentBase]);

  // Poll status until DONE/ERROR
  useEffect(() => {
    if (!runId) return;
    let cancelled = false;
    const url = `${agentBase.replace(/\/$/, '')}/api/llm/status?id=${encodeURIComponent(runId)}`;
    async function loop() {
      try {
        const r = await fetch(url, { cache: 'no-store' });
        if (cancelled) return;
        if (r.ok) {
          const j = await r.json();
          if (j?.status === 'DONE') {
            setStatus('DONE');
            setPrUrl(j?.pr?.url || null);
            return;
          }
          if (j?.status === 'ERROR') {
            setStatus('ERROR');
            setError(j?.error || 'Unknown error');
            return;
          }
        }
      } catch (_) {}
      setTimeout(loop, 1500);
    }
    loop();
    return () => { cancelled = true; };
  }, [runId, agentBase]);

  // Auto-scroll logs
  useEffect(() => {
    if (!logsRef.current) return;
    logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-3 border rounded-xl p-4">
        <div className="flex flex-col gap-1">
          <label className="font-medium">Prompt<span className="text-red-500">*</span></label>
          <textarea id="ai-prompt" className="border rounded p-2 min-h-[120px]" required
            value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what to build/change..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Roster override (comma)</label>
            <input id="ai-roster" className="border rounded p-2" value={roster} onChange={e => setRoster(e.target.value)} placeholder="e.g., node,react,sql" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Ticket</label>
            <input id="ai-ticket" className="border rounded p-2" value={ticket} onChange={e => setTicket(e.target.value)} placeholder="e.g., VIBE-123" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Max steps</label>
            <input id="ai-maxsteps" type="number" min={1} max={100} className="border rounded p-2" value={maxSteps}
              onChange={e => setMaxSteps(parseInt(e.target.value || '30', 10))} />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
            disabled={status === 'RUNNING'}>
            {status === 'RUNNING' ? 'Creating…' : 'Create PR'}
          </button>
          {status === 'DONE' && prUrl && (
            <a className="px-3 py-2 rounded-lg bg-green-600 text-white" href={prUrl} rel="noreferrer" target="_blank">
              Open PR
            </a>
          )}
        </div>
        {error && <div className="text-red-600 text-sm">Error: {error}</div>}
      </form>

      <div className="border rounded-xl p-4">
        <div className="font-semibold mb-2">Live logs</div>
        <div ref={logsRef} className="h-64 overflow-auto bg-gray-50 rounded p-2 text-sm whitespace-pre-wrap">
          {logs.length === 0 ? <div className="text-gray-500">No logs yet.</div> : logs.join('\n')}
        </div>
      </div>
    </div>
  );
}
