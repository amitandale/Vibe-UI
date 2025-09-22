'use client';

import React from 'react';
import LlmSettingsClient from './LlmSettingsClient.mjs';

export default function SettingsPage(){
  return (
    <div className="space-y-6">
      <div className="card">
        <h3>Settings</h3>
        <p>Set <code>NEXT_PUBLIC_BRIDGE_URL</code> in Vercel → Project → Settings → Environment Variables.</p>
      </div>
      <LlmSettingsClient />
    </div>
  );
}
