# PROJECT-BOOTSTRAP-001 — Tech Lead Challenge: Critical Assessment of Human Decisions

**Agent:** Tech Lead (`keui3u6`)  
**Role:** Tech Lead  
**Task:** PROJECT-BOOTSTRAP-001 — Project Foundation Bootstrap  
**Artifact:** Tech Lead Challenge / Critical Assessment  
**Status:** PROPOSED (Assessment of PROPOSED human decisions)  
**Production Code Impact:** None  

---

## 1. Purpose

This document is the Tech Lead's critical assessment of the human developer's proposed technical decisions for PROJECT-BOOTSTRAP-001. The human's decisions are recorded, challenged where necessary, and handed back to the human at the **Human Technical Decision Gate** for final resolution.

The Tech Lead's job is not to agree automatically, but to identify hidden complexity, better alternatives, and risks that the human may not have considered.

---

## 2. Human Decisions Summary

| # | Decision Area | Human Proposal | Tech Lead Assessment |
|---|---------------|----------------|----------------------|
| 1 | Backend build tool | Gradle Kotlin DSL | **Accept** — aligns with prior proposal. |
| 2 | Frontend stack | Vite + React + TypeScript | **Accept** — aligns with prior proposal. |
| 3 | Frontend package manager | npm | **Accept with note** — acceptable; pnpm is faster but npm is fine. |
| 4 | Database migrations | Flyway | **Accept** — aligns with prior proposal. |
| 5 | Flyway migration naming | Sequential `V1__...` | **CHALLENGE** — see §3.1. |
| 6 | Module boundaries | Package-by-service + ArchUnit | **Accept with caution** — see §3.2. |
| 7 | Notification package | Defer until needed | **Accept** — addresses C2 from prior review. |
| 8 | Frontend state management | Defer until first feature | **Accept** — correct for foundation. |
| 9 | Local PostgreSQL | Docker Compose | **CHALLENGE** — see §3.3. |
| 10 | HikariCP | Spring Boot defaults | **CHALLENGE** — see §3.4. |
| 11 | Testcontainers | Shared container per JVM | **Accept** — addresses C7 from prior review. |
| 12 | Request ID + MDC | Include in foundation | **CHALLENGE** — see §3.5. |
| 13 | Transaction boundary | Application service | **Accept** — addresses C3 from prior review. |
| 14 | CORS | Explicit property gate + `local` profile | **Accept** — addresses C9 from prior review. |
| 15 | Gradle Wrapper + Node version locking | Yes | **Accept** — addresses C14 from prior review. |

---

## 3. Detailed Challenges

### 3.1 CHALLENGE — Flyway Sequential Naming (`V1__...`)

**Human Decision:** Use sequential Flyway migration names (`V1__...`, `V2__...`).

**Problem:** In a multi-developer, multi-branch workflow, sequential numbering guarantees merge collisions.

**Why it matters:**
- Feature `RESERVATION-001` and `EVENT-001` are developed on separate branches.
- Both developers add a migration. On `main`, the next number is `V2`.
- Both branches create `V2__...`. When the second branch merges, Flyway detects a duplicate version and fails at runtime.
- The fix is manual: renumber, update `flyway_schema_history`, and restart. This friction scales with team size.

**Possible consequence:**
- Broken CI builds.
- Developers manually editing `flyway_schema_history`.
- Migrations accidentally skipped or re-run.
- Loss of trust in the migration tool.

**Suggested direction:**
- Use **timestamp-based versioning**: `V202409141200__description.sql`.
- Timestamps are naturally ordered and collision-free across branches.
- Flyway supports this out of the box; no plugin is needed.
- If the human insists on sequential numbering, the team must adopt a strict branch-merge protocol: migrations are rebased and renumbered before merge, and only one feature branch may add a migration at a time. This is operational overhead.

**Trade-off:**
- Sequential: familiar, easy to read, but collision-prone.
- Timestamp: slightly longer filenames, but eliminates an entire class of merge conflicts.

**Tech Lead recommendation:** Switch to timestamp-based naming. If the human rejects this, document the branch-merge protocol as a mandatory convention.

---

### 3.2 CHALLENGE — ArchUnit from Day One

**Human Decision:** Use package-by-service + ArchUnit to enforce boundaries.

**Problem:** ArchUnit is a good tool, but it adds hidden build friction and a learning curve that may not be justified in Phase 0.

**Why it matters:**
- ArchUnit tests run on every build. If a developer accidentally violates a boundary during rapid prototyping, the build fails.
- In Phase 1, the team is still discovering domain boundaries. A rule that says "`order` must not depend on `ticket`" may be too rigid when the team is experimenting with in-process sagas or temporary cross-domain reads.
- The ArchUnit DSL has a learning curve. Developers may spend time fighting the test instead of building features.

**Possible consequence:**
- Developers disable ArchUnit tests "temporarily" to unblock feature work.
- The tests become ignored and rot.
- The boundary enforcement is nominal, not real.

