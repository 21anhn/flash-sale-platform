# ADR-001 — Reservation Inventory Allocation Concurrency Model

**Status:** ACCEPTED  
**Decision ID:** ADR-001  
**Feature:** RESERVATION-001 — Reservation Module (Phase 1)  
**Date:** 2026-09-13  
**Author:** Solution Architect / Tech Lead  
**Approver:** Human Developer (Technical Decision Gate)

---

## 1. Decision

Use an **atomic conditional UPDATE** on `event_inventory` as the concurrency control mechanism for Phase 1 reservation inventory allocation.

```sql
UPDATE event_inventory
SET reserved_count = reserved_count + ?
WHERE event_id = ?
  AND reserved_count + sold_count + ? <= total_inventory;
```

The application determines success or failure by the number of rows updated (1 = success, 0 = failure). No `SELECT FOR UPDATE` pessimistic lock and no optimistic version-column retry loop is used in Phase 1.

---

## 2. Context

- The project is in Phase 1 — Modular Monolith.
- PostgreSQL is the authoritative transactional data store.
- The highest-priority business invariant is `sold_count + reserved_count <= total_inventory`.
- The Human Technical Decision Gate for the Reservation feature has concluded and accepted the concurrency model described here.
- The project philosophy (SPEC.md §2.1, AGENTS.md §8) states correctness before performance and starting simple (SPEC.md §2.3, AGENTS.md §10).

---

## 3. Problem

How should the reservation system allocate inventory when many concurrent users attempt to reserve tickets for the same flash-sale event?

The chosen mechanism must:

1. Guarantee the inventory invariant under high concurrency.
2. Be simple to implement and reason about in a modular monolith.
3. Avoid premature distributed complexity (no Redis, Kafka, or distributed locks in Phase 1).
4. Provide a foundation that can be benchmarked and replaced in later phases if evidence supports it.

---

## 4. Options Considered

### Option A — Pessimistic Row-Level Lock (`SELECT FOR UPDATE`)

Read the `event_inventory` row with `SELECT FOR UPDATE`, check availability in application code, then update.

### Option B — Optimistic Locking with Version Column

Read the row without locking, increment a `version` column, and rely on the database to reject updates where the version has changed.

### Option C — Atomic Conditional UPDATE

Issue a single `UPDATE` statement that both checks availability and increments `reserved_count` atomically, as shown in the Decision section.

---

## 5. Decision Rationale

### Why Not Option A

- Holds a database lock while the application validates the sale window, inserts the reservation row, and emits events.
- Longer lock duration increases lock wait time and contention.
- Deadlock risk if lock ordering conventions are violated.
- The Human Technical Decision Gate explicitly rejected pessimistic locking for Phase 1.

### Why Not Option B

- Under a flash-sale spike, the version conflict rate would be very high.
- Requires bounded retry loops with backoff; thundering retries can overload the database.
- More complex to reason about and test than a single atomic statement.
- Performance benefit is unproven without a baseline benchmark.

### Why Option C

- The availability check and inventory mutation happen in a single database statement.
- No application-level read-modify-write race condition.
- No long-lived lock held during business logic.
- Low deadlock risk because the lock scope is a single statement.
- Simple to implement, test, and operate in Phase 1.
- Provides a measurable baseline for future optimization experiments.

---

## 6. Consequences

### Positive

- Strong correctness guarantee for the inventory invariant.
- Simple implementation with minimal moving parts.
- Single-row contention is acceptable within the Phase 1 performance budget (100 reservations/sec per event, p99 < 500 ms).
- Easy to observe and benchmark: count rows updated, measure latency, identify contention.

### Negative

- The `event_inventory` row for a popular event becomes a hot spot.
- Throughput is bounded by PostgreSQL's ability to serialize updates on that row.
- If future benchmarks show the row is the bottleneck, a different mechanism (sharding, Redis, etc.) may be needed.

### Neutral

- Expiration and conversion must also use conditional UPDATE patterns to remain safe under multiple scheduler instances and overlapping operations.
- Idempotency must be enforced separately through a partial unique index or application-level check scoped to active reservations.

---

## 7. Related Decisions

- Idempotency keys are scoped to **active** reservations only. Reuse after expiration creates a new reservation.
- Reservation expiration is determined at query time by `expires_at`. A scheduler reclaims expired rows asynchronously as a safety net.
- Reservation → Order conversion is atomic: confirming a reservation as `Converted` happens inside the same database transaction as order creation.
- A single scheduler instance is acceptable for Phase 1, but all scheduler queries must remain safe if multiple instances run.

---

## 8. Compliance

This decision aligns with:

- SPEC.md §2.1 — Correctness before performance.
- SPEC.md §2.3 — Start simple.
- SPEC.md §17 — Inventory invariant.
- AGENTS.md §8 — Correctness before performance.
- AGENTS.md §10 — Do not introduce technology without a concrete reason.
- AGENTS.md §13 — Significant architectural decisions recorded as ADRs.

---

## 9. Traceability

- Architecture Proposal: `docs/architecture/proposals/RESERVATION-001-architecture-proposal.md`
- Task: `tasks/backlog/RESERVATION-001.md`
- Source Requirements: `docs/requirements/features/RESERVATION-001-product-requirement.md`
- Source Business Analysis: `docs/requirements/business/RESERVATION-001-business-analysis.md`
