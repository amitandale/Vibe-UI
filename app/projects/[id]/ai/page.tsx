import React from 'react';
import CreateAiPrPanel from './CreateAiPrPanel';

export const metadata = {
  title: 'Create AI PR',
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create AI PR</h1>
      <p className="text-sm text-gray-600">
        Provide a prompt and optional settings. The Bridge-Agent will generate changes,
        open a PR, and stream live logs below.
      </p>
      {/* Client panel handles form + SSE logs */}
      <CreateAiPrPanel projectId={params.id} />
    </div>
  );
}
