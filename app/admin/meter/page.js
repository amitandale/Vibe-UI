
"use client";
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_CI_URL;

export default function MeterAdmin(){
  const [projectId, setProjectId] = useState('');
  const [rows, setRows] = useState([]);
  const [days, setDays] = useState(14);
  const [err, setErr] = useState('');

  async function load(){
    setErr('');
    if(!projectId) return;
    try{
      const res = await fetch(`${API_BASE}/api/meter/project/${encodeURIComponent(projectId)}?days=${days}`, { cache:'no-store' });
      const j = await res.json();
      if (j.ok) setRows(j.rows||[]); else setErr(j.code||'error');
    }catch(e){ setErr(e.message); }
  }

  useEffect(()=>{ if(projectId) load(); }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Meter — Project Daily Usage</h1>
      <div className="flex gap-2 items-center">
        <input className="border p-2 rounded flex-1" placeholder="Project ID" value={projectId} onChange={e=>setProjectId(e.target.value)} />
        <input className="border p-2 rounded w-24" type="number" min="1" max="90" value={days} onChange={e=>setDays(parseInt(e.target.value||'14',10))} />
        <button className="px-3 py-2 border rounded" onClick={load} disabled={!projectId}>Load</button>
      </div>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <table className="w-full border mt-2 text-sm">
        <thead><tr><th className="text-left p-2 border">Day (UTC)</th><th className="text-left p-2 border">Count</th></tr></thead>
        <tbody>
          {rows.map(r => (<tr key={r.day}><td className="p-2 border">{r.day}</td><td className="p-2 border">{r.count}</td></tr>))}
          {!rows.length && <tr><td className="p-2 border" colSpan={2}>No data</td></tr>}
        </tbody>
      </table>
      <p className="text-xs text-gray-500">No PII is stored; counts are aggregated per day by project.</p>
    </div>
  );
}
