
"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_CI_URL;
const BILLING_URL = process.env.NEXT_PUBLIC_BILLING_URL || '/settings';

export default function PRsPage() {
  const [owner, setOwner] = useState(""); 
  const [repo, setRepo] = useState(""); 
  const [items, setItems] = useState([]);
  const [log, setLog] = useState(""); 
  const [plan, setPlan] = useState("");

  useEffect(()=>{
    const o = localStorage.getItem('vibe:owner')||'';
    const r = localStorage.getItem('vibe:repo')||'';
    if(o) setOwner(o);
    if(r) setRepo(r);
  },[]);

  useEffect(()=>{ if(owner) localStorage.setItem('vibe:owner', owner); }, [owner]);
  useEffect(()=>{ if(repo) localStorage.setItem('vibe:repo', repo); }, [repo]);

  async function load() {
    setLog("Loading...");
    try {
      const res = await fetch(`${API_BASE}/api/github/prs?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
      const data = await res.json();
      if (data.ok) {
        setItems(data.items || []);
        setLog(""); 
      } else {
        setLog("Error: " + (data.error || "unknown"));
      }
    } catch (e) {
      setLog("Network error: " + e.message);
    }
  }

  async function refreshPlan(){
    if(!owner||!repo) return;
    try{
      const res = await fetch(`${API_BASE}/api/plan/state?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`, { cache:'no-store' });
      const j = await res.json();
      if (j && j.ok) setPlan(j.state);
    }catch{}
  }

  useEffect(()=>{ if(owner && repo){ load(); refreshPlan(); } }, [owner, repo]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Pull Requests</h1>
      <div className="grid grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="owner" value={owner} onChange={e=>setOwner(e.target.value)} />
        <input className="border p-2 rounded" placeholder="repo" value={repo} onChange={e=>setRepo(e.target.value)} />
      </div>
      {plan && plan!=='ACTIVE' && (
        <div className="text-sm bg-red-50 border border-red-200 text-red-700 p-2 rounded">
          <b>Policy:</b> vibe/policy-ok is red due to plan state {plan}. <a className="underline" href={BILLING_URL}>Update billing</a>.
        </div>
      )}
      {log && <pre className="bg-gray-100 p-3 rounded text-sm">{log}</pre>}
      <div className="space-y-3">
        {items.map(pr => (
          <div key={pr.number} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <a href={pr.url} target="_blank" className="font-semibold">#{pr.number} {pr.title}</a>
              {pr.previewUrl && <a href={pr.previewUrl} target="_blank" className="text-blue-600 underline">Preview</a>}
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {(pr.checks||[]).map((c,i)=>(
                <div key={i} className="text-sm">
                  <span className="font-mono">{c.name}</span>: <span>{c.status}</span> {c.url && <a className="underline" href={c.url} target="_blank">view</a>}
                  {c.name==='vibe/policy-ok' && c.status!=='success' && <span className="ml-2 text-red-600">(blocked by plan)</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
