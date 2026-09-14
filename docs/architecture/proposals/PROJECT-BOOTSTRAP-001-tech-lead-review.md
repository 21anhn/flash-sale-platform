# PROJECT-BOOTSTRAP-001 — Tech Lead Review

**Agent:** Tech Lead (`keui3u6`)  
**Role:** Tech Lead  
**Task:** PROJECT-BOOTSTRAP-001 — Project Foundation Bootstrap  
**Artifact:** Tech Lead Review  
**Status:** PROPOSED (Review of a PROPOSED artifact)  
**Production Code Impact:** None  

---

## 1. Summary of Proposal Strengths

The PROJECT-BOOTSTRAP-001 proposal, together with its supporting ADR-003, security review, and test strategy, is a well-structured foundation plan. Its strengths include:

1. **Adherence to the Start-Simple principle.** The proposal explicitly excludes Kafka, Redis, Kubernetes, authentication, API Gateway, and microservices from Phase 0, which aligns with SPEC.md §2.3 and AGENTS.md §10.
2. **Clear Phase 0 → Phase 1 evolution path.** The `services/monolith/` directory and package-by-service layout (`com.flashsale.user`, `com.flashsale.event`, etc.) provide a mechanical mapping to future service extraction.
3. **Reasonable technology defaults.** Gradle (Kotlin DSL), Vite, Flyway, and Testcontainers are all mainstream, well-supported choices for the stated stack.
4. **Explicit FE/BE connectivity contract.** The Vite proxy + narrow `local`-profile CORS strategy is pragmatic and avoids early CORS friction.
5. **Security-conscious defaults.** Secrets are externalized, CORS is profile-gated, and `.env` files are excluded from source control.
6. **Test harness readiness.** The proposal includes context-load tests, Testcontainers connectivity tests, and frontend smoke tests, which is the correct minimum for a foundation.
7. **Traceability.** Artifacts are cross-referenced and aligned with the repository structure defined in AGENTS.md §16.

---

## 2. Specific Criticisms

Each criticism follows the structure: **Problem → Why it matters → Possible consequence → Suggested direction.**

### C1 — Package-By-Service Boundaries Are Not Enforced

**Problem:** The proposal recommends package-by-service (`com.flashsale.user`, `com.flashsale.ticket`, etc.) within a single Gradle module, but there is no compile-time or build-time enforcement of these boundaries. Any class in the monolith can import any other class.

**Why it matters:** SPEC.md §16 (Data Ownership) states that a service must not directly access another service's database tables. In a monolith, the equivalent invariant is that a package must not directly access another package's repository or database tables. Without enforcement, this invariant relies entirely on code-review discipline, which degrades under time pressure.

**Possible consequence:** By Phase 2 (Microservices extraction), the team may discover that `order` code directly calls `ticket` repositories, `user` entities are referenced from `payment` services, and database transactions span multiple "service" packages. Refactoring into real services becomes a large, risky rewrite rather than a mechanical extraction.

**Suggested direction:** Consider adding a lightweight architectural test framework (e.g., ArchUnit) from day one. A single test class can enforce rules such as:
- `com.flashsale.order` must not depend on `com.flashsale.ticket.repository`.
- Only `com.flashsale.ticket` may access classes in `com.flashsale.ticket.repository`.

This adds minimal complexity but protects the boundary invariant. Alternatively, if the human developer prefers stricter boundaries, Gradle submodules with `implementation` dependencies (not `api`) provide compile-time enforcement at the cost of more build configuration.

---

### C2 — The `notification` Package Is Specified Without Clear Ownership

**Problem:** The proposal includes `com.flashsale.notification` as a top-level package, but notification logic is inherently cross-cutting. In Phase 1, notifications may not exist as a standalone domain; they may be simple in-process calls or logging statements.

**Why it matters:** Creating a package too early encourages building abstractions before there is a concrete requirement. SPEC.md §2.3 warns against introducing technology or structure without a concrete reason.

**Possible consequence:** The `notification` package becomes a dumping ground for logging, email stubs, and unrelated utility code, diluting the package-by-service boundary model.

**Suggested direction:** Omit `com.flashsale.notification` from the initial package structure. If a notification requirement emerges in Phase 1, create the package then. Until then, notification concerns (if any) can live in `com.flashsale.common` or within the domain package that triggers the notification (e.g., `order`).

---

### C3 — No Guidance on Transaction Boundary Ownership

**Problem:** The proposal defines packages but says nothing about who owns a Spring `@Transactional` boundary. In a monolith, it is easy for a controller in `event` to call services in `ticket` and `order`, wrapping everything in an implicit or explicit transaction.

**Why it matters:** The core invariant `sold + reserved <= total_inventory` will eventually require careful transaction design. If the foundation does not establish a convention (e.g., "transactions are owned by the application service in the same package as the primary entity being modified"), developers will create implicit distributed transactions within the monolith.

