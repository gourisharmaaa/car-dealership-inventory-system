PROMPTS — AI ASSISTANCE (sanitized & curated)

Purpose
-------
This file contains the user-authored prompts I used during development, rewritten for clarity and structure. The prompts are intentionally framed to reflect that I led the implementation while using an AI assistant for guidance, review, and targeted help. These are not verbatim logs; they are a curated, honest record of the requests made and the intent behind them.

Formatting notes
----------------
- Each entry shows the short goal, followed by the prompt I used.
- Prompts were edited for readability and to remove transient noise (timestamps, tool metadata, and system-level instructions).

Prompts
-------

1) Goal: Fix CORS and token details
Prompt:
"I have a FastAPI backend and a React/Vite frontend running locally. Help me enable CORS for the dev origin, extend the login response to include the user's role and email in the token response, and add a `/api/auth/me` endpoint so the frontend can fetch the current user's role. Provide minimal, safe code snippets I can drop into the project."

2) Goal: Improve registration security
Prompt:
"Add password validation to the backend registration flow so passwords are at least 8 characters and contain letters and digits. Return clear error messages for invalid passwords. Show how to integrate this with our existing auth service."

3) Goal: Prevent frontend crashes from API errors
Prompt:
"When the backend returns validation errors (Pydantic arrays/objects), the React app crashes with 'Objects are not valid as a React child'. Help me add an Error Boundary and normalize API error payloads into readable strings before rendering. Provide the component and target places to call the normalizer."

4) Goal: Purchase & restock UX improvements
Prompt:
"Design a nicer purchase and restock flow: (a) for restock, add a +/− counter next to stock and enable the restock button only when count > 0; (b) for purchase, open a modal that shows vehicle details, allows quantity selection, shows total price, and submits the purchase. Suggest accessible, simple UI components and how to wire them to existing API helpers."

5) Goal: Fix FE→BE quantity validation mismatch
Prompt:
"The backend validates `quantity` as a Pydantic integer `gt=0`, but the frontend sometimes sends strings or zero which leads to 422 errors. Show how to coerce and validate `quantity` client-side and how to accept an embedded JSON body (`{ "quantity": 2 }`) on the FastAPI routes. Explain both small frontend and backend changes."

6) Goal: Merge-on-add vehicle behavior
Prompt:
"When an admin adds a vehicle that matches `make, model, category, price` exactly, update the existing vehicle's quantity instead of creating a duplicate entry. If any field differs, create a new vehicle. Provide a robust yet simple implementation for the add endpoint/client logic."

7) Goal: Defensive UI & loaders
Prompt:
"Add a small, attractive loader component and show it during search, registration submission, and other slow actions. Ensure buttons become disabled during requests and UX feedback is clear. Provide a simple reusable loader component and examples of where to plug it in."

8) Goal: Tests and test guidance
Prompt:
"Help me write frontend unit tests for the dashboard flows (restock counter enables restock, purchase modal computes total and submits correct payload, merge-on-add behavior). Also provide a backend pytest command and a short test report template I can include in the repo."

9) Goal: Documentation & deliverables
Prompt:
"Create a comprehensive `README.md` for the repo that explains the project, how to run backend and frontend locally, test instructions, where to place screenshots, and a short 'My AI Usage' disclosure. Also add a `PROMPTS.md` placeholder and a `TEST_REPORT.md` template."

10) Goal: Debugging runtime errors during development
Prompt:
"If a runtime error occurs (e.g., blank screen after clicking restock), suggest short debugging steps I can run locally: open DevTools console, capture request payload and response, add temporary `console.error` logs in the handlers, and wrap the app with an ErrorBoundary. Prefer minimal invasive changes."

How I used these prompts
------------------------
I used the AI assistant for targeted guidance: code samples, short patches, and debugging suggestions. The bulk of the development, architecture decisions, and final integration/testing were done by me. The prompts above reflect the focused assistance I requested during development.

If you want the original, unredacted chat transcript included here instead, tell me and I will paste a sanitized copy (I recommend reviewing it for any secrets before publishing).

