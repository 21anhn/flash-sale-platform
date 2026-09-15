# ADR-003 — Build Tool and Monorepo Layout for PROJECT-BOOTSTRAP-001 (Phase 0 Foundation)

**Agent:** Tech Lead (`keui3u6`)  
**Role:** Tech Lead  
**Task:** PROJECT-BOOTSTRAP-001 — Project Foundation Bootstrap  
**Artifact:** Architecture Decision Record (ADR)  
**Status:** ACCEPTED  
**Production Code Impact:** None (decision record only; implementation deferred to human developer)

---

## 1. Decision

For the Phase 0 foundation, the human developer has accepted the following tool and layout choices:

| # | Decision Area | Decision | Status |
|---|---------------|----------|--------|
| 1 | Backend build tool | Gradle with Kotlin DSL | **ACCEPTED** |
| 2 | Spring Boot version | **4.1.1** (latest stable 4.x at implementation time) | **ACCEPTED** |
| 3 | Backend module strategy | Single Spring Boot application (`services/monolith`) with **package-by-service** boundaries aligned to future service names | **ACCEPTED** |
| 3 | Frontend build tool | Vite with React and TypeScript | **ACCEPTED** |
| 4 | Frontend package manager | npm | **ACCEPTED** |
| 5 | Database migrations | Flyway | **ACCEPTED** |
| 6 | Flyway migration naming | **Timestamp-based** (`V202409141200__...`) | **ACCEPTED** |
| 7 | Module boundary enforcement | Package-by-service + **lenient** ArchUnit test-scoped rules; strict service boundaries are not enforced yet | **ACCEPTED** |
| 8 | Notification package | Defer until needed | **ACCEPTED** |
| 9 | Frontend state management | Defer until first feature | **ACCEPTED** |
| 10 | Frontend API wrapper | Defer until first feature | **DEFERRED** |
| 11 | Local PostgreSQL | **Docker Compose recommended** as the reproducible path; **developer-managed PostgreSQL supported** as an alternative | **ACCEPTED** |
| 12 | HikariCP | **Spring Boot defaults**; no explicit tuning without benchmark evidence | **ACCEPTED** |
| 13 | Testcontainers | Shared container per JVM | **ACCEPTED** |
| 14 | Request ID + MDC | **Minimal backend request-id filter and MDC log pattern**; frontend interceptor, structured logging, and full observability deferred | **ACCEPTED** |
| 15 | Transaction boundary | Owned by the application service in the domain package that owns the primary entity being written | **ACCEPTED** |
| 16 | CORS | Explicit property gate (`app.cors.enabled=true`) + `local` profile | **ACCEPTED** |
| 17 | Gradle Wrapper + Node version locking | Yes | **ACCEPTED** |
| 18 | Lombok | **Defer**; prefer Java records for DTOs and explicit constructors for entities | **ACCEPTED** |
| 19 | Environment configuration | Provide `.env.example` and document the `.env` workflow; do not commit secrets | **ACCEPTED** |

These choices are **accepted by the human developer** and are recorded here for implementation. The ADR is now **ACCEPTED** following explicit human sign-off at the Human Technical Decision Gate.

---

## 2. Pinned Dependency Versions

For reproducibility, the following versions must be pinned in the foundation build files. Patch versions may be bumped to the latest stable release at implementation time, but major/minor versions require explicit approval.

### Backend

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

### Frontend

| Dependency / Tool | Pinned Version | Where to Pin |
|---|---|---|
| Node.js | `22.11.0` LTS | `.nvmrc`, `package.json` `engines.node` |
| npm | `10.9.0` | `package.json` `engines.npm` |
| Vite | `5.4.10` | `package.json` `devDependencies` |
| React | `18.3.1` | `package.json` `dependencies` |
| TypeScript | `5.6.3` | `package.json` `devDependencies` |
| Vitest | `2.1.3` | `package.json` `devDependencies` |
| React Testing Library | `16.0.1` | `package.json` `devDependencies` |

> **Note:** These versions are compatible with the accepted stack as of 2026-09-15. Verify the latest stable patch releases at implementation time.

---

## 3. Context

