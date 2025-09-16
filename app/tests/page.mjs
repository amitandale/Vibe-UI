"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TestsAssigned() {
  const [assignments,setAssignments]=useState([]);
  const [log,setLog]=useState("");

  async function load(){
    try{ const r = await api(`/api/tests/assigned?me=true`); setAssignments(r.items||[]); }
    catch(e){ setLog(e.message); }
  }
  useEffect(()=>{ load(); },[]);

  async function doResult(runId, caseId, status){
    try{
      await api(`/api/tests/results`, { method:"POST", body: JSON.stringify({ runId, caseId, status }) });
      await load();
    }catch(e){ setLog(e.message); }
  }

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">My Assigned Tests</h1>
      {assignments.length===0 && <div>No tests assigned.</div>}
      {assignments.map(a => (
        <div key={a.runId} className="border rounded p-3 space-y-2">
          <div className="font-semibold">PR #{a.prNumber} — {a.planName}</div>
          {a.cases.map(c=>(
            <div key={c.id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-medium">{c.title} {c.required && <span className="text-xs text-red-600">*required</span>}</div>
                {c.links?.map((l,i)=>(<a key={i} className="text-blue-600 underline text-sm mr-2" href={l} target="_blank">link {i+1}</a>))}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>doResult(a.runId, c.id, "pass")} className="px-3 py-1 bg-green-600 text-white rounded">Pass</button>
                <button onClick={()=>doResult(a.runId, c.id, "fail")} className="px-3 py-1 bg-red-600 text-white rounded">Fail</button>
              </div>
            </div>
          ))}
        </div>
      ))}
      {log && <div className="text-sm text-gray-600">{log}</div>}
    </div>
  );
}