**Suggested direction:**
- Keep ArchUnit, but start with **lenient rules** that only catch the most dangerous violations (e.g., `*.repository` classes must not be accessed from other top-level packages).
- Allow `*.service` and `*.dto` cross-package access for reads.
- Document that ArchUnit rules will be tightened in Phase 2 as boundaries solidify.
- Alternatively, defer ArchUnit until Phase 1 is underway and boundaries are clearer. The risk is that boundary violations accumulate.

**Trade-off:**
- ArchUnit now: enforces discipline early, but may slow down experimentation.
- ArchUnit later: faster early development, but riskier refactoring when boundaries are violated.

**Tech Lead recommendation:** Accept ArchUnit, but define the rules collaboratively and keep them lenient initially. Do not let ArchUnit become a barrier to learning.

---

### 3.3 CHALLENGE — Docker Compose for Local PostgreSQL

**Human Decision:** Use Docker Compose for local PostgreSQL.

**Problem:** Docker Compose becomes a hard dependency for local development. Not every developer wants or can run Docker locally.

**Why it matters:**
- Some developers run Windows Home, WSL1, or corporate laptops with Docker Desktop restrictions.
- Docker Compose adds a startup step: `docker-compose up -d` before the backend can start.
- If the container fails (port conflict, volume permission issue, Docker daemon not running), the developer must debug Docker before debugging the application.
- The SPEC.md §13 says "Local development should be possible without AWS," but it does not mandate Docker.

**Possible consequence:**
- New contributors give up because they cannot get Docker working.
- Developers bypass Docker and install PostgreSQL locally, but the project documentation only describes Docker Compose, leaving them unsupported.
- The `docker-compose.yml` drifts out of date because only some developers use it.

**Suggested direction:**
- Provide **both** options:
  1. **Docker Compose** as the recommended path (documented in `LOCAL_SETUP.md`).
  2. **Developer-managed PostgreSQL** as a supported alternative, with connection defaults in `application-local.yml` that match typical local installs (`localhost:5432/flashsale`).
- The `application-local.yml` should use safe defaults that work for both Docker Compose (if ports are mapped) and local PostgreSQL.
- Do not make Docker Compose the only documented path.

**Trade-off:**
- Docker only: consistent environment, but higher barrier to entry.
- Docker + local: more documentation, but lower barrier to entry.

**Tech Lead recommendation:** Support both paths. Document Docker Compose as the recommended path, but do not require it.

---

### 3.4 CHALLENGE — Spring Boot Defaults for HikariCP

**Human Decision:** Accept Spring Boot defaults for HikariCP (connection pool).

**Problem:** Relying on defaults is under-engineering for a project whose explicit goal is to study high-traffic behavior.

**Why it matters:**
- Spring Boot default `maximum-pool-size` is 10. For Phase 1, this is fine. For Phase 4 (High Traffic), it is almost certainly too low.
- The default `connection-timeout` is 30 seconds. Under load, a slow database will cause threads to block for 30 seconds before failing, which can cascade into thread pool exhaustion.
- The SPEC.md §30 (Performance Experiments) and §31 (Concurrency Experiments) expect the team to measure and tune connection behavior. If the foundation has no explicit pool configuration, the team may not realize the defaults are in play until a benchmark fails.
- AGENTS.md §9 says: "Measure Before Optimizing." Explicitly documenting the defaults is the first step toward measurement.

**Possible consequence:**
- Phase 4 benchmarks fail mysteriously because the pool is exhausted.
- Developers waste time debugging application code when the bottleneck is the connection pool.
- The team retrofits pool settings under pressure, without baseline data.

**Suggested direction:**
- Add an **explicit HikariCP configuration block** to `application.yml` with the Spring Boot defaults, plus comments explaining each value and when to revisit it.
- Example:
  ```yaml
  spring.datasource.hikari.maximum-pool-size: 10   # Revisit in Phase 4
  spring.datasource.hikari.connection-timeout: 30000
  spring.datasource.hikari.idle-timeout: 600000
  spring.datasource.hikari.max-lifetime: 1800000
  ```
- This is not tuning; it is **documentation of intent**. It tells future developers: "We have thought about this, and these are the conscious defaults."

**Trade-off:**
- Defaults only: less YAML, but invisible and unmeasured.
- Explicit defaults: slightly more YAML, but establishes a baseline for future benchmarks.

**Tech Lead recommendation:** Add explicit HikariCP settings with comments. Do not rely on invisible defaults for a performance-oriented project.

---

### 3.5 CHALLENGE — Request ID + MDC in Foundation

**Human Decision:** Include a `RequestIdFilter` and MDC logging in the foundation.

**Problem:** This is appropriate scope creep, but it is still scope creep. The foundation is meant to be the minimal set of technologies that enables Phase 1 feature work.

