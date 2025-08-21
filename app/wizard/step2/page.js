// app/wizard/step2/page.js
'use client';
import { useEffect, useState } from 'react';
import { fetchStacks } from '../../../lib/stacks.api.mjs';
import { filterStacksByProvider } from '../../../lib/wizard.stacks.mjs';

export default function Step2() {
  const [provider, setProvider] = useState('vercel'); // demo default; in real flow we would read from Step1 state/router
  const [stacks, setStacks] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const ciUrl = process.env.NEXT_PUBLIC_CI_URL;
        const list = await fetchStacks(ciUrl);
        setStacks(list);
      } catch (e) {
        setErr(String(e));
      }
    })();
  }, []);

  const filtered = filterStacksByProvider(stacks, provider);

  return (
    <main style={{ padding:'1rem' }}>
      <h1>Choose a Stack</h1>
      <div style={{ margin:'0.5rem 0' }}>
        <label>Provider:</label>{' '}
        <select value={provider} onChange={e=>setProvider(e.target.value)}>
          <option value="vercel">Vercel</option>
          <option value="gcp">GCP</option>
        </select>
      </div>
      {err && <p style={{color:'red'}}>{err}</p>}
      <ul>
        {filtered.map(s => (
          <li key={s.id} style={{ margin:'0.5rem 0' }}>
            <strong>{s.displayName}</strong>{' '}
            <small>({s.id})</small>{' '}
            {s.requiresDocker ? <em>requires Docker</em> : <em>no Docker</em>}
          </li>
        ))}
      </ul>
    </main>
  );
}
