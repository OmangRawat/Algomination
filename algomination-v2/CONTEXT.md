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
    │   ├── sorting/[slug]/       # bubble, selection, insertion, merge, quick, heap
    │   ├── searching/[slug]/     # linear, binary
    │   ├── data-structures/[slug]/  # stack, queue, linked-list, doubly-linked-list,
    │   │                         #   bst, avl-tree, hash-table, priority-queue, trie,
    │   │                         #   graph-traversal, union-find
    │   ├── about/  contact/  login/
    │   ├── sitemap.ts  robots.ts # SEO
    │   ├── layout.tsx  template.tsx  loading.tsx  not-found.tsx
    │   └── globals.css           # theme tokens + hero CSS + slim scrollbar + reduced-motion
    ├── components/
    │   ├── ui/                   # Button, Card, Input, Textarea, Badge, Container
    │   ├── viz/                  # the engine UI + every visualizer (see §5)
    │   ├── nav/                  # SideNav (slide-in drawer tree) + NavDropdown (header mega-menu)
    │   ├── auth/                 # AuthProvider, AuthForms
    │   ├── contact/ContactForms.tsx
    │   ├── Navbar  Footer  Reveal  StaggerHero  CategoryHub  PagePlaceholder
    ├── lib/
    │   ├── engine/               # types.ts, useFramePlayer.ts, useStepPlayer.ts, highlight.ts
    │   ├── algorithms/           # one file per sort/search + registry.ts + __tests__/
    │   ├── nav.ts                # NAV_TREE (Algorithms ▸ Sorting/Searching), built from registry
    │   └── api/                  # client.ts, auth.ts, community.ts, config.ts, types.ts
    └── vitest.config.ts          # `npm test` → fuzz tests for the pure generators
