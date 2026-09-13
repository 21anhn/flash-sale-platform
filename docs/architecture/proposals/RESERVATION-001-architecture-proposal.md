# RESERVATION-001 — Architecture Proposal: Reservation Module (Phase 1)

**Status:** ACCEPTED  
**Feature ID:** RESERVATION-001  
**Phase:** Phase 1 — Modular Monolith  
**Source Requirement:** `docs/requirements/features/RESERVATION-001-product-requirement.md`  
**Source Business Analysis:** `docs/requirements/business/RESERVATION-001-business-analysis.md`  
**Owner:** Solution Architect

---

## 1. Problem

Design the reservation subsystem for Phase 1 so that:

1. Inventory is never oversold under concurrency.
2. Reservations expire reliably and release inventory.
3. Idempotency protects against duplicate reservation creation.
4. Order confirmation atomically converts a reservation into a sale.
5. The design remains simple enough for a modular monolith and can evolve into microservices/event-driven phases.

---

## 2. Context

- Phase 1 is a Spring Boot modular monolith using PostgreSQL as the single source of truth.
- No Redis, Kafka, or distributed locks are used for reservation allocation in Phase 1.
- The inventory invariant `sold_count + reserved_count <= total_inventory` is the highest-priority correctness constraint.
- The Human Technical Decision Gate has accepted the concurrency model described below.

---

## 3. Proposed Solution

Implement the reservation capability inside the **ticket-service module** of the Phase 1 modular monolith. The module owns:

- `EventInventory` aggregate (single row per event in Phase 1).
- `Reservation` aggregate.
- Reservation lifecycle operations: `reserve`, `expire`, `convert`, `cancel`.

Inventory allocation is performed with an **atomic conditional UPDATE** on `event_inventory`. No `SELECT FOR UPDATE` or application-level read-modify-write is used.

```sql
UPDATE event_inventory
SET reserved_count = reserved_count + ?
WHERE event_id = ?
  AND reserved_count + sold_count + ? <= total_inventory;
```

The number of updated rows (0 or 1) tells the application whether allocation succeeded or failed.

---

## 4. Component Responsibilities

| Component | Responsibility |
|---|---|
| `ReservationController` | Accepts `POST /api/v1/reservations` and `GET /api/v1/reservations/{id}`; validates input; extracts `userId` from JWT; passes `Idempotency-Key` to the service; returns correct HTTP status codes. |
| `ReservationService` | Owns reservation domain logic and transaction boundaries: `reserve`, `expire`, `convert`, `cancel`, `getForOwner`. |
| `ReservationRepository` | JPA repository for `Reservation`. Provides `findById`, `findByUserIdAndIdempotencyKeyAndStatus`, and queries for expired active reservations. |
| `EventInventoryRepository` | Provides the atomic conditional `UPDATE` via a native query or JPQL equivalent. |
| `EventInventory` | Aggregate root for ticket counts. The database enforces `sold_count + reserved_count <= total_inventory` as a safety net. |
| `Reservation` | Entity representing a hold. Tracks `eventId`, `userId`, `quantity`, `status`, `expiresAt`, `idempotencyKey`. |
| `ReservationExpirationScheduler` | Spring `@Scheduled` job that periodically finds expired `Reserved` rows and calls `ReservationService.expire` in small, independent transactions. |
| `ReservationEventPublisher` | Publishes `TicketReserved` and `ReservationExpired` domain events. In Phase 1 this is an in-process Spring event publisher; in Phase 3 it becomes a transactional outbox. |

---

## 5. Data Model

### 5.1 `events`

Owned by event-service.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. |
| `name` | VARCHAR | Event name. |
| `sale_starts_at` | TIMESTAMP | Sale open time. |
| `sale_ends_at` | TIMESTAMP | Sale close time. |
| `status` | ENUM | e.g., Draft, Published. |

### 5.2 `event_inventory`

Owned by ticket-service. Single row per event in Phase 1.

| Column | Type | Notes |
|---|---|---|
| `event_id` | UUID | Primary key, FK to `events.id`. |
| `total_inventory` | INT NOT NULL | Total tickets for sale. |
| `sold_count` | INT NOT NULL DEFAULT 0 | Tickets already sold. |
| `reserved_count` | INT NOT NULL DEFAULT 0 | Tickets currently reserved. |

**Constraints:**

```sql
CHECK (sold_count + reserved_count <= total_inventory)
```

**Indexes:**

- Primary key on `event_id`.

### 5.3 `reservations`

