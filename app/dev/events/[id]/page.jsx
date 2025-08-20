
'use client';
import React, { useEffect, useState } from 'react';
import { EventClient } from '../../../lib/EventClient.js';

export default function Page({ params }){
  const [items, setItems] = useState([]);
  useEffect(() => {
    const ec = new EventClient('', params.id);
    const off = ec.on(e => setItems(prev => [...prev, e].slice(-200)));
    ec.start();
    return () => { off(); ec.stop(); };
  }, [params.id]);
  return (
    <main style={{ padding: 24 }}>
      <h1>Events for job: {params.id}</h1>
      <pre style={{ background:'#111', color:'#eee', padding:16, borderRadius:8, maxHeight:600, overflow:'auto' }}>
        {items.map(i => JSON.stringify(i)).join('\n')}
      </pre>
    </main>
  );
}