**Why it matters:**
- A `RequestIdFilter` is ~20 lines of code, plus a log pattern change, plus a frontend interceptor. It is small, but it is not zero.
- The SPEC.md §27 (Observability) places distributed tracing in **Phase 6**. Request IDs are a precursor to tracing, but they are not required for Phase 1 business features.
- If the human adds Request ID now, they may also feel compelled to add structured logging (JSON), correlation ID propagation, and log aggregation — all of which belong in Phase 6.
- AGENTS.md §10 warns against introducing technology without a concrete reason. The concrete reason for Request ID is debugging, but the foundation has no business logic to debug yet.

**Possible consequence:**
- The foundation grows beyond its "minimal" mandate.
- Time is spent polishing observability infrastructure instead of starting Phase 1 features.
- When Phase 6 arrives, the existing Request ID implementation may need to be replaced or upgraded to OpenTelemetry, creating rework.

**Suggested direction:**
- **Option A (defer):** Remove Request ID + MDC from PROJECT-BOOTSTRAP-001. Add it as a dedicated Phase 1 task (e.g., `INFRA-001`) before the first business feature, when there is actual behavior to trace.
- **Option B (minimal):** Keep a trivial `RequestIdFilter` (~10 lines) and a simple log pattern, but explicitly document that it is a temporary convenience, not a permanent observability stack. Do not build frontend interceptors, MDC wrappers, or structured JSON logging yet.

**Trade-off:**
- Include now: better debugging from day one, but foundation is less minimal.
- Defer: cleaner foundation, but first bugs are harder to trace.

**Tech Lead recommendation:** Accept Option B (minimal). Keep the filter small, do not build frontend infrastructure for it yet, and document that it will be superseded by OpenTelemetry in Phase 6.

---

## 4. Additional Observations (Not Blockers)

### 4.1 Lombok Not Mentioned

The human did not decide on Lombok. The Tech Lead has no strong preference, but notes:
- Java records are sufficient for DTOs in Phase 0–1.
- Lombok reduces boilerplate for entities (getters, setters, builders), but adds an annotation processor and IDE plugin dependency.
- **Recommendation:** Defer Lombok. Use Java records for DTOs and explicit constructors for entities. Revisit if boilerplate becomes painful.

### 4.2 Frontend Error Handling Not Mentioned

The human deferred state management, which is correct. However, the Tech Lead's prior review (C11) recommended a minimal API client wrapper with error handling. The human did not address this.
- **Recommendation:** Add a thin `fetch` wrapper in `src/api/` that handles HTTP errors and attaches `X-Request-Id`. This is ~30 lines and establishes a convention without committing to a state-management library.

### 4.3 No Decision on `.env` Strategy

The human did not specify how local environment variables should be supplied. The Tech Lead's prior review (C5) highlighted this as a risk.
- **Recommendation:** Provide a `.env.example` file and document that developers copy it to `.env`. Spring Boot can read `.env` via `spring.config.import` or IDE environment configuration.

---

## 5. Summary of Challenges

| Challenge | Severity | Recommended Action |
|-----------|----------|--------------------|
| Flyway sequential naming | **High** | Switch to timestamp-based (`V202409141200__...`). |
| ArchUnit from day one | **Medium** | Accept, but start with lenient rules. |
| Docker Compose as hard dependency | **Medium** | Support both Docker Compose and developer-managed PostgreSQL. |
| HikariCP defaults | **Medium** | Add explicit settings with comments (not tuning, just documentation). |
| Request ID + MDC in foundation | **Low** | Keep minimal (trivial filter only), defer full observability stack. |

---

## 6. What the Human Needs to Decide

To clear the **Human Technical Decision Gate**, the human developer must explicitly resolve the following:

1. **Flyway naming:** Accept timestamp-based migration names, or insist on sequential and document the branch-merge protocol?
2. **ArchUnit rules:** Accept lenient initial rules, or enforce strict boundaries from day one?
3. **Local PostgreSQL:** Support Docker Compose only, or both Docker Compose and developer-managed PostgreSQL?
4. **HikariCP:** Add explicit configuration block with defaults + comments, or rely on Spring Boot defaults?
5. **Request ID + MDC:** Keep a minimal filter, defer entirely, or build full frontend/backend correlation now?
6. **Lombok:** Defer, or add to foundation dependencies?
7. **Frontend API wrapper:** Add a minimal error-handling wrapper now, or defer until the first feature?

The Tech Lead does not make these decisions. The human developer does.

---

## 7. Traceability

- Architecture Proposal: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-architecture-proposal.md`
- ADR: `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`
- Prior Tech Lead Review: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-tech-lead-review.md`
- Task: `tasks/backlog/PROJECT-BOOTSTRAP-001.md`
- SPEC.md §2.3 — Start Simple.
- SPEC.md §13 — Local Environment.
- SPEC.md §27 — Observability.
- SPEC.md §30 — Performance Experiments.
- AGENTS.md §9 — Measure Before Optimizing.
- AGENTS.md §10 — Do not introduce technology without a concrete reason.