Owned by ticket-service.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. |
| `event_id` | UUID | FK to `events.id`. |
| `user_id` | UUID | FK to `users.id`. |
| `quantity` | INT NOT NULL | Positive integer. |
| `status` | VARCHAR/ENUM | `Reserved`, `Expired`, `Converted`. |
| `expires_at` | TIMESTAMP NOT NULL | TTL deadline. |
| `idempotency_key` | VARCHAR NOT NULL | Per-user idempotency key. |
| `created_at` | TIMESTAMP | Audit. |
| `updated_at` | TIMESTAMP | Audit. |

**Constraints:**

```sql
UNIQUE (user_id, idempotency_key, status)
-- Partial unique index on status = 'Reserved' is preferred if supported;
-- otherwise enforce active-scoping in application code.
```

> Approved decision: idempotency key is scoped to **active** reservations only. Reuse after expiration creates a new reservation. PostgreSQL partial unique indexes (`WHERE status = 'Reserved'`) can enforce this directly.

**Indexes:**

- `reservations(event_id, status, expires_at)` — supports scheduler query for expired rows.
- `reservations(user_id, idempotency_key, status)` — supports idempotency lookup.
- `reservations(event_id, user_id, status)` — supports per-user reservation queries and abuse checks.

---

## 6. Control Flow

### 6.1 Create Reservation

```text
POST /api/v1/reservations
        |
        v
Controller validates eventId, quantity, Idempotency-Key format
        |
        v
Extract userId from JWT (never from request body)
        |
        v
BEGIN TRANSACTION
        |
        v
Check active idempotency: SELECT reservations
        WHERE user_id = ? AND idempotency_key = ? AND status = 'Reserved'
        |
        +-- Found --> return existing reservation; COMMIT
        |
        +-- Not found
              |
              v
        Validate event sale is open
              |
              v
        Atomic conditional UPDATE on event_inventory
              |
              +-- 0 rows updated --> return 409; ROLLBACK
              |
              +-- 1 row updated
                    |
                    v
              INSERT Reservation (status=Reserved, expiresAt=now+ttl)
                    |
                    v
              Publish TicketReserved (Phase 1: in-process)
                    |
                    v
              COMMIT
                    |
                    v
        Return 201 + reservation DTO
```

### 6.2 Expire Reservation

```text
Scheduler @Scheduled(fixedDelay=...)
        |
        v
SELECT id, event_id, quantity FROM reservations
        WHERE status = 'Reserved' AND expires_at <= now
        LIMIT batch_size
        |
        v
For each reservation:
        BEGIN TRANSACTION
              |
              v
        Atomic conditional UPDATE on event_inventory:
            UPDATE event_inventory
            SET reserved_count = reserved_count - ?
            WHERE event_id = ?
              AND reserved_count >= ?;
              |
              v
        UPDATE reservations SET status = 'Expired' WHERE id = ? AND status = 'Reserved'
              |
              v
        Publish ReservationExpired (Phase 1: in-process)
              |
              v
        COMMIT
```

The conditional decrement guards against double-release when multiple scheduler instances run concurrently or when the scheduler overlaps with a conversion.

### 6.3 Confirm Reservation as Sold (Order Conversion)

```text
Order creation flow
        |
        v
BEGIN TRANSACTION (order scope)
        |
        v
Create Order row
        |
        v
ReservationService.convert(reservationId, orderId)
        |
        v
SELECT Reservation FOR UPDATE (or rely on status check)
        WHERE id = ? AND status = 'Reserved' AND expires_at > now
        |
        +-- Not found --> ROLLBACK order; return 409
        |
        +-- Found
              |
              v
        Atomic conditional UPDATE on event_inventory:
            UPDATE event_inventory
            SET reserved_count = reserved_count - ?,
                sold_count = sold_count + ?
            WHERE event_id = ?
              AND reserved_count >= ?;
              |
              v
        UPDATE reservations SET status = 'Converted' WHERE id = ? AND status = 'Reserved'
              |
              v
        Publish OrderConfirmed / reservation converted event
        |
        v
COMMIT
```

> Approved decision: confirming a reservation as `Converted` happens inside the **same database transaction** as order creation.

### 6.4 Cancel Reservation (Internal)

Same as expiration, but triggered by order/payment failure handling rather than the scheduler.

---

## 7. Concurrency Model

The core concurrency mechanism is the atomic conditional UPDATE:

```sql
UPDATE event_inventory
SET reserved_count = reserved_count + ?
WHERE event_id = ?
  AND reserved_count + sold_count + ? <= total_inventory;
```