- The project is in Phase 0 — Foundation, moving into Phase 1 — Modular Monolith.
- SPEC.md §37 describes Phase 1 as `React → Spring Boot → PostgreSQL`.
- SPEC.md §36 defines the long-term repository structure with `services/`, `frontend/`, `load-tests/`, `infrastructure/`, and `docs/`.
- The foundation must not introduce Kafka, Redis, Kubernetes, authentication/authorization, API Gateway, microservices, virtual queue, or advanced infrastructure.
- Downstream feature planning (e.g., `RESERVATION-001`) assumes a Spring Boot monolith with internal boundaries such as `ticket`.

---

## 4. Problem

How should the repository be structured and built so that:

1. Phase 1 business features can be developed immediately after the foundation is accepted.
2. The layout can evolve naturally toward microservices in later phases.
3. Local development is frictionless for FE/BE connectivity and database setup.
4. The technology choices are simple, well-supported, and consistent with the stack defined in SPEC.md §8.

---

## 5. Options Considered

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
| **Flyway (timestamp naming)** | SQL-first, versioned, simple Spring Boot integration, collision-free across branches. | Slightly longer filenames than sequential numbering. |
| Liquibase | Rich change types, XML/YAML support, rollbacks. | Adds XML/YAML overhead; more complex. |

### Flyway Naming

| Option | Pros | Cons |
|---|---|---|
| **Timestamp-based (`V202409141200__...`)** | Collision-free across branches; naturally ordered. | Longer filenames. |
| Sequential (`V1__...`) | Familiar, easy to read. | Guaranteed merge collisions in multi-developer workflows. |

### Local PostgreSQL

| Option | Pros | Cons |
|---|---|---|
| **Docker Compose recommended + dev-managed supported** | Reproducible path for most; does not block developers who cannot run Docker. | More documentation to maintain. |
| Docker Compose only | Consistent environment. | Hard dependency on Docker; may block some contributors. |
| Developer-managed only | No Docker prerequisite. | Environment drift; harder onboarding. |

### HikariCP

| Option | Pros | Cons |
|---|---|---|
| **Spring Boot defaults** | Minimal YAML; no premature tuning. | Invisible defaults may surprise the team in Phase 4 unless measured. |
| Explicit settings with comments | Documents intent and establishes a baseline. | Adds YAML the human has decided is unnecessary before measurement. |

### Request ID / MDC

| Option | Pros | Cons |
|---|---|---|
| **Minimal backend filter + MDC pattern** | Improves debuggability from day one; small scope. | Still a small amount of foundation code. |
| Full observability foundation | Rich correlation. | Scope creep; belongs in Phase 6. |
| Defer entirely | Cleanest foundation. | First bugs are harder to trace. |

---

## 6. Decision Rationale

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

### Why Flyway with Timestamp-Based Naming

- The team is PostgreSQL-first and SQL migrations are easy to review in pull requests.
- Spring Boot auto-configuration requires minimal setup.
- Timestamp-based naming eliminates an entire class of merge collisions in a multi-developer, multi-branch workflow.

### Why Lenient ArchUnit

- Protects the most dangerous boundary violation (cross-package repository access) without blocking rapid prototyping.
- Rules can be tightened in Phase 2 as boundaries solidify.
- Reduces the risk that developers disable ArchUnit tests to unblock feature work.

### Why Docker Compose Recommended + Developer-Managed Supported

- Provides a reproducible onboarding path.
- Does not make Docker a hard dependency for local development.
- Acknowledges that some developers cannot or prefer not to run Docker locally.

### Why Spring Boot Defaults for HikariCP

- Keeps the foundation minimal.
- Avoids premature tuning before any performance baseline exists.
- The human developer explicitly decided to measure before optimizing, consistent with SPEC.md §2.2 and AGENTS.md §9.

### Why Minimal Request ID / MDC

- Small improvement in debuggability without the scope creep of a full observability stack.
- Aligns with the eventual Phase 6 observability work but does not pre-commit to it.

### Why Defer Lombok

- Java records are sufficient for DTOs in Phase 0–1.
- Avoids adding an annotation processor and IDE plugin dependency before it is needed.
- Can be revisited if entity boilerplate becomes painful.

### Why `.env.example` + Documented `.env` Workflow

- Provides a clear, copy-paste local setup path.
- Keeps real secrets out of source control.
- Supports both Docker Compose and developer-managed PostgreSQL workflows.

---

## 7. Tech Lead Challenges and Resolutions

The Tech Lead (`keui3u6`) challenged several of the human's original proposals. The human developer has resolved each challenge as follows.

