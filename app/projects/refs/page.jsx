
'use client';
import { useState } from 'react';

export default function ProjectRefsForm(){
  const [owner,setOwner]=useState('');
  const [repo,setRepo]=useState('');
  const [provider,setProvider]=useState('vercel');
  const [secretRefs,setSecretRefs]=useState('GHA_SECRET:OPENAI_API_KEY\nVERCEL_ENV:N8N_TOKEN');
  const [uiUrl,setUiUrl]=useState('');
  const [bridgeUrl,setBridgeUrl]=useState('');
  const [appUrl,setAppUrl]=useState('');
  const [msg,setMsg]=useState('');

  async function submit(e){
    e.preventDefault();
    const refs = secretRefs.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const body = {
      owner, repo,
      providerConfig: { provider },
      secretRefs: refs,
      urls: { uiUrl, bridgeUrl, appUrl }
    };
    const res = await fetch(process.env.NEXT_PUBLIC_CI_URL + '/api/projects', {
      method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(body)
    });
    const j = await res.json();
    setMsg(JSON.stringify(j,null,2));
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Project Secret Refs (no secrets stored)</h1>
      <form onSubmit={submit} className="space-y-3">
        <div><label className="block text-sm">Owner</label><input className="border p-2 w-full" value={owner} onChange={e=>setOwner(e.target.value)} required/></div>
        <div><label className="block text-sm">Repo</label><input className="border p-2 w-full" value={repo} onChange={e=>setRepo(e.target.value)} required/></div>
        <div><label className="block text-sm">Provider</label>
          <select className="border p-2 w-full" value={provider} onChange={e=>setProvider(e.target.value)}>
            <option value="vercel">Vercel</option>
            <option value="gcp">GCP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Secret Refs (one per line, e.g., GHA_SECRET:OPENAI_API_KEY)</label>
          <textarea className="border p-2 w-full h-28" value={secretRefs} onChange={e=>setSecretRefs(e.target.value)} />
          <p className="text-xs text-gray-500 mt-1">These are <b>references only</b>—we never store raw secret values. Supported kinds: <code>GHA_SECRET</code>, <code>VERCEL_ENV</code>.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div><label className="block text-sm">UI URL</label><input className="border p-2 w-full" value={uiUrl} onChange={e=>setUiUrl(e.target.value)} placeholder="https://ui.example.com"/></div>
          <div><label className="block text-sm">Bridge URL</label><input className="border p-2 w-full" value={bridgeUrl} onChange={e=>setBridgeUrl(e.target.value)} placeholder="https://bridge.example.com"/></div>
          <div><label className="block text-sm">App URL</label><input className="border p-2 w-full" value={appUrl} onChange={e=>setAppUrl(e.target.value)} placeholder="https://app.example.com"/></div>
        </div>
        <button className="border rounded px-4 py-2">Create Project</button>
      </form>
      {msg && <pre className="mt-4 p-3 bg-gray-50 border overflow-auto text-xs">{msg}</pre>}
    </div>
  );
}
