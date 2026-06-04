# Algomination v2 — Rebuild Guide

A complete, ground-up rewrite of Algomination as a modern **Django REST + Next.js** app with a
robust client-side animation engine. The original code in the parent folder is **never modified** —
this lives entirely under `algomination-v2/`.

---

## 1. Decisions (locked)

| Area | Choice |
|------|--------|
| Frontend | **Next.js 14 (App Router) + TypeScript** |
| Styling | **Tailwind CSS** + CSS variables for theming |
| Animation | **Framer Motion** + a custom **client-side step engine** |
| Backend | **Django 5 + Django REST Framework** |
| Auth | **JWT** (`djangorestframework-simplejwt`), hashed passwords, real Django user |
| DB | SQLite (dev) → Postgres-ready (prod) |
| Viz logic | Algorithms run **in TypeScript**, emit step frames; a player animates them |
| Scope | Full feature parity with original **+ proper auth** |
| Location | `algomination-v2/` (sibling to old code) |

---

## 2. Original app → what we are reproducing

Mapped from the existing Django app so nothing is lost.

### Visualizers
- **Sorting:** Bubble, Selection, Insertion (original capped at 10 elements; we'll keep a sane cap, e.g. 15)
- **Searching:** Linear Search, Binary Search (binary requires sorted input)
- **Data Structures:** Stack (push / pop / peek)
- *(Stretch, beyond original: Queue, Merge/Quick sort — only if time allows; not required for parity)*

### Pages
- **Landing / Home** (original `try4.html` — hero with floating-bubble animation + parallax)
- **Sort Home / Search Home / DS Home** — category hubs listing the visualizers
- **About**
- **Contact** — three forms in original: *Opinion*, *Project submission*, *Contact message*
- **Login / Signup**

### Data models (original, to be redesigned)
- `Client` (name, email, **plaintext password** ❌) → replace with Django `User` + JWT
- `Opinion` (name, email, desc) → keep as `Opinion`
- `Project` (name, algo, git_link, email) → keep as `Project` (community submissions)
- `Cont` (name, email, desc) → rename to `ContactMessage`

### Known problems we are fixing
- Plaintext passwords / custom non-Django auth → **JWT + hashed passwords**
- Algorithm logic computed server-side, animation driven by brittle hardcoded `setTimeout` chains → **deterministic TS step engine + Framer Motion**
- Huge blocks of dead commented-out JS → **clean, typed modules**
- Magic-number positioning, `anime.js`/`skrollr`/jQuery → **Tailwind + Framer Motion**
- No component reuse → **shared component library**

---

## 3. Target architecture

```
algomination-v2/
├── REBUILD_GUIDE.md            ← this file
├── backend/                    # Django + DRF
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/                 # project (settings/urls/asgi/wsgi)
│   ├── accounts/               # custom user, JWT auth, profile
│   └── community/              # Opinion, Project, ContactMessage + API
└── frontend/                   # Next.js App Router
    ├── package.json
    ├── app/                    # routes
    │   ├── (marketing)/        # landing, about, contact
    │   ├── sorting/[algo]/
    │   ├── searching/[algo]/
    │   ├── data-structures/[ds]/
    │   └── (auth)/login, register
    ├── components/
    │   ├── ui/                 # Button, Card, Input, Navbar, Footer…
    │   └── viz/                # VisualizerShell, ArrayBars, controls…
    ├── lib/
    │   ├── algorithms/         # bubble.ts, selection.ts, binary-search.ts… (step generators)
    │   ├── engine/             # step types + player hook (useStepPlayer)
    │   └── api/                # typed fetch client, auth
    └── styles/
```

### The step engine (heart of the rewrite)
Every algorithm is a **pure function** `(input) => Step[]`. A `Step` describes one frame:

```ts
type Step = {
  array: number[];                 // current values
  highlights: Record<number, 'compare'|'swap'|'sorted'|'active'|'found'>;
  pointers?: Record<string, number>; // e.g. { i: 2, j: 5, low: 0, high: 9 }
  caption: string;                 // "Comparing 5 and 3 → swap"
};
```

A `useStepPlayer(steps)` hook gives `play / pause / step / reset / speed / progress`.
The visualizer component renders the *current* step with Framer Motion `layout` animations —
no manual pixel math, no `setTimeout` chains, fully scrubbable.

---

## 4. Build phases (we do these one by one)

Each phase is self-contained and ends in something runnable.

### Phase 0 — Scaffolding ⚙️
- [ ] Create `backend/` Django project (`config`) + `frontend/` Next.js app
- [ ] Tailwind, ESLint/Prettier, base layout, theme tokens
- [ ] `.env.example`, README for v2, dev scripts
- **Done when:** both servers boot, frontend shows a placeholder home, backend serves `/api/health/`

### Phase 1 — Design system & shell 🎨
- [ ] `ui/` components: Button, Card, Input, Badge, Navbar, Footer, Container
- [ ] Global layout, responsive nav, dark theme, page transitions
- **Done when:** navigating between empty routes feels polished

### Phase 2 — Step engine + first sorter 🔧
- [ ] `lib/engine` types + `useStepPlayer`
- [ ] `VisualizerShell` (input box, controls, speed, caption, bar canvas `ArrayBars`)
- [ ] `bubble.ts` step generator + `/sorting/bubble`
- **Done when:** bubble sort animates smoothly, scrubbable, with captions

### Phase 3 — Remaining sorters 📊
- [ ] `selection.ts`, `insertion.ts` + routes, reuse the shell
- [ ] Sort Home hub page
- **Done when:** all three sorters work via shared engine

### Phase 4 — Searching 🔍
- [ ] `linear-search.ts`, `binary-search.ts` (with pointers low/mid/high)
- [ ] Search Home hub; binary enforces sorted input
- **Done when:** both searches animate with found/not-found states

### Phase 5 — Data structures 🧱
- [ ] Stack visualizer (push/pop/peek) with enter/exit animations
- [ ] DS Home hub
- **Done when:** stack operations animate correctly

### Phase 6 — Marketing pages ✨
- [ ] Landing page (modern hero replacing bubble/skrollr), About, Contact (3 forms)
- [ ] Framer Motion scroll/reveal animations
- **Done when:** pages look production-quality and responsive

### Phase 7 — Backend API + auth 🔐
- [ ] Custom user, JWT login/register/refresh, `/api/auth/*`
- [ ] `community` API: Opinion, Project submission, ContactMessage
- [ ] DRF serializers, validation, CORS, admin
- **Done when:** register/login works end-to-end, forms POST to API

### Phase 8 — Wire frontend ↔ backend 🔌
- [ ] Typed API client, auth context, protected routes, toasts
- [ ] Contact/Project/Opinion forms submit to API; login/register UI
- **Done when:** full auth + form flows work against the live backend

### Phase 9 — Polish & ship 🚀
- [ ] Loading/empty/error states, 404, SEO metadata, accessibility pass
- [ ] Dockerfiles / deploy notes (Postgres, gunicorn, `next build`)
- [ ] v2 README + screenshots
- **Done when:** ready to deploy

---

## 5. Tech stack summary

**Backend:** Django 5, DRF, simplejwt, django-cors-headers, python-dotenv, (Postgres via psycopg for prod)
**Frontend:** Next.js 14, React 18, TypeScript, Tailwind, Framer Motion, react-hook-form + zod, axios/fetch, lucide-react, sonner (toasts)

---

## 6. Conventions
- TypeScript strict mode; algorithms are **pure & unit-testable**
- Server state via the API only; no business logic in components
- Commit per phase; each phase independently runnable
- Old code under the parent folder is **read-only reference** — never edited

---

## 7. Deployment (free-tier target)

The frontend and backend are **fully decoupled** (frontend talks to the API only
via `NEXT_PUBLIC_API_URL`), so each can be hosted separately on a free tier.

| Piece | Free host | Notes |
|-------|-----------|-------|
| Frontend (Next.js) | **Vercel** | Native Next.js host, zero-config |
| Backend (Django)   | **Render** free (or Railway / Fly.io) | gunicorn web service |
| Database           | **Neon / Supabase / Render** Postgres free | swap SQLite → Postgres via `DATABASE_URL` |

**To keep deployment painless, we follow these rules from the start:**
1. **All config via env vars** — `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`,
   `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (backend) and
   `NEXT_PUBLIC_API_URL` (frontend). Prod just sets different values. ✅ done in Phase 0.
2. **DB abstraction** — SQLite locally, Postgres in prod via a `DATABASE_URL`
   switch (added in Phase 7).
3. **Static & server** — add `whitenoise` + `gunicorn` + `Procfile`/`render.yaml`
   in Phase 9.

**Known free-tier caveat:** Render's free backend sleeps after ~15 min idle and
takes ~30s to cold-start. Acceptable for a portfolio/demo; a small paid tier removes it.

---

*Progress: all phases (0–9) complete. The app has full feature parity with the
original plus proper auth, and is deploy-ready — see [`DEPLOYMENT.md`](./DEPLOYMENT.md).*
