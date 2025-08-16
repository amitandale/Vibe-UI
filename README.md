# Vibe UI (Studio)

Thin Next.js app that lets users submit diffs, view PRs/checks/previews, manage manual tests, and kick off integrations. No secrets are stored here; all mutations go through Vibe CI.

## Environment
- `NEXT_PUBLIC_CI_URL` — Base URL of Vibe CI (our VPS), e.g. `https://ci.example.com`

## Key Pages
- `/studio` — Submit unified diff → CI proxy → Bridge opens PR
- `/prs`    — Read PRs + checks (from CI)
- `/integrations/slack` — Get Slack install URL (from CI)

## Security
- No server-side secrets.
- All requests call Vibe CI over HTTPS; Vibe CI enforces auth/RBAC.

## Local Dev
```
npm install
npm run dev
# set NEXT_PUBLIC_CI_URL in .env.local
```

## Notes
- File uploads (screenshots/videos) should always use signed URLs returned by Vibe CI and go directly to user storage (Blob/S3), never proxied through the UI.
