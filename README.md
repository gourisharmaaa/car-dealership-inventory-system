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

<img width="329" height="358" alt="image" src="https://github.com/user-attachments/assets/7f2f259a-6de1-458d-a287-7b73b101fbe3" />
<img width="341" height="376" alt="image" src="https://github.com/user-attachments/assets/cd0d3044-30df-431a-b618-8d953a9ddb5d" />
<img width="339" height="392" alt="image" src="https://github.com/user-attachments/assets/667596f8-938f-4209-a385-e9bc068ec305" />
<img width="373" height="350" alt="image" src="https://github.com/user-attachments/assets/2ba3c935-8e64-4104-8d3b-6e794600bc8f" />
<img width="338" height="390" alt="image" src="https://github.com/user-attachments/assets/9e8afec1-7165-4569-b01d-72843f60f578" />
<img width="419" height="350" alt="image" src="https://github.com/user-attachments/assets/cda8c568-45ac-461b-9f9c-abb8ec96c5a9" />
<img width="923" height="435" alt="image" src="https://github.com/user-attachments/assets/2d158cfe-648d-4dbb-90c9-88d74771a276" />
<img width="924" height="476" alt="image" src="https://github.com/user-attachments/assets/e71e83f5-1d52-4a17-a864-d57acc4d4c57" />
<img width="672" height="266" alt="image" src="https://github.com/user-attachments/assets/0c6ad0a9-4010-4920-8562-c009120442c4" />
<img width="680" height="212" alt="image" src="https://github.com/user-attachments/assets/146818d7-9f4b-4d6e-9103-3a6278b598cd" />
<img width="877" height="265" alt="image" src="https://github.com/user-attachments/assets/8b2eb98e-7b70-4063-a588-d2436e14b990" />
<img width="893" height="454" alt="image" src="https://github.com/user-attachments/assets/09a041a1-1ec9-4679-964b-5800aa7222d3" />
<img width="620" height="313" alt="image" src="https://github.com/user-attachments/assets/cb170b1b-259e-444a-9e77-5c323716e9ab" />











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
