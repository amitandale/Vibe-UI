'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { listBudgets, upsertBudget, getSummary, getEvents, getPrices } from '../../lib/orchestrator.client.mjs';

function Card({ children }){
  return <div className="border rounded-xl p-4 mb-4 bg-white/5">{children}</div>
}
function Row({ label, children }){
  return <div className="flex items-center gap-3 my-1"><div className="w-28 opacity-70">{label}</div><div>{children}</div></div>
}

function cents(n){ return `$${(Number(n||0)/100).toFixed(2)}`; }

export default function BillingClient(){
  const [projectId, setProjectId] = useState('');
  const [prId, setPrId] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function refresh(){
    setLoading(true); setError('');
    try {
      const [b, s, ev] = await Promise.all([
        listBudgets({ projectId, prId }),
        getSummary({ projectId, prId }),
        getEvents({ prId, limit: 200 }),
      ]);
      setBudgets(b.budgets || []);
      setSummary(s.summary || null);
      setEvents(ev.events || []);
    } catch(e){
      setError(String(e?.message||'error'));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, [projectId, prId]);

  const dayRows = useMemo(() => {
    const map = {};
    for (const e of events || []){
      const d = new Date(e.ts);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
      const c = Math.round((Number(e.costUsd)||0)*100);
      map[key] = (map[key]||0) + c;
    }
    return Object.entries(map).sort((a,b)=>a[0].localeCompare(b[0])).map(([date,c])=>({ date, cents:c }));
  }, [events]);

  async function onSaveBudget(e){
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      scope: data.scope,
      scopeId: data.scopeId,
      hardUsd: Number(data.hardUsd),
      softUsd: data.softUsd ? Number(data.softUsd) : undefined,
      period: data.period,
      active: data.active === 'on'
    };
    await upsertBudget(payload);
    await refresh();
    form.reset();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Billing</h1>

      <Card>
        <div className="flex gap-3 items-end">
          <div><label className="text-sm opacity-70">Project ID</label><input className="border rounded p-2" value={projectId} onChange={e=>setProjectId(e.target.value)} placeholder="optional" /></div>
          <div><label className="text-sm opacity-70">PR ID</label><input className="border rounded p-2" value={prId} onChange={e=>setPrId(e.target.value)} placeholder="optional" /></div>
          <button className="px-3 py-2 rounded-lg border" onClick={refresh}>Refresh</button>
          {loading && <div className="opacity-70">Loading…</div>}
          {error && <div className="text-red-600">{error}</div>}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-medium mb-2">Summary</h2>
          {summary ? (
            <div>
              <Row label="Current">{cents(summary.currentCents||0)}</Row>
              {'softCents' in summary && <Row label="Soft cap">{cents(summary.softCents)}</Row>}
              {'hardCents' in summary && <Row label="Hard cap">{cents(summary.hardCents)}</Row>}
              {summary.softWarn && <div className="mt-2 text-amber-700">Soft cap warning</div>}
            </div>
          ) : <div className="opacity-70">No data</div>}
        </Card>

        <Card>
          <h2 className="font-medium mb-2">Add / Update Budget</h2>
          <form onSubmit={onSaveBudget} className="grid gap-2">
            <div className="flex gap-2">
              <div><label className="text-sm opacity-70">Scope</label><select name="scope" className="border rounded p-2"><option value="project">project</option><option value="pr">pr</option></select></div>
              <div><label className="text-sm opacity-70">Scope ID</label><input name="scopeId" required className="border rounded p-2" placeholder="my-project or 123" /></div>
              <div><label className="text-sm opacity-70">Period</label><select name="period" className="border rounded p-2"><option value="month">month</option><option value="once">once</option></select></div>
            </div>
            <div className="flex gap-2">
              <div><label className="text-sm opacity-70">Hard USD</label><input name="hardUsd" type="number" step="0.01" required className="border rounded p-2" defaultValue="10" /></div>
              <div><label className="text-sm opacity-70">Soft USD</label><input name="softUsd" type="number" step="0.01" className="border rounded p-2" /></div>
              <div className="flex items-end gap-2"><input id="active" name="active" type="checkbox" defaultChecked /><label htmlFor="active">Active</label></div>
            </div>
            <div><button className="px-3 py-2 rounded-lg border" type="submit">Save</button></div>
          </form>
        </Card>
      </div>

      <Card>
        <h2 className="font-medium mb-2">Budgets</h2>
        {!budgets?.length ? <div className="opacity-70">None</div> :
          <table className="w-full">
            <thead><tr><th className="text-left">Scope</th><th className="text-left">ID</th><th className="text-left">Hard</th><th className="text-left">Soft</th><th className="text-left">Period</th><th className="text-left">Active</th></tr></thead>
            <tbody>
              {budgets.map((b,i)=>(
                <tr key={i}><td>{b.scope}</td><td>{b.scopeId}</td><td>${Number(b.hardUsd).toFixed(2)}</td><td>{b.softUsd!=null?`$${Number(b.softUsd).toFixed(2)}`:'—'}</td><td>{b.period}</td><td>{b.active===false?'no':'yes'}</td></tr>
              ))}
            </tbody>
          </table>
        }
      </Card>

      <Card>
        <h2 className="font-medium mb-2">Usage</h2>
        {!events?.length ? <div className="opacity-70">No events</div> :
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr><th className="text-left">Time</th><th className="text-left">Provider</th><th className="text-left">Model</th><th>In</th><th>Out</th><th className="text-left">Cost</th><th>PR</th></tr></thead>
              <tbody>
                {events.map((e,i)=>(
                  <tr key={i}>
                    <td>{new Date(e.ts).toLocaleString()}</td>
                    <td>{e.provider}</td>
                    <td>{e.model}</td>
                    <td className="text-right">{e.inputTokens}</td>
                    <td className="text-right">{e.outputTokens}</td>
                    <td>{cents(Math.round((Number(e.costUsd)||0)*100))}</td>
                    <td className="text-right">{e.prId||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3">
              <div className="opacity-70 mb-1">Daily totals (UTC)</div>
              <table className="w-full text-sm">
                <thead><tr><th className="text-left">Date</th><th className="text-left">Cost</th></tr></thead>
                <tbody>
                  {dayRows.map((r,i)=>(<tr key={i}><td>{r.date}</td><td>{cents(r.cents)}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        }
      </Card>
    </div>
  );
}
