# PROJECT-001 — Architecture Proposal: Project Bootstrap (Phase 0 → Phase 1 Foundation)

**Status:** PROPOSED  
**Feature ID:** PROJECT-001  
**Phase:** Phase 0 → Phase 1 Foundation  
**Source Requirement:** `docs/requirements/features/PROJECT-001-product-requirement.md`  
**Source Business Analysis:** `docs/requirements/business/PROJECT-001-business-analysis.md`  
**Owner:** Solution Architect

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
- The Human Technical Decision Gate has not yet ruled on build tools, module layout, or local DB setup.
- Existing downstream planning (e.g., `RESERVATION-001`) assumes a Spring Boot monolith with internal modules aligned to future service names such as `ticket-service`.

---

## 3. Proposed Solution

### 3.1 High-Level Layout

```text
flash-sale-platform/
├── services/
│   └── monolith/                       # Phase 1 deployable
│       ├── build.gradle.kts            # or pom.xml
│       ├── settings.gradle.kts
│       └── src/
│           ├── main/
│           │   ├── java/com/flashsale/
│           │   │   ├── config/        # cross-cutting configuration
│           │   │   ├── user/
│           │   │   ├── event/
│           │   │   ├── ticket/
│           │   │   ├── order/
│           │   │   ├── payment/
│           │   │   └── notification/
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
│           ├── api/                   # Axios/fetch wrappers
│           ├── components/
│           ├── pages/
│           └── main.tsx
├── load-tests/                        # reserved for k6 scripts (future)
├── infrastructure/
│   └── docker/                        # future Docker Compose files
├── docs/
└── tasks/
```

> **Note:** `infrastructure/docker/` and `load-tests/` are listed for alignment with SPEC.md §36. No Docker Compose file or load-test script is created as part of PROJECT-001.

### 3.2 Backend Module Layout

**Primary recommendation:** a single Spring Boot application (`services/monolith`) with **package-by-service** boundaries inside `com.flashsale`:

- `com.flashsale.config`
- `com.flashsale.user`
- `com.flashsale.event`
- `com.flashsale.ticket`
- `com.flashsale.order`
- `com.flashsale.payment`
- `com.flashsale.notification`

Each package will eventually contain its own `controller`, `service`, `repository`, `model`, and `dto` sub-packages. Package-private boundaries and code-review discipline replace physical service boundaries in Phase 1.

**Alternative (to be decided by the human / Tech Lead):** introduce Gradle submodules (`:user`, `:event`, `:ticket`, etc.) inside `services/monolith` to enforce compile-time boundaries now. This adds build complexity but makes later extraction easier.

### 3.3 Frontend Project Layout

- **Build tool:** Vite with React plugin and TypeScript.
- **Package manager:** npm (pnpm or yarn are acceptable alternatives).
- **Directory layout:**
  - `src/api/` — HTTP client and backend endpoint wrappers.
  - `src/components/` — reusable UI components.
  - `src/pages/` — page-level components.
  - `src/main.tsx` — application entry point.

### 3.4 Build Tool Recommendations

| Layer | Recommended Tool | Alternatives |
|---|---|---|
| Backend | Gradle (Kotlin DSL) | Maven, Gradle (Groovy DSL) |
| Frontend | Vite + React + TypeScript | Create React App, Next.js |
| Package manager | npm | pnpm, yarn |
| Database migrations | Flyway | Liquibase |

**Rationale for Gradle + Kotlin DSL:**

- Multi-module builds are first-class if the team later wants compile-time module boundaries.
- Dependency declarations are concise.
- Widely supported by Spring Boot tooling.

**Rationale for Vite:**

- Fast dev server and HMR.
- First-class TypeScript support.
- Simple proxy configuration for local backend calls.

**Rationale for Flyway:**

- SQL-based migrations match the team's PostgreSQL-first approach.
- Versioned migration files are easy to review and trace.
- Spring Boot auto-configuration is minimal.

### 3.5 Local Development Architecture

| Component | Default Port | Purpose |
|---|---|---|
| Spring Boot backend | `8080` | API and actuator |
| Vite dev server | `5173` | React frontend |
| PostgreSQL | `5432` | Local development database |

**FE → BE connectivity:**

- Use Vite's dev-server proxy to forward `/api` and `/actuator` to `http://localhost:8080`.
- This avoids CORS issues during local development and keeps the frontend code free of hardcoded backend URLs.
- A minimal Spring CORS configuration is still recommended for `local` profile only, restricted to `http://localhost:5173`.

**Database connection:**

- Use Spring profiles: `local` for developer workstations, `test` for Testcontainers-based tests.
- Connection URL, username, and password are read from environment variables (e.g., `DB_URL`, `DB_USER`, `DB_PASSWORD`).
- No credentials in `application.yml`.

### 3.6 Dependencies for Foundation

Backend:

- Spring Boot Web
- Spring Boot Data JPA
- Spring Boot Validation
- Spring Boot Actuator
- PostgreSQL JDBC driver
- Flyway
- Testcontainers (PostgreSQL) — test scope
- Lombok or Java records (optional, for boilerplate reduction)

Frontend:

- React
- TypeScript
- Vite
- A fetch/HTTP client (no commitment to a specific state-management library yet)

