# PROJECT-001 — Project Bootstrap (Phase 0 → Phase 1 Foundation)

**Task ID:** PROJECT-001  
**Type:** FEATURE  
**Title:** Project Bootstrap  
**Phase:** Phase 0 → Phase 1 Foundation  
**Feature:** Project Foundation  
**Goal:** Establish the minimum source base and development foundation required before any business feature can be implemented  
**Source Requirement:** `docs/requirements/features/PROJECT-001-product-requirement.md`  
**Relevant SPEC Section:** §36 (Repository Structure), §37 (Phase 0 Foundation / Phase 1 Modular Monolith)  
**Dependencies:** None  
**Priority:** High  
**Status:** BACKLOG  
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

- Backend project skeleton under `services/monolith/` with the chosen build tool.
- Backend dependencies (Spring Boot Web, Data JPA, Validation, Actuator, PostgreSQL driver, Flyway, Testcontainers).
- Backend configuration files (`application.yml`, `application-local.yml`, `application-test.yml`) using environment variables for secrets.
- Backend package structure (`com.flashsale.config`, `com.flashsale.user`, `com.flashsale.event`, `com.flashsale.ticket`, `com.flashsale.order`, `com.flashsale.payment`, `com.flashsale.notification`).
- Backend main application class.
- Flyway migration directory layout (`src/main/resources/db/migration/`).
- Frontend project skeleton under `frontend/web/` with Vite, React, and TypeScript.
- Frontend dev-server proxy configuration for `/api` and `/actuator`.
- Frontend landing page that calls the backend health endpoint.
- Backend and frontend test harnesses with at least one passing test each.
- `.gitignore` rules for secrets, build artifacts, and IDE files.

---

## Verification Requirements

- Backend builds and starts successfully (`GET /actuator/health` returns HTTP 200 `{"status":"UP"}`).
- Frontend builds and starts successfully on the configured dev-server port.
- Local PostgreSQL is reachable from the backend with the `local` profile.
- Flyway runs and records the migration/version history.
- Frontend landing page successfully calls the backend health endpoint through the dev-server proxy.
- Backend context-load test and Testcontainers PostgreSQL test pass.
- Frontend unit/component test passes.
- No Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue, or advanced infrastructure dependencies are present.

---

## Definition of Done

- [ ] Backend skeleton is implemented and builds successfully.
- [ ] Frontend skeleton is implemented and builds successfully.
- [ ] Local PostgreSQL connection is configured and reachable.
- [ ] FE → BE health endpoint smoke test passes.
- [ ] Backend and frontend test harnesses each have at least one passing test.
- [ ] Security review findings (CORS, secrets, `.gitignore`) are addressed or accepted.
- [ ] Architecture proposal and ADR are accepted or updated to reflect final decisions.
- [ ] Product requirement, business analysis, test strategy, and security review are updated to IMPLEMENTED/VERIFIED status where applicable.
- [ ] Task is moved to `tasks/completed/` after human confirmation.

---

## Traceability

- Product Requirement: `docs/requirements/features/PROJECT-001-product-requirement.md`
- Business Analysis: `docs/requirements/business/PROJECT-001-business-analysis.md`
- Architecture Proposal: `docs/architecture/proposals/PROJECT-001-architecture-proposal.md`
- Proposed ADR: `docs/architecture/decisions/ADR-002-project-001-build-tool-and-monorepo-layout.md`
- Test Strategy: `docs/testing/PROJECT-001-test-strategy.md`
- Security Review: `docs/security/PROJECT-001-security-review.md`
- Downstream dependency: `tasks/backlog/RESERVATION-001.md` requires this foundation.
