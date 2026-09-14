# PROJECT-BOOTSTRAP-001 — Project Foundation Bootstrap (Phase 0)

**Task ID:** PROJECT-BOOTSTRAP-001  
**Type:** FEATURE  
**Title:** Project Foundation Bootstrap  
**Phase:** Phase 0 — Foundation  
**Feature:** Project Foundation  
**Goal:** Establish the minimum source base and development foundation required before any business feature can be implemented  
**Source Requirement:** `docs/requirements/features/PROJECT-BOOTSTRAP-001-product-requirement.md`  
**Relevant SPEC Section:** §36 (Repository Structure), §37 (Phase 0 Foundation / Phase 1 Modular Monolith)  
**Dependencies:** None  
**Priority:** High  
**Status:** READY  
**Owner:** Human Developer

---

## Required Agents

- Tech Lead
- Solution Architect
- FE Engineer
- Test Engineer
- Security Reviewer (review only)

---

## Human Implementation Responsibility

The human developer is responsible for implementing the foundation production code, including but not limited to:

- Backend project skeleton under `services/monolith/` with Gradle Kotlin DSL.
- Backend dependencies (Spring Boot Web, Data JPA, Validation, Actuator, PostgreSQL driver, Flyway, Testcontainers, ArchUnit).
- Backend configuration files (`application.yml`, `application-local.yml`, `application-test.yml`) using environment variables for secrets.
- Backend package structure (`com.flashsale.config`, `com.flashsale.user`, `com.flashsale.event`, `com.flashsale.ticket`, `com.flashsale.order`, `com.flashsale.payment`). **Note:** `notification` is deferred until needed.
- Backend main application class.
- Flyway migration directory layout (`src/main/resources/db/migration/`). Use **timestamp-based** migration names (`V202409141200__...`).
- Frontend project skeleton under `frontend/web/` with Vite, React, and TypeScript.
- Frontend dev-server proxy configuration for `/api` and `/actuator`.
- Frontend landing page that calls the backend health endpoint.
- Backend and frontend test harnesses with at least one passing test each.
- `.gitignore` rules for secrets, build artifacts, and IDE files.
- Gradle Wrapper committed; Node version locked via `.nvmrc` or `package.json` `engines`.
- Minimal backend `RequestIdFilter` and MDC log pattern. Do **not** add frontend interceptors, structured logging, or full observability.
- CORS enabled only when `app.cors.enabled=true` (typically set in `local` profile).
- ArchUnit test with **lenient** boundary rules: prohibit cross-package repository access initially; allow cross-package service/DTO reads.
- `infrastructure/docker/docker-compose.yml` as the **recommended** local PostgreSQL path.
- Documentation for developer-managed PostgreSQL as a **supported alternative**.
- `.env.example` file with placeholder environment variables and documented `.env` workflow.
- **No explicit HikariCP tuning**; rely on Spring Boot defaults until benchmark evidence justifies tuning.
- **No Lombok** in the dependency list; prefer Java records and explicit constructors.
- **No frontend API wrapper** in the foundation; reserve `src/api/` for the first frontend feature.

---

## Verification Requirements

- Backend builds and starts successfully (`GET /actuator/health` returns HTTP 200 `{"status":"UP"}`).
- Frontend builds and starts successfully on the configured dev-server port.
- Local PostgreSQL is reachable from the backend with the `local` profile using either Docker Compose or developer-managed PostgreSQL.
- Flyway runs and records the migration/version history using timestamp-based migration names.
- Frontend landing page successfully calls the backend health endpoint through the dev-server proxy.
- Backend context-load test and Testcontainers PostgreSQL test pass (shared container per JVM).
- Frontend unit/component test passes.
- No Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue, or advanced infrastructure dependencies are present.
- ArchUnit test enforces lenient boundary rules (cross-package repository access prohibited).
- Request ID appears in backend logs for HTTP requests.
- CORS is gated by `app.cors.enabled=true` and restricted to local origins.
- `.env.example` exists, `.env` is excluded from source control, and no secrets are committed.

---

## Resolved Blockers

All items previously flagged by the Tech Lead at the Human Technical Decision Gate have been resolved by the human developer:

| # | Blocker | Human Decision | Resolution Reference |
|---|---------|----------------|----------------------|
| 1 | Flyway naming | Timestamp-based (`V202409141200__...`) | `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md` §6.1 |
| 2 | ArchUnit strictness | Include from day one with **lenient** initial rules | `ADR-003` §6.2 |
| 3 | Local PostgreSQL | Docker Compose **recommended**; developer-managed **supported** | `ADR-003` §6.3 |
| 4 | HikariCP | Use **Spring Boot defaults**; no explicit tuning without benchmark evidence | `ADR-003` §6.4 |
| 5 | Request ID + MDC | Minimal backend filter + MDC pattern only | `ADR-003` §6.5 |
| 6 | Lombok | **Defer**; prefer records and explicit constructors | `ADR-003` §6.6 |
| 7 | Frontend API wrapper | **Defer** until first frontend feature | `ADR-003` §6.7 |
| 8 | Environment configuration | Provide `.env.example` + documented `.env` workflow; no secrets committed | `ADR-003` §6.8 |

## Open Blockers

None. All challenged decisions have been resolved.

> **Gate cleared:** The human developer explicitly accepted the final ADR (`docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`) and the PROJECT-BOOTSTRAP-001 architecture. The task has moved to `READY` and implementation may begin.

---

## Acceptance Record

The human developer explicitly accepted ADR-003 and the PROJECT-BOOTSTRAP-001 architecture at the Human Technical Decision Gate. This task is now **READY** for human implementation.

- **Date:** 2026-09-14
- **Acceptance Statement:** "Human developer explicitly accepts ADR-003 and the PROJECT-BOOTSTRAP-001 architecture as documented."
- **Final Tech Lead Consistency Review:** `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-final-review.md`
- **ADR Reference:** `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`
- **Architecture Proposal Reference:** `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-architecture-proposal.md`
- **Human Decision Gate:** Cleared.

---

## Definition of Done

- [x] Human developer explicitly accepts the final ADR at the Technical Decision Gate.
- [ ] Backend skeleton is implemented and builds successfully.
- [ ] Frontend skeleton is implemented and builds successfully.
- [ ] Local PostgreSQL connection is configured and reachable.
- [ ] FE → BE health endpoint smoke test passes.
- [ ] Backend and frontend test harnesses each have at least one passing test.
- [ ] Security review findings (CORS, secrets, `.gitignore`, `.env` workflow) are addressed or accepted.
- [x] Architecture proposal and ADR are accepted or updated to reflect final decisions.
- [ ] Product requirement, business analysis, test strategy, and security review are updated to IMPLEMENTED/VERIFIED status where applicable.
- [ ] Task is moved to `tasks/completed/` after human confirmation.

---

## Traceability

- Product Requirement: `docs/requirements/features/PROJECT-BOOTSTRAP-001-product-requirement.md`
- Business Analysis: `docs/requirements/business/PROJECT-BOOTSTRAP-001-business-analysis.md`
- Architecture Proposal: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-architecture-proposal.md`
- ADR: `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`
- Tech Lead Final Review: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-final-review.md`
- Test Strategy: `docs/testing/PROJECT-BOOTSTRAP-001-test-strategy.md`
- Security Review: `docs/security/PROJECT-BOOTSTRAP-001-security-review.md`
- Downstream dependency: `tasks/backlog/RESERVATION-001.md` requires this foundation.
