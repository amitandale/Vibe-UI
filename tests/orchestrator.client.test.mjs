// tests/orchestrator.client.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../lib/orchestrator.client.mjs';

test('listBudgets builds correct URL with filters', async () => {
  const calls = [];
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init={}) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ ok:true, budgets:[] }), { status:200, headers:{ 'content-type':'application/json' } });
  };
  try {
    const res = await api.listBudgets({ projectId:'p1', prId:'42' });
    assert.equal(res.ok, true);
    assert.ok(String(calls[0].url).startsWith('/proxy/orch/app/api/billing/budgets?'));
    const u = new URL('http://x' + String(calls[0].url));
    assert.equal(u.searchParams.get('projectId'), 'p1');
    assert.equal(u.searchParams.get('prId'), '42');
  } finally {
    globalThis.fetch = origFetch;
  }
});

test('upsertBudget POSTs JSON body', async () => {
  const calls = [];
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init={}) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ ok:true, budgets:[] }), { status:200, headers:{ 'content-type':'application/json' } });
  };
  try {
    await api.upsertBudget({ scope:'project', scopeId:'p', hardUsd:1, period:'month' });
    const { url, init } = calls[0];
    assert.equal(String(url), '/proxy/orch/app/api/billing/budgets');
    assert.equal(init.method, 'POST');
    assert.equal(init.headers['content-type'], 'application/json');
    assert.ok(typeof init.body === 'string' && init.body.includes('"scope":"project"'));
  } finally {
    globalThis.fetch = origFetch;
  }
});

test('getSummary and getEvents query params shape', async () => {
  const calls = [];
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init={}) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ ok:true, summary:{}, events:[] }), { status:200, headers:{ 'content-type':'application/json' } });
  };
  try {
    await api.getSummary({ projectId:'p', prId:'1', provider:'openai', model:'gpt', estIn:100 });
    await api.getEvents({ prId:'1', limit: 123 });
    const u1 = new URL('http://x' + String(calls[0].url));
    assert.equal(u1.searchParams.get('projectId'), 'p');
    assert.equal(u1.searchParams.get('prId'), '1');
    assert.equal(u1.searchParams.get('provider'), 'openai');
    assert.equal(u1.searchParams.get('model'), 'gpt');
    assert.equal(u1.searchParams.get('estIn'), '100');
    const u2 = new URL('http://x' + String(calls[1].url));
    assert.equal(u2.searchParams.get('prId'), '1');
    assert.equal(u2.searchParams.get('limit'), '123');
  } finally {
    globalThis.fetch = origFetch;
  }
});

test('getPrices hits /prices', async () => {
  let called = '';
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init={}) => {
    called = String(url);
    return new Response(JSON.stringify({ ok:true, prices:[] }), { status:200, headers:{ 'content-type':'application/json' } });
  };
  try {
    await api.getPrices();
    assert.equal(called, '/proxy/orch/app/api/billing/prices');
  } finally {
    globalThis.fetch = origFetch;
  }
});