Out of scope for foundation:

- Spring Security, Spring Kafka, Spring Cloud Gateway, Resilience4j, Redis, Micrometer, OpenTelemetry.
- These may be added later when their respective phases begin.

---

## 4. Architecture Impact

- Introduces the first deployable artifact in `services/monolith`.
- Establishes package naming that maps to future service names in SPEC.md §36.
- Reserves `frontend/web/` as the single-page React application.
- Leaves `load-tests/` and `infrastructure/docker/` empty but located according to SPEC.md §36.

---

## 5. Data Impact

- No business tables are created by PROJECT-001.
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
   - Create `services/monolith/` with the chosen build tool.
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
   - Choose local PostgreSQL setup (developer-managed instance or Docker container).
   - Configure Flyway in Spring Boot.
   - Add an empty baseline migration if required by Flyway.
   - Verify the backend starts and connects without errors.

4. **Test harness**
   - Add backend test dependencies (JUnit 5, Mockito, AssertJ, Testcontainers).
   - Add a Spring context-load test.
   - Add a Testcontainers PostgreSQL connectivity test.
   - Add frontend test dependencies (Vitest or Jest) and one component/render test.

---

## 8. Alternatives and Trade-offs

| Decision | Option A (recommended) | Option B | Option C |
|---|---|---|---|
| Backend build tool | Gradle (Kotlin DSL) | Maven | Gradle (Groovy DSL) |
| Module boundary enforcement | Package-by-service in one module | Gradle submodules now | Separate Maven modules now |
| FE build tool | Vite | Create React App | Next.js |
| Migration tool | Flyway | Liquibase | Manual SQL scripts |
| Local DB setup | Docker Compose later + dev env vars | Developer-managed local PostgreSQL | Cloud-hosted dev database |

**Package-by-service vs. Gradle submodules now:**

- *Package-by-service* is simpler to set up and sufficient for Phase 1. Later extraction requires more refactoring.
- *Gradle submodules* enforce compile-time boundaries and make future microservice extraction easier, but add build complexity and slower initial setup.

**Vite vs. CRA:**

- Vite has faster startup and HMR; CRA is more familiar but slower and no longer actively maintained.

**Flyway vs. Liquibase:**

- Flyway is simpler for SQL-first teams; Liquibase offers more change types and rollback support but adds XML/YAML overhead.

---

## 9. Failure Scenarios and Recovery

| Failure | Behavior | Recovery |
|---|---|---|
| PostgreSQL is not running when backend starts | Spring Boot fails fast with connection exception. | Start PostgreSQL and restart the application. |
| Wrong DB credentials in environment | Startup fails with authentication error. | Correct environment variables and restart. |
| Frontend dev server cannot reach backend | Landing page shows backend unavailable. | Ensure backend is running on the configured port; check Vite proxy config. |
| Flyway migration checksum mismatch | Application refuses to start. | Investigate migration changes; repair or baseline in development only. |
| Port 8080/5173 already in use | Startup fails with `BindException` or Vite error. | Change ports in profile config or stop the conflicting process. |

---

## 10. Testing

- Spring Boot context-load test.
- Testcontainers-based PostgreSQL connection test.
- Frontend smoke test that renders the landing page.
- Manual smoke test: browser on `localhost:5173` shows backend health status.

---

## 11. Performance

No performance claims are made for the foundation. Performance baselines will be established when the first business feature is benchmarked.

---

## 12. Security

- CORS is configured only for the `local` profile and restricted to `http://localhost:5173`.
- Database credentials are read from environment variables; none are committed.
- Input validation conventions use Jakarta Bean Validation and frontend form constraints.
- Authentication/authorization is out of scope for the foundation.

---

## 13. Observability

- Spring Boot Actuator provides the `/actuator/health` endpoint.
- Structured logging is configured with SLF4J/Logback defaults.
- Metrics, distributed tracing, and alerting are deferred to later phases.

---

## 14. Open Questions for Tech Lead / Human Developer

1. **Build tool:** Gradle (Kotlin DSL) or Maven for the backend?
2. **Module granularity:** Package-by-service in a single module, or Gradle submodules from day one?
3. **Package manager:** npm, pnpm, or yarn for the frontend?
4. **Local PostgreSQL:** developer-managed instance, or should a `docker-compose.yml` be created in a separate infrastructure task?
5. **Lombok:** allow it for boilerplate reduction, or prefer Java records and explicit constructors?
6. **Frontend state management:** defer selection until the first feature needs it, or pick a default now (e.g., React Context, Zustand)?

---

## 15. Traceability

- Source Requirement: `docs/requirements/features/PROJECT-001-product-requirement.md`
- Source Business Analysis: `docs/requirements/business/PROJECT-001-business-analysis.md`
- Task: `tasks/backlog/PROJECT-001.md`
- Test Strategy: `docs/testing/PROJECT-001-test-strategy.md`
- Security Review: `docs/security/PROJECT-001-security-review.md`
- Proposed ADR: `docs/architecture/decisions/ADR-002-project-001-build-tool-and-monorepo-layout.md`
- SPEC.md §36 — Repository Structure.
- SPEC.md §37 — Phase 0 Foundation and Phase 1 Modular Monolith.
