# Project Context

Flash Sale Distributed Ticketing Platform — AI context summary.

This file provides a **concise project identity** for agents. For full detail, see [`SPEC.md`](../SPEC.md) and [`AGENTS.md`](../AGENTS.md).

---

## Identity

- **Name:** Flash Sale Distributed Ticketing Platform
- **Type:** Production-oriented distributed system + distributed-systems laboratory
- **Core invariant:** `sold + reserved <= total_inventory`
- **Primary scenario:** 10,000 tickets, 500,000+ concurrent users, sale opens at fixed time
- **Human developer:** Primary engineer and final decision maker
- **AI agents:** Advisors, analysts, reviewers, architects — not autonomous implementers

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Java, Spring Boot |
| Frontend | React, TypeScript |
| Database | PostgreSQL (authoritative) |
| Cache | Redis (introduced with reason) |
| Message Broker | Apache Kafka (introduced with reason) |
| Load Testing | k6 |
| Cloud | AWS (progressive) |
| Infrastructure | Docker, Kubernetes, Terraform |

---

## Core Principles

1. **Correctness before performance** — never oversell tickets.
2. **Measure before optimizing** — every important optimization needs baseline, benchmark, metrics, analysis, trade-offs, conclusion.
3. **Start simple** — do not introduce Kafka, Redis, Kubernetes, gRPC, service mesh, CQRS, event sourcing without a concrete reason.
4. **Human ownership** — human decides and implements; AI proposes, explains, challenges, reviews.

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [`SPEC.md`](../SPEC.md) | Authoritative specification: vision, invariants, phases, APIs, tech stack, acceptance criteria |
| [`AGENTS.md`](../AGENTS.md) | AI engineering contract: workflow, artifact structure, agent roles, decision authority, code-review standards |
| [`README.md`](../README.md) | Human orientation: current phase, quick start, project overview |
| [`docs/ONBOARDING.md`](../docs/ONBOARDING.md) | New member onboarding guide |

---

## Business Invariants

- Inventory: `sold + reserved <= total_inventory`
- Order: idempotent requests must not produce multiple logical orders
- Reservation: expired reservations must eventually release inventory
- Authorization: a user cannot access another user's private order
- Payment: payment failure must not leave inventory permanently unavailable

---

## Development Phases

See [`.context/phases.md`](phases.md) for the full phase breakdown and current status.

High-level sequence:

```text
Phase 0 — Foundation
Phase 1 — Modular Monolith
Phase 2 — Microservices
Phase 3 — Event Driven
Phase 4 — High Traffic
Phase 5 — Distributed Consistency
Phase 6 — Observability
Phase 7 — Kubernetes
Phase 8 — AWS
Phase 9 — Chaos Engineering
Phase 10 — Optimization
```

---

## Agent Roles

See [`.context/agents.md`](agents.md) for the full agent responsibility matrix.

Primary agents:

- **Product Owner** — product goals, scope, acceptance criteria
- **Business Analyst** — workflows, state transitions, invariants, edge cases
- **Project Manager** — delivery planning, tasks, dependencies, Definition of Done
- **Solution Architect** — architecture proposals, boundaries, consistency, scalability
- **Tech Lead** (`keui3u6`) — technical discussion, implementation approach, code review
- **Backend Reviewer** — correctness, maintainability, code quality
- **Test Engineer** — test strategy, coverage, integration plans
- **Business QA** — business acceptance, invariant verification
- **Performance Engineer** — benchmarks, load tests, bottleneck analysis
- **Security Reviewer** — threat modeling, auth, abuse cases
- **UI Designer** — user flows, screen states, interaction design
- **FE Engineer** — frontend technical design and integration

---

## Artifact Locations

| Artifact Type | Location |
|---------------|----------|
| Product requirements | `docs/requirements/features/` |
| Business analysis | `docs/requirements/business/` |
| Architecture proposals | `docs/architecture/proposals/` |
| Architecture decisions (ADRs) | `docs/architecture/decisions/` |
| Test strategy / QA | `docs/testing/` |
| Performance plans / reports | `docs/performance/` |
| Security reviews | `docs/security/` |
| Frontend design | `docs/frontend/design/` |
| Frontend implementation | `docs/frontend/implementation/` |
| Tasks (backlog) | `tasks/backlog/` |
| Tasks (active) | `tasks/active/` |
| Tasks (completed) | `tasks/completed/` |

---

## Status

**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
