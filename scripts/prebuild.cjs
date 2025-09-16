// scripts/prebuild.js
// Remove Babel config files that force Next.js into Babel loader and break Vercel build.
const fs = require('fs');
const path = require('path');

const candidates = ['babel.config.cjs', 'babel.config.mjs'];
let removed = 0;

for (const file of candidates) {
  const p = path.join(process.cwd(), file);
  if (fs.existsSync(p)) {
    try {
      fs.rmSync(p);
      console.log(`[prebuild] Removed ${file}`);
      removed++;
    } catch (e) {
      console.log(`[prebuild] Failed to remove ${file}:`, e.message);
    }
  }
}

if (!removed) {
  console.log('[prebuild] No Babel .cjs/.mjs config found; continuing.');
}
