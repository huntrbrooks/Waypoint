# Waypoint

**Know Your Way. Know You're Safe.**

Waypoint is a tactical emergency evacuation navigation MVP for enterprise facilities teams, government buildings, hospitals, large retail chains, and security officers. The product combines an employee-facing mobile compass navigator, a facilities manager dashboard, a branded marketing landing page, and a mock API for evacuation events and exit management.

## Monorepo Structure

```text
Waypoint/
├── apps/
│   ├── api/          # Express REST API + WebSocket evacuation broadcasts
│   ├── dashboard/    # React + Vite + Tailwind facilities dashboard
│   ├── landing/      # Static Vite + Tailwind marketing site
│   └── mobile/       # Expo React Native evacuation navigator
├── packages/
│   ├── mock-data/    # Shared seed buildings, exits, and historical events
│   └── types/        # Shared TypeScript interfaces
├── package.json
└── tsconfig.base.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- Expo Go for mobile device testing
- Xcode or Android Studio if running native simulators

## Install

```bash
npm install
```

## Run Locally

Start the mock API first:

```bash
npm run dev:api
```

Run the dashboard:

```bash
npm run dev:dashboard
```

Run the landing page:

```bash
npm run dev:landing
```

Run the mobile app:

```bash
npm run dev:mobile
```

## Environment Variables

Copy the relevant examples before running each app:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/dashboard/.env.example apps/dashboard/.env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/landing/.env.example apps/landing/.env
```

| App | Variable | Default | Purpose |
| --- | --- | --- | --- |
| API | `PORT` | `3001` | Express and WebSocket server port |
| API | `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` | Allowed browser origins |
| API | `SUPABASE_URL` | unset | Supabase project URL |
| API | `SUPABASE_SERVICE_ROLE_KEY` | unset | Server-only Supabase service role key |
| API | `WAYPOINT_DEMO_MODE` | `true` | Allows local demo fallback when Supabase is absent |
| Dashboard | `VITE_API_URL` | `http://localhost:3001` | REST API base URL |
| Dashboard | `VITE_WS_URL` | `ws://localhost:3001/ws` | Evacuation WebSocket URL |
| Dashboard | `VITE_SUPABASE_URL` | unset | Supabase project URL |
| Dashboard | `VITE_SUPABASE_PUBLISHABLE_KEY` | unset | Browser-safe Supabase publishable key |
| Dashboard | `VITE_WAYPOINT_DEMO_MODE` | `true` | Enables demo credentials without Supabase |
| Mobile | `EXPO_PUBLIC_API_URL` | `http://localhost:3001` | REST API base URL |
| Mobile | `EXPO_PUBLIC_SUPABASE_URL` | unset | Supabase project URL |
| Mobile | `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | unset | Mobile-safe Supabase publishable key |
| Mobile | `EXPO_PUBLIC_WAYPOINT_DEMO_MODE` | `true` | Enables demo credentials without Supabase |
| Landing | `VITE_DEMO_REQUEST_URL` | `mailto:sales@waypoint.app` | Demo CTA target |

For physical mobile devices, replace `localhost` with your machine's LAN IP address.

## Dashboard Login

When Supabase is not configured, the dashboard and mobile app use local demo authentication:

```text
Email: admin@waypoint.app
Password: demo1234
```

For a pilot deployment, set `WAYPOINT_DEMO_MODE=false`, configure Supabase environment variables, create Supabase Auth users, and provision matching `profiles`, `memberships`, and `building_assignments` rows.

## Supabase Pilot Schema

The production pilot schema is in:

```text
supabase/migrations/001_waypoint_pilot_schema.sql
supabase/seed/001_waypoint_pilot_seed.sql
```

It includes organizations, profiles, memberships, buildings, building assignments, exits, and evacuation events with RLS enabled on all public tables.

## Manager Workflow: Mark Exits

1. Open the mobile app.
2. Go to `Settings` and select the building.
3. Go to `Mark Exit`.
4. Enter a label and floor.
5. Tap `MARK EXIT HERE`.

The mobile app requests foreground location permission, captures GPS coordinates, and posts them to `POST /buildings/:id/exits`. If the API is unavailable, the exit is saved into local demo state.

## Trigger a Test Evacuation

From mobile:

1. Open `Home`.
2. Tap `EVACUATE NOW`.
3. The app calls `POST /buildings/:id/evacuate` and opens the compass navigator.

From dashboard:

1. Sign in.
2. Open `Building Detail`.
3. Click `Trigger Evacuation`.
4. The dashboard switches to `Evacuation Monitor` and simulates live evacuation counts.

The API broadcasts evacuation changes to connected clients at:

```text
ws://localhost:3001/ws
```

## API Endpoints

```text
GET  /buildings
GET  /buildings/:id/exits
POST /buildings/:id/exits
POST /buildings/:id/evacuate
GET  /events
GET  /events/:id
```

Run the API smoke test against a local or deployed API:

```bash
WAYPOINT_API_URL=http://localhost:3001 WAYPOINT_API_TOKEN=demo-token npm run smoke:api
```

## Core Mobile Navigation Logic

- `useCompass` subscribes to Expo `Magnetometer` readings and returns heading.
- `useCurrentLocation` watches the user's GPS position with `expo-location`.
- `useNearestExit` chooses the closest exit by Haversine distance.
- `useBearing` calculates the bearing from the current position to the target exit and rotates the arrow relative to device heading.
- `useEvacuationState` listens for mock WebSocket evacuation events.

## Deployment Notes

- **Mobile:** Use Expo EAS Build and Submit for iOS/Android once production credentials are ready.
- **Dashboard:** Deploy `apps/dashboard` to Vercel as a Vite app.
- **Landing:** Deploy `apps/landing` to Vercel as a static Vite site.
- **API:** Deploy `apps/api` to Railway or another Node-compatible host with WebSocket support.
- **Production checklist:** See `docs/production-checklist.md`.
- **Pilot inputs:** See `docs/pilot-inputs.md`.

## Production Gaps

This repository is intentionally an MVP scaffold. Before production, add real authentication, tenant isolation, durable database persistence, audited role-based access control, device calibration UX, indoor positioning integrations, emergency services procedures, and security review.
