import { loadModelConfig } from '@/lib/models';
export async function GET(){
  const cfg = await loadModelConfig();
  return Response.json(cfg);
}
