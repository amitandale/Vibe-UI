
"use client";
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_CI_URL;

export default function MarketPage(){
  const [teamId, setTeamId] = useState('team-demo');
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('Feature build');
  const [jobs, setJobs] = useState([]);
  const [vId, setVId] = useState('vb-001');
  const [log, setLog] = useState('');

  async function load(){
    if(!teamId) return;
    const r = await fetch(`${API}/api/market/jobs?team=${encodeURIComponent(teamId)}`);
    const j = await r.json();
    if (j.ok) setJobs(j.items||[]);
  }

  async function setPlan(){
    await fetch(`${API}/api/market/teams/${encodeURIComponent(teamId)}/plan`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ seatLimit:1, projectLimit:1 }) });
    load();
  }

  async function postJob(){
    setLog('Posting...');
    const r = await fetch(`${API}/api/market/jobs`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ teamId, projectId, title }) });
    const j = await r.json();
    if (!j.ok) setLog('Error: '+(j.code||'')+' '+(j.message||'')); else { setLog('Posted.'); load(); }
  }

  async function assign(id){
    setLog('Assigning...');
    const r = await fetch(`${API}/api/market/jobs/${id}/assign`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ vibecoderId: vId }) });
    const j = await r.json();
    if (!j.ok) setLog('Assign error: '+(j.code||'')+' '+(j.message||'')); else { setLog('Assigned.'); load(); }
  }

  useEffect(()=>{ load(); }, [teamId]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Marketplace (Plan-aware)</h1>
      <div className="grid grid-cols-3 gap-2">
        <input className="border p-2 rounded" placeholder="Team ID" value={teamId} onChange={e=>setTeamId(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Project ID" value={projectId} onChange={e=>setProjectId(e.target.value)} />
        <button className="border p-2 rounded" onClick={setPlan}>Init Team Plan (1 seat/1 project)</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input className="border p-2 rounded col-span-2" placeholder="Job Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <button className="border p-2 rounded" onClick={postJob} disabled={!teamId||!projectId||!title}>Post Job</button>
      </div>
      <div className="grid grid-cols-3 gap-2 items-center">
        <input className="border p-2 rounded" placeholder="Vibecoder ID" value={vId} onChange={e=>setVId(e.target.value)} />
      </div>

      <div className="space-y-2">
        {jobs.map(j=>(
          <div key={j.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{j.title}</div>
              <div className="text-xs text-gray-600">project: {j.projectId} — assigned: {j.assignedCount}</div>
            </div>
            <button className="border px-3 py-1 rounded" onClick={()=>assign(j.id)}>Assign</button>
          </div>
        ))}
        {!jobs.length && <div className="text-sm text-gray-500">No jobs yet.</div>}
      </div>
      {log && <div className="text-sm text-gray-700">{log}</div>}
    </div>
  );
}
