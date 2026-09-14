# Development Phases

This document tracks the **current development phase** and provides a quick reference for all phases.

For full phase details, see [`SPEC.md`](../SPEC.md) §37.

---

## Current Phase

**Phase 0 — Foundation**

The repository currently contains:

- Project specification (`SPEC.md`)
- AI engineering contract (`AGENTS.md`)
- Human orientation (`README.md`)
- Initial planning artifacts for PROJECT-001 and RESERVATION-001
- AI agent configuration (orchestrator and specialists)
- Context engineering system (`.context/`)

No backend services, frontend application, infrastructure code, or production tests exist yet.

---

## Phase Overview

| Phase | Name | Focus | Status |
|-------|------|-------|--------|
| 0 | Foundation | Repository, CI, coding standards, Docker Compose, PostgreSQL, basic documentation, migration system | **Current** |
| 1 | Modular Monolith | Authentication, Events, Tickets, Reservation, Orders, Mock Payment, React UI | Planned |
| 2 | Microservices | Extract User, Event, Ticket, Order, Payment services; introduce API Gateway and service boundaries | Planned |
| 3 | Event Driven | Introduce Kafka, Transactional Outbox, Domain Events, Async Notifications | Planned |
| 4 | High Traffic | Introduce Redis, Rate Limiting, Virtual Queue, Load Testing, Horizontal Scaling | Planned |
| 5 | Distributed Consistency | Introduce Idempotency, Saga, Compensation, Retry, DLQ, Circuit Breaker | Planned |
| 6 | Observability | Introduce OpenTelemetry, Prometheus, Grafana, Distributed Tracing, Structured Logging | Planned |
| 7 | Kubernetes | Introduce Kubernetes, HPA, Readiness, Liveness, Resource Limits | Planned |
| 8 | AWS | Move toward AWS, EKS, RDS PostgreSQL, ElastiCache Redis, MSK Kafka, S3, ALB, WAF, CloudWatch, IAM, Secrets Manager, KMS | Planned |
| 9 | Chaos Engineering | Introduce controlled failures and chaos experiments | Planned |
| 10 | Optimization | Benchmark and optimize Database, Redis, Kafka, JVM, HTTP, Connection Pools, Thread Pools, Kubernetes, AWS Infrastructure | Planned |

---

## Phase 0 — Foundation Details

**Goal:** Establish the project foundation before implementing business functionality.

**Expected deliverables:**

- Repository structure
- CI pipeline
- Coding standards
- Docker Compose local environment
- PostgreSQL setup
- Basic documentation
- Migration system

**Current state:**

- Repository structure partially established (root docs, docs/, tasks/, .opencode/)
- No CI pipeline yet
- No Docker Compose yet
- No PostgreSQL service yet
- No migration system yet

---

## Phase 1 — Modular Monolith Details

**Goal:** Complete business flow as a modular monolith.

**Architecture:**

```text
React
   ↓
Spring Boot
   ↓
PostgreSQL
```

**Features:**

- Authentication
- Events
- Tickets
- Reservation
- Orders
- Mock Payment
- React UI

---

## Status

**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
