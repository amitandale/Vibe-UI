'use client';
import { useEffect, useState } from 'react';
import { computeIndicators } from '@/lib/billing/uiStates';

function LineChart({ points }){
  if (!points || points.length < 2) return <div className="muted">No data</div>;
  const maxY = Math.max(...points.map(p=>p[1])) || 1;
  const maxX = points.length - 1;
  const w = 360, h = 120, pad = 10;
  const path = points.map(([i,y], idx)=>{
    const x = pad + (i/maxX) * (w-2*pad);
    const py = h - pad - (y/maxY) * (h-2*pad);
    return `${idx?'L':'M'}${x},${py}`;
  }).join(' ');
  return <svg width={w} height={h}><path d={path} fill="none" stroke="currentColor"/></svg>;
}

export default function BillingPage(){
  const [budgets, setBudgets] = useState(null);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [prices, setPrices] = useState(null);
  useEffect(()=>{ fetch('/app/api/billing/budgets').then(r=>r.json()).then(setBudgets); },[]);
  useEffect(()=>{ fetch('/app/api/billing/summary').then(r=>r.json()).then(setSummary); },[]);
  useEffect(()=>{ fetch('/app/api/billing/events').then(r=>r.json()).then(x=>setEvents(x.items||[])); },[]);
  useEffect(()=>{ fetch('/app/api/billing/prices').then(r=>r.json()).then(setPrices); },[]);
  const ind = computeIndicators(summary||{});
  async function saveBudget(e){
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      scope: form.get('scope'),
      level: form.get('level'),
      period: form.get('period'),
      soft: Number(form.get('soft')||0),
      hard: Number(form.get('hard')||0),
    };
    await fetch('/app/api/billing/budgets', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
    const next = await fetch('/app/api/billing/budgets').then(r=>r.json());
    setBudgets(next);
  }
  const points = (summary?.trend||[]).map((y,i)=>[i,y]);
  return (
    <div className="space-y-6">
      <div className="card">
        <h2>Budgets</h2>
        <form onSubmit={saveBudget} className="grid gap-3" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>
          <label>Scope<select name="scope" defaultValue="project"><option>project</option><option>pr</option></select></label>
          <label>Level<select name="level" defaultValue="soft"><option>soft</option><option>hard</option></select></label>
          <label>Period<select name="period" defaultValue="monthly"><option>daily</option><option>monthly</option></select></label>
          <label>Soft USD<input name="soft" type="number" step="0.01" defaultValue={budgets?.soft||0}/></label>
          <label>Hard USD<input name="hard" type="number" step="0.01" defaultValue={budgets?.hard||0}/></label>
          <div><button type="submit">Save</button></div>
        </form>
      </div>

      <div className="card">
        <h2>Usage</h2>
        <div className="grid gap-3" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>
          <div>
            <div className="muted">By PR</div>
            <div>{summary?.byPr?.tokens ?? 0} tokens / ${summary?.byPr?.usd ?? 0}</div>
          </div>
          <div>
            <div className="muted">By Project</div>
            <div>{summary?.byProject?.tokens ?? 0} tokens / ${summary?.byProject?.usd ?? 0}</div>
          </div>
          <div>
            <div className="muted">Unit Prices</div>
            <div>${prices?.input ?? 0} in / ${prices?.output ?? 0} out</div>
          </div>
        </div>
        <div className="mt-3"><LineChart points={points} /></div>
        {ind.softCap && <div className="banner warn">Soft cap approaching</div>}
        {ind.hardCap && <div className="banner error">Hard cap reached. Blocked.</div>}
      </div>
    </div>
  );
}
