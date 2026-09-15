# PROJECT-BOOTSTRAP-001 — Architecture Proposal: Project Foundation Bootstrap (Phase 0)

**Agent:** Solution Architect  
**Role:** Solution Architect  
**Task:** PROJECT-BOOTSTRAP-001 — Project Foundation Bootstrap  
**Artifact:** Architecture Proposal  
**Status:** ACCEPTED  
**Production Code Impact:** None (planning artifact only)

---

## 1. Problem

The repository currently contains only specification and instruction documents. Before any business feature can be implemented, the team needs:

1. A runnable Spring Boot backend skeleton.
2. A runnable React/TypeScript frontend skeleton.
3. A local PostgreSQL connection and migration strategy.
4. A local FE/BE connectivity contract (ports, proxy, CORS).
5. A directory and package layout that supports Phase 1 — Modular Monolith and can evolve toward the service boundaries in SPEC.md §36.

The foundation must stay simple and must not introduce Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue, or advanced infrastructure.

---

## 2. Context

- The project is in Phase 0 — Foundation moving into Phase 1 — Modular Monolith.
- SPEC.md §37 defines Phase 1 as: `React → Spring Boot → PostgreSQL`.
- SPEC.md §36 defines the long-term repository structure with `services/`, `frontend/`, `load-tests/`, `infrastructure/`, and `docs/`.
- The human developer has resolved the Human Technical Decision Gate decisions listed in §14.
- Existing downstream planning (e.g., `RESERVATION-001`) assumes a Spring Boot monolith with internal packages/modules aligned to future service names such as `ticket-service`.

---

## 3. Proposed Solution

### 3.1 High-Level Layout

```text
flash-sale-platform/
├── services/
│   └── monolith/                       # Phase 1 deployable
│       ├── build.gradle.kts            # Gradle Kotlin DSL
│       ├── settings.gradle.kts
│       └── src/
│           ├── main/
│           │   ├── java/com/flashsale/
│           │   │   ├── config/        # cross-cutting configuration
│           │   │   ├── user/
│           │   │   ├── event/
│           │   │   ├── ticket/
│           │   │   ├── order/
│           │   │   └── payment/
│           │   └── resources/
│           │       ├── application.yml
│           │       ├── application-local.yml
│           │       ├── application-test.yml
│           │       └── db/migration/  # Flyway migrations
│           └── test/
├── frontend/
│   └── web/
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── api/                   # reserved for first frontend feature
│           ├── components/
│           ├── pages/
│           └── main.tsx
├── load-tests/                        # reserved for k6 scripts (future)
├── infrastructure/
│   └── docker/                        # Docker Compose for PostgreSQL (recommended)
├── docs/
└── tasks/
```

> **Note:** `infrastructure/docker/` and `load-tests/` are listed for alignment with SPEC.md §36. Only the `infrastructure/docker/docker-compose.yml` PostgreSQL service is included as a planning recommendation for PROJECT-BOOTSTRAP-001; no load-test scripts are created.

### 3.2 Backend Module Layout

**Primary recommendation:** a single Spring Boot application (`services/monolith`) with **package-by-service** boundaries inside `com.flashsale`:

- `com.flashsale.config`
- `com.flashsale.user`
- `com.flashsale.event`
- `com.flashsale.ticket`
- `com.flashsale.order`
- `com.flashsale.payment`

Each package will eventually contain its own `controller`, `service`, `repository`, `model`, and `dto` sub-packages. Package-private boundaries and code-review discipline replace physical service boundaries in Phase 1.

**Boundary enforcement:** ArchUnit is included from day one as a test-scoped dependency, but the initial rules are intentionally **lenient**. The first ArchUnit test should only prohibit the most dangerous cross-package dependency: repository classes in one domain package must not be accessed by another domain package. Cross-package service calls and DTO reads are allowed initially. Rules will be tightened in Phase 2 as boundaries solidify.

> **Status:** ACCEPTED by the human developer.

### 3.3 Frontend Project Layout

- **Build tool:** Vite with React plugin and TypeScript.
- **Package manager:** npm.
- **Directory layout:**
  - `src/api/` — reserved for the first frontend feature; no API wrapper is implemented in the foundation.
  - `src/components/` — reusable UI components.
  - `src/pages/` — page-level components.
  - `src/main.tsx` — application entry point.

> **Status:** ACCEPTED by the human developer.

