
'use client'
import { useEffect, useState } from 'react';
const BRIDGE_URL = process.env.NEXT_PUBLIC_BRIDGE_URL || '';

export default function Studio(){
  const [owner,setOwner]=useState('your-github');
  const [repo,setRepo]=useState('your-repo');
  const [base,setBase]=useState('main');
  const [title,setTitle]=useState('My PR from Vibe UI');
  const [diff,setDiff]=useState('');
  const [log,setLog]=useState('');

  useEffect(()=>{
    if(!BRIDGE_URL) setLog('⚠️ NEXT_PUBLIC_BRIDGE_URL is not set. Go to Settings and add it in Vercel.');
  },[]);

  const submit = async ()=>{
    setLog('Sending to bridge...');
    try{
      const payload={ mode:'fixed-diff', owner, repo, base, title, diff, timestamp:Math.floor(Date.now()/1000)};
      const r = await fetch(BRIDGE_URL, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
      const j = await r.json();
      setLog(JSON.stringify(j,null,2));
    }catch(e){ setLog(String(e)); }
  };

  return (
    <div className="card">
      <div className="banner" style={{marginBottom:12}}>
        <b>Bridge URL:</b> {BRIDGE_URL || <span className="muted">[not set]</span>}
      </div>
      <div className="row">
        <input placeholder="owner" value={owner} onChange={e=>setOwner(e.target.value)} />
        <input placeholder="repo" value={repo} onChange={e=>setRepo(e.target.value)} />
        <input placeholder="base branch" value={base} onChange={e=>setBase(e.target.value)} style={{width:160}}/>
      </div>
      <div className="row" style={{marginTop:8}}>
        <input className="grow" placeholder="PR title" value={title} onChange={e=>setTitle(e.target.value)} />
        <button onClick={submit}>Open PR</button>
      </div>
      <div style={{marginTop:12}}>
        <textarea placeholder="Paste unified diff here..." value={diff} onChange={e=>setDiff(e.target.value)} />
      </div>
      <pre className="muted" style={{whiteSpace:'pre-wrap', marginTop:12}}>{log}</pre>
    </div>
  )
}
