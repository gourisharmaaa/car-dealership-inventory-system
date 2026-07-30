TEST REPORT

This file describes how to run tests and capture results for inclusion in the deliverable.

1) Backend tests

- Prereqs: Python 3.10+, venv activated, dependencies installed (`pip install -r requirements.txt`).
- Run tests and save output:

```bash
cd backend
pytest -q | tee ../backend-test-output.txt
```

- Attach `backend-test-output.txt` or paste its contents into this repo (for example, in `docs/test-results/backend.txt`).

2) Frontend tests (if configured)

- If you add frontend test runners (Jest / React Testing Library), run them and capture output similarly:

```bash
cd frontend
npm test -- --silent | tee ../frontend-test-output.txt
```

3) Manual verification checklist

- Register and login as admin and customer
- Add a vehicle as admin
- Use restock +/- counters and confirm stock updates
- Open purchase modal as customer, select quantity, confirm purchase and stock decrement

Include screenshots of each successful step under `docs/screenshots/` and reference them in the final report.
