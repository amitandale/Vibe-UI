import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export async function loadModelConfig(){
  const base = path.join(process.cwd(), 'config', 'models.json');
  const override = path.join(process.cwd(), 'config', 'models.override.json');
  const raw = JSON.parse(await readFile(base, 'utf8'));
  if (existsSync(override)){
    try {
      const over = JSON.parse(await readFile(override, 'utf8'));
      // shallow merge
      if (over.providers){
        raw.providers = { ...raw.providers, ...over.providers };
      }
    } catch {}
  }
  return raw;
}
