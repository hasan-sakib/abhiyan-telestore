<div align="center">

# 🛒 Abiyan Telestore

**A production-ready, full-stack e-commerce platform for mobile phones & accessories**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)

</div>

---

## 📖 Project Overview

**Abiyan Telestore** is a fully containerized, production-grade e-commerce solution purpose-built for the telecom retail market. It delivers a seamless shopping experience for customers and a powerful management interface for administrators — all backed by a robust, type-safe API layer.

The platform is architected as three independent, decoupled services orchestrated via Docker Compose and deployed through a fully automated GitHub Actions CI/CD pipeline:

| Service | Description |
|---|---|
| **Customer Storefront** | Animated React SPA for browsing products, managing carts, and placing orders |
| **Admin Dashboard** | Dedicated React SPA for inventory, order, and user management |
| **Backend API** | FastAPI service with JWT auth, business logic, and OpenAPI-generated TypeScript types |

### ✨ Key Features

- 🔐 **Dual-token JWT Authentication** — Short-lived access tokens (15 min) with secure refresh tokens (7 days), powered by `python-jose` and `passlib/bcrypt`
- 🖼️ **Cloud Image Management** — Product images stored and served via **Cloudinary** with CDN delivery
- 📧 **Transactional Email** — Order confirmations and notifications via SMTP (Gmail / Resend.com)
- 🔄 **Type-Safe API Client** — TypeScript client auto-generated from FastAPI's OpenAPI spec, eliminating API drift
- ⚡ **Optimistic UI** — TanStack Query handles all server state with caching, background refetching, and optimistic updates
- 🌊 **Rich Animations** — GSAP-powered page transitions and micro-interactions for a premium feel
- 🐳 **Fully Containerized** — Multi-stage Docker builds for lean production images; Nginx reverse proxy per service
- 🚀 **CI/CD Pipeline** — GitHub Actions workflow with automated test → build → push → deploy stages

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│                                                                 │
│  ┌────────────────────────┐   ┌────────────────────────────┐   │
│  │   Customer Storefront  │   │     Admin Dashboard        │   │
│  │  React 18 + Vite       │   │  React 18 + Vite           │   │
│  │  TanStack Query        │   │  TanStack Query            │   │
│  │  Zustand + GSAP        │   │  Zustand                   │   │
│  │  Tailwind + shadcn/ui  │   │  Tailwind + shadcn/ui      │   │
│  │  :5173 (Nginx :80)     │   │  :5174 (Nginx :80)         │   │
│  └────────────┬───────────┘   └────────────┬───────────────┘   │
└───────────────┼─────────────────────────────┼───────────────────┘
                │  HTTP / REST                 │
┌───────────────▼─────────────────────────────▼───────────────────┐
│                      API Layer  (:8000)                         │
│                                                                 │
│              FastAPI + SQLModel + Alembic                       │
│              JWT Auth (python-jose + passlib)                   │
│              Pydantic v2 Schemas                                 │
│              Auto-Generated OpenAPI Spec                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼───────┐  ┌──────▼──────────┐
│ PostgreSQL 16│  │  Cloudinary    │  │   SMTP / Email  │
│  (pgdata vol)│  │  (Image CDN)   │  │  (Gmail/Resend) │
└──────────────┘  └────────────────┘  └─────────────────┘
```

### CI/CD Pipeline

```
Push to main
     │
     ▼
┌─────────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│  Run Tests  │───▶│ Docker Build │───▶│  Push to GHCR │───▶│    Deploy    │
│  pytest +   │    │  Multi-stage │    │  (GitHub      │    │  Render.com  │
│  npm test   │    │  Dockerfiles │    │  Container    │    │  + Vercel    │
└─────────────┘    └──────────────┘    │  Registry)    │    └──────────────┘
                                       └───────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend Framework** | FastAPI 0.115 | Async REST API with auto OpenAPI docs |
| **ORM / Migrations** | SQLModel + Alembic | Type-safe DB models and schema migrations |
| **Database** | PostgreSQL 16 | Primary relational data store |
| **Authentication** | python-jose + passlib | JWT signing/verification + bcrypt hashing |
| **Customer Frontend** | React 18 + TypeScript + Vite | Customer-facing SPA |
| **Admin Frontend** | React 18 + TypeScript + Vite | Admin management SPA |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first styling with accessible components |
| **Animations** | GSAP | Page transitions and micro-interactions |
| **Server State** | TanStack Query | Caching, mutations, and background sync |
| **Client State** | Zustand | Lightweight global state (cart, auth) |
| **Image Storage** | Cloudinary | Cloud image upload, transform, and CDN |
| **Email** | SMTP (Gmail) / Resend.com | Transactional email delivery |
| **Containerization** | Docker + Docker Compose | Multi-service orchestration |
| **Reverse Proxy** | Nginx | Static file serving per frontend service |
| **CI/CD** | GitHub Actions | Automated test, build, and deploy pipeline |

---

## 📁 Project Structure

