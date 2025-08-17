// app/projects/[id]/page.js
'use client';
import { useEffect, useState } from 'react';

function Row({ label, status }){
  const color = status==='SUCCESS' ? 'text-green-500' : status==='RUNNING' ? 'text-yellow-500' : 'text-gray-400';
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <div className="text-sm">{label}</div>
      <div className="text-xs opacity-60">({status})</div>
    </div>
  );
}

export default function ProjectStatusPage({ params }){
  const { id } = params;
  const [job, setJob] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_CI_URL;
    let es;
    async function boot(){
      try {
        es = new EventSource(`${base}/api/provisioning/${id}/stream`);
        es.onmessage = (evt) => {
          try{
            const data = JSON.parse(evt.data);
            if (data.ok && data.type === 'STATUS') {
              setJob(data.job);
              const labels = {
                VALIDATING_TOKENS:'Validating tokens',
                CREATING_REPO:'Creating repo',
                PUSHING_SKELETON:'Pushing skeleton',
                VERIFYING:'Verifying setup',
              };
              setSteps((data.job.steps||[]).map(s => ({ key:s.key, label:labels[s.key]||s.key, status:s.status })));
            } else if (!data.ok) {
              setError(data.code || 'Stream error');
            }
          }catch(e){}
        };
        es.onerror = () => { /* allow browser retry */ };
      } catch (e) {
        setError(String(e));
      }
    }
    boot();
    return () => { try{ es && es.close(); }catch{} };
  }, [id]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Provisioning</h1>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="space-y-2">
        {steps.map(s => <Row key={s.key} label={s.label} status={s.status} />)}
      </div>
      {job?.state === 'SUCCESS' && (
        <div className="text-green-500">All done! You can close this page.</div>
      )}
    </div>
  );
}
