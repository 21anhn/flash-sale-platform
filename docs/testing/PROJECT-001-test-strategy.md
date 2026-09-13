# PROJECT-001 — Test Strategy: Project Bootstrap (Phase 0 → Phase 1 Foundation)

**Status:** PROPOSED  
**Feature ID:** PROJECT-001  
**Phase:** Phase 0 → Phase 1 Foundation  
**Source Requirement:** `docs/requirements/features/PROJECT-001-product-requirement.md`  
**Source Architecture:** `docs/architecture/proposals/PROJECT-001-architecture-proposal.md`  
**Owner:** Test Engineer

---

## 1. Goal

Define the minimum test approach required to prove that the project foundation is buildable, runnable, and ready to support Phase 1 feature development.

The foundation has no business behavior, so the test strategy focuses on:

- Build and startup verification.
- Database connectivity.
- End-to-end FE/BE connectivity smoke test.
- Test harness readiness for future unit, integration, and contract tests.

---

## 2. Test Levels

### 2.1 Backend Unit / Context Tests

**Scope:** Prove the Spring Boot application context loads and core configuration is valid.

**Scenarios:**

- Application context loads successfully with the `test` profile.
- `application-test.yml` activates Testcontainers PostgreSQL.
- Health endpoint is reachable and returns `UP`.

**Tools:**

- JUnit 5
- Spring Boot Test (`@SpringBootTest`)
- AssertJ

### 2.2 Backend Integration Tests with Testcontainers

**Scope:** Verify that the backend can connect to a real PostgreSQL instance in tests.

**Scenarios:**

- Testcontainers PostgreSQL container starts.
- Flyway runs baseline/version migrations without errors.
- A simple repository or JDBC query can read from the database.

**Tools:**

- Spring Boot Test
- Testcontainers (PostgreSQL module)
- Awaitility (for async container readiness if needed)

### 2.3 Frontend Unit / Component Tests

**Scope:** Prove the frontend test harness works and the landing page renders.

**Scenarios:**

- Landing page component renders without errors.
- A utility function or API wrapper behaves as expected.

**Tools:**

- Vitest (recommended) or Jest
- React Testing Library
- MSW (Mock Service Worker) if needed to mock the health endpoint

### 2.4 Smoke Test — FE Calls BE Health Endpoint

**Scope:** Verify end-to-end local connectivity.

**Scenarios:**

- With both dev servers running, the browser page at `http://localhost:5173` displays the backend health status.
- If the backend is stopped, the page displays an "unavailable" state.

**Execution:**

- Manual for PROJECT-001.
- Can be automated later with Playwright or Cypress once the foundation is accepted.

---

## 3. Verification Criteria

| Criterion | How Verified |
|---|---|
| Backend builds | `./gradlew build` or `mvn verify` completes without errors. |
| Backend starts | `GET /actuator/health` returns HTTP 200 `{"status":"UP"}`. |
| Frontend builds | `npm run build` completes without errors. |
| Frontend dev server starts | `npm run dev` serves the landing page on the configured port. |
| PostgreSQL reachable | Testcontainers integration test connects and Flyway runs. |
| FE → BE connectivity | Landing page shows backend health status. |

---

## 4. Test Data Strategy

- No business test data is needed for the foundation.
- Testcontainers uses a disposable database per test class or per JVM run.
- If a JDBC smoke query is written, use a trivial table or rely on `flyway_schema_history` to prove the database is reachable.

---

## 5. Tools and Environment

### Backend

- JUnit 5
- Spring Boot Test
- AssertJ
- Testcontainers PostgreSQL
- Awaitility

### Frontend

- Vitest or Jest
- React Testing Library
- MSW (optional)

### Manual / E2E Smoke

- Browser or `curl`
- Optional future automation: Playwright / Cypress

---

## 6. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Testcontainers startup is slow on developer machines | Reuse containers across tests where possible; keep the foundation test suite small. |
| Frontend build tool choice changes | Keep test configuration minimal so it is easy to migrate between Vite/Jest/Vitest. |
| Local PostgreSQL setup differs across developers | Document environment variables clearly; use Testcontainers for tests so no shared DB is required. |
| Port conflicts on 8080/5173 | Make ports configurable via environment variables and document how to change them. |

---

## 7. Traceability

- Source Requirement: `docs/requirements/features/PROJECT-001-product-requirement.md`
- Source Architecture: `docs/architecture/proposals/PROJECT-001-architecture-proposal.md`
- Task: `tasks/backlog/PROJECT-001.md`
- SPEC.md §35 — Testing Strategy.
- SPEC.md §37 — Phase 1 scope.
