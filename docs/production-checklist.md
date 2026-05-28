# Pilot Production Checklist

## Database

- Apply `supabase/migrations/001_waypoint_pilot_schema.sql`.
- Apply `supabase/seed/001_waypoint_pilot_seed.sql` or replace it with real pilot building data.
- Create Supabase Auth users for pilot admins and managers.
- Insert matching `profiles`, `memberships`, and `building_assignments` rows.
- Confirm RLS is enabled on every public table.

## API

- Deploy `apps/api` to Railway or Render.
- Set `WAYPOINT_DEMO_MODE=false`.
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Set `CORS_ORIGINS` to the dashboard and landing origins.
- Verify `GET /health` returns `dataMode: "supabase"`.

## Dashboard

- Deploy `apps/dashboard` to Vercel.
- Set `VITE_WAYPOINT_DEMO_MODE=false`.
- Set `VITE_API_URL`, `VITE_WS_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Sign in as a real Supabase Auth user.
- Verify building list, exit creation, evacuation trigger, and monitor updates.

## Landing

- Deploy `apps/landing` to Vercel.
- Point the production domain at the Vercel project.
- Replace demo CTA email if a CRM or lead capture endpoint is added.
- Verify metadata, CTAs, pricing, FAQ toggles, and mobile layout.

## Mobile

- Configure Expo EAS project.
- Set production Expo environment variables.
- Build preview internal releases for iOS and Android.
- Verify location permission, compass behavior, building selector, exit marking, logout, and evacuation flow on physical devices.

## Operational Readiness

- Assign owners for production error alerts and demo requests.
- Review emergency-use disclaimer, privacy policy, and terms before pilot use.
- Run `npm run typecheck` and `npm run build` before every release.
- Run the API smoke test script against the deployed API before inviting pilot users.
