'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getLlmConfig, setLlmCredentials } from '../../lib/orchestrator.client.mjs';

const DEFAULT_MODELS = {
  perplexity: ['pplx-7b-online','pplx-70b-online','pplx-codellama-34b','pplx-70b-chat'],
  anthropic: ['claude-3-5-sonnet','claude-3-haiku','claude-3-opus','claude-3-5-sonnet-20241022'],
  openai: ['gpt-4o','gpt-4.1','gpt-4o-mini','gpt-4.1-mini','o4-mini'],
  grok: ['grok-2','grok-2-mini','grok-beta']
};

/** Load override JSON from /llm-models.json if available. */
async function loadOverrides(){
  try{
    const res = await fetch('/llm-models.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const j = await res.json().catch(()=>null);
    if (!j || typeof j !== 'object') return null;
    return j;
  }catch{ return null; }
}

function normalizeProvider(p){
  return String(p||'').trim().toLowerCase();
}

export default function LlmSettingsClient(){
  const [provider, setProvider] = useState('perplexity');
  const [model, setModel] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState(''); // write-only input
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [modelsMap, setModelsMap] = useState(DEFAULT_MODELS);

  // Load current config and model overrides
  useEffect(()=>{
    let mounted = true;
    (async () => {
      const ovr = await loadOverrides();
      if (mounted && ovr) setModelsMap(prev => ({ ...prev, ...ovr }));

      try{
        const cfg = await getLlmConfig();
        if (!mounted || !cfg) return;
        if (cfg.provider) setProvider(normalizeProvider(cfg.provider));
        if (cfg.model) setModel(cfg.model);
        if (cfg.baseUrl) setBaseUrl(cfg.baseUrl);
      }catch{ /* ignore for first render */ }
    })();
    return () => { mounted = false; };
  }, []);

  const providers = useMemo(()=>[
    { id:'perplexity', label:'Perplexity' },
    { id:'anthropic', label:'Anthropic' },
    { id:'openai', label:'OpenAI' },
    { id:'grok', label:'Grok' },
  ], []);

  const modelOptions = useMemo(()=>{
    const m = modelsMap[normalizeProvider(provider)] || [];
    return Array.isArray(m) ? m : [];
  }, [provider, modelsMap]);

  async function onSave(e){
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try{
      const payload = { provider: normalizeProvider(provider) };
      if (apiKey) payload.apiKey = apiKey;
      if (model) payload.model = model;
      if (baseUrl) payload.baseUrl = baseUrl;
      await setLlmCredentials(payload);
      // Optimistic apply; do not echo key
      setSaved(true);
      setApiKey('');
    }catch(err){
      setError(String(err?.message||'error'));
    }finally{
      setSaving(false);
      setTimeout(()=>setSaved(false), 2000);
    }
  }

  return (
    <div className="border rounded-xl p-4 bg-white/5">
      <h3 className="font-medium mb-3">LLM Configuration</h3>
      <form className="grid gap-3" onSubmit={onSave}>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm opacity-70">Provider</label>
          <select value={provider} onChange={e=>setProvider(e.target.value)} className="border rounded p-2 bg-white text-black">
            {providers.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>

          <label className="text-sm opacity-70">Model</label>
          <select value={model} onChange={e=>setModel(e.target.value)} className="border rounded p-2 bg-white text-black">
            <option value="" disabled>{modelOptions.length ? 'Select a model' : 'No models'}</option>
            {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <label className="text-sm opacity-70">Base URL (optional)</label>
          <input value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} className="border rounded p-2 bg-white text-black" placeholder="https://api.example.com" />

          <label className="text-sm opacity-70">API Key</label>
          <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} className="border rounded p-2 bg-white text-black" placeholder="••••••••" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-3 py-2 rounded bg-black/80 text-white border">
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-green-700 text-sm">Saved</span>}
          {error && <span className="text-red-700 text-sm">Error: {error}</span>}
        </div>
      </form>
      <p className="text-xs opacity-70 mt-3">Keys are write-only. The UI never displays stored secrets.</p>
    </div>
  );
}
