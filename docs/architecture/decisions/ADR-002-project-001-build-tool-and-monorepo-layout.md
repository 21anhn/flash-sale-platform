# ADR-002 — Build Tool and Monorepo Layout for Phase 1 Foundation

**Status:** PROPOSED  
**Decision ID:** ADR-002  
**Feature:** PROJECT-001 — Project Bootstrap (Phase 0 → Phase 1 Foundation)  
**Date:** 2026-09-13  
**Author:** Solution Architect / Tech Lead  
**Approver:** Human Developer (Technical Decision Gate)

---

## 1. Proposed Decision

For the Phase 1 foundation, use the following tool and layout choices:

- **Backend build tool:** Gradle with Kotlin DSL.
- **Backend module strategy:** A single Spring Boot application (`services/monolith`) with **package-by-service** boundaries aligned to future service names.
- **Frontend build tool:** Vite with React and TypeScript.
- **Frontend package manager:** npm.
- **Database migrations:** Flyway.
- **Local FE/BE connectivity:** Vite dev-server proxy for `/api` and `/actuator`, plus a narrow `local`-profile CORS policy as a safety net.

These choices are proposals pending approval at the Human Technical Decision Gate.

---

## 2. Context

- The project is in Phase 0 — Foundation, moving into Phase 1 — Modular Monolith.
- SPEC.md §37 describes Phase 1 as `React → Spring Boot → PostgreSQL`.
- SPEC.md §36 defines the long-term repository structure with `services/`, `frontend/`, `load-tests/`, `infrastructure/`, and `docs/`.
- The foundation must not introduce Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue, or advanced infrastructure.
- Downstream feature planning (e.g., `RESERVATION-001`) assumes a Spring Boot monolith with internal boundaries such as `ticket`.

---

## 3. Problem

How should the repository be structured and built so that:

1. Phase 1 business features can be developed immediately after the foundation is accepted.
2. The layout can evolve naturally toward microservices in later phases.
3. Local development is frictionless for FE/BE connectivity and database setup.
4. The technology choices are simple, well-supported, and consistent with the stack defined in SPEC.md §8.

---

## 4. Options Considered

### Backend Build Tool

| Option | Pros | Cons |
|---|---|---|
| **Gradle (Kotlin DSL)** | Concise DSL, excellent multi-module support, fast incremental builds, strong Spring Boot plugin. | Slightly steeper learning curve than Maven for some developers. |
| Maven | Very familiar, huge ecosystem, simple to start. | Verbose XML; multi-module setup is more rigid. |
| Gradle (Groovy DSL) | Same build power as Kotlin DSL. | Less type-safe; IDE support slightly weaker. |

### Backend Module Layout

| Option | Pros | Cons |
|---|---|---|
| **Package-by-service in one module** | Simple to set up; easy refactoring; sufficient for Phase 1. | No compile-time boundaries; requires discipline. |
| Gradle submodules now | Enforces boundaries; easier future extraction. | More build complexity; slower initial setup. |
| Separate Maven/Gradle projects now | Closest to future microservices. | Too much overhead for Phase 1; contradicts the start-simple philosophy. |

### Frontend Build Tool

| Option | Pros | Cons |
|---|---|---|
| **Vite** | Fast dev server, simple config, first-class TypeScript. | Less familiar than CRA to some developers. |
| Create React App | Familiar. | Slow, no longer actively maintained. |
| Next.js | Full-featured framework. | More complexity than needed for a SPA backend client. |

### Database Migration Tool

| Option | Pros | Cons |
|---|---|---|
| **Flyway** | SQL-first, versioned, simple Spring Boot integration. | Less flexible rollback than Liquibase. |
| Liquibase | Rich change types, XML/YAML support, rollbacks. | Adds XML/YAML overhead; more complex. |

---

## 5. Decision Rationale

### Why Gradle (Kotlin DSL)

- Aligns with modern Spring Boot multi-project conventions.
- Makes it easy to introduce compile-time modules later without restructuring the build.
- Incremental builds and build caching improve the local dev experience.

### Why Package-by-Service in One Module

- Satisfies the start-simple principle (SPEC.md §2.3, AGENTS.md §10).
- Provides enough structure to map future service names without the overhead of physical modules.
- Can be migrated to Gradle submodules once the team observes pain points or needs stricter boundaries.

### Why Vite

- Fast HMR and cold start improve frontend developer productivity.
- Proxy configuration is trivial, which is important for the FE/BE smoke test.
- TypeScript support is built in.

### Why Flyway

- The team is PostgreSQL-first and SQL migrations are easy to review in pull requests.
- Spring Boot auto-configuration requires minimal setup.

---

## 6. Consequences

### Positive

- A single Spring Boot application reduces operational and build complexity in Phase 1.
- Package-by-service names make future extraction to microservices more mechanical.
- Vite proxy removes CORS friction during local development.
- Flyway provides a clear, versioned history of schema changes from the first feature onward.

### Negative

- Without compile-time modules, developers must rely on package visibility and code review to enforce boundaries.
- Gradle Kotlin DSL may require a short learning curve for developers more familiar with Maven.

### Neutral

- The decisions are reversible: the build can later be split into submodules or separate projects as the architecture evolves.
- Authentication/authorization, Redis, Kafka, and Kubernetes are explicitly deferred to later phases.

---

## 7. Related Decisions

- Backend will run on port `8080`; frontend dev server on port `5173`; PostgreSQL on port `5432`.
- Database credentials are externalized via environment variables.
- CORS is enabled only in the `local` profile and restricted to local frontend origins.
- No business tables are created by PROJECT-001; the first schema migration belongs to a downstream feature task.

---

## 8. Compliance

This proposed decision aligns with:

- SPEC.md §2.3 — Start simple.
- SPEC.md §8 — Technology stack (Java, Spring Boot, React, TypeScript, PostgreSQL).
- SPEC.md §36 — Repository structure.
- SPEC.md §37 — Phase 0 Foundation and Phase 1 Modular Monolith.
- AGENTS.md §10 — Do not introduce technology without a concrete reason.
- AGENTS.md §13 — Significant architectural decisions recorded as ADRs.

---

## 9. Traceability

- Architecture Proposal: `docs/architecture/proposals/PROJECT-001-architecture-proposal.md`
- Task: `tasks/backlog/PROJECT-001.md`
- Source Requirement: `docs/requirements/features/PROJECT-001-product-requirement.md`
- Source Business Analysis: `docs/requirements/business/PROJECT-001-business-analysis.md`
