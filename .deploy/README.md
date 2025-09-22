# Studio deploy

- Runs on self-hosted runner on VPS.
- Uses systemd `vibe-studio` unit.
- Build-time env: `.env.production.local` created in workflow.
- Runtime env: `/etc/vibe/studio.env` written from GitHub Environment secrets/vars.
- Stop → rsync → start. Leaves service running for manual checks.