**Possible consequence:** Long-running transactions spanning multiple future service boundaries, lock contention, and difficulty reasoning about rollback behavior when extraction to microservices begins.

**Suggested direction:** Add a lightweight convention document (even a `README.md` inside `services/monolith/`) stating:
- A transaction boundary should be owned by the service layer of the domain package that owns the primary entity being written.
- Cross-package service calls are allowed for reads, but writes that require atomicity should be reconsidered and documented.

This is a convention, not code, but it sets the mental model before business logic arrives.

---

### C4 — Database Migration Strategy Is Under-Specified for Multi-Developer Workflows

**Problem:** The proposal selects Flyway and creates a migration directory, but it does not specify migration naming conventions, baseline strategy, or how multiple developers working on different features will avoid migration conflicts.

**Why it matters:** In Phase 1, multiple feature tasks (e.g., `RESERVATION-001`, `EVENT-001`) may each add migrations. Without a convention, two developers may create `V2__add_reservation.sql` and `V2__add_event.sql` on separate branches, causing a merge conflict that Flyway detects only at runtime.

**Possible consequence:** Broken local environments, failed CI builds, and developers manually repairing `flyway_schema_history`.

**Suggested direction:** Document a migration convention now, before the first feature migration is written. For example:
- Use timestamp-based versions (`V202409141200__description.sql`) instead of sequential integers to avoid merge collisions.
- Or, establish a branch-merge protocol where migrations are rebased and renumbered before merge.

Timestamp-based versioning is simpler and scales better for a team.

---

### C5 — Environment Variable Strategy Is Inconsistent Between Local and Test

**Problem:** The proposal states that `local` profile uses environment variables (`DB_URL`, `DB_USER`, `DB_PASSWORD`), while `test` uses Testcontainers with auto-generated credentials. However, it does not specify how a developer running the application locally via IDE or command line should supply these variables.

**Why it matters:** If the setup friction is too high, developers will hardcode credentials in `application-local.yml` "just to get it working," violating the security review's BR-3.

**Possible consequence:** Credentials committed to source control, or developers bypassing the `local` profile and running tests against their local PostgreSQL, causing test data pollution.

**Suggested direction:** Provide a concrete local development setup recommendation in the task or a `README.md` inside `services/monolith/`:
- Option A: A `.env.example` file and instructions to copy it to `.env`, with a note that the Spring Boot application can be started with `export $(cat .env | xargs)` or via IDE environment variable configuration.
- Option B: `application-local.yml` uses safe defaults (`jdbc:postgresql://localhost:5432/flashsale`, `flashsale` / `flashsale`) but **only** for local development, with a prominent comment warning that production credentials must never be added.

Either approach is acceptable, but the proposal must be explicit. Ambiguity leads to workarounds.

---

### C6 — No Mention of Database Connection Pool Sizing or Timeouts

**Problem:** The foundation will include Spring Boot Data JPA and a PostgreSQL driver, but the proposal does not mention HikariCP (the default connection pool) configuration.

**Why it matters:** Even in Phase 1, default connection pool settings (e.g., 10 connections) may be fine, but the foundation is the right place to establish that connection limits and timeouts are conscious decisions, not accidents.

**Possible consequence:** When Phase 4 (High Traffic) arrives, the team discovers that the application has been running with default pool settings that are inappropriate for load. Changing them later is easy, but the lack of a convention means no one has thought about it.

**Suggested direction:** Add a minimal HikariCP configuration block to `application.yml` with conservative defaults and comments explaining each value. For example:
```yaml
spring.datasource.hikari.maximum-pool-size: 10
spring.datasource.hikari.connection-timeout: 30000
spring.datasource.hikari.idle-timeout: 600000
spring.datasource.hikari.max-lifetime: 1800000
```
This documents the intent: "We have considered connection pooling."

---

### C7 — The `test` Profile Uses Testcontainers, but No Container Reuse Strategy Is Defined

**Problem:** The test strategy mentions Testcontainers PostgreSQL but does not specify whether each test class starts a fresh container or whether containers are reused across the suite.

**Why it matters:** Testcontainers startup is slow. If every context-load test spins up a new PostgreSQL container, the feedback loop for developers will degrade quickly.

**Possible consequence:** Developers stop running integration tests locally, or they annotate tests with `@Disabled` to save time, defeating the purpose of the test harness.

**Suggested direction:** Specify a container reuse strategy in the test strategy or implementation plan. For example:
- Use a single shared PostgreSQL container for the entire JVM test run (e.g., via a `@TestConfiguration` or a base test class).
- Or, use `@DynamicPropertySource` with a static container that is started once.
- Document that each test class should use `@Transactional` + `@Rollback` to isolate test data, rather than starting a new container.

