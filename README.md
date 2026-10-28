# ChopWeti

**Live beta:** https://chopweti-beta.onrender.com

**“Chop weti?”** — the daily question, answered for a Bamenda kitchen.

ChopWeti is a mobile-first product prototype built from the brief: household-aware meal
suggestions, guided Cameroonian recipes, health labels and cautions, verified neighbourhood
vendors, and FCFA shopping lists that let you buy raw or buy the hard part ready-made.

## Run it

```bash
npm install
npm run dev
```

Open **http://127.0.0.1:4173**.

Production build:

```bash
npm run build
npm run preview
```

The app is a Vite + React + TypeScript single-page app using hash routing, so the built
`dist/` folder can be served from any static host without route rewrites.

### Deploy on Render

The beta is deployed as a Render Static Site from
[`nito-jr/chopweti`](https://github.com/nito-jr/chopweti):

- **URL:** https://chopweti-beta.onrender.com
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **Blueprint:** [`render.yaml`](render.yaml)

Pushing to `main` triggers a new deploy. The repository is currently public so Render can
fetch it without a private GitHub connection. Add `chopweti.cmspnw.org` as a custom domain
in Render when the DNS record is ready.

## Open it on a phone on the same Wi-Fi

Both `npm run dev` and `npm run preview` bind to `0.0.0.0`, so they are reachable from the
local network. Find the computer's LAN IPv4 address and open the same port on the phone:

```powershell
Get-NetIPConfiguration |
  Where-Object { $_.IPv4DefaultGateway -ne $null } |
  Select-Object InterfaceAlias, @{n='IPv4';e={$_.IPv4Address.IPAddress}}
```

Then browse to `http://<computer-lan-ip>:4173`.

If the phone cannot connect, Windows Firewall is blocking inbound connections. In an
**Administrator** PowerShell, allow only the local subnet:

```powershell
New-NetFirewallRule -DisplayName "ChopWeti LAN 4173" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4173 `
  -Profile Private,Public -RemoteAddress LocalSubnet
```

Guest Wi-Fi networks often isolate devices from each other; use the same normal network on
both devices.

## What is in the prototype

### Landing experience
- Editorial hero with real Cameroonian food photography
- The problem, the guided-recipe promise, health labels, vendor story, field network and places
- Responsive editorial layouts from 390 px phones to wide desktop

### Household table
- Name, neighbourhood, adults and children — all recipes and costs scale to the table
- Allergies act as absolute filters; dislikes only move dishes down
- Goals (muscle, energy, iron, lighter, family), blood pressure / blood sugar cautions, and spice level
- Pantry items bias recommendations toward what is already at home
- Private to the browser: no account, no email, no backend

### Recipes
Seven Bamenda-area dishes: Achu & Yellow Soup, Ndolé & Plantain, Eru & Water Fufu,
Kati-Kati, Koki & Ripe Plantain, Beans & Dodo, and Poulet DG.
- Household-scaled ingredient quantities
- “Buy raw” vs “buy ready” choice per ingredient, with a verified vendor and price
- Numbered method with practical kitchen tips, doneness cues and per-step time
- Step completion and progress
- Health labels, estimated per-serving nutrition, allergy line, and condition-specific cautions

### Shopping list
- Grouped raw market run and prepared-vendor orders
- FCFA totals that follow servings and raw/ready choices
- Check-off progress, vendor note, copy, print and WhatsApp share
- Vendor verification dates and pickup notes

### Vendors and trust
- 10 verified vendors across nine places
- Vendor detail sheet with the items they prepare in each recipe
- Field-note dates, correspondent / regulator / admin roles, verification anatomy and re-check cadence

### Global beta mode
- “In Bamenda” keeps the full vendor and prepared-ingredient flow
- “Outside Bamenda” hides vendor pickup and prepared items; recipes, scaling and FCFA estimates still work
- Local shopping list remains useful anywhere, with a clear Bamenda-market estimate note

### Feedback and analytics
- In-app beta feedback: rating, what was cooked, what worked or broke, optional email
- Feedback inbox and local event funnel in the admin desk
- Events are written to a local buffer first; when Supabase is configured they are also inserted into `events` and `feedback`
- No marketing pixels or third-party trackers

### Operations and roles
- `/login` was designed as an invite-only email magic-link sign-in
- `/ops` contains role-specific desks for **admin**, **regulator**, **correspondent** and **vendor**
- Responsibilities are separated: a correspondent cannot approve their own report, and a vendor cannot change its own verification date
- A clearly labelled prototype mode is available until a Supabase project is connected
- The real schema, RLS policies and role checks are in [`supabase/schema.sql`](supabase/schema.sql)

## Product film

The finished 60-second launch film is in [`video/`](video/):

- [`chopweti-product-film-1080p.mp4`](video/chopweti-product-film-1080p.mp4) — 1920×1080, 24 fps, stereo
- [`chopweti-cover.jpg`](video/chopweti-cover.jpg) — end-card cover
- [`chopweti-poster.jpg`](video/chopweti-poster.jpg) — mid-film poster
- [`chopweti-film.srt`](video/chopweti-film.srt) — transcript and subtitle track

It was built from the actual running app, with an original soundtrack and a synthetic
English voiceover. See [`video/README.md`](video/README.md) for the scene breakdown.

## Project structure

```
src/
  data.ts                 dishes, ingredients, vendors, neighbourhoods, label metadata
  store.tsx               profile + shopping state, localStorage persistence
  lib/recommend.ts        allergy filtering, scoring, costs, helpers
  components/             brand, headers, cards, pills, toast
  pages/                  landing, setup, today, dishes, recipe, list, vendors, trust, table, credits
  styles.css              full visual system and responsive rules
public/
  images/                 optimised dish, market and vendor photography
  fonts/                  locally hosted Fraunces + Manrope variable fonts
```

## Connecting real auth, feedback and analytics

The front end is ready for Supabase; it currently runs in prototype mode until the
project keys are added.

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Copy `.env.example` to `.env.local` and add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`.
4. Enable email magic links in Supabase Auth.
5. Create your account in Supabase Auth, then insert an admin row in `profiles` using
   the comment at the end of the schema.

Once configured, the prototype-role switcher disappears, `/ops` requires a signed-in
account, feedback and events go to Supabase, and the role checks are enforced by
row-level security rather than the UI.

## Prototype notes

- Households, vendors, prices, field notes and verification dates are illustrative.
- Recipes are written as a credible starting point and should be reviewed by local cooks before publication.
- Allergen filtering is implemented as a hard exclusion. Condition cautions are informational, not medical advice.
- The app does not call a backend. Everything is local browser state, so it works offline after the first load.
- Photography is from Wikimedia Commons under CC0 / CC BY / CC BY-SA licences; see the in-app **Photo credits** page for the full list.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Vite on `127.0.0.1:4173` |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview the production build |
