// app/wizard/step1/page.js
'use client';
import { useState } from 'react';
import { validateStep1 } from '../../../lib/wizard.validate.mjs';
import { createProject } from '../../../lib/projects.mjs';

export default function Step1() {
  const [kind, setKind] = useState('SCRATCH');
  const [runtimeProvider, setRuntimeProvider] = useState('vercel');
  const [stackProfile, setStackProfile] = useState('');
  const [status, setStatus] = useState('');
  const [err, setErr] = useState({});

  async function onSubmit(e){
    e.preventDefault();
    const v = validateStep1({ kind, runtime_provider: runtimeProvider, stack_profile: stackProfile });
    setErr(v.errors || {});
    if (!v.ok) return;
    try{
      const ciUrl = process.env.NEXT_PUBLIC_CI_URL;
      const res = await createProject(ciUrl, { owner:'demo', repo:'app', kind: v.value.kind, runtime_provider: v.value.runtime_provider, stack_profile: v.value.stack_profile });
      setStatus('Saved');
    }catch(ex){
      setStatus(String(ex));
    }
  }

  return (
    <main style={{padding:'1rem'}}>
      <h1>New Project</h1>
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Mode</legend>
          <label><input type="radio" name="kind" checked={kind==='SCRATCH'} onChange={()=>setKind('SCRATCH')} /> Scratch</label>
          <label style={{marginLeft:16}}><input type="radio" name="kind" checked={kind==='SUPABASE'} onChange={()=>setKind('SUPABASE')} /> Supabase</label>
          {err.kind && <div style={{color:'red'}}>{err.kind}</div>}
        </fieldset>

        <div style={{marginTop:12}}>
          <label>Provider</label>
          <select value={runtimeProvider||''} onChange={e=>setRuntimeProvider(e.target.value||null)} disabled={kind!=='SCRATCH'}>
            <option value="">-- choose --</option>
            <option value="vercel">Vercel</option>
            <option value="gcp">GCP</option>
          </select>
          {err.runtime_provider && <div style={{color:'red'}}>{err.runtime_provider}</div>}
        </div>

        {kind==='SCRATCH' && (
          <div style={{marginTop:12}}>
            <label>Stack profile (optional)</label>
            <input value={stackProfile} onChange={e=>setStackProfile(e.target.value)} placeholder="e.g., node-basic" />
            {err.stack_profile && <div style={{color:'red'}}>{err.stack_profile}</div>}
          </div>
        )}

        <button type="submit" style={{marginTop:16}}>Continue</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  );
}
