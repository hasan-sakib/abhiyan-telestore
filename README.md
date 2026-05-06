# Abiyan Telestore

Production-ready e-commerce platform for mobile phones and accessories.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + SQLModel + PostgreSQL |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | GSAP |
| State | TanStack Query (server) + Zustand (client) |
| Images | Cloudinary |

## Local Development

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 16 (macOS: `brew install postgresql@16 && brew services start postgresql@16`)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Copy and fill in environment variables
cp ../.env.example .env

# Create the database
createdb abiyan_telestore

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload
```

API docs available at: http://localhost:8000/api/docs

### Frontend

```bash
cd frontend
npm install

# Copy and fill in environment variables
cp ../.env.example .env.local

# Generate API types (requires backend running)
npm run generate-api

# Start dev server
npm run dev
```

App available at: http://localhost:5173

### Generate TypeScript API client

With the backend running:

```bash
cd frontend
npm run generate-api
```

This generates `src/api/generated/schema.d.ts` from FastAPI's OpenAPI spec.

## Project Structure

```
Abiyan Telestore/
├── backend/         FastAPI application
│   └── app/
│       ├── models/      SQLModel DB models
│       ├── schemas/     Pydantic request/response schemas
│       ├── api/v1/      Route handlers (thin)
│       ├── services/    Business logic
│       ├── dependencies/  FastAPI deps (auth, pagination)
│       └── core/        Security, email utilities
└── frontend/        React + Vite application
    └── src/
        ├── api/         OpenAPI client + generated types
        ├── components/  UI components
        ├── pages/       Route pages
        ├── store/       Zustand stores
        └── hooks/       TanStack Query hooks
```

## Testing

```bash
# Backend
cd backend
pytest --cov=app --cov-report=term-missing

# Frontend
cd frontend
npm run test
```

## Deployment

| Service | Platform |
|---------|----------|
| Backend API | Render.com |
| PostgreSQL | Supabase |
| Frontend | Vercel |
| Images | Cloudinary |
| Email | Resend.com |
