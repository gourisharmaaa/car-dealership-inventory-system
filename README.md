 # Car Dealership — Inventory Management (FastAPI + React)

This repository is a small full-stack assessment app implementing a car dealership inventory system. The backend is built with FastAPI (Python), SQLAlchemy and PostgreSQL (via Docker), and the frontend is a React + Vite SPA.

**Status:** Development complete for core features; includes auth (register/login), role-aware UI (admin/customer), vehicle CRUD, purchase & restock flows, and tests.

---

## Project overview

- Backend: FastAPI providing JSON REST endpoints under `/api/*` for authentication and vehicle inventory management. Token-based auth (JWT) with roles (admin, customer).
- Frontend: React + Vite SPA that consumes the backend API. Admins can add/restock/delete vehicles; customers can browse and purchase.
- Tests: pytest-based backend tests in `backend/tests` and a few frontend unit tests in `frontend/src/__tests__`.

---

## Local setup

Prerequisites:

- Git
- Node.js (16+)
- Python 3.10+ (venv recommended)
- Docker & Docker Compose (for the local Postgres DB)

High-level steps (detailed commands below):
1. Start the database via Docker Compose
2. Create and activate a Python virtualenv, install backend deps
3. Run backend (uvicorn)
4. Install frontend deps and run Vite dev server

### Backend (development)

Open a terminal, then:

```bash
# from repository root
cd backend

# create and activate venv (example, Windows PowerShell)
python -m venv .venv
. .venv/Scripts/Activate.ps1

# install dependencies
pip install -r requirements.txt

# start the local Postgres DB with Docker Compose (runs 'db' service defined in docker-compose.yml)
docker-compose up -d db

# run uvicorn (development)
uvicorn app.main:app --reload --reload-dir app --host 0.0.0.0 --port 8000
```

Notes:
- If Docker is not available, you can point `SQLALCHEMY_DATABASE_URL` in `backend/app/core/config.py` to a local Postgres instance.
- Migrations: Alembic is configured under `backend/alembic`. To create/run migrations, use `alembic` from the backend venv.

### Frontend (development)

Open a second terminal and run:

```bash
# from repository root
cd frontend

# install deps
# npm install

# start Vite dev server
npm run dev

# The app will be available at http://localhost:5173
```

Make sure the frontend has the correct API base URL set in `frontend/.env` (for development the repo contains `VITE_API_URL=http://localhost:8000`).

---

## Running tests

Backend tests (pytest):

```bash
# from repository root
cd backend
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
pytest -q
```

Frontend tests (Jest/RTL) — dev dependencies may need to be installed. Example skeleton tests are in `frontend/src/__tests__`.

---

## Screenshots

Place screenshots of your final app under `docs/screenshots/`. Example files (placeholders) are already included.

---

## My AI Usage

This project was built and refined with the assistance of an AI coding assistant. The AI helped with the following tasks:

- Implementing frontend `PurchaseModal` and `Loader` components.
- Fixing FE→BE validation mismatch (sending `{ "quantity": <int> }` vs scalar body) by updating backend routes to accept embedded bodies and normalizing quantities client-side.
- Adding an `ErrorBoundary` and normalizing API error payloads to avoid runtime crashes when rendering validation errors.
- Adding restock +/- counters and modal-based purchase flow.
- Adding README, tests, and other developer ergonomics.

Please see the PROMPTS.md file at the project root for the full AI conversation transcript used during development.

---

## Test report

See `TEST_REPORT.md` for a template and instructions to capture test output.

---

## Publishing to a public Git repository

1. Create a new repository on GitHub (or GitLab).
2. Add the remote and push the code:

```bash
git remote add origin git@github.com:<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

3. On GitHub add a repository description, topics, and a short README (the file in this repo will be used).

Add the final public repo link in deliverables.

---

If you want, I can:
- Create `PROMPTS.md` in the repo (I can add a placeholder where you paste the chat transcript),
- Create `TEST_REPORT.md` with instructions on capturing test outputs and example output,
- Add screenshot placeholders under `docs/screenshots` and give guidance on capturing screenshots,
- Or I can prepare a GitHub release checklist and final commit for you to push.

Which of these would you like me to do now? If you'd like me to create the files, I'll add `PROMPTS.md`, `TEST_REPORT.md`, and `docs/screenshots/.gitkeep` to the repo.
# car-dealership-inventory-system