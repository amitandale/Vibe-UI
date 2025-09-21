export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import crypto from 'node:crypto';

const ORCH_BASE = process.env.ORCH_BASE || 'http://127.0.0.1';
const VIBE_HMAC_SECRET = process.env.VIBE_HMAC_SECRET || '';
const VIBE_KID = process.env.VIBE_KID || 'ui';

function hexHmac(body){
  if (!VIBE_HMAC_SECRET) return '';
  const h = crypto.createHmac('sha256', VIBE_HMAC_SECRET);
  h.update(body || '');
  return h.digest('hex');
}

async function forward(req, path){
  const url = new URL(req.url);
  // Reconstruct target URL: ORCH_BASE + /app/api/... + search
  const target = new URL(path.startsWith('/') ? path : '/' + path, ORCH_BASE);
  target.search = url.search;

  const method = req.method.toUpperCase();
  const init = { method, headers: {} };
  let body = '';

  if (method !== 'GET' && method !== 'HEAD'){
    body = await req.text();
    init.body = body;
  }

  // Copy headers except auth/cookie
  for (const [k, v] of req.headers.entries()){
    if (k === 'authorization' || k === 'cookie') continue;
    init.headers[k] = v;
  }
  init.headers['x-forwarded-for'] = '127.0.0.1';
  if (VIBE_HMAC_SECRET){
    init.headers['x-vibe-kid'] = VIBE_KID;
    init.headers['x-signature'] = hexHmac(body);
  }
  init.headers['content-type'] = init.headers['content-type'] || 'application/json';

  const res = await fetch(target.toString(), init);
  const headers = new Headers();
  for (const [k, v] of res.headers.entries()) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}

export async function GET(req, { params }){
  const path = (params?.path || []).join('/');
  return forward(req, path);
}
export async function POST(req, { params }){
  const path = (params?.path || []).join('/');
  return forward(req, path);
}
export async function PUT(req, { params }){
  const path = (params?.path || []).join('/');
  return forward(req, path);
}
export async function DELETE(req, { params }){
  const path = (params?.path || []).join('/');
  return forward(req, path);
}
