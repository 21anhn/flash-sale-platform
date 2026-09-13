# RESERVATION-001 — Security Review: Reservation Module (Phase 1)

**Status:** PROPOSED  
**Feature ID:** RESERVATION-001  
**Phase:** Phase 1 — Modular Monolith  
**Source Requirement:** `docs/requirements/features/RESERVATION-001-product-requirement.md`  
**Source Architecture:** `docs/architecture/proposals/RESERVATION-001-architecture-proposal.md`  
**Owner:** Security Reviewer

---

## 1. Goal

Identify security risks, abuse scenarios, and verification requirements for the Reservation module before implementation.

---

## 2. Trust Boundaries

- External clients are untrusted.
- `userId` must be derived from the JWT by the gateway or controller; it must never come from the request body.
- The `ticket-service` database is an internal trust boundary. No other module accesses its tables directly.

---

## 3. Authentication and Authorization

### 3.1 Authentication

- `POST /api/v1/reservations` and `GET /api/v1/reservations/{id}` require a valid JWT.
- Anonymous requests must receive HTTP 401 Unauthorized.

### 3.2 Authorization

- A user may only create reservations for themselves.
- A user may only read reservations where `reservation.user_id == authenticated userId`.
- Non-owner access to another user's reservation must return HTTP 404 Not Found (not 403) to prevent ID enumeration and information leakage.
- Admin access is out of scope for Phase 1.

---

## 4. Rate Limiting

Per SPEC.md §25, the following rate limits must be configurable:

| Limit | Scope | Purpose |
|---|---|---|
| Per-user reservation creation | User ID | Prevent a single account from mass-reserving inventory. |
| Per-IP reservation creation | Source IP | Mitigate bot farms behind shared accounts. |
| Per-endpoint | `POST /api/v1/reservations` | Protect the hot allocation path. |
| Per-event | Event ID | Prevent one event from consuming all platform capacity. |

Phase 1 implementation may use an in-memory rate limiter (e.g., Bucket4j or Resilience4j). Redis-backed rate limiting is a Phase 4 concern.

---

## 5. Idempotency Abuse

### 5.1 Replay After Expiration

- Approved decision: idempotency keys are scoped to **active** reservations only.
- If a prior reservation with the same key has expired or been converted, the key may be reused to create a new reservation.
- The application must bind the idempotency key to `(user_id, event_id, quantity)` and reject mismatched payloads to prevent accidental or malicious reuse with different parameters.

### 5.2 Long-Lived Keys

- Idempotency keys should have a retention policy aligned with the active reservation lifetime plus a small buffer.
- Keys for terminal reservations should be eligible for cleanup.

---

## 6. Input Validation

| Field | Validation |
|---|---|
| `eventId` | Required, valid UUID, event must exist and be on sale. |
| `quantity` | Required, integer, `> 0`, `<= max_reservation_quantity`. |
| `Idempotency-Key` | Required, valid UUID or alphanumeric string within max length. |
| Path `id` in `GET /api/v1/reservations/{id}` | Valid UUID. |

### 6.1 Request Size Limits

- Enforce a maximum request body size to prevent DoS via large payloads.

### 6.2 Content-Type

- Reject requests with unsupported Content-Type.

---

## 7. Data Leakage Prevention

- `GET /api/v1/reservations/{id}` returns 404 for non-existent or unauthorized reservations. Do not distinguish between "not found" and "not authorized" in the HTTP status.
- Reservation IDs are UUIDs to prevent enumeration.
- Response bodies must not include internal IDs, database versions, or stack traces.
- Do not log `Idempotency-Key`, JWT tokens, or PII at INFO level.

---

## 8. Abuse Scenarios

| Abuse | Risk | Mitigation |
|---|---|---|
| Bot mass-reserves tickets and never pays. | Inventory held hostage, denial of service to legitimate users. | Rate limiting per user/IP/endpoint; short TTL; max reservations per user per event. |
| Replay of Idempotency-Key with a different payload. | Could create an unexpected reservation. | Bind key to `(user_id, event_id, quantity)` and reject mismatched payloads. |
| Enumeration of reservation IDs. | Information leakage about active reservations. | UUID IDs; 404 for unauthorized access. |
| Oversized quantity or invalid eventId. | DoS or injection attempts. | Strict input validation; max quantity cap. |
| Holding inventory by repeatedly cancelling and re-reserving. | Circumvents TTL. | Track reservation history; enforce cooldown or max attempts per user per event. |
| Slowloris or connection exhaustion against reservation endpoint. | Service unavailability. | Request timeouts, connection limits, reverse-proxy protection. |

---

## 9. Verification Requirements

- [ ] Unauthorized requests receive 401.
- [ ] Non-owner GET requests receive 404.
- [ ] Rate limits are enforced and return 429.
- [ ] Invalid input returns 400 with clear, safe error messages.
- [ ] Mismatched idempotency payload is rejected.
- [ ] Logs do not contain JWTs, idempotency keys, or PII at INFO.
- [ ] Response bodies do not leak internal state.

---

## 10. Traceability

- Source Requirement: `docs/requirements/features/RESERVATION-001-product-requirement.md`
- Source Architecture: `docs/architecture/proposals/RESERVATION-001-architecture-proposal.md`
- Task: `tasks/backlog/RESERVATION-001.md`
- SPEC.md §24 — Virtual Queue.
- SPEC.md §25 — Rate Limiting.
- SPEC.md §34 — Security.
