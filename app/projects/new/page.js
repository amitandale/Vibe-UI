// app/projects/new/page.js
'use client';
import { useState } from 'react';

export default function NewProjectPage(){
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [withTests, setWithTests] = useState(true);
  const [level, setLevel] = useState('basic');
  const [coverage, setCoverage] = useState('off');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e){
    e.preventDefault();
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
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Owner/Org</label>
          <input className="w-full border rounded px-3 py-2 bg-transparent" value={owner} onChange={e=>setOwner(e.target.value)} placeholder="acme" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Repo name</label>
          <input className="w-full border rounded px-3 py-2 bg-transparent" value={repo} onChange={e=>setRepo(e.target.value)} placeholder="my-app" required />
        </div>
        <div className="border rounded p-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={withTests} onChange={e=>setWithTests(e.target.checked)} /> With tests
          </label>
          {withTests && (
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Level</label>
                <select className="w-full border rounded px-3 py-2 bg-transparent" value={level} onChange={e=>setLevel(e.target.value)}>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="strict">Strict</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Coverage</label>
                <select className="w-full border rounded px-3 py-2 bg-transparent" value={coverage} onChange={e=>setCoverage(e.target.value)}>
                  <option value="off">Off</option>
                  <option value="60">60%</option>
                  <option value="80">80%</option>
                </select>
              </div>
            </div>
          )}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button disabled={submitting} className="px-3 py-2 rounded-lg border">
          {submitting ? 'Creating...' : 'Create project'}
        </button>
      </form>
    </div>
  );
}