---

### C8 — Observability Plan Is Too Thin for a Foundation

**Problem:** The observability section mentions only Spring Boot Actuator `/actuator/health` and default SLF4J/Logback logging. It does not mention log formatting, correlation IDs, or how a developer will debug a failing request in Phase 1.

**Why it matters:** SPEC.md §27 requires `trace_id`, `span_id`, and `request_id` for all services. While distributed tracing (OpenTelemetry) is deferred to Phase 6, the foundation should at least generate and propagate a `request_id` so that logs from the backend and frontend can be correlated during local development.

**Possible consequence:** When the first bug appears in Phase 1, developers grep through unstructured logs without a correlation key, wasting time.

**Suggested direction:** Add a simple `request_id` generation and logging convention:
- A servlet filter or Spring `OncePerRequestFilter` generates a `request_id` (UUID) and stores it in MDC.
- Logback pattern includes `%X{request_id}`.
- The frontend includes the same `X-Request-Id` header in API calls.

This is a ~20-line filter and a log pattern change. It costs almost nothing and establishes the observability mindset before Phase 6.

---

### C9 — CORS Configuration Has a Hidden Production Risk

**Problem:** The security review recommends allowing CORS only in the `local` profile, restricted to `http://localhost:5173`. However, the architecture proposal says "a minimal Spring CORS configuration is still recommended for `local` profile only."

**Why it matters:** Spring Boot profile-specific configuration is powerful but error-prone. If a developer accidentally copies `application-local.yml` to `application-prod.yml` or enables the `local` profile in a staging environment, CORS becomes wide open.

**Possible consequence:** Unrestricted cross-origin access in a non-production environment, which may expose unauthenticated endpoints to phishing sites during early demos or stakeholder reviews.

**Suggested direction:** Recommend that CORS configuration be **explicitly disabled by default** and enabled only when a specific property (e.g., `app.cors.enabled=true`) is set. The `local` profile sets this property, but the default `application.yml` does not. This adds a second gate and reduces the risk of profile misconfiguration.

---

### C10 — The Frontend Proxy Strategy Hides CORS Issues That Will Appear in Production

**Problem:** The Vite dev-server proxy forwards `/api` to `localhost:8080`, which means the frontend never makes a cross-origin request during local development. CORS issues will only surface when the application is deployed to separate hosts.

**Why it matters:** This is acceptable for Phase 0–1, but the team should be aware that the proxy is a local-development convenience, not a production architecture. If the frontend code assumes same-origin behavior (e.g., relying on default cookie handling without `credentials: 'include'`), production integration will fail.

**Possible consequence:** A working local demo fails when deployed because cookies or headers behave differently across origins.

**Suggested direction:** Document this explicitly in the frontend setup notes: "The Vite proxy is for local development only. The frontend must use absolute API paths and explicit fetch/Axios configuration so that the transition to separate origins in later phases is mechanical."

---

### C11 — No Guidance on Frontend Error Handling or Loading States

**Problem:** The frontend skeleton includes a landing page that calls `/actuator/health`, but the proposal does not establish a pattern for handling API errors, loading states, or network timeouts.

**Why it matters:** The first business feature will need these patterns. If every developer invents their own, the frontend will accumulate inconsistent error handling.

**Possible consequence:** Inconsistent user experience, unhandled promise rejections, and difficulty adding global error boundaries later.

**Suggested direction:** Include a minimal API client wrapper (e.g., an Axios instance with interceptors or a thin `fetch` wrapper) in the `src/api/` directory from the start. This wrapper should:
- Attach the `X-Request-Id` header.
- Handle HTTP errors consistently.
- Return a typed result (e.g., `{ data: T | null, error: ApiError | null, loading: boolean }`).

This is not over-engineering; it is establishing a convention.

---

### C12 — The Task Definition Mixes "Implementation" and "Verification" Responsibilities

**Problem:** The task file (`tasks/backlog/PROJECT-BOOTSTRAP-001.md`) lists many implementation details (e.g., "Backend package structure," "Flyway migration directory layout") under "Human Implementation Responsibility," but also includes verification steps that depend on those details being correct.

**Why it matters:** This is a minor process issue, but it blurs the line between "what to build" and "how to verify." The Definition of Done includes "Architecture proposal and ADR are accepted or updated," which creates a circular dependency: the task cannot be DONE until the ADR is accepted, but the ADR is part of the task's output.

**Possible consequence:** Confusion about whether the human developer should update the ADR after implementation, or whether the ADR must be accepted before implementation begins.

**Suggested direction:** Clarify in the task that the ADR and architecture proposal are **inputs** to implementation (they must be accepted at the Human Technical Decision Gate before coding begins), and the Definition of Done applies to the **code and tests** produced after that gate.

---

### C13 — Missing Failure Scenario: Flyway Baseline in a Non-Empty Database

