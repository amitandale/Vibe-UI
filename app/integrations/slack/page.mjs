'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function SlackConnectPage() {
  const [link, setLink] = useState(null);
  const [log, setLog] = useState('');

  async function getInstallUrl() {
    setLog('Requesting Slack install URL...');
    try {
      const { installUrl } = await api(`/api/slack/install`, { method: 'POST', body: JSON.stringify({}) });
      setLink(installUrl);
      setLog('');
    } catch (e) { setLog(e?.message || 'error'); }
  }

  const title = React.createElement('h1', { className: 'text-2xl font-bold' }, 'Connect Slack');
  const desc = React.createElement('p', null, 'Install the Slack app to receive PR/test/deploy updates and run quick actions.');
  const btn  = React.createElement('button', { onClick: getInstallUrl, className: 'bg-black text-white px-4 py-2 rounded' }, 'Get Install Link');
  const linkNode = link
    ? React.createElement('div', { className: 'mt-3' },
        React.createElement('a', { className: 'text-blue-600 underline', href: link, target: '_blank' }, 'Install Vibe Slack App')
      )
    : null;
  const logNode = log
    ? React.createElement('pre', { className: 'bg-gray-100 p-3 rounded text-sm' }, log)
    : null;

  return React.createElement(
    'div', { className: 'p-6 max-w-xl space-y-3' },
    title, desc, btn, linkNode, logNode
  );
}
