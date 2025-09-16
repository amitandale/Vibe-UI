// app/wizard/byor/page.js
'use client';
import React, { useState } from 'react';
import { ByorResult } from '../../../components/ByorResult.mjs';
import { createByorPR } from '../../../lib/byor.api.mjs';

export default function ByorPage() {
  const [result, setResult] = useState({ prUrl:null, requiredChecks:[] });
  async function onSubmit(e){
    e.preventDefault();
    // demo stub: in real flow, gather from form
    const ciUrl = process.env.NEXT_PUBLIC_CI_URL || '';
    try {
      const r = await createByorPR(ciUrl, { owner:'acme', repo:'demo', provider:'vercel', stackId:'node-basic' });
      setResult(r);
    } catch (err) {
      setResult({ prUrl:null, requiredChecks:[] });
    }
  }
  return React.createElement('main', { style:{padding:'1rem'} },
    React.createElement('h1', null, 'BYOR'),
    React.createElement('button', { onClick:onSubmit }, 'Connect Repo'),
    React.createElement(ByorResult, { prUrl: result.prUrl, requiredChecks: result.requiredChecks })
  );
}
