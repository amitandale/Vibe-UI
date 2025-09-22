'use client';
import { useEffect, useState } from 'react';

export default function LlmPage(){
  const [cfg, setCfg] = useState({ providers:{} });
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetch('/app/api/llm/config').then(r=>r.json()).then(setCfg); }, []);
  useEffect(() => {
    const list = cfg.providers?.[provider] || [];
    setModel(list[0] || '');
  }, [cfg, provider]);
  async function onSave(e){
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch('/app/api/llm/credentials', {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ provider, model, apiKey })
    });
    setSaving(false);
    setSaved(res.ok);
    setApiKey(''); // write-only
  }
  const providers = Object.keys(cfg.providers || {});
  const models = cfg.providers?.[provider] || [];
  return (
    <div className="card">
      <h2>LLM Provider</h2>
      <form onSubmit={onSave} className="space-y-3">
        <div>
          <label>Provider</label>
          <select value={provider} onChange={e=>setProvider(e.target.value)}>
            {providers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label>Model</label>
          <select value={model} onChange={e=>setModel(e.target.value)}>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label>API key</label>
          <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Write-only" />
        </div>
        <button disabled={saving} type="submit">{saving ? 'Saving…' : 'Save'}</button>
        {saved && <div className="muted">Saved</div>}
      </form>
    </div>
  );
}
