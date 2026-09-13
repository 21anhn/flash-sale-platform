# RESERVATION-001 — Test Strategy: Reservation Module (Phase 1)

**Status:** PROPOSED  
**Feature ID:** RESERVATION-001  
**Phase:** Phase 1 — Modular Monolith  
**Source Requirement:** `docs/requirements/features/RESERVATION-001-product-requirement.md`  
**Source Architecture:** `docs/architecture/proposals/RESERVATION-001-architecture-proposal.md`  
**Owner:** Test Engineer

---

## 1. Goal

Define the testing approach that proves the Reservation module meets its functional, correctness, security, and performance requirements before it is accepted as complete.

---

## 2. Test Levels

### 2.1 Unit Tests

**Scope:** Individual classes with mocked dependencies.

**Components to cover:**

- `ReservationService` — happy path, no inventory, invalid input, idempotency, status transitions.
- `ReservationExpirationScheduler` — batch selection, per-row expiration call, no double-call.
- `ReservationController` — validation mapping, auth extraction, HTTP status mapping.
- `EventInventoryRepository` — conditional UPDATE returns correct row counts.

**Tools:** JUnit 5, Mockito, AssertJ.

### 2.2 Integration Tests with Testcontainers

**Scope:** Service + real PostgreSQL via Testcontainers.

**Scenarios:**

- Reserve when inventory is available.
- Reserve when inventory is exhausted returns 409.
- Duplicate `Idempotency-Key` returns the same reservation.
- Reservation expires and inventory is restored.
- Conversion decrements reserved and increments sold.
- Cancellation decrements reserved only.
- User A cannot read User B's reservation.

**Tools:** Spring Boot Test, Testcontainers (PostgreSQL), REST Assured or MockMvc.

### 2.3 Concurrency Tests

**Scope:** Prove the inventory invariant under contention.

**Scenario:**

- 100 tickets available, 500 parallel reservation attempts for 1 ticket each.
- Expected: exactly 100 reservations succeed, 400 fail, `sold + reserved <= total_inventory` holds at all times.

**Scenario:**

- 1 ticket available, 500 parallel reservation attempts for 1 ticket each.
- Expected: exactly 1 reservation succeeds, 499 fail.

**Tools:** JUnit 5 with `ExecutorService`, Awaitility, or k6 for higher load.

### 2.4 Expiration Tests

**Scope:** Scheduler and query-time expiration semantics.

**Scenarios:**

- Advance clock past `expires_at`; scheduler reclaims the row and inventory.
- Multiple scheduler runs on the same expired row do not double-release inventory.
- Conversion of a reservation that has just expired returns 409.

**Tools:** Testcontainers + `@Sql` or direct clock manipulation.

### 2.5 Failure-Injection Tests

**Scope:** Recovery from failures.

**Scenarios:**

- Kill the application mid-reservation; restart and verify idempotency returns the existing reservation.
- Database connection loss during reservation; transaction rolls back and inventory is unchanged.
- Scheduler restart mid-batch; next run completes without double-release.
- Duplicate retry after successful commit returns the same reservation.

**Tools:** Testcontainers, Toxiproxy (for network latency/loss), or manual process restart.

### 2.6 API Contract Tests

**Scope:** Request/response shape for `POST /api/v1/reservations` and `GET /api/v1/reservations/{id}`.

**Scenarios:**

- Valid request produces the documented response fields and status codes.
- Invalid request bodies produce 400 with clear error messages.
- Unauthorized requests produce 401.
- Conflict requests produce 409.

**Tools:** Spring Cloud Contract or REST Assured.

---

## 3. Verification Criteria

| Criterion | How Verified |
|---|---|
| Inventory invariant | Concurrency tests and integration tests assert `sold_count + reserved_count <= total_inventory` after every operation. |
| No overselling | 1-ticket / many-user concurrency test produces exactly 1 success. |
| Idempotency | Duplicate key requests return identical reservation and do not change inventory counts. |
| Expiration | Scheduler test restores inventory to expected value after TTL. |
| Conversion atomicity | Integration test verifies `Converted` status and inventory movement inside a single transaction. |
| Authorization | Non-owner GET returns 404 and does not leak data. |
| Performance budget | k6 or JMeter baseline shows 100 reservations/sec per event with p99 < 500 ms. |

---

## 4. Test Data Strategy

- Use fixed UUIDs for deterministic integration tests.
- Pre-seed `events` and `event_inventory` rows in Testcontainers setup.
- Clean database state between tests with `@Transactional` rollback or `@Sql` cleanup.

---

## 5. Tools and Environment

- JUnit 5
- Mockito
- AssertJ
- Spring Boot Test
- Testcontainers (PostgreSQL)
- REST Assured / MockMvc
- k6 (for Phase 1 performance baseline)
- Awaitility
- Toxiproxy (optional, for failure injection)

---

## 6. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Concurrency tests are flaky | Use fixed thread pools, deterministic assertions, and Awaitility for async conditions. |
| Testcontainers startup is slow | Reuse containers across test class where possible; separate slow integration tests from fast unit tests. |
| Scheduler timing is non-deterministic | Use a controlled clock or query the database repeatedly with Awaitility. |
| Performance baseline environment differs from production | Document environment and run baseline on consistent hardware; treat numbers as relative, not absolute. |

---

## 7. Traceability

- Source Requirement: `docs/requirements/features/RESERVATION-001-product-requirement.md`
- Source Architecture: `docs/architecture/proposals/RESERVATION-001-architecture-proposal.md`
- Source ADR: `docs/architecture/decisions/ADR-001-reservation-concurrency-model.md`
- Task: `tasks/backlog/RESERVATION-001.md`
- SPEC.md §35 — Testing strategy.
