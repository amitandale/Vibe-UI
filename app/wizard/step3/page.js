'use client';
import React, { useMemo, useState } from 'react';
import { StackChecksPreview } from '../../../components/StackChecksPreview.mjs';
import { composeRequiredChecks } from '../../../lib/wizard.checks.mjs';
export default function Step3() {
  const [provider] = useState('vercel');
  const [stack] = useState({ id:'node-basic', flags:{ e2e:false } });
  const checks = useMemo(() => composeRequiredChecks({ stack, provider }), [stack, provider]);
  return React.createElement('main', { style:{padding:'1rem'} },
    React.createElement('h1', null, 'Stack & Checks'),
    React.createElement(StackChecksPreview, { checks }),
  );
}