### 7.1 Flyway Sequential Naming (`V1__...`) — Severity: High — **RESOLVED**

**Original challenge:** Sequential numbering causes merge collisions in multi-developer workflows.

**Human resolution:** Use **timestamp-based** naming (`V202409141200__...`).

**Tech Lead assessment:** Accepted. This eliminates branch-merge migration conflicts. Team must still ensure migration descriptions are meaningful and that no two developers intentionally create migrations with the same timestamp.

### 7.2 ArchUnit from Day One — Severity: Medium — **RESOLVED**

**Original challenge:** Strict ArchUnit rules may slow experimentation and lead to tests being disabled.

**Human resolution:** Include ArchUnit from day one with **lenient** initial rules. Do not enforce strict service boundaries yet.

**Tech Lead assessment:** Accepted. The initial rule set should be minimal (e.g., prohibit cross-package repository access only). Rules must be tightened deliberately in Phase 2, not allowed to rot.

### 7.3 Docker Compose for Local PostgreSQL — Severity: Medium — **RESOLVED**

**Original challenge:** Docker Compose as the only path can block contributors.

**Human resolution:** Support **Docker Compose as the recommended reproducible path**, while **allowing developer-managed PostgreSQL**.

**Tech Lead assessment:** Accepted. Documentation must describe both paths clearly and `application-local.yml` should use defaults that work for both (`localhost:5432/flashsale`).

### 7.4 HikariCP Spring Boot Defaults — Severity: Medium — **RESOLVED WITH CAVEATS**

**Original challenge:** Relying on defaults is under-engineering for a performance-oriented project; explicit settings document intent.

**Human resolution:** Use **Spring Boot defaults**. Do not introduce explicit tuning without benchmark evidence.

**Tech Lead assessment:** Accepted, with caveats. The team must remember that default pool size (10) and timeout (30s) are in effect. When Phase 4 (High Traffic) begins, the first benchmark should capture pool behavior as a baseline. The human's decision is consistent with SPEC.md §2.2 and AGENTS.md §9, but the default values must not be forgotten.

### 7.5 Request ID + MDC in Foundation — Severity: Low — **RESOLVED**

**Original challenge:** Full request-id/MDC/structured logging is scope creep for Phase 0.

**Human resolution:** Implement only a **minimal backend request-id filter and MDC foundation**. Defer frontend interceptor, structured logging, and full observability.

**Tech Lead assessment:** Accepted. The filter should be trivial (~10 lines) and the Logback pattern should include the request id. No frontend interceptor, JSON logging, or trace propagation beyond MDC is added.

### 7.6 Lombok — Severity: Low — **RESOLVED**

**Original observation:** Lombok was not mentioned in the original decisions.

**Human resolution:** **Defer Lombok**. Prefer Java records for DTOs and explicit constructors for entities.

**Tech Lead assessment:** Accepted. This keeps the build simple and avoids an annotation processor in Phase 0.

### 7.7 Frontend API Wrapper — Severity: Low — **RESOLVED**

**Original observation:** No decision on a minimal API client wrapper.

**Human resolution:** **Defer** the frontend API wrapper until the first frontend feature requires it.

**Tech Lead assessment:** Accepted. `src/api/` may be created as a placeholder directory, but no wrapper code is implemented in the foundation.

### 7.8 Environment Configuration — Severity: Medium — **RESOLVED**

**Original observation:** No decision on how developers supply local environment variables.

**Human resolution:** Provide `.env.example` and document the `.env` workflow. Do not commit secrets.

**Tech Lead assessment:** Accepted. This addresses the original C5 concern and aligns with the security review.

---

## 8. Final Tech Lead Concerns and Caveats

Although the human's decisions are accepted, the Tech Lead records the following concerns for future reference:

1. **HikariCP defaults are invisible.** The team must explicitly measure pool saturation, connection acquisition time, and timeout behavior in Phase 4 before deciding whether to tune. Do not assume defaults are optimal.

2. **ArchUnit leniency may allow boundary drift.** Cross-package service reads are permitted initially. When Phase 2 begins, the team must review the dependency graph and tighten ArchUnit rules or introduce Gradle submodules before extraction becomes expensive.

3. **Timestamp-based Flyway migrations require team discipline.** Two developers should not create migrations with the same timestamp. A simple convention (e.g., use current local time, not a fixed value) is usually sufficient, but the team should be aware of the possibility.

