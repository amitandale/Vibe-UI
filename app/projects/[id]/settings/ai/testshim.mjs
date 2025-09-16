import { buildConfigCheckUrl } from '../../../../../lib/ai/prPanel.mjs';
export function ssrHtml() {
  return `<div><button>Run check</button><div id="res"></div></div>`;
}
export { buildConfigCheckUrl };
