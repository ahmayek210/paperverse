# Paperverse

Paperverse is a browser drawing sandbox. Draw a creature, place it in an explorable Ocean, and revisit the saved World.

## Scope

- Ocean is the only playable environment.
- Freehand drawing, transparent sprite export, placement, saved creatures, and species-specific motion.
- A World supports up to two authorized members through a single-use invitation.
- Other illustrated map regions are intentionally marked Coming Soon.

## Development

```bash
npm ci
cp .env.example .env.local
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Set only public client values in `.env.local`:

```env
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Never expose a service-role or secret key in the frontend or GitHub Actions variables.

## Data and security

Supabase Auth, PostgreSQL, private Storage, Row Level Security, and Realtime provide persistence. Membership, ownership, and storage path authorization are enforced server-side. Existing non-Ocean records are retained but not exposed as playable areas.

## Deployment

The GitHub Actions workflow builds and deploys the static frontend to GitHub Pages. Configure GitHub Pages variables and the Supabase Auth redirect/site URLs before using the hosted application. The exact live URL is documented only after a successful deployment verification.

## Known limitations

Anonymous sign-in must be enabled in Supabase before two-browser authenticated testing and live collaboration can work. Fullscreen and orientation behavior depend on browser support.
