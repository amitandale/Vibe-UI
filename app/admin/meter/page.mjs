'use client';

import React, { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_CI_URL;

export default function MeterAdmin(){
  const [projectId, setProjectId] = useState('');
  const [rows, setRows] = useState([]);
  const [days, setDays] = useState(14);
  const [err, setErr] = useState('');

  async function load(){
    setErr('');
    if (!projectId) return;
    try{
      const url = `${String(API_BASE||'').replace(/\/$/, '')}/app/admin/meter?projectId=${encodeURIComponent(projectId)}&days=${encodeURIComponent(String(days))}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      const items = Array.isArray(j?.rows) ? j.rows : [];
      setRows(items.map(r => ({ day: String(r.day||''), count: Number(r.count||0) })));
    }catch(e){
      setErr(String(e?.message || 'error'));
    }
  }

  useEffect(() => { /* no auto-load */ }, []);

  const header = React.createElement('div', { className: 'text-xl font-semibold' }, 'Usage Meter');
  const controls = React.createElement(
    'div', { className: 'flex items-center gap-2' },
    React.createElement('input', {
      className: 'border p-2 rounded',
      placeholder: 'projectId',
      value: projectId,
      onChange: e => setProjectId(e.target.value)
    }),
    React.createElement('select', {
      className: 'border p-2 rounded bg-white text-black',
      value: String(days),
      onChange: e => setDays(Number(e.target.value))
    },
      ...[7,14,30,60,90].map(n => React.createElement('option', { key: n, value: String(n) }, `${n} days`))
    ),
    React.createElement('button', {
      className: 'px-3 py-2 border rounded',
      onClick: load,
      disabled: !projectId
    }, 'Load')
  );

  const errorNode = err
    ? React.createElement('div', { className: 'text-sm text-red-600' }, err)
    : null;

  const thead = React.createElement('thead', null,
    React.createElement('tr', null,
      React.createElement('th', { className: 'text-left p-2 border' }, 'Day (UTC)'),
      React.createElement('th', { className: 'text-left p-2 border' }, 'Count')
    )
  );

  const bodyRows = rows.length
    ? rows.map(r => React.createElement('tr', { key: r.day },
        React.createElement('td', { className: 'p-2 border' }, r.day),
        React.createElement('td', { className: 'p-2 border' }, String(r.count))
      ))
    : [React.createElement('tr', { key: 'empty' },
        React.createElement('td', { className: 'p-2 border', colSpan: 2 }, 'No data')
      )];

  const tbody = React.createElement('tbody', null, ...bodyRows);

  const table = React.createElement('table', { className: 'w-full border mt-2 text-sm' }, thead, tbody);

  const footer = React.createElement('p', { className: 'text-xs text-gray-500' },
    'No PII is stored; counts are aggregated per day by project.'
  );

  return React.createElement(
    'div', { className: 'p-6 max-w-3xl mx-auto space-y-4' },
    header,
    controls,
    errorNode,
    table,
    footer
  );
}