This UPDATE is serializable at the database level for the same `event_id` row. It guarantees:

- No read-modify-write race conditions.
- No overselling.
- No `SELECT FOR UPDATE` hot lock held during business logic.

The scheduler and conversion paths use a similar conditional UPDATE pattern so that multiple scheduler instances or overlapping conversion/expiration operations remain safe.

Idempotency is enforced by checking for an active reservation with the same `(user_id, idempotency_key)` before attempting inventory allocation. A partial unique index on `status = 'Reserved'` provides a database-level guarantee.

---

## 8. Failure Scenarios and Recovery

| Failure | Behavior | Recovery |
|---|---|---|
| Service crash before transaction commit. | No DB changes persisted. | Client retries with same idempotency key. |
| Service crash after commit but before HTTP response. | Reservation exists; client thinks it failed. | Idempotency returns existing reservation on retry. |
| DB connection loss during reserve. | Transaction rolls back. | Return 503; client may retry. |
| Scheduler crashes mid-batch. | Some rows remain unprocessed. | Scheduler is stateless; next run processes remaining expired rows. |
| Multiple scheduler instances run. | Conditional UPDATEs serialize; only `Reserved` rows are changed. | No special recovery needed. |
| Order conversion overlaps with scheduler expiration. | Both paths update the same inventory row atomically and re-check reservation status. | Only one succeeds; the other is a no-op or returns a conflict. |
| Conversion fails after inventory decrement. | Rollback of the order transaction restores inventory and reservation status. | — |

---

## 9. Observability Plan

### 9.1 Logs

- Structured JSON logs with `trace_id`, `span_id`, `request_id`, `user_id`, `event_id`, `reservation_id`.
- INFO on successful reservation, expiration, conversion.
- WARN on inventory conflict, rate-limit hit, expired conversion attempt.
- ERROR on DB failures and unexpected exceptions.

### 9.2 Metrics (Micrometer)

| Metric | Type | Labels |
|---|---|---|
| `reservation.created` | Counter | `event_id`, `status` |
| `reservation.failed` | Counter | `event_id`, `reason` |
| `reservation.expired` | Counter | `event_id` |
| `reservation.converted` | Counter | `event_id` |
| `reservation.active` | Gauge | `event_id` |
| `reservation.duration_ms` | Timer | `operation` |
| `inventory.available` | Gauge | `event_id` |
| `scheduler.expiration.batch_size` | Gauge | — |
| `db.allocation.rows_updated` | Counter | `event_id` |

### 9.3 Traces

OpenTelemetry spans for:

- `POST /api/v1/reservations`
- `GET /api/v1/reservations/{id}`
- `ReservationService.reserve`
- `ReservationService.expire`
- `ReservationService.convert`
- Scheduler run span.

---

## 10. Alternatives and Trade-offs

| Approach | Pros | Cons | Phase 1 Fit |
|---|---|---|---|
| **Atomic conditional UPDATE** (accepted) | Simple, correct, no long-lived locks, low deadlock risk. | Single-row contention limits peak throughput per event. | Best fit for Phase 1 correctness budget. |
| Pessimistic lock (`SELECT FOR UPDATE`) | Easy to reason about; serializes all mutations. | Holds lock during business logic; higher lock wait; deadlock risk if ordering inconsistent. | Rejected at the Human Technical Decision Gate. |
| Optimistic locking with version column | No long-lived locks; good read scalability. | High conflict rate under flash-sale spikes; requires retry logic and thundering-herd mitigation. | Rejected for Phase 1; may be measured in Phase 4+. |
| Sharded inventory rows | Distributes contention; higher throughput. | High complexity; bucket balancing; more complex queries. | Out of scope for Phase 1. |

---

## 11. Open Questions

- Exact default and maximum reservation quantity per request (to be decided during implementation by the human developer / Tech Lead).
- Scheduler frequency and batch size (to be tuned during implementation and benchmarking).
- Whether to use a PostgreSQL partial unique index for active idempotency keys or enforce active-scoping in application code.

---

## 12. Traceability

- Source Requirement: `docs/requirements/features/RESERVATION-001-product-requirement.md`
- Source Business Analysis: `docs/requirements/business/RESERVATION-001-business-analysis.md`
- Decision: `docs/architecture/decisions/ADR-001-reservation-concurrency-model.md`
- Task: `tasks/backlog/RESERVATION-001.md`
- SPEC.md §17, §18, §22, §26, §37.