4. **Docker Compose + developer-managed PostgreSQL doubles documentation.** Both setup paths must be kept up to date. If one path is neglected, developers will fall back to workarounds or hardcoded credentials.

5. **Minimal request-id filter is a temporary convenience.** It will likely be replaced or subsumed by OpenTelemetry in Phase 6. The implementation should be small and isolated so that replacement is mechanical.

6. **No frontend API wrapper means the first feature must establish the convention.** The team should not let every feature invent its own error-handling pattern. When the first feature creates `src/api/`, it should define a project-wide convention.

7. **`.env.example` must stay in sync with code.** If new environment variables are added (e.g., for feature flags or ports), `.env.example` must be updated at the same time.

---

## 9. Consequences

### Positive

- A single Spring Boot application reduces operational and build complexity in Phase 1.
- Package-by-service names make future extraction to microservices more mechanical.
- Vite proxy removes CORS friction during local development.
- Flyway with timestamp naming provides a clear, collision-free history of schema changes.
- ArchUnit with lenient rules protects the most critical boundary invariant without blocking experimentation.
- Docker Compose recommendation gives a reproducible onboarding path while supporting alternatives.
- Minimal Request ID/MDC improves debuggability without bloating the foundation.
- Deferring Lombok and the frontend API wrapper keeps the foundation minimal.
- `.env.example` establishes a clear secret-management convention from day one.

### Negative

- Gradle Kotlin DSL may require a short learning curve for developers more familiar with Maven.
- ArchUnit adds a test-scoped dependency and potential build friction if rules are tightened too aggressively.
- Supporting two local PostgreSQL paths requires maintaining two sets of setup instructions.
- Spring Boot HikariCP defaults may surprise the team in Phase 4 if not measured.
- Minimal request-id filter may be replaced in Phase 6, creating a small amount of rework.

### Neutral

- The decisions are reversible: the build can later be split into submodules or separate projects as the architecture evolves.
- Authentication/authorization, Redis, Kafka, and Kubernetes are explicitly deferred to later phases.
- Lombok and frontend API wrapper can be introduced when justified by feature work.

---

## 10. Related Decisions

- Backend will run on port `8080`; frontend dev server on port `5173`; PostgreSQL on port `5432`.
- Database credentials are externalized via environment variables and documented through `.env.example`.
- CORS is enabled only when `app.cors.enabled=true` is set (typically in the `local` profile).
- No business tables are created by PROJECT-BOOTSTRAP-001; the first schema migration belongs to a downstream feature task.
- The first Flyway migration should use timestamp-based naming (`V202409141200__...`).

---

## 11. Compliance

This decision aligns with:

- SPEC.md §2.2 — Measure before optimizing.
- SPEC.md §2.3 — Start simple.
- SPEC.md §8 — Technology stack (Java, Spring Boot, React, TypeScript, PostgreSQL).
- SPEC.md §13 — Local environment.
- SPEC.md §27 — Observability (minimal request id only).
- SPEC.md §36 — Repository structure.
- SPEC.md §37 — Phase 0 Foundation and Phase 1 Modular Monolith.
- AGENTS.md §9 — Measure before optimizing.
- AGENTS.md §10 — Do not introduce technology without a concrete reason.
- AGENTS.md §13 — Significant architectural decisions recorded as ADRs.

---

## 12. Acceptance Record

The human developer explicitly accepted this ADR and the PROJECT-BOOTSTRAP-001 architecture at the Human Technical Decision Gate.

- **Date:** 2026-09-14
- **Acceptance Statement:** "Human developer explicitly accepts ADR-003 and the PROJECT-BOOTSTRAP-001 architecture as documented."
- **Final Tech Lead Consistency Review:** `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-final-review.md`
- **Human Decision Gate:** Cleared. All challenged decisions documented in §6 (Tech Lead Challenges and Resolutions) are accepted.

## 13. Traceability

- Architecture Proposal: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-architecture-proposal.md`
- Tech Lead Challenge: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-challenge.md`
- Prior Tech Lead Review: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-review.md`
- Tech Lead Final Review: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-final-review.md`
- Task: `tasks/active/PROJECT-BOOTSTRAP-001.md`
- Source Requirement: `docs/requirements/features/PROJECT-BOOTSTRAP-001-product-requirement.md`
- Source Business Analysis: `docs/requirements/business/PROJECT-BOOTSTRAP-001-business-analysis.md`
