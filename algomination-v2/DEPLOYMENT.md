# Deploying Algomination v2 (free tier)

Frontend and backend deploy separately. Recommended free hosts:

| Piece | Host |
|-------|------|
| Frontend (Next.js) | **Vercel** |
| Backend (Django) | **Render** |
| Database | **Render Postgres** (free) |

---

## 1. Backend → Render

The backend is already production-ready: `gunicorn`, `whitenoise` (static files),
`dj-database-url` (Postgres via `DATABASE_URL`), and security headers that switch
on automatically when `DJANGO_DEBUG=False`.

**Option A — Blueprint (one click):** commit the repo and point Render at
[`backend/render.yaml`](backend/render.yaml). It provisions the web service **and**
a free Postgres database, and wires `DATABASE_URL` automatically. Then set
`CORS_ALLOWED_ORIGINS` to your Vercel URL.

**Option B — Manual web service:**
- **Root directory:** `algomination-v2/backend`
- **Build command:** `./build.sh` (installs deps, `collectstatic`, `migrate`)
- **Start command:** `gunicorn config.wsgi:application`
- **Environment variables:**

  | Key | Value |
  |-----|-------|
  | `DJANGO_DEBUG` | `False` |
  | `DJANGO_SECRET_KEY` | a long random string |
  | `DJANGO_ALLOWED_HOSTS` | `.onrender.com` (or your domain) |
  | `CORS_ALLOWED_ORIGINS` | your Vercel URL, e.g. `https://algomination.vercel.app` |
  | `DATABASE_URL` | from the Render Postgres instance |

Create an admin user once via the Render shell: `python manage.py createsuperuser`.

> **Free-tier note:** the free Render web service sleeps after ~15 min idle and
> cold-starts in ~30s. Fine for a demo; a small paid tier removes it.

## 2. Frontend → Vercel

- **Root directory:** `algomination-v2/frontend`
- Vercel auto-detects Next.js — no build config needed.
- **Environment variables:**

  | Key | Value |
  |-----|-------|
  | `NEXT_PUBLIC_API_URL` | `https://<your-render-app>.onrender.com/api` |
  | `NEXT_PUBLIC_SITE_URL` | your Vercel URL |

Deploy, then go back and set the backend's `CORS_ALLOWED_ORIGINS` to the Vercel URL.

## 3. Checklist

- [ ] Backend up; `/api/health/` returns ok
- [ ] `DATABASE_URL` set (Postgres), migrations ran
- [ ] `CORS_ALLOWED_ORIGINS` = exact Vercel origin (no trailing slash)
- [ ] Frontend `NEXT_PUBLIC_API_URL` points at the backend `/api`
- [ ] Sign-up / login works end to end across the two domains
