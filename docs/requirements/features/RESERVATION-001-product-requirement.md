# RESERVATION-001 — Product Requirement: Reservation Module (Phase 1)

**Status:** ACCEPTED  
**Feature ID:** RESERVATION-001  
**Phase:** Phase 1 — Modular Monolith  
**Source:** SPEC.md §17-18, §22, §26, §37  
**Owner:** Product Owner

---

## 1. Feature Goal and Business Value

The Reservation feature gives a user a short, bounded time window to complete payment after selecting tickets during a flash sale. By temporarily removing tickets from available inventory, the platform prevents overselling while preserving a good user experience.

Business value:

- Prevents overselling during extreme traffic spikes.
- Gives legitimate buyers time to complete payment without losing their selected tickets.
- Automatically returns unclaimed inventory to the pool so other buyers can purchase.
- Provides a clear hand-off point between ticket selection, order creation, and payment.

---

## 2. Scope

### In Scope (Phase 1)

- Authenticated users can create a reservation for an event that is on sale.
- A reservation holds a configurable quantity of tickets for a configurable TTL (default 10 minutes per SPEC.md §18).
- Creating a reservation decreases available inventory by the reserved quantity.
- A reservation can be viewed by its owner through `GET /api/v1/reservations/{id}`.
- Expired reservations are reclaimed automatically and their inventory is released.
- A reservation is converted to a sale atomically inside the same transaction as order creation.
- Idempotency key support for `POST /api/v1/reservations` to protect against duplicate requests.
- Domain event stubs for `TicketReserved` and `ReservationExpired` (in-process in Phase 1; Kafka in Phase 3).

### Out of Scope (Phase 1)

- Redis cache for inventory reads.
- Kafka / transactional outbox (event stubs only).
- Distributed locks or sharded inventory rows.
- Public cancellation endpoint (cancellation is internal-only, driven by payment failure or scheduler expiration).
- Advanced abuse controls beyond basic rate limiting and input validation.
- Production-grade horizontal scaling of the scheduler (safe for multiple instances, but only one required).

---

## 3. Acceptance Criteria

### A1 — Happy Path Reservation

Given an event with 100 tickets and 0 reserved/sold, when an authenticated user creates a reservation for 2 tickets, then:

- HTTP 201 Created is returned.
- The response contains `id`, `eventId`, `userId`, `quantity=2`, `status=Reserved`, `expiresAt`, and `createdAt`.
- `expiresAt` is approximately 10 minutes after `createdAt`.
- `event_inventory.reserved_count` becomes 2.
- `sold + reserved <= total_inventory` holds.

### A2 — Insufficient Inventory

Given an event with 0 available tickets, when a user attempts to reserve, then:

- HTTP 409 Conflict is returned.
- No reservation row is created.
- Inventory counts remain unchanged.

### A3 — Idempotent Reservation Creation

Given a successful reservation creation with `Idempotency-Key: ABC`, when the same user repeats the same request with the same key while the prior reservation is still active, then:

- The same reservation is returned.
- Inventory is not decremented a second time.

### A4 — Expiration Releases Inventory

Given a reservation with `quantity=2` and `reserved_count=2`, when the reservation TTL passes and the scheduler reclaims expired rows, then:

- The reservation status becomes `Expired`.
- `event_inventory.reserved_count` becomes 0.
- `sold + reserved <= total_inventory` holds.

### A5 — Conversion to Sale

Given a `Reserved` reservation, when an order is created and confirmed inside the same database transaction, then:

- The reservation status becomes `Converted`.
- `event_inventory.reserved_count` decreases by the reservation quantity.
- `event_inventory.sold_count` increases by the reservation quantity.
- `sold + reserved <= total_inventory` holds.

### A6 — Authorization

Given a reservation owned by user A, when user B requests `GET /api/v1/reservations/{id}`, then:

- HTTP 404 Not Found is returned (no data leakage).

### A7 — Concurrency Invariant

Given 1 remaining ticket, when 100 concurrent users each attempt to reserve 1 ticket, then:

- Exactly 1 reservation succeeds.
- 99 requests fail with HTTP 409 Conflict.
- `sold + reserved <= total_inventory` holds at all times.

---

## 4. API Endpoints

### 4.1 `POST /api/v1/reservations`

Creates a new reservation.

**Headers:**

- `Authorization: Bearer <JWT>`
- `Idempotency-Key: <UUID>` (required)
- `Content-Type: application/json`

**Request body (illustrative):**

```json
{
  "eventId": "uuid",
  "quantity": 2
}
```

**Responses:**

- `201 Created` — reservation created or reused from idempotency key.
- `400 Bad Request` — invalid input (missing eventId, quantity <= 0, malformed idempotency key).
- `401 Unauthorized` — missing or invalid JWT.
- `409 Conflict` — insufficient inventory or sale not open.
- `429 Too Many Requests` — rate limit exceeded.

**Response body (201, illustrative):**

```json
{
  "id": "uuid",
  "eventId": "uuid",
  "userId": "uuid",
  "quantity": 2,
  "status": "Reserved",
  "expiresAt": "2026-09-13T20:10:00Z",
  "createdAt": "2026-09-13T20:00:00Z"
}
```

### 4.2 `GET /api/v1/reservations/{id}`

Retrieves a reservation owned by the authenticated user.

**Headers:**

- `Authorization: Bearer <JWT>`

**Responses:**

- `200 OK` — reservation belongs to caller.
- `404 Not Found` — reservation does not exist or caller is not authorized.

---

## 5. Events

| Event | Producer | Phase 1 Delivery | Phase 3 Delivery | Purpose |
|---|---|---|---|---|
| `TicketReserved` | Reservation module | In-process domain event stub | Kafka via transactional outbox | Signals that inventory has been reserved. |
| `ReservationExpired` | Reservation module | In-process domain event stub | Kafka via transactional outbox | Signals that inventory has been released. |

Both events must include the standard envelope fields defined in SPEC.md §20:

```text
event_id
event_type
aggregate_id
timestamp
producer
schema_version
correlation_id
payload
```

---

## 6. Non-Functional Requirements

### Performance Budget

- 100 reservations/sec per event.
- p99 latency < 500 ms for `POST /api/v1/reservations` under the Phase 1 budget load.

### Correctness

- The inventory invariant `sold + reserved <= total_inventory` must never be violated.

### Availability

- The scheduler must be safe to run with multiple instances, even though a single instance is acceptable for Phase 1.

---

## 7. Traceability

- SPEC.md §17 — Core inventory invariant.
- SPEC.md §18 — Reservation lifecycle and default TTL.
- SPEC.md §22 — Idempotency requirement.
- SPEC.md §26 — Reservation API endpoints.
- SPEC.md §37 — Phase 1 scope.

Downstream artifacts:

- `docs/requirements/business/RESERVATION-001-business-analysis.md`
- `docs/architecture/proposals/RESERVATION-001-architecture-proposal.md`
- `docs/architecture/decisions/ADR-001-reservation-concurrency-model.md`
- `tasks/backlog/RESERVATION-001.md`
