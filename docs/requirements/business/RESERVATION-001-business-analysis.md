# RESERVATION-001 — Business Analysis: Reservation Module (Phase 1)

**Status:** ACCEPTED  
**Feature ID:** RESERVATION-001  
**Phase:** Phase 1 — Modular Monolith  
**Source Requirement:** `docs/requirements/features/RESERVATION-001-product-requirement.md`  
**Owner:** Business Analyst

---

## 1. Business Workflow

```text
User selects tickets
        |
        v
POST /api/v1/reservations
        |
        v
Validate request + Idempotency-Key
        |
        v
Atomically allocate inventory
        |
        v
Reservation status = Reserved
        |
        +-- User completes order + payment -->
        |           |
        |           v
        |   Order transaction confirms sale
        |           |
        |           v
        |   Reservation status = Converted
        |
        +-- TTL expires or payment fails -->
                    |
                    v
            Scheduler reclaims reservation
                    |
                    v
            Reservation status = Expired
                    |
                    v
            Inventory returns to available pool
```

---

## 2. Reservation Lifecycle

```text
AVAILABLE INVENTORY
        |
        | reserve()
        v
    RESERVED
        |
        |-- order confirmed (payment success) -->
        |           |
        |           v
        |       SOLD / CONVERTED
        |
        |-- TTL expires ------------------------>
        |           |
        |           v
        |       EXPIRED
        |
        |-- payment fails / cancel -------------->
                    |
                    v
                EXPIRED / RELEASED
```

> Phase 1 uses the statuses `Reserved`, `Expired`, and `Converted`. A separate `Released` status is intentionally avoided; payment failure results in `Expired` after scheduler cleanup or immediate internal release.

---

## 3. State Transitions and Triggers

| From | To | Trigger | Guard |
|---|---|---|---|
| — | Reserved | `POST /api/v1/reservations` succeeds | Sale open; `reserved_count + sold_count + quantity <= total_inventory`; idempotency key not active for this user. |
| Reserved | Converted | Order creation confirms sale | Same DB transaction as order; reservation still active (`expires_at > now`, status = Reserved). |
| Reserved | Expired | Scheduler reclaims expired rows | `status = Reserved` and `expires_at <= now`. |
| Reserved | Expired | Internal cancel on payment failure | Order service invokes internal cancel within failure handling. |
| Expired | — | None (terminal) | — |
| Converted | — | None (terminal) | — |

---

## 4. Business Invariants

### INV-1 — Inventory Invariant (Critical)

```text
sold_count + reserved_count <= total_inventory
```

This invariant must hold for every event at all times, including during concurrent reservation attempts, scheduler runs, and order confirmation.

### INV-2 — Idempotency Invariant

For a given user, the same active idempotency key must map to exactly one reservation.

- If a reservation exists with status `Reserved` and the same `idempotency_key` for the same user, the same reservation is returned.
- If the prior reservation is `Expired` or `Converted`, the key may be reused to create a new reservation.

### INV-3 — Expiration Invariant

An expired reservation must eventually release its reserved inventory back to the available pool.

### INV-4 — Ownership Invariant

A user may only read reservations where `reservation.user_id == authenticated userId`. Admins are out of scope for Phase 1.

### INV-5 — Conversion Exclusivity Invariant

A reservation cannot be both converted and expired. Conversion and expiration are mutually exclusive.

---

## 5. Business Rules

### BR-1 — Sale Window

A reservation can only be created while the event sale is open.

### BR-2 — Quantity Limits

- A reservation must have `quantity > 0`.
- The maximum quantity per reservation is configurable; default is to be defined by the human developer / Tech Lead.

### BR-3 — Per-User Scope

Idempotency keys are scoped per user. A key collision across users is allowed and must not block another user's reservation.

### BR-4 — TTL

Default TTL is 10 minutes per SPEC.md §18. The TTL is configurable per event or globally.

### BR-5 — Expiration Query-Time Semantics

A reservation is considered expired when `expires_at <= now()` at the moment of evaluation. No background mutation is required to mark a row as expired before the scheduler or a conversion check evaluates it.

### BR-6 — Inventory Reclamation Safety

The scheduler's inventory reclamation must be idempotent: running the scheduler twice on the same expired row must not decrement `reserved_count` below the correct value.

---

## 6. Edge Cases and Alternative Flows

| Scenario | Expected Behavior | Invariant Impact |
|---|---|---|
| Two users attempt to reserve the last ticket concurrently. | Exactly one succeeds; the other receives 409. | `sold + reserved <= total` holds. |
| Same user retries with the same Idempotency-Key while active. | Same reservation returned; inventory not touched twice. | No duplicate reservation. |
| Scheduler runs while order conversion is in progress. | Only one wins because both update the same inventory row atomically and re-check status. | No double-release or lost sale. |
| Order payment succeeds but conversion is retried due to a network timeout. | Idempotency at the order layer prevents duplicate conversion; reservation stays Converted. | Inventory counts stable. |
| Order payment fails after reservation. | Reservation is either cancelled immediately or left to expire naturally; inventory is eventually released. | No permanent inventory loss. |
| Scheduler crashes mid-batch. | Next scheduler run re-processes remaining expired rows; already-processed rows are skipped. | No double-release. |
| Multiple scheduler instances run. | Conditional UPDATEs ensure only rows still `Reserved` are updated; safe under concurrency. | No double-release. |
| Client sends malformed Idempotency-Key. | 400 Bad Request. | No reservation created. |
| Client requests reservation for non-existent event. | 409 Conflict (treat as unavailable). | No reservation created. |
| User B requests User A's reservation. | 404 Not Found (no leakage). | — |

---

## 7. Traceability

- Source: `docs/requirements/features/RESERVATION-001-product-requirement.md`
- Downstream: `docs/architecture/proposals/RESERVATION-001-architecture-proposal.md`
- SPEC.md §17 — Inventory invariant.
- SPEC.md §18 — Reservation lifecycle and TTL.
- SPEC.md §22 — Idempotency.