### 3.4 Build Tool and Technology Decisions

| Decision | Accepted Choice | Status |
|---|---|---|
| Backend build tool | Gradle with Kotlin DSL | **ACCEPTED** |
| Spring Boot version | **4.1.1** (latest stable 4.x at implementation time) | **ACCEPTED** |
| Frontend build tool | Vite + React + TypeScript | **ACCEPTED** |
| Frontend package manager | npm | **ACCEPTED** |
| Database migrations | Flyway | **ACCEPTED** |
| Flyway migration naming | Timestamp-based (`V202409141200__...`) | **ACCEPTED** |
| Module boundary enforcement | Package-by-service + lenient ArchUnit rules | **ACCEPTED** |
| Notification package | Defer until needed | **ACCEPTED** |
| Frontend state management | Defer until first feature | **ACCEPTED** |
| Frontend API wrapper | Defer until first feature | **DEFERRED** |
| Local PostgreSQL | Docker Compose recommended; developer-managed PostgreSQL supported | **ACCEPTED** |
| HikariCP | Spring Boot defaults; no explicit tuning without benchmark evidence | **ACCEPTED** |
| Testcontainers | Shared container per JVM | **ACCEPTED** |
| Request ID + MDC | Minimal backend `RequestIdFilter` + MDC log pattern only | **ACCEPTED** |
| Transaction boundary | Application service in domain package that owns the primary entity | **ACCEPTED** |
| CORS | Explicit property gate (`app.cors.enabled=true`) + `local` profile | **ACCEPTED** |
| Gradle Wrapper + Node version locking | Yes | **ACCEPTED** |
| Lombok | Defer; prefer Java records for DTOs and explicit constructors for entities | **ACCEPTED** |
| Environment configuration | `.env.example` + documented `.env` workflow; no secrets committed | **ACCEPTED** |

### 3.5 Pinned Dependency Versions

For reproducibility, the following versions are pinned for the foundation. Patch versions may be bumped to the latest stable release at implementation time; major/minor changes require explicit approval.

#### Backend

| Dependency / Tool | Pinned Version | Where to Pin |
|---|---|---|
| Java | `21` LTS | `build.gradle.kts` toolchain / CI matrix |
| Gradle | `8.10.2` | `gradle/wrapper/gradle-wrapper.properties` |
| Spring Boot | `4.1.1` | `build.gradle.kts` plugin |
| PostgreSQL (Docker image) | `16.4` | `infrastructure/docker/docker-compose.yml` |
| PostgreSQL JDBC driver | Spring Boot BOM managed | `build.gradle.kts` |
| Flyway | Spring Boot BOM managed | `build.gradle.kts` |
| Testcontainers | `1.20.3` | `build.gradle.kts` `testImplementation` |
| ArchUnit | `1.3.0` | `build.gradle.kts` `testImplementation` |
| JUnit / Mockito / AssertJ | Spring Boot BOM managed | `build.gradle.kts` |

#### Frontend

| Dependency / Tool | Pinned Version | Where to Pin |
|---|---|---|
| Node.js | `22.11.0` LTS | `.nvmrc`, `package.json` `engines.node` |
| npm | `10.9.0` | `package.json` `engines.npm` |
| Vite | `5.4.10` | `package.json` `devDependencies` |
| React | `18.3.1` | `package.json` `dependencies` |
| TypeScript | `5.6.3` | `package.json` `devDependencies` |
| Vitest | `2.1.3` | `package.json` `devDependencies` |
| React Testing Library | `16.0.1` | `package.json` `devDependencies` |

> **Note:** Versions are compatible with the accepted stack as of 2026-09-15. Verify latest stable patches at implementation time.

### 3.6 Local Development Architecture

| Component | Default Port | Purpose |
|---|---|---|
| Spring Boot backend | `8080` | API and actuator |
| Vite dev server | `5173` | React frontend |
| PostgreSQL | `5432` | Local development database |

**FE → BE connectivity:**

- Use Vite's dev-server proxy to forward `/api` and `/actuator` to `http://localhost:8080`.
- This avoids CORS issues during local development and keeps the frontend code free of hardcoded backend URLs.
- A minimal Spring CORS configuration is enabled only when `app.cors.enabled=true` is set, which is configured in the `local` profile and restricted to `http://localhost:5173`.

**Database connection:**

