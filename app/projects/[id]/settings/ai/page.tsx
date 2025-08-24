import React from 'react';
import SettingsAiPanel from './SettingsAiPanel';

export const metadata = {
  title: 'AI Settings',
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AI Settings</h1>
      <p className="text-sm text-gray-600">Verify Claude readiness for this project.</p>
      <SettingsAiPanel projectId={params.id} />
    </div>
  );
}
