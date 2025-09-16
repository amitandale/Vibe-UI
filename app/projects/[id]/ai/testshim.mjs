import { buildSseUrl, buildComposeUrl } from '../../../../lib/ai/prPanel.mjs';

export function ssrFormHtml() {
  // A minimal SSR string that reflects our field ids and structure.
  return `
    <div>
      <form>
        <textarea id="ai-prompt"></textarea>
        <input id="ai-roster" />
        <input id="ai-ticket" />
        <input id="ai-maxsteps" />
        <button type="submit">Create PR</button>
      </form>
      <div class="logs"></div>
    </div>
  `.trim();
}

export { buildSseUrl, buildComposeUrl };