- Use Spring profiles: `local` for developer workstations, `test` for Testcontainers-based tests.
- Connection URL, username, and password are read from environment variables (e.g., `DB_URL`, `DB_USER`, `DB_PASSWORD`).
- No credentials in `application.yml` or `application-local.yml`.
- Provide an `.env.example` file (no real values) and document the `.env` workflow in the setup instructions.
- `.env` files must be listed in `.gitignore`.

**Local PostgreSQL setup:**

- Docker Compose is the **recommended** reproducible path (`infrastructure/docker/docker-compose.yml` providing PostgreSQL).
- Developer-managed PostgreSQL is a **supported alternative**. `application-local.yml` should use safe defaults that work for both paths (`jdbc:postgresql://localhost:5432/flashsale`).

### 3.7 Dependencies for Foundation

Backend:

- Spring Boot Web
- Spring Boot Data JPA
- Spring Boot Validation
- Spring Boot Actuator
- PostgreSQL JDBC driver
- Flyway
- Testcontainers (PostgreSQL) — test scope
- ArchUnit — test scope (lenient initial rules)
- Lombok — **not included** (deferred)

Frontend:

- React
- TypeScript
- Vite
- A fetch/HTTP client is **deferred** until the first feature requires it.

Out of scope for foundation:

- Spring Security, Spring Kafka, Spring Cloud Gateway, Resilience4j, Redis, Micrometer, OpenTelemetry.
- These may be added later when their respective phases begin.

---

## 4. Architecture Impact

- Introduces the first deployable artifact in `services/monolith`.
- Establishes package naming that maps to future service names in SPEC.md §36.
- Reserves `frontend/web/` as the single-page React application.
- Leaves `load-tests/` empty but located according to SPEC.md §36.
- Provides an `infrastructure/docker/docker-compose.yml` recommendation for PostgreSQL.

---

## 5. Data Impact

- No business tables are created by PROJECT-BOOTSTRAP-001.
- Flyway will create its own `flyway_schema_history` table once the baseline migration runs.
- The first intentionally created table will be introduced by a downstream feature task (e.g., `RESERVATION-001`).

---

## 6. API Impact

- No business APIs are added.
- The backend exposes Spring Boot Actuator:
  - `GET /actuator/health` — health/readiness probe.
- Optionally, a thin `GET /api/v1/health` wrapper may be added to confirm the `/api/v1` prefix and routing work end-to-end.

---

## 7. Implementation Plan

The human developer should implement the following (no code is provided here):

1. **Backend skeleton**
   - Create `services/monolith/` with Gradle Kotlin DSL.
   - Add the dependency set listed in §3.6.
   - Configure `application.yml`, `application-local.yml`, and `application-test.yml`.
   - Add the package structure under `com.flashsale`.
   - Add a main application class.
   - Verify `GET /actuator/health` returns `UP`.

2. **Frontend skeleton**
   - Create `frontend/web/` with Vite + React + TypeScript.
   - Configure `vite.config.ts` to proxy `/api` and `/actuator` to `localhost:8080`.
   - Add a minimal landing page that fetches `/actuator/health` and displays the status.
   - Verify the page loads on `localhost:5173`.

3. **Database connection**
   - Provide `infrastructure/docker/docker-compose.yml` as the recommended PostgreSQL path.
   - Document developer-managed PostgreSQL as a supported alternative.
   - Configure Flyway in Spring Boot.
   - Add an empty baseline migration if required by Flyway, using **timestamp-based** naming (`V202409141200__...`).
   - Verify the backend starts and connects without errors against either Docker Compose or developer-managed PostgreSQL.

4. **Environment configuration**
   - Add `.env.example` with placeholder environment variables (`DB_URL`, `DB_USER`, `DB_PASSWORD`, etc.).
   - Document the `.env` workflow in setup instructions.
   - Ensure `.env` is in `.gitignore`.

5. **Test harness**
   - Add backend test dependencies (JUnit 5, Mockito, AssertJ, Testcontainers, ArchUnit).
   - Add a Spring context-load test.
   - Add a Testcontainers PostgreSQL connectivity test using a **shared container per JVM**.
   - Add one lenient ArchUnit test that prohibits cross-package repository access.
   - Add frontend test dependencies (Vitest or Jest) and one component/render test.

6. **Minimal observability foundation**
   - Add a minimal backend `RequestIdFilter` (servlet/OncePerRequestFilter) that generates or accepts an `X-Request-Id` header and stores it in MDC.
   - Configure a Logback pattern that includes `%X{request_id}`.
   - Do **not** add frontend interceptors, structured JSON logging, or full observability infrastructure.

