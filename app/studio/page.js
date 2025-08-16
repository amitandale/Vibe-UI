"use client";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_CI_URL;

export default function StudioPage() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [base, setBase] = useState("main");
  const [title, setTitle] = useState("vibe: update");
  const [diff, setDiff] = useState("");
  const [log, setLog] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLog("Submitting...");
    try {
      const res = await fetch(`${API_BASE}/api/bridge/proxy`, {
        method: "POST",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({ mode:"fixed-diff", owner, repo, base, title, diff })
      });
      const data = await res.json();
      if (data.ok) {
        setLog(`PR opened: ${data.prUrl} (#${data.prNumber})`);
      } else {
        setLog(`Error: ${data.error || data.errorCode} - ${data.message || ""}`);
      }
    } catch (e) {
      setLog("Network error: " + e.message);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Studio — Fixed Diff</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="owner" value={owner} onChange={e=>setOwner(e.target.value)} />
          <input className="border p-2 rounded" placeholder="repo" value={repo} onChange={e=>setRepo(e.target.value)} />
          <input className="border p-2 rounded" placeholder="base branch" value={base} onChange={e=>setBase(e.target.value)} />
          <input className="border p-2 rounded" placeholder="PR title" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <textarea className="border p-2 rounded w-full h-64 font-mono" placeholder="paste unified diff here" value={diff} onChange={e=>setDiff(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded">Open PR</button>
      </form>
      <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">{log}</pre>
    </div>
  );
}
