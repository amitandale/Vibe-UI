# Vibe UI (Studio)

**Role:** The user‑facing studio. Paste diffs to open PRs, manage testers, and follow PR status. Runs on the user’s Vercel.

## v1 Features
- **Studio** `/studio`: paste unified diff → open PR via CI → show PR URL
- **PRs list** `/prs`: read‑only list with status/preview (basic for v1)
- **Testers** `/testers`: create tester (name/email), invite
- **Tester accept** `/tests/accept?token=...` → `/tests`
- **Assigned tests** `/tests`: see runs/cases; pass/fail submit
- **Slack connect** `/integrations/slack` (optional v1)

## Environment
- `NEXT_PUBLIC_CI_URL=https://<your-ci-domain>`

## CI & Tests
- **Unit**: Node’s `node --test` for the API helper
- **UI components**: Jest + Testing Library (deps installed ephemerally in CI)
- **Playwright ready**: `playwright.config.js` + `.github/workflows/ui-e2e.yml` (placeholder)

## v1 PRs (UI)
1. **UI‑01** Studio: paste diff → open PR → show PR URL  
2. **UI‑02** Testers pages: invite/accept/assigned/pass‑fail  
3. **UI‑03** PRs list: basic status + preview link (read‑only)  
4. **UI‑04** Settings polish (Bridge URL input, validation)  
5. **UI‑05** Slack connect page (install URL from CI)

## Usage (dev)
- Set `NEXT_PUBLIC_CI_URL`
- Start dev server; open `/studio`, `/testers`, `/tests`

## Notes
- UI stays **thin**; business logic lives in CI/Bridge.
