// tests/stacks.fetch.shape.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchStacks } from '../lib/stacks.api.mjs';

test('fetchStacks returns stacks array', async () => {
  const mockFetch = async (_url, _opts) => {
    const payload = {
      ok: true,
      stacks: [
        {
          id: 'x',
          displayName: 'X',
          providersSupported: ['vercel'],
          ciSkeleton: 'node',
          requiresDocker: false,
          defaultChecks: [],
          scaffoldContract: {
            files: [],
            envRefs: [],
            build: { cmd: '' },
            test:  { cmd: '' },
            deploy: { target: 'vercel' }
          }
        }
      ]
    };
    return {
      ok: true,
      async json(){ return payload; }
    };
  };

  const stacks = await fetchStacks('https://ci.local', mockFetch);
  assert.ok(Array.isArray(stacks));
  assert.equal(stacks[0].id, 'x');
});
