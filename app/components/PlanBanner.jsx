
'use client';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_CI_URL;
const BILLING_URL = process.env.NEXT_PUBLIC_BILLING_URL || '/settings';

export default function PlanBanner(){
  const [state,setState] = useState(null);
  const [msg,setMsg] = useState('');
  const [projectId, setProjectId] = useState('');

  async function fetchState(){
    const owner = localStorage.getItem('vibe:owner')||'';
    const repo = localStorage.getItem('vibe:repo')||'';
    if(!owner || !repo) return setState(null);
    try{
      const res = await fetch(`${API_BASE}/api/plan/state?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`, { cache:'no-store' });
      const j = await res.json();
      if (j && j.ok){
        setState(j.state);
        setProjectId(j.projectId||'');
        setMsg(j.ok===false ? (j.message||'') : (j.ok===true && j.ok===false ? j.message : (j.state && j.state!=='ACTIVE' ? j.message : '')));
      }
    }catch(e){ /* ignore */ }
  }

  useEffect(()=>{
    fetchState();
    const id = setInterval(fetchState, 20000);
    return ()=> clearInterval(id);
  }, []);

  if(!state || state==='ACTIVE') return null;
  const text = state==='PAST_DUE' ? 'Your plan is past due. Actions are blocked.' :
               state==='TERMINATED' ? 'Your plan is terminated. Actions are blocked.' :
               'Your plan is in grace period; some actions may be limited.';
  return (
    <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-900 px-4 py-2 text-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div><strong>Plan status:</strong> {state} — {text}</div>
        <a href={BILLING_URL} className="underline">Update billing</a>
      </div>
    </div>
  );
}
