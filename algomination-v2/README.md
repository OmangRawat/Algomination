# Algomination v2

A ground-up rebuild of Algomination — an interactive platform for learning algorithms
and data structures through smooth visualizations. Created by **Omang Rawat** and
**Rahul Soni**.

- **Backend:** Django 5 + Django REST Framework + JWT auth
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion
- **Visualizations:** client-side step engine (algorithms emit frames; a player animates them)

See [`REBUILD_GUIDE.md`](./REBUILD_GUIDE.md) for the full plan and phased roadmap,
[`CONTEXT.md`](./CONTEXT.md) for the build log + architecture + gotchas, and
[`DEPLOYMENT.md`](./DEPLOYMENT.md) to ship it.

> The original project lives in the parent folder and is left untouched — this is a
> separate, clean rebuild.

## Getting started

> All commands assume you start from the **`algomination-v2/`** folder
> (not the legacy `Algomination/frontend` or root). On Windows:
> `cd "C:\Users\omang\OneDrive\Documents\GitHub\Algomination\algomination-v2"`

### Backend (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows;  source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
copy .env.example .env          # cp on macOS/Linux
python manage.py migrate
python manage.py runserver      # http://127.0.0.1:8000
```

Health check: <http://127.0.0.1:8000/api/health/>

### Frontend (Next.js)

```bash
cd frontend
npm install
copy .env.example .env.local    # cp on macOS/Linux
npm run dev -- -p 3010          # http://localhost:3010
```

Run both servers and open <http://localhost:3010>; the home page shows an
**API online** badge when it can reach the backend.

## Project layout

```
algomination-v2/
├── REBUILD_GUIDE.md   # the plan
├── backend/           # Django + DRF API
└── frontend/          # Next.js app
```

## Status

- [x] **Phase 0** — scaffolding
- [x] **Phase 1** — design system & app shell
- [x] **Phase 2** — step engine + Bubble sort
- [x] **Phase 3** — Selection + Insertion sort
- [x] **Phase 4** — Linear + Binary search
- [x] **Phase 5** — Stack data structure
- [x] **Phase 6** — landing / about / contact pages
- [x] **Phase 7** — Django API + JWT auth
- [x] **Phase 8** — frontend ↔ backend wiring
- [x] **Phase 9** — polish & deploy-ready

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) to ship it on free tiers.
```
