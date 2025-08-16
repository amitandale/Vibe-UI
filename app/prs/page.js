"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_CI_URL;

export default function PRsPage() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [items, setItems] = useState([]);
  const [log, setLog] = useState("");

  async function load() {
    setLog("Loading...");
    try {
      const res = await fetch(`${API_BASE}/api/github/prs?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
      const data = await res.json();
      if (data.ok) {
        setItems(data.prs);
        setLog("");
      } else {
        setLog("Error: " + (data.error || "unknown"));
      }
    } catch (e) {
      setLog("Network error: " + e.message);
    }
  }

  useEffect(()=>{ if(owner && repo) load(); }, [owner, repo]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Pull Requests</h1>
      <div className="grid grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="owner" value={owner} onChange={e=>setOwner(e.target.value)} />
        <input className="border p-2 rounded" placeholder="repo" value={repo} onChange={e=>setRepo(e.target.value)} />
      </div>
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
                  <span className="font-mono">{c.name}</span>: <span>{c.conclusion || c.status}</span> {c.url && <a className="underline" href={c.url} target="_blank">view</a>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
