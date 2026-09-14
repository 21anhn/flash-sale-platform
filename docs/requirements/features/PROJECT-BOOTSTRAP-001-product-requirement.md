# PROJECT-BOOTSTRAP-001 — Product Requirement: Project Foundation Bootstrap (Phase 0)

**Agent:** Product Owner  
**Role:** Product Owner  
**Task:** PROJECT-BOOTSTRAP-001 — Project Foundation Bootstrap  
**Artifact:** Product Requirement  
**Status:** PROPOSED  
**Production Code Impact:** None (planning artifact only)

---

## 1. Goal and Business Value

Before any business feature (Reservation, Events, Orders, Payments, etc.) can be implemented, the repository needs a common technical foundation that both the backend and frontend teams can build on.

PROJECT-BOOTSTRAP-001 establishes that foundation: a buildable Spring Boot backend, a runnable React/TypeScript frontend, a local PostgreSQL connection strategy, a migration approach, and local FE/BE connectivity conventions.

Business value:

- Removes the "empty repository" blocker for Phase 1 feature work.
- Defines a shared directory layout, build tool, and local development contract.
- Ensures the team can verify end-to-end connectivity before committing to business logic.

---

## 2. Scope

### 2.1 In Scope

- **Spring Boot backend foundation**
  - Project skeleton, build tool selection, and dependency strategy.
  - A single deployable application for Phase 1 (modular monolith) with internal packages/modules aligned to future service boundaries.
  - A health endpoint (`/actuator/health`) that proves the application starts.
- **React frontend foundation**
  - Project skeleton, build tool, TypeScript setup, and component layout.
  - A minimal landing page that can call the backend health endpoint.
- **PostgreSQL development foundation**
  - Local database connection conventions (profiles, URL/credentials via environment variables).
  - Migration tool selection and migration directory layout.
  - No production schema yet; only the migration baseline and `flyway_schema_history` (or equivalent) are expected after the first migration run.
- **Local FE/BE connectivity**
  - Port assignments and a proxy/CORS strategy so the React dev server can reach Spring Boot without CORS friction.
- **Basic project/runtime configuration**
  - Environment profiles (`local`, `test`).
  - Local dev conventions: ports, naming conventions, package structure.

### 2.2 Out of Scope

- Business endpoints, domain entities, or business logic (Reservation, Events, Orders, Payments, etc.).
- Authentication/authorization, JWT, RBAC, or user identity flows.
- Kafka, Redis, API Gateway, Kubernetes, microservices, virtual queue, load balancing, or horizontal scaling.
- Production deployment configuration, Terraform, CI/CD pipelines, or Docker Compose files.
- Observability stack (OpenTelemetry, Prometheus, Grafana) beyond basic Spring Boot Actuator health.

### 2.3 Constraints

- No Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue, or advanced infrastructure may be introduced in the foundation code.
- The implementation must remain simple enough to support Phase 1 — Modular Monolith.
- The human developer remains the owner of all production implementation.

---

## 3. Acceptance Criteria

### A1 — Backend Builds and Starts

Given the backend source is checked out, when the human developer runs the build and starts the application with the `local` profile, then:

- The application compiles without errors.
- The application starts successfully on the configured backend port (default `8080`).
- `GET /actuator/health` returns HTTP 200 with `{"status":"UP"}`.

### A2 — Frontend Builds and Starts

Given the frontend source is checked out, when the human developer installs dependencies and starts the dev server, then:

- The frontend compiles without errors.
- The dev server starts successfully on the configured frontend port (default `5173`).
- A browser can load the landing page.

### A3 — Local Database Is Reachable

Given a local PostgreSQL instance is running and the connection environment variables are set, when the backend starts with the `local` profile, then:

- The application connects to PostgreSQL without startup failures.
- The migration tool runs and records the baseline/version history.

### A4 — Frontend Can Call Backend Health Endpoint

Given both dev servers are running locally, when the landing page makes a request to the backend health endpoint through the configured proxy, then:

- The request reaches the backend.
- The frontend displays the backend health status.

### A5 — Test Harness Runs

Given the test harness is configured, when the human developer runs the backend and frontend test commands, then:

- Unit and integration test commands execute.
- At minimum, a smoke test proving the Spring Boot context loads and a FE component/utility test run successfully.

### A6 — No Prohibited Technology in Foundation

When the foundation code is inspected, then:

- No Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue, or advanced infrastructure dependencies are present.

---

## 4. Non-Functional Requirements

### Local Development Conventions

| Concern | Default Convention |
|---|---|
| Backend port | `8080` |
| Frontend dev server port | `5173` |
| PostgreSQL port | `5432` |
| API base path | `/api/v1` |
| Health path | `/actuator/health` |
| Backend package root | `com.flashsale` |

These defaults are proposals and may be changed by the human developer / Tech Lead at the Technical Decision Gate.

### Correctness

- The foundation must not introduce any mechanism that could weaken the core business invariant `sold + reserved <= total_inventory` when business features are added.

### Simplicity

- The foundation should be the smallest set of technologies and structure that enables Phase 1 feature development.

---

## 5. Traceability

- SPEC.md §36 — Repository Structure.
- SPEC.md §37 — Development Phases (Phase 0 Foundation, Phase 1 Modular Monolith).
- Downstream artifacts:
  - `docs/requirements/business/PROJECT-BOOTSTRAP-001-business-analysis.md`
  - `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-architecture-proposal.md`
  - `docs/testing/PROJECT-BOOTSTRAP-001-test-strategy.md`
  - `docs/security/PROJECT-BOOTSTRAP-001-security-review.md`
  - `tasks/backlog/PROJECT-BOOTSTRAP-001.md`
