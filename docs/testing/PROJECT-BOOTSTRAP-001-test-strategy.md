# PROJECT-BOOTSTRAP-001 — Test Strategy: Project Foundation Bootstrap (Phase 0)

**Agent:** Test Engineer  
**Role:** Test Engineer  
**Task:** PROJECT-BOOTSTRAP-001 — Project Foundation Bootstrap  
**Artifact:** Test Strategy  
**Status:** PROPOSED (awaiting final human acceptance of the ADR)  
**Production Code Impact:** None (planning artifact only)

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

- Testcontainers PostgreSQL container starts once per JVM test run (shared container strategy).
- Flyway runs baseline/version migrations without errors.
- A simple repository or JDBC query can read from the database.

**Tools:**

- Spring Boot Test
- Testcontainers (PostgreSQL module)
- Awaitility (for async container readiness if needed)

**Container reuse strategy:**

- Use a single shared PostgreSQL container for the entire JVM test run (e.g., via a `@TestConfiguration` or a base test class with a static `@DynamicPropertySource`).
- Each test class should use `@Transactional` + `@Rollback` to isolate test data, rather than starting a new container.

### 2.3 Architectural Tests with ArchUnit

**Scope:** Enforce the minimum acceptable package-by-service boundary rules.

**Scenarios:**

- Repository classes in one domain package (e.g., `com.flashsale.ticket`) are not accessed from another domain package (e.g., `com.flashsale.order`).
- Cross-package service and DTO access are permitted initially.

**Tools:**

- ArchUnit (test scope)

**Note:** ArchUnit rules are intentionally lenient in the foundation. Strict service-boundary rules will be added in Phase 2.

### 2.4 Frontend Unit / Component Tests

**Scope:** Prove the frontend test harness works and the landing page renders.

**Scenarios:**

- Landing page component renders without errors.
- A utility function behaves as expected.

**Tools:**

- Vitest (recommended) or Jest
- React Testing Library
- MSW (Mock Service Worker) if needed to mock the health endpoint

### 2.5 Smoke Test — FE Calls BE Health Endpoint

**Scope:** Verify end-to-end local connectivity.

**Scenarios:**

- With both dev servers running, the browser page at `http://localhost:5173` displays the backend health status.
- If the backend is stopped, the page displays an "unavailable" state.

**Execution:**

- Manual for PROJECT-BOOTSTRAP-001.
- Can be automated later with Playwright or Cypress once the foundation is accepted.

---

## 3. Verification Criteria

| Criterion | How Verified |
|---|---|
| Backend builds | `./gradlew build` completes without errors. |
| Backend starts | `GET /actuator/health` returns HTTP 200 `{"status":"UP"}`. |
| Frontend builds | `npm run build` completes without errors. |
| Frontend dev server starts | `npm run dev` serves the landing page on the configured port. |
| PostgreSQL reachable | Testcontainers integration test connects and Flyway runs. |
| FE → BE connectivity | Landing page shows backend health status. |
| Boundary rules | ArchUnit test passes with lenient rules. |
| Request ID in logs | A backend log line for an HTTP request contains the request id. |

---

## 4. Test Data Strategy

- No business test data is needed for the foundation.
- Testcontainers uses a shared PostgreSQL container per JVM run; test data is isolated via `@Transactional` + `@Rollback`.
- If a JDBC smoke query is written, use a trivial table or rely on `flyway_schema_history` to prove the database is reachable.

---

## 5. Tools and Environment

### Backend

- JUnit 5
- Spring Boot Test
- AssertJ
- Testcontainers PostgreSQL
- Awaitility
- ArchUnit (test scope, lenient initial rules)

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
| Testcontainers startup is slow on developer machines | Reuse containers across tests; keep the foundation test suite small. |
| Frontend build tool choice changes | Keep test configuration minimal so it is easy to migrate between Vite/Jest/Vitest. |
| Local PostgreSQL setup differs across developers | Document environment variables clearly; use Testcontainers for tests so no shared DB is required. |
| Port conflicts on 8080/5173 | Make ports configurable via environment variables and document how to change them. |
| ArchUnit rules too strict for Phase 1 experimentation | Keep initial rules lenient; only prohibit cross-package repository access. |

---

## 7. Updates Based on Final Technical Decisions

The following updates were made to this test strategy after the human developer resolved the Human Technical Decision Gate:

1. **ArchUnit:** Added as a test-scoped dependency with **lenient** initial rules. The first ArchUnit test should only prohibit cross-package repository access. Cross-package service/DTO reads are allowed.
2. **Testcontainers reuse:** Clarified that a single shared PostgreSQL container per JVM should be used, with `@Transactional` + `@Rollback` for test data isolation.
3. **HikariCP:** No explicit pool tuning is required; tests run against Spring Boot defaults. Future performance benchmarks should measure pool behavior before tuning.
4. **Lombok:** Not present in the foundation. DTOs should use Java records; entities should use explicit constructors.
5. **Request ID / MDC:** Added a verification criterion that backend logs include the request id for HTTP requests. No frontend interceptor tests are required.
6. **Frontend API wrapper:** Deferred; no API-client wrapper tests are required in the foundation.

---

## 8. Traceability

- Source Requirement: `docs/requirements/features/PROJECT-BOOTSTRAP-001-product-requirement.md`
- Source Architecture: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-architecture-proposal.md`
- ADR: `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`
- Task: `tasks/backlog/PROJECT-BOOTSTRAP-001.md`
- SPEC.md §35 — Testing Strategy.
- SPEC.md §37 — Phase 1 scope.
