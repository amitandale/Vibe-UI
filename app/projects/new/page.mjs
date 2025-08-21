// app/projects/new/page.js
'use client';
import { useState } from 'react';

function Stepper({ step }){
  const labels = ['Basics','CI Profile','Confirm'];
  return (
    <div className="flex items-center gap-3 mb-3">
      {labels.map((l,i)=>(
        <div key={l} className={`px-2 py-1 rounded ${i===step?'bg-white/10 border':''}`}>
          {i+1}. {l}
        </div>
      ))}
    </div>
  );
}

export default function NewProjectPage(){
  const [step, setStep] = useState(0);
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [withTests, setWithTests] = useState(true);
  const [level, setLevel] = useState('basic');
  const [coverage, setCoverage] = useState('off');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function next(){
    if (step === 0 && (!owner || !repo)) { setError('Owner and repo are required'); return; }
    setError('');
    setStep(s => Math.min(2, s+1));
  }
  function back(){ setStep(s => Math.max(0, s-1)); }

  async function submit(){
    setSubmitting(true); setError('');
    try{
      const base = process.env.NEXT_PUBLIC_CI_URL;
      const body = {
        owner, repo,
        visibility: 'private',
        tests: withTests ? { enabled:true, level, coverage } : { enabled:false }
      };
      const res = await fetch(`${base}/api/projects`, {
        method:'POST',
        headers:{ 'content-type':'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if(!res.ok || !json.ok) throw new Error(json.message || 'Failed to create');
      window.location.href = `/projects/${json.projectId}`;
    }catch(err){
      setError(String(err.message || err));
    }finally{
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">New Project</h1>
      <Stepper step={step} />
      {step===0 && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Owner/Org</label>
            <input aria-label="Owner" className="w-full border rounded px-3 py-2 bg-transparent" value={owner} onChange={e=>setOwner(e.target.value)} placeholder="acme" />
          </div>
          <div>
            <label className="block text-sm mb-1">Repo name</label>
            <input aria-label="Repo" className="w-full border rounded px-3 py-2 bg-transparent" value={repo} onChange={e=>setRepo(e.target.value)} placeholder="my-app" />
          </div>
        </div>
      )}
      {step===1 && (
        <div className="border rounded p-3 space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={withTests} onChange={e=>setWithTests(e.target.checked)} /> With tests
          </label>
          {withTests && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Level</label>
                <select aria-label="Level" className="w-full border rounded px-3 py-2 bg-transparent" value={level} onChange={e=>setLevel(e.target.value)}>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="strict">Strict</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Coverage</label>
                <select aria-label="Coverage" className="w-full border rounded px-3 py-2 bg-transparent" value={coverage} onChange={e=>setCoverage(e.target.value)}>
                  <option value="off">Off</option>
                  <option value="60">60%</option>
                  <option value="80">80%</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
      {step===2 && (
        <div className="border rounded p-3 text-sm">
          <div className="font-medium mb-2">Confirm</div>
          <div>Owner: <b>{owner}</b></div>
          <div>Repo: <b>{repo}</b></div>
          <div>Tests: <b>{withTests ? `${level} / coverage ${coverage}` : 'disabled'}</b></div>
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex items-center gap-2">
        {step>0 && <button onClick={back} className="px-3 py-2 rounded-lg border">Back</button>}
        {step<2 && <button onClick={next} className="px-3 py-2 rounded-lg border">Next</button>}
        {step===2 && <button disabled={submitting} onClick={submit} className="px-3 py-2 rounded-lg border">{submitting?'Creating...':'Create project'}</button>}
      </div>
    </div>
  );
}
