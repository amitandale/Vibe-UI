
# Vibe-UI — Developer Notes

The UI is a **thin shell** over Vibe‑CI: auth, dashboards, Studio (Fixed‑Diff), PR Center, Tester portal, marketplace page.

## EventClient — SSE → Poll Fallback

- Prefer **SSE** when infra supports long connections.
- In serverless environments, fall back to **polling** endpoints for job and project snapshots.
- Helper used in tests: `chooseTransport()` returns `sse` or `poll` based on profile.

## Plan UX States

Global banner + local component gates reflect plan state from `GET {CI}/api/plan/state`:

- `ACTIVE` → actions enabled
- `GRACE`, `PAST_DUE`, `TERMINATED` → actions disabled with remediation link.

No client‑only bypass; server validates on every privileged POST.

## Environment

- `NEXT_PUBLIC_CI_URL` — base URL for CI API
- Optional banner link: `NEXT_PUBLIC_BILLING_URL`

## Local Dev

- `npm install` then `node --test` for utility tests.
- The Studio’s submit button consults plan state, but server remains the source of truth.