**Problem:** The failure scenarios table mentions "Flyway migration checksum mismatch" but does not mention what happens if Flyway is introduced against a database that already contains tables (e.g., a developer's local PostgreSQL that was used for experiments).

**Why it matters:** This is a common local development friction point. A developer may have created tables manually before Flyway was configured, then starts the application and sees Flyway fail because the schema is not empty.

**Possible consequence:** Developers manually dropping tables or disabling Flyway to "fix" the issue, losing data or bypassing migrations.

**Suggested direction:** Add a failure scenario and recovery step:
- **Failure:** Flyway refuses to baseline because the schema is not empty.
- **Recovery:** For local development only, run `flyway baseline` or drop/recreate the database. Document this in a `LOCAL_SETUP.md`.

---

### C14 — No Mention of Gradle Wrapper or Node Version Locking

**Problem:** The proposal recommends Gradle and npm but does not mention the Gradle Wrapper (`gradlew`) or a Node version manager (e.g., `.nvmrc`).

**Why it matters:** Build reproducibility is a foundation concern. If developers use different Gradle or Node versions, build behavior may diverge.

**Possible consequence:** "Works on my machine" issues, CI failures due to version mismatches, and time lost debugging environment differences.

**Suggested direction:** Explicitly state that the Gradle Wrapper must be committed and that a `.nvmrc` (or `package.json` `engines` field) should specify the Node version. This is standard practice but worth calling out.

---

## 3. Open Questions Requiring Human Decision

The following questions must be answered by the human developer before implementation begins:

1. **Build tool confirmation:** Do you accept Gradle (Kotlin DSL), or do you prefer Maven? This affects the entire backend skeleton.
2. **Module boundary enforcement:** Do you want ArchUnit tests or Gradle submodules from day one, or are you comfortable with package-private discipline and code review?
3. **Migration versioning:** Do you prefer sequential (`V1`, `V2`) or timestamp-based (`V202409141200`) Flyway migration names?
4. **Local database setup:** Should a `docker-compose.yml` for PostgreSQL be created as part of this task, or do you prefer developer-managed instances?
5. **Lombok vs. records:** Do you want Lombok in the dependency list, or do you prefer Java records and explicit constructors?
6. **Frontend state management:** Defer until first feature, or pick a default now (e.g., React Context, Zustand, Redux Toolkit)?
7. **Request ID / logging:** Do you want a simple `request_id` filter in the foundation, or defer to Phase 6?
8. **Notification package:** Keep `com.flashsale.notification` in the initial package structure, or remove it until needed?
9. **HikariCP configuration:** Add explicit pool settings in `application.yml` now, or rely on Spring Boot defaults?

---

## 4. Overall Assessment

**Status:** `NEEDS_REVISION`

The PROJECT-BOOTSTRAP-001 proposal is a solid starting point, but it needs refinement in four areas before the Human Technical Decision Gate can be cleared:

1. **Boundary enforcement:** The proposal must address how package-by-service boundaries will be protected (ArchUnit, submodules, or explicit convention).
2. **Operational conventions:** Migration naming, environment variable setup, connection pool defaults, and Testcontainers reuse must be specified.
3. **Observability foundation:** A minimal `request_id` and structured logging convention should be added.
4. **Security hardening:** CORS should be gated by an explicit property, not just a profile, and the frontend proxy limitation should be documented.

The core technology choices (Gradle, Vite, Flyway, Testcontainers) are sound and do not need to change. The proposal's spirit—start simple, evolve toward microservices—is correct. However, the devil is in the details of conventions that, if omitted now, will become expensive to retrofit once Phase 1 business logic arrives.

**Recommended next step:** The Solution Architect should revise the architecture proposal to incorporate the suggested directions for C1–C14, and the human developer should answer the open questions above. Once revised, the Tech Lead will re-review before the Human Technical Decision Gate.

---

## 5. Traceability

- Architecture Proposal: `docs/architecture/proposals/PROJECT-BOOTSTRAP-001-architecture-proposal.md`
- ADR: `docs/architecture/decisions/ADR-003-project-bootstrap-001-technical-decisions.md`
- Security Review: `docs/security/PROJECT-BOOTSTRAP-001-security-review.md`
- Test Strategy: `docs/testing/PROJECT-BOOTSTRAP-001-test-strategy.md`
- Task: `tasks/backlog/PROJECT-BOOTSTRAP-001.md`
- SPEC.md §2.3 — Start Simple.
- SPEC.md §16 — Data Ownership.
- SPEC.md §27 — Observability.
- SPEC.md §36 — Repository Structure.
- SPEC.md §37 — Phase 0 / Phase 1 scope.
- AGENTS.md §10 — Do not introduce technology without a concrete reason.
- AGENTS.md §16 — AI Artifact and File Structure.
