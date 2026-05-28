# Waypoint Pilot Inputs

Use this checklist to collect the production values that must be supplied outside source control.

## Accounts

- Vercel team with access to `apps/dashboard` and `apps/landing` projects.
- Railway or Render workspace for `apps/api`.
- Supabase project with Auth enabled and Postgres migrations applied.
- Expo account with EAS enabled for internal iOS and Android builds.
- DNS access for production domains.

## Domains

- Landing: `waypoint.app`
- Dashboard: `admin.waypoint.app`
- API: `api.waypoint.app`
- WebSocket: `wss://api.waypoint.app/ws`

## Pilot Building Data

For each pilot building, collect:

- Building name and address.
- Organization name and billing contact.
- Floor count and floor labels.
- Employee/user count estimate.
- Exit labels, floor numbers, latitude, and longitude.
- Manager/admin users who can mark exits and trigger evacuations.

## Environment Secrets

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `VITE_API_URL`
- `VITE_WS_URL`
- `EXPO_PUBLIC_API_URL`
- `CORS_ORIGINS`

Never commit service-role keys or production secrets.