```
Abiyan Telestore/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/v1/             # Route handlers (thin controllers)
│   │   ├── models/             # SQLModel DB models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic layer
│   │   ├── dependencies/       # FastAPI deps (auth, pagination)
│   │   └── core/               # Security utilities, email, config
│   ├── alembic/                # Database migration scripts
│   └── requirements.txt
│
├── frontend/                   # Customer storefront (React + Vite)
│   └── src/
│       ├── api/                # OpenAPI client + generated types
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-level page components
│       ├── store/              # Zustand stores (cart, auth)
│       └── hooks/              # TanStack Query data hooks
│
├── admin-frontend/             # Admin dashboard (React + Vite)
│   └── src/
│       ├── api/                # OpenAPI client + generated types
│       ├── components/         # Admin UI components
│       ├── pages/              # Admin route pages
│       └── lib/                # API client configuration
│
├── deploy/                     # All deployment artifacts
│   ├── backend.Dockerfile      # Multi-stage Python image
│   ├── frontend.Dockerfile     # Multi-stage Node → Nginx image
│   ├── admin.Dockerfile        # Multi-stage Node → Nginx image
│   ├── docker-compose.yml      # Full-stack orchestration
│   ├── nginx/
│   │   ├── frontend.conf       # Nginx config for customer SPA
│   │   └── admin.conf          # Nginx config for admin SPA
│   └── DEPLOYMENT.md           # Step-by-step cloud deployment guide
│
├── .github/workflows/
│   └── ci-cd.yml               # GitHub Actions pipeline
└── .env.example                # Environment variable reference
```

---

## 🚀 Local Development

### Prerequisites

| Requirement | Version | macOS Install |
|---|---|---|
| Python | 3.12+ | `brew install python@3.12` |
| Node.js | 20+ | `brew install node` |
| PostgreSQL | 16 | `brew install postgresql@16 && brew services start postgresql@16` |

### 1. Clone & Configure

```bash
git clone https://github.com/your-username/abiyan-telestore.git
cd abiyan-telestore

# Copy the root env example — fill in your own values
cp .env.example .env
```

> **Key variables to configure** — see `.env.example` for all options:
> - `SECRET_KEY` / `REFRESH_SECRET_KEY` — generate with `python -c "import secrets; print(secrets.token_hex(32))"`
> - `CLOUDINARY_*` — from your [Cloudinary Console](https://cloudinary.com/console)
> - `MAIL_*` — Gmail account + [App Password](https://myaccount.google.com/apppasswords)

### 2. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp ../.env.example .env

# Create the database
createdb abiyan_telestore

# Run migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload
```

📄 Interactive API docs: **http://localhost:8000/api/docs**

### 3. Customer Frontend

```bash
cd frontend
npm install

cp ../.env.example .env.local  # Set VITE_API_BASE_URL=http://localhost:8000

# Auto-generate TypeScript client from live OpenAPI spec (backend must be running)
npm run generate-api

npm run dev
```

🌐 Storefront: **http://localhost:5173**

### 4. Admin Dashboard

```bash
cd admin-frontend
npm install

cp ../.env.example .env.local  # Set VITE_API_BASE_URL=http://localhost:8000

npm run dev
```

🛠️ Admin Panel: **http://localhost:5174**

### Generate TypeScript API Client

Whenever the backend schema changes, regenerate the typed client:

```bash
# With backend running at localhost:8000
cd frontend && npm run generate-api
cd admin-frontend && npm run generate-api
```

This fetches the live OpenAPI spec and regenerates `src/api/generated/schema.d.ts` for both frontends.

---

## 🐳 Docker (Full Stack)

Run the entire platform — database, backend, both frontends — with a single command:

```bash
# From the repo root
docker compose -f deploy/docker-compose.yml up --build
```

| Service | URL |
|---|---|
| Backend API | http://localhost:8000/api/docs |
| Customer Storefront | http://localhost:5173 |
| Admin Dashboard | http://localhost:5174 |
| PostgreSQL | localhost:5432 |

To stop and clean up:

```bash
docker compose -f deploy/docker-compose.yml down -v
```

---

## 🧪 Testing

```bash
# Backend — pytest with coverage report
cd backend
source .venv/bin/activate
pytest --cov=app --cov-report=term-missing

# Customer frontend
cd frontend
npm run test

# Admin frontend
cd admin-frontend
npm run test
```

---

## ☁️ Deployment

| Service | Platform | Notes |
|---|---|---|
| **Backend API** | [Render.com](https://render.com) | Auto-deploys from `main` branch |
| **PostgreSQL** | [Supabase](https://supabase.com) | Managed Postgres with connection pooling |
| **Customer Frontend** | [Vercel](https://vercel.com) | Edge-optimized static deployment |
| **Admin Dashboard** | [Vercel](https://vercel.com) | Separate project, restricted access |
| **Images** | [Cloudinary](https://cloudinary.com) | Transform + CDN delivery |
| **Email** | [Resend.com](https://resend.com) | Transactional email (production) |

For full step-by-step cloud deployment instructions, see [`deploy/DEPLOYMENT.md`](deploy/DEPLOYMENT.md).

---

## 🔐 Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SECRET_KEY` | JWT access token signing key (32+ chars) | ✅ |
| `REFRESH_SECRET_KEY` | JWT refresh token signing key (32+ chars) | ✅ |
| `ALGORITHM` | JWT algorithm (default: `HS256`) | ✅ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime (default: `15`) | ✅ |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime (default: `7`) | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `MAIL_USERNAME` | SMTP account email address | ✅ |
| `MAIL_PASSWORD` | SMTP app password | ✅ |
| `MAIL_SERVER` | SMTP server (e.g. `smtp.gmail.com`) | ✅ |
| `MAIL_PORT` | SMTP port (default: `587`) | ✅ |
| `FRONTEND_URL` | Allowed CORS origin for frontend | ✅ |
| `VITE_API_BASE_URL` | Backend API base URL for Vite frontends | ✅ |

See [`.env.example`](.env.example) for a complete template.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please ensure all tests pass and new functionality includes appropriate test coverage before submitting a PR.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/your-username">Sakib</a></sub>
</div>
