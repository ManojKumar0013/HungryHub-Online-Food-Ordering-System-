# HungryHub — Postgres Backend Setup Guide

This package connects your existing React frontend to a real PostgreSQL
database via a new Express API. It was built directly from your two
project docs (DBMS design + UI design) and tested end-to-end against a
real local Postgres instance before being handed to you.

## What's in this package

```
backend/                      ← NEW. The Express + PostgreSQL API server
  database/
    schema.sql                ← Full DB schema (extends your DBMS doc's tables)
    seed.sql                  ← Seed data matching your team's mockData.ts
  src/
    server.js                 ← Express entrypoint
    db.js                     ← Postgres connection pool
    routes/                   ← auth, restaurants, food-items, orders, users, misc
    utils/mappers.js          ← Converts DB rows → your exact types.ts shapes
    scripts/setupDb.js        ← One-command DB creation + schema + seed
  package.json
  .env.example

frontend-updates/             ← Files to copy into YOUR existing frontend project
  src/api.ts                  ← NEW. Typed fetch client for the backend
  src/App.tsx                 ← UPDATED. Now loads data from the API instead of mockData.ts
  src/components/common/AuthModal.tsx  ← UPDATED. Calls real /api/auth/login + /register
  src/vite-env.d.ts           ← NEW. Just adds Vite env typing for api.ts
  .env.local.example
```

Everything else in your frontend (`components/`, `data/mockData.ts`, `types.ts`,
`utils/`) is untouched — `mockData.ts` is no longer imported by `App.tsx` but
you can leave the file in place or delete it later.

## 1. Install PostgreSQL locally (if you haven't already)

- **Windows:** https://www.postgresql.org/download/windows/
- **macOS:** `brew install postgresql@16 && brew services start postgresql@16`
- **Linux:** `sudo apt install postgresql postgresql-contrib`

Remember the password you set for the `postgres` user during install.

## 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set `PGPASSWORD` (and `PGUSER`/`PGHOST`/`PGPORT` if you changed
Postgres's defaults). Then create and seed the database in one command:

```bash
npm run db:setup
```

This creates the `hungryhub` database, runs `schema.sql`, then `seed.sql`.
You'll see restaurants, menu items, demo users (one per role), and a few
sample orders — all matching your team's original mock data.

Start the API server:

```bash
npm run dev
```

You should see `HungryHub API listening on http://localhost:4000`.
Sanity check it: open http://localhost:4000/api/health in a browser —
you should see `{"status":"ok"}`.

## 3. Wire up the frontend

Copy the files from `frontend-updates/` into your frontend project,
keeping the same folder structure (they'll overwrite `App.tsx` and
`AuthModal.tsx`, and add `api.ts` + `vite-env.d.ts` as new files):

```
frontend-updates/src/api.ts                              → src/api.ts
frontend-updates/src/App.tsx                              → src/App.tsx
frontend-updates/src/components/common/AuthModal.tsx      → src/components/common/AuthModal.tsx
frontend-updates/src/vite-env.d.ts                         → src/vite-env.d.ts
```

If your backend runs anywhere other than `http://localhost:4000`, copy
`.env.local.example` to `.env.local` in your frontend root and set
`VITE_API_URL` accordingly.

Then just run your frontend as usual:

```bash
npm run dev
```

The app auto-signs-in as the demo customer on load (same as your old mock
data did), and everything — restaurants, menu items, cart, checkout,
order tracking, staff/driver/admin dashboards — now reads and writes to
Postgres instead of in-memory arrays.

**Demo login (all portals):** password `demo1234` for every seeded account
(`customer@hungryhub.in`, `staff@pizzeria.in`, `driver@hungryhub.in`,
`admin@hungryhub.in`). The "Instant 1-Click Demo Login" button in each
portal tab logs in with these automatically.

## What actually changed vs. your DBMS design doc

`database/schema.sql` keeps every entity, relationship, and business rule
from your design doc (specialization, weak entities, 1:1 Order–Payment–Delivery,
the status-consistency trigger) and adds a handful of clearly-commented
`-- EXTENSION` columns/tables your UI needs but the doc didn't model —
multiple customer addresses, food variants/toppings, coupons, and reviews.
This is the same kind of refinement your doc already did when it split
`PAYMENT` and `DELIVERY` out of `ORDERS`, so it should be easy to explain
in a viva if asked.

## Known simplifications (worth knowing, not blockers)

- **Cart isn't persisted server-side.** The `CART`/`CART_ITEM` tables exist
  in the schema (per your doc) but the app keeps the in-progress cart in
  React state and only writes to the database at checkout — same as most
  real delivery apps.
- **Reviews added through the UI aren't sent to the API yet** — only the
  seeded ones are read from Postgres. `POST /api/reviews` already exists
  in the backend if you want to wire that up.
- **Auth is intentionally simple** (bcrypt + JWT, no refresh tokens/roles
  middleware) — appropriate for a course project, not production-hardened.

## Testing it yourself

With the backend running, try:

```bash
curl http://localhost:4000/api/restaurants
curl http://localhost:4000/api/food-items
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@hungryhub.in","password":"demo1234"}'
```

If anything returns an error, check `npm run dev` output in the backend
terminal — the API returns errors as JSON with a `detail` field pointing
at the actual Postgres error, which is usually enough to debug from.
