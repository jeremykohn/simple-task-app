<!--
This file guides AI coding agents (Copilot/assistant) to be immediately productive
in this repository. It is intentionally concise and focused on discoverable facts
and checks the agent should perform before making code changes.
-->

# Copilot / AI Agent Instructions — simple-task-app

- **Repo snapshot:** minimal repository — only a `.gitignore` file present.

- **Primary goal:** make small, well-scoped changes. If the repo lacks build
  or test files, prefer non-destructive edits (README, small feature files,
  or add a clear README/manifest before major work).

## Quick startup checklist (automated by agent)
- Look for language/runtime manifests in this order: `package.json`, `pyproject.toml`,
  `requirements.txt`, `Pipfile`, `go.mod`, `Cargo.toml`, `Gemfile`.
- If `package.json` exists: run `npm ci` then `npm test` (or `npm run test`).
- If Python manifests exist: create a venv and run `pytest` if tests are present.
- If `Dockerfile` or `docker-compose.yml` exist, prefer local container runs for
  debugging when dependencies are complex.

## What to look for (project-specific heuristics)
- If you see `src/` + `index.html` or `src/index.(js|tsx)`, treat repo as frontend.
  Use `npm start` / `vite` / `react-scripts` if referenced in `package.json` scripts.
- If you see `server/` or `api/` files with `express`, `fastify`, `flask`:
  inspect `scripts.start` and `Procfile` to understand the run command.
- If there is a `db/` or SQL migration folder, look for a `migrations` tool
  (e.g., `knex`, `alembic`) and avoid schema-breaking edits without tests.

## Editing & PR guidance (how the agent should make changes)
- Keep diffs minimal and self-contained. Add or update `README.md` when adding
  major runtime or script changes so humans can reproduce your steps.
- When creating new runtime files, also add a minimal `package.json`/`requirements.txt`
  entry if it enables local testing (only when necessary and documented in the PR).
- If you add tests, place them under `__tests__`, `tests/`, or adjacent to modules
  following existing project patterns.

## Examples from this repository (current state)
- Found: `.gitignore` at repository root. No `README.md`, `package.json`, or `src/`.
  -> Before implementing features, create or update `README.md` describing how to
     run and test locally.

## Merge strategy and human handoff
- If you cannot run tests because the project lacks a manifest, open a draft PR
  that includes: `README.md` with required steps, the minimal manifest (if added),
  and the code change. Ask a human to run the first full test step.

## Safety & assumptions
- Do not assume a particular framework unless evidenced by files or `package.json`.
- Avoid destructive changes (schema drops, mass refactors) unless tests and
  CI are present and passing.

## If you need more context
- Look for these files and prefer their guidance (in this order):
  - `README.md`, `CONTRIBUTING.md`, `.github/workflows/*`, `package.json` scripts
  - `Makefile`, `Procfile`, `Dockerfile`, `.nvmrc` / `.node-version`, `pyproject.toml`
- When uncertain, add a small exploratory PR that documents assumptions and
  requests human review rather than pushing large changes.

---
If any part of this file is unclear or you'd like me to include repository-specific
examples (once more files are present), tell me which areas to expand.
