import React from 'react';
import PlanPanel from './PlanPanel';

export const metadata = {
  title: 'Plan → Implement',
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Plan → Implement</h1>
      <p className="text-sm text-gray-600">
        Save plan items for this project, then create an AI PR per item.
      </p>
      <PlanPanel projectId={params.id} />
    </div>
  );
}
