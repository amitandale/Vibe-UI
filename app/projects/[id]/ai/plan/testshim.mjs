import { buildComposeUrl } from '../../../../../lib/ai/prPanel.mjs';

export function ssrPlanHtml() {
  return `
    <div>
      <form><textarea></textarea><button type="submit">Save Plan</button></form>
      <ul id="plan-list"></ul>
      <button id="create-pr">Create PR</button>
      <div id="last-run"></div>
    </div>
  `.trim();
}

export function buildCompose(agentBase) {
  return buildComposeUrl(agentBase);
}