---

## 8. Alternatives and Trade-offs

| Decision | Accepted Option | Alternatives |
|---|---|---|
| Backend build tool | Gradle (Kotlin DSL) | Maven, Gradle (Groovy DSL) |
| Module boundary enforcement | Package-by-service + lenient ArchUnit | Gradle submodules now, separate Maven/Gradle projects now |
| FE build tool | Vite | Create React App, Next.js |
| Migration tool | Flyway (timestamp naming) | Liquibase, manual SQL scripts |
| Local DB setup | Docker Compose recommended + dev-managed | Docker Compose only, cloud-hosted dev database |
| HikariCP | Spring Boot defaults | Explicit baseline settings with comments |
| Lombok | Deferred | Add to foundation dependencies |
| Frontend API wrapper | Deferred | Minimal error-handling wrapper now |

**Package-by-service + lenient ArchUnit vs. strict enforcement:**

- *Lenient ArchUnit* adds minimal build friction while protecting the most dangerous boundary violations. It allows experimentation in Phase 1.
- *Strict rules or Gradle submodules* would enforce boundaries now but could slow feature development before domain boundaries are fully understood.

**Docker Compose recommended vs. hard dependency:**

- *Recommended Docker Compose* gives a reproducible path without blocking developers who cannot or prefer not to run Docker.
- *Docker Compose only* would simplify documentation but raise the barrier to entry.

**Spring Boot HikariCP defaults vs. explicit settings:**

- *Defaults* keep the foundation minimal and avoid premature tuning.
- *Explicit settings* document intent but add YAML that the human has decided is unnecessary until measured.

---

## 9. Failure Scenarios and Recovery

| Failure | Behavior | Recovery |
|---|---|---|
| PostgreSQL is not running when backend starts | Spring Boot fails fast with connection exception. | Start PostgreSQL (Docker Compose or local) and restart the application. |
| Wrong DB credentials in environment | Startup fails with authentication error. | Correct environment variables or `.env` and restart. |
| Frontend dev server cannot reach backend | Landing page shows backend unavailable. | Ensure backend is running on the configured port; check Vite proxy config. |
| Flyway migration checksum mismatch | Application refuses to start. | Investigate migration changes; repair or baseline in development only. |
| Flyway introduced against a non-empty database | Flyway refuses to baseline because the schema is not empty. | For local development only, run `flyway baseline` or drop/recreate the database. |
| Port 8080/5173 already in use | Startup fails with `BindException` or Vite error. | Change ports in profile config or stop the conflicting process. |

---

## 10. Testing

- Spring Boot context-load test.
- Testcontainers-based PostgreSQL connection test with a shared container per JVM.
- One lenient ArchUnit boundary test.
- Frontend smoke test that renders the landing page.
- Manual smoke test: browser on `localhost:5173` shows backend health status.

---

## 11. Performance

No performance claims are made for the foundation. The human has decided to rely on Spring Boot defaults for HikariCP. Performance baselines and pool tuning will be established when the first business feature is benchmarked, following SPEC.md §2.2 and AGENTS.md §9.

---

## 12. Security

- CORS is configured only when `app.cors.enabled=true` is set, typically in the `local` profile, and restricted to `http://localhost:5173`.
- Database credentials are read from environment variables; none are committed.
- Provide `.env.example` and document the `.env` workflow.
- Ensure `.env` files are excluded from source control.
- Input validation conventions use Jakarta Bean Validation and frontend form constraints.
- Authentication/authorization is out of scope for the foundation.

---

## 13. Observability

- Spring Boot Actuator provides the `/actuator/health` endpoint.
- A minimal backend `RequestIdFilter` generates or accepts an `X-Request-Id` header and stores it in MDC.
- Logback pattern includes `%X{request_id}`.
- Structured logging, frontend interceptors, distributed tracing, metrics, and alerting are deferred to later phases.

---

## 14. Accepted Foundation Decisions

The following decisions were explicitly approved by the human developer at the Human Technical Decision Gate:

