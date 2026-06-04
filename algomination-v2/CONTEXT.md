# Algomination v2 — Project Context & Build Log

A living record of **what** was built and **how**, so anyone can pick this up cold.
For the original plan see [`REBUILD_GUIDE.md`](./REBUILD_GUIDE.md); for shipping see
[`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 1. What this is

A ground-up rewrite of the original **Algomination** (an algorithm-visualization
website). The original lives in the parent folder (`../Algomination`, `../flowwithalgo`,
`../backend`) and was **never modified** — v2 is a clean, separate build under
`algomination-v2/`.

The original was a Django-template monolith: server-rendered HTML + jQuery/anime.js/
skrollr, algorithm logic computed in Python views, animations driven by fragile
hardcoded `setTimeout` chains, **plaintext passwords**, and lots of dead commented code.

v2 fixes all of that with a decoupled API + SPA and a proper client-side animation engine.

## 2. Tech stack

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
  Framer Motion · react-hook-form + zod · sonner (toasts) · anime.js v3 (hero only)
- **Backend:** Django 5.1 · Django REST Framework · djangorestframework-simplejwt ·
  django-cors-headers · whitenoise · gunicorn · dj-database-url · psycopg
- **DB:** SQLite (dev) → Postgres (prod via `DATABASE_URL`)

## 3. Decisions (and why)

| Decision | Why |
|----------|-----|
| Next.js App Router (not Vite SPA) | SSR/SEO for the marketing pages + file routing |
| **Client-side step engine** | Algorithms emit frames; a player animates them. Robust, scrubbable, no server round-trips. The single most important design choice. |
| Decoupled frontend/backend | Each deploys free & independently (Vercel + Render) |
| JWT auth + custom email user | Replaces the original's plaintext `Client` model |
| anime.js v3 for the hero only | Faithfully reproduce the original landing animation; everything else uses Framer Motion |
| Registry-driven visualizers | One source of truth; adding an algorithm is ~1 generator + 1 registry entry |

## 4. Repo layout

```
algomination-v2/
├── CONTEXT.md  REBUILD_GUIDE.md  DEPLOYMENT.md  README.md
├── backend/                      # Django + DRF
│   ├── config/                   # settings, urls, wsgi/asgi
│   ├── accounts/                 # custom email User, JWT auth
│   ├── community/                # Opinion / Project / ContactMessage
│   ├── Procfile  build.sh  render.yaml  requirements.txt
│   └── venv/                     # local virtualenv (gitignored)
└── frontend/
    ├── app/                      # routes (App Router)
    │   ├── page.tsx              # landing (hero + sections)
    │   ├── sorting/[slug]/       # bubble, selection, insertion, merge, quick
    │   ├── searching/[slug]/     # linear, binary
    │   ├── data-structures/[slug]/  # stack, queue
    │   ├── about/  contact/  login/
    │   ├── layout.tsx  template.tsx  loading.tsx  not-found.tsx
    │   └── globals.css           # theme tokens + hero CSS
    ├── components/
    │   ├── ui/                   # Button, Card, Input, Textarea, Badge, Container
    │   ├── viz/                  # the engine UI (see §5)
    │   ├── auth/                 # AuthProvider, AuthForms
    │   ├── contact/ContactForms.tsx
    │   ├── Navbar  Footer  Reveal  StaggerHero  CategoryHub  PagePlaceholder
    ├── lib/
    │   ├── engine/               # types.ts, useStepPlayer.ts, highlight.ts
    │   ├── algorithms/           # one file per algorithm + registry.ts
    │   └── api/                  # client.ts, auth.ts, community.ts, config.ts, types.ts
    └── scripts/                  # throwaway tsx verification scripts
```

## 5. The step engine (the heart of it)

Everything visual flows from a few pieces in `lib/engine/`:

- **`types.ts`** — a `Step` is one animation frame:
  ```ts
  interface Step {
    items: { id: number; value: number }[];      // current order (stable ids!)
    highlights: Record<number, HighlightKind>;    // position → colour role
    pointers?: Record<string, number>;            // label → position (i, low, mid…)
    caption: string;
  }
  ```
  `makeItems()` assigns each value a **stable id** so Framer Motion `layout` animates
  reordering by identity (bars slide past each other instead of snapping).
- **`useStepPlayer.ts`** — drives playback: play/pause/next/prev/reset/seek + 0.5×–4×
  speed; auto-resets when a new step list arrives.
- **`highlight.ts`** — `HIGHLIGHT_FILL` (colour per kind) + `HIGHLIGHT_LABEL` (legend text).

UI in `components/viz/`:
- **`ArrayBars.tsx`** — renders the current step's bars (height = value, colour =
  highlight, pointer labels above). Keyed by `item.id` + `layout` for movement.
- **`VisualizerShell.tsx`** — input box + validation, Random, play controls, scrub bar,
  speed toggle, live caption, **auto-adapting legend** (shows only the highlight kinds a
  given algorithm actually uses). Supports an optional **target field** + `requiresSorted`
  note for search algorithms.
- **`AlgorithmVisualizer.tsx`** — client bridge: looks up a generator from the registry
  by `{category, slug}` and renders the shell (keeps non-serializable functions on the
  client side; server pages only pass strings).
- **`DataStructureVisualizer.tsx`** — DS are interactive (operations build on live
  state), so they use dedicated components (`StackVisualizer`, `QueueVisualizer`)
  with `AnimatePresence`, not the step player.

## 6. How to add a new visualizer (the recipe)

**A sorting/searching algorithm:**
1. Write a pure generator `lib/algorithms/<name>.ts`: `(values, target?) => Step[]`.
2. Add one entry to `lib/algorithms/registry.ts` (`status: "live"`, `generate`, blurb,
   complexity, `defaultInput`; for search add `needsTarget`/`requiresSorted`).
3. Done — the hub card, the `/[category]/[slug]` route, SSG, and the player all pick it
   up automatically. Add it to `scripts/verify-sorts.ts` and run the test.

**A data structure:** build a `<Thing>Visualizer.tsx` (interactive), add a registry
entry (`category: "data-structures"`, `status: "live"`), and one `case` in
`DataStructureVisualizer.tsx`.

## 7. Backend shape

- **`accounts`** — custom `User` (email is the login field, `AUTH_USER_MODEL`), hashed
  passwords via Django validators. Endpoints: `POST /api/auth/register/` (returns user +
  JWT), `/login/`, `/refresh/`, `GET /api/auth/me/`.
- **`community`** — `Opinion`, `Project`, `ContactMessage` (all timestamped). Public
  create endpoints: `POST /api/community/{feedback,projects,contact}/`. All in admin.
- **`config/settings.py`** — env-driven (`python-dotenv`); DRF + simplejwt + CORS;
  `DATABASE_URL` switch; whitenoise; security headers auto-enable when `DEBUG=False`;
  in DEBUG, CORS allows **any localhost port**.

The frontend talks to it through `lib/api/client.ts` (`apiFetch`, `tokenStore` in
localStorage, `ApiError` with DRF field errors, **auto token-refresh on 401**).

## 8. Gotchas hit & how they were solved

These cost real time — worth remembering:

- **Two `backend` folders.** `../Algomination/backend` (old, abandoned) vs
  `algomination-v2/backend` (this one). Running the wrong one → `/api/auth/*` 404s.
  Always `cd` into the `algomination-v2` path; health returns `service:
  "algomination-v2-api"`.
- **Orphaned dev servers on Windows.** Killing a *bash* background `npm`/`manage.py`
  leaves the child process alive holding the port; the next server fails to bind and a
  stale one keeps serving. Clean up by querying `Win32_Process` for the command line and
  `Stop-Process`. In a real terminal, Ctrl+C is fine.
- **lucide-react removed brand icons** (`Github`, `Linkedin`) in this version → inlined
  SVGs in `Footer.tsx`. Core icons (Menu, Play, etc.) are fine.
- **Next.js 16: route `params` is a `Promise`** — `const { slug } = await params;`.
- **zod v4** — use top-level `z.email()` / `z.url()`, not the deprecated
  `z.string().email()`.
- **CORS + port 3000 taken.** The user's machine runs another app on :3000, so Next
  falls back (3001/3010/…). Dev CORS now allows any localhost port; run the frontend with
  `npm run dev -- -p 3010` for a fixed port.
- **Merge sort transient duplicates.** Naively overwriting `items[k]` during a merge left
  the source slot occupied, so a mid-merge frame showed a duplicate value. Fixed by
  computing the merged order then realizing it via **swaps**, keeping every frame a valid
  permutation. Caught by the permutation-invariant unit test.

## 9. Verification strategy

No formal test runner yet; correctness is checked with throwaway `tsx` scripts in
`frontend/scripts/` plus build + runtime curls:
- `verify-sorts.ts` — 500 random arrays × 5 sorts; asserts sorted output **and** every
  frame is a permutation of the input.
- `verify-search.ts` — 1000 cases × 2 searches; found-at-correct-value / not-found.
- `verify-api.ts` — drives the real API client against a running backend (submits, auth,
  error parsing).
Run: `npx tsx scripts/<file>.ts` (backend up for `verify-api`).
**Possible next step:** promote these into Vitest + CI.

## 10. Running locally

Backend (terminal 1):
```
cd algomination-v2/backend
.\venv\Scripts\activate
python manage.py runserver           # http://127.0.0.1:8000
```
Frontend (terminal 2):
```
cd algomination-v2/frontend
npm run dev -- -p 3010               # http://localhost:3010
```
Admin: `python manage.py createsuperuser`, then `/admin/`.

## 11. Current status

**All 10 phases (0–9) complete + stretch visualizers.** Catalog:

| Category | Visualizers |
|----------|-------------|
| Sorting | Bubble, Selection, Insertion, Merge, Quick |
| Searching | Linear, Binary |
| Data Structures | Stack, Queue |

Plus: landing (original anime.js hero reproduced), About, Contact (3 forms → API),
JWT auth (login/register/logout, session restore), deploy-ready (Vercel + Render).

Credits: **Omang Rawat** & **Rahul Soni**. Contact: `algominationalgorithms@gmail.com`.

## 12. Possible next steps

- Linked List / Binary Tree / pathfinding (Dijkstra, A*) visualizers
- Vitest + CI for the generator tests
- An OG share image; per-visualizer metadata
- Actually deploy (see `DEPLOYMENT.md`)

---

*Build log: implemented phase by phase (0 scaffolding → 9 polish/deploy), each phase
ending in a runnable, verified state before moving on.*
