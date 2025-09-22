import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as fs from 'node:fs';
import * as parser from '@babel/parser';

function findFiles(root) {
  const out = [];
  const skip = new Set(['node_modules', '.next', 'coverage', 'dist', 'build']);
  const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name.startsWith('.git')) continue;
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!skip.has(ent.name)) stack.push(p);
        continue;
      }
      const ext = path.extname(ent.name);
      if (exts.has(ext)) out.push(p);
    }
  }
  return out;
}

let failed = 0;
const files = findFiles(process.cwd());
for (const f of files) {
  const code = readFileSync(f, 'utf8');
  try {
    parser.parse(code, {
      sourceType: 'module',
      allowReturnOutsideFunction: true,
      plugins: ['jsx','typescript','importMeta','topLevelAwait']
    });
  } catch (e) {
    console.error('\nSyntax error in', f);
    console.error(e.message);
    failed = 1;
  }
}
process.exit(failed);