```

Note: interactive data-structure logic (AVL rotations, heap sift, union-find, trie,
merge/heap-sort frames) currently lives **inside** the respective `viz/*Visualizer.tsx`
components, not in `lib/`. Only the sort/search **Step generators** are in `lib/algorithms/`.

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
- **`useFramePlayer.ts`** — the generic playback engine: drives playback over an array of
  frames of **any** shape (play/pause/next/prev/reset/seek + 0.25×–4× speed; auto-resets
  when a new frame list arrives). Used by the array sorts, the graph traversal, and the
  tree traversals so they all share identical controls.
- **`useStepPlayer.ts`** — thin wrapper over `useFramePlayer` that exposes the frame as
  `step` (kept for the array visualizer's call sites).
- **`highlight.ts`** — `HIGHLIGHT_FILL` (colour per kind) + `HIGHLIGHT_LABEL` (legend text).
  Kinds: compare/swap/sorted/active/min/pivot/found/range.

UI in `components/viz/`:
- **`PlayerControls.tsx`** — the shared transport (seek bar, reset/step/play-pause, step
  counter, **0.25×/0.5×/1×/2×/4×** speed). Takes any `useFramePlayer` and is reused
  everywhere an animation plays.
- **`ArrayBars.tsx`** — renders a step's bars (height = value, colour = highlight, pointer
  labels above). Keyed by `item.id` + `layout` for movement. Used by the standard sorts.
- **`VisualizerShell.tsx`** — input + validation, Random, `<PlayerControls>`, live caption,
  **auto-adapting legend** (only the highlight kinds the algorithm uses). Optional **target
  field** + `requiresSorted` note for search.
- **`AlgorithmVisualizer.tsx`** — client bridge: looks up a generator by `{category, slug}`
  and renders the shell. **Special-cases** `sorting/merge` and `sorting/heap` to bespoke
  renderers (see below); everything else uses the bar shell.
- **Structure-aware sort renderers** — bars hide the structure of a couple of algorithms,
  so these two get custom views that still use `useFramePlayer` + `PlayerControls`:
  - `MergeSortVisualizer.tsx` — the **recursion tree**: divide into sub-array boxes level
    by level, then merge each parent back sorted, cell by cell (cap 8 elements).
  - `HeapSortVisualizer.tsx` — renders the array as the **binary heap tree** (reuses the
    `heapSort` generator's steps) with the sorted tail dropping into a row below.
- **`DataStructureVisualizer.tsx`** — bridge for DS; each slug maps to its own interactive
  component. DS use live state + `AnimatePresence` and run their own timed animations
  (timers with cleanup), except the **graph + tree traversals**, which build frames and
  use `useFramePlayer` (so they get play/pause/scrub). Components:
  Stack, Queue, LinkedList (singly+doubly via `doubly` prop), Tree (BST, with BFS/DFS
  traversals + explanation panel), AVL (rotations + balance factors), HashTable (chaining),
  Heap (priority queue, min/max + array backing), Trie, Graph (BFS/DFS, clickable start),
  UnionFind (forest, path compression).

## 6. How to add a new visualizer (the recipe)

**A sorting/searching algorithm:**
1. Write a pure generator `lib/algorithms/<name>.ts`: `(values, target?) => Step[]`.
2. Add one entry to `lib/algorithms/registry.ts` (`status: "live"`, `generate`, blurb,
   complexity, `defaultInput`; for search add `needsTarget`/`requiresSorted`).
3. Done — the hub card, the `/[category]/[slug]` route, SSG, the side-nav tree, the header
   dropdown, the sitemap, and the player all pick it up automatically. Add it to the
   `SORTS` map in `lib/algorithms/__tests__/algorithms.test.ts` and run `npm test`.

**A data structure (or DS algorithm):** build a `<Thing>Visualizer.tsx` (interactive),
add a registry entry (`category: "data-structures"`, `status: "live"`), and one `case` in
`DataStructureVisualizer.tsx`. Reuse `useFramePlayer` + `PlayerControls` if you want
play/pause/scrub; otherwise drive timed steps with a `timers` ref (clear on unmount + each
new op). For a tree-shaped DS, copy the in-order column `layout()` from `TreeVisualizer`.

Everything is **registry-driven**, so a new entry flows into the hub, nav drawer, header
mega-menu, sitemap, and SEO text with no extra plumbing. `lib/nav.ts` builds `NAV_TREE`
(Algorithms ▸ Sorting/Searching + Data Structures) straight from the registry.

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
- **OneDrive locks `.next` → `EPERM unlink … .segments` on build.** The repo lives under
  OneDrive, which syncs/locks files in `.next`. A build can fail mid-write. Fix:
  `rm -rf .next` then rebuild. Stray dev servers also hold these files (see below).
- **Port 3010 + other apps on this machine.** The user runs a separate app (**Tapwise**)
  with its own `next dev` processes — **do not kill those**. When freeing port 3010, match
  on the `Algomination` path in the process command line before `Stop-Process`. Frontend
  dev port is **3010** (`npm run dev -- -p 3010`); :3000 is usually taken.
- **React splits `{a} ({b})` in SSR HTML.** Text like `Level-order (BFS)` renders as
  separate text nodes with comment markers between them, so a grep for the full contiguous
  string fails on the served HTML even though it renders. Grep for a fragment instead.
- **Client-only content isn't in the initial HTML.** Panels rendered on interaction (e.g.
  the traversal explanation, the transport controls that appear only after a run) live in
  the JS bundle, not the SSR HTML — that's expected, not a bug.

## 9. Verification strategy

**`npm test`** (Vitest, ~1.5s) runs the fuzz suite for the pure Step generators in
`lib/algorithms/__tests__/algorithms.test.ts`:
- all 6 sorts × 800 random arrays — asserts the final frame is sorted **and** every frame
  is a permutation of the input, plus sorted/reverse edge cases;
- linear + binary search × 1000 cases each — found-at-correct-value / correctly-absent.

This replaces the old throwaway `tsx` scripts for the generators — run `npm test` instead
of writing ad-hoc fuzz scripts (much cheaper). The **component-embedded** logic (AVL
balance, heap property, union-find, merge/heap-sort frames) was each fuzz-verified once via
inline `node -e` checks; extracting those cores into `lib/` so Vitest can cover them is a
worthwhile follow-up. UI itself is checked with `npm run build` (typecheck + SSG) plus a
quick dev-server `curl` smoke test (`200` + expected content + no `⨯`/`error:` in logs).

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

**Core rebuild complete + a large visualizer catalog.** All registry-driven:

| Category | Visualizers |
|----------|-------------|
| Sorting | Bubble, Selection, Insertion, **Merge** (recursion-tree view), Quick (pivot + i/j pointers + active sub-array), **Heap** (binary-heap-tree view) |
| Searching | Linear, Binary |
| Array Techniques | Kadane (max subarray, negatives → `ArrayBars` zero-baseline branch), Two-Pointer Pair Sum (`needsTarget`+`requiresSorted`), Sliding Window Max-Sum (`target`=window size K, `targetLabel`), Dutch National Flag (3-way partition, median pivot), **Trapping Rain Water** (custom water-level canvas), **Next Greater Element** (custom monotonic-stack canvas) |
| Data Structures | Stack, Queue, Linked List, Doubly Linked List, BST (+ BFS/DFS traversals), AVL Tree (rotations), Hash Table (chaining), Priority Queue / Heap (min+max), Trie, Graph (BFS & DFS), Union-Find |

**Array Techniques wiring:** new `Category` value `"array"`, routes `app/array/{page,[slug]/page}.tsx`,
client bridge `components/viz/ArrayAlgorithmVisualizer.tsx` (Tier-1 → shared `VisualizerShell`;
Trapping/Next-Greater → bespoke components). Tier-1 generators are pure `(values, target?) => Step[]`
in `lib/algorithms/{kadane,two-pointer-pair-sum,sliding-window,dutch-flag}.ts`; the two custom ones
(`rain.ts`, `next-greater.ts`) export their own frame types + drive `useFramePlayer`. Fuzz-tested in
`__tests__/array-algorithms.test.ts` (6 suites × 1500 cases vs brute force). `VisualizerShell` gained
`targetLabel` + `allowNegative` props.

Navigation: a **slide-in side drawer** (`components/nav/SideNav.tsx`) with a collapsible
tree — *Algorithms ▸ Sorting / Searching / Array Techniques*, *Data Structures* — plus icons, a
section header, and active highlighting; and **header mega-menu dropdowns** (`NavDropdown.tsx`).
"Algorithms" is a presentational umbrella only — URLs stay flat (`/sorting`, `/searching`,
`/array`, `/data-structures`) so the SEO/canonical/sitemap work is untouched.

Polish: slim themed scrollbars + `prefers-reduced-motion` (globals.css), staggered drawer
rows + cascading category cards, 0.25×–4× playback speeds, per-page SEO metadata +
canonical + sitemap/robots.

Plus: landing (original anime.js hero reproduced), About, Contact (3 forms → API),
JWT auth (login/register/logout, session restore), deployed (Vercel + Render).

Credits: **Omang Rawat** & **Rahul Soni**. Contact: `algominationalgorithms@gmail.com`.

> **Working convention:** all changes are made on the `master` branch and left
> **uncommitted** — the user commits/pushes manually ("Don't push anything. I'll do it").

## 12. Possible next steps

- **Graph-algorithms track**: Dijkstra (shortest path), Kruskal/Prim (MST — reuses
  Union-Find), topological sort. Reuses the graph visualizer.
- Extract the component-embedded pure logic (AVL/heap/union-find/merge frames) into `lib/`
  so Vitest covers them too; add CI.
- An OG share image; per-visualizer metadata polish.

---

*Build log: implemented phase by phase (0 scaffolding → 9 polish/deploy), each phase
ending in a runnable, verified state before moving on.*
