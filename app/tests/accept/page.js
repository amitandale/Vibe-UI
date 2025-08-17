// app/tests/accept/page.js
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AcceptPageInner() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const status = params.get('status') || '';
  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Acceptance</h1>
      <p className="text-sm opacity-80">This page reads query params on the client.</p>
      <div className="text-sm">
        <div><span className="opacity-60">token:</span> {token || '(none)'}</div>
        <div><span className="opacity-60">status:</span> {status || '(none)'}</div>
      </div>
    </div>
  );
}

export default function AcceptPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <AcceptPageInner />
    </Suspense>
  );
}
