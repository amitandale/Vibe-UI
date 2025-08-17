"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TestersPage() {
  const [testers,setTesters]=useState([]);
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [log,setLog]=useState("");

  async function list(){ try{ const r = await api(`/api/testers`); setTesters(r.items||[]);}catch(e){setLog(e.message);} }
  useEffect(()=>{ list(); },[]);

  async function create(){
    try{
      await api(`/api/testers`, { method:"POST", body: JSON.stringify({ name, email }) });
      setName(""); setEmail(""); await list(); setLog("Invite sent.");
    }catch(e){ setLog(e.message); }
  }

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Testers</h1>
      <div className="flex gap-2">
        <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2 flex-1" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={create} className="bg-black text-white px-4 rounded">Invite</button>
      </div>
      {log && <div className="text-sm text-gray-600">{log}</div>}
      <ul className="divide-y">
        {testers.map(t=> (<li key={t.id} className="py-2 flex justify-between"><span>{t.name} <span className="text-gray-500">&lt;{t.email}&gt;</span></span><span className="text-xs">{t.status}</span></li>))}
      </ul>
    </div>
  );
}