| # | Decision Area | Decision | Status |
|---|---------------|----------|--------|
| 1 | Flyway migration naming | Timestamp-based (`V202409141200__...`) | **ACCEPTED** |
| 2 | ArchUnit | Include from day one with **lenient** initial rules; do not enforce strict service boundaries yet | **ACCEPTED** |
| 3 | Local PostgreSQL | Docker Compose as the **recommended** reproducible path; developer-managed PostgreSQL **supported** | **ACCEPTED** |
| 4 | HikariCP | Use **Spring Boot defaults**; no explicit tuning without benchmark evidence | **ACCEPTED** |
| 5 | Request ID / MDC | Implement only a **minimal backend request-id filter and MDC foundation**; defer frontend interceptor, structured logging, and full observability | **ACCEPTED** |
| 6 | Lombok | **Defer Lombok**; prefer Java records for DTOs and explicit constructors for entities | **ACCEPTED** |
| 7 | Frontend API wrapper | **Defer** until the first frontend feature requires it | **DEFERRED** |
| 8 | Environment configuration | Provide `.env.example` and document the `.env` workflow; do not commit secrets | **ACCEPTED** |

The following earlier decisions remain accepted:

| # | Decision Area | Decision | Status |
|---|---------------|----------|--------|
| 9 | Backend build tool | Gradle Kotlin DSL | **ACCEPTED** |
| 10 | Spring Boot version | **4.1.1** (latest stable 4.x at implementation time) | **ACCEPTED** |
| 11 | Frontend stack | Vite + React + TypeScript | **ACCEPTED** |
| 11 | Frontend package manager | npm | **ACCEPTED** |
| 12 | Database migrations | Flyway | **ACCEPTED** |
| 13 | Module boundaries | Package-by-service | **ACCEPTED** |
| 14 | Notification package | Defer until needed | **ACCEPTED** |
| 15 | Frontend state management | Defer until first feature | **ACCEPTED** |
| 16 | Testcontainers | Shared container per JVM | **ACCEPTED** |
| 17 | Transaction boundary | Application service in domain package that owns the primary entity | **ACCEPTED** |
| 18 | CORS | Explicit property gate + `local` profile | **ACCEPTED** |
| 19 | Gradle Wrapper + Node version locking | Yes | **ACCEPTED** |

### 14.1 Revisions Made to This Proposal to Reflect Accepted Decisions

- **Flyway naming:** Changed from sequential `V1__...` to timestamp-based `V202409141200__...`.
- **ArchUnit:** Rules are intentionally lenient initially; only cross-package repository access is prohibited.
- **Local PostgreSQL:** Docker Compose is recommended, not required; developer-managed PostgreSQL remains supported.
- **HikariCP:** Removed the explicit configuration block; rely on Spring Boot defaults until benchmark evidence justifies tuning.
- **Request ID + MDC:** Reduced scope to a minimal backend filter and Logback MDC pattern only.
- **Lombok:** Removed from the dependency list; prefer Java records and explicit constructors.
- **Frontend API wrapper:** Removed from the foundation; `src/api/` is reserved for the first frontend feature.
- **Environment configuration:** Added `.env.example` and `.env` workflow documentation requirements.

### 14.2 Items Explicitly Deferred

- Frontend API client wrapper.
- Lombok.
- Structured logging, frontend request-id interceptor, distributed tracing, metrics, and alerting.
- Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue.

---

## 15. Acceptance Record

The human developer explicitly accepted this architecture proposal and ADR-003 at the Human Technical Decision Gate.

- **Date:** 2026-09-14
- **Acceptance Statement:** "Human developer explicitly accepts ADR-003 and the PROJECT-BOOTSTRAP-001 architecture as documented."
- **Final Tech Lead Consistency Review:** `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-final-review.md`
- **ADR Reference:** `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`
- **Human Decision Gate:** Cleared.

## 16. Traceability

- Source Requirement: `docs/requirements/features/PROJECT-BOOTSTRAP-001-product-requirement.md`
- Source Business Analysis: `docs/requirements/business/PROJECT-BOOTSTRAP-001-business-analysis.md`
- Task: `tasks/active/PROJECT-BOOTSTRAP-001.md`
- Test Strategy: `docs/testing/PROJECT-BOOTSTRAP-001-test-strategy.md`
- Security Review: `docs/security/PROJECT-BOOTSTRAP-001-security-review.md`
- ADR: `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`
- Tech Lead Final Review: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-final-review.md`
- SPEC.md §36 — Repository Structure.
- SPEC.md §37 — Phase 0 Foundation and Phase 1 Modular Monolith.
