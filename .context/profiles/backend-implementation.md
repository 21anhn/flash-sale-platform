# Context Profile: Backend Implementation

Use this profile when the work type is:

- Implementation preparation
- Technical discussion before coding
- Clarifying implementation approach
- Understanding what code to write

**This profile is for planning, NOT for writing production code.**

---

## Load Order

1. [`.context/current-state.md`](../current-state.md) — understand what exists
2. [`AGENTS.md`](../../AGENTS.md) — review implementation policy and technical discussion standard
3. Relevant sections of [`SPEC.md`](../../SPEC.md) — understand intended behavior and APIs
4. Existing artifacts in:
   - `docs/architecture/proposals/` — understand proposed architecture
   - `docs/architecture/decisions/` — understand accepted ADRs
   - `docs/requirements/features/` — understand requirements
   - `docs/requirements/business/` — understand business rules and invariants
   - `tasks/backlog/` and `tasks/active/` — understand task context
5. Relevant source code — inspect existing services, controllers, repositories, entities only when needed

---

## Key Questions to Answer

### Tech Lead

- How should the human implement this?
- Why this approach?
- What alternatives exist?
- What concurrency issues exist?
- What happens if the service crashes?
- What happens if the DB transaction succeeds but Kafka publish fails?
- What should the human watch out for when coding this?

### Implementation Specification

Before the human writes code, the agent must describe exactly what needs to change:

- Feature name
- Files/components affected (service, controller, service class, repository, entity, scheduler)
- Database changes (tables, indexes)
- Events (Kafka topics, event structure)
- Cache keys (if applicable)
- Tests (unit, integration)
- Metrics (if applicable)

Example:

```text
ticket-service

ReservationController
    POST /reservations

ReservationService
    reserve()

ReservationRepository
    findAvailableInventoryForUpdate()

Reservation entity
    status
    expiresAt

ReservationExpirationScheduler
    periodically finds expired reservations

Kafka:
    ReservationExpired

Metrics:
    reservation.success
    reservation.failure
    reservation.expired
```

---

## Human Approval Gates

- Gate 3: Technical Implementation Decision — human decides the implementation approach
- The human may disagree with the Tech Lead or Solution Architect
- The final technical decision belongs to the human

---

## What Agents Must NOT Do

- Do NOT write production code unless explicitly requested
- Do NOT silently implement the feature
- Do NOT make final technical decisions without human approval
- Do NOT bypass the Tech Lead discussion

---

## Status

**Profile:** backend-implementation
**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
