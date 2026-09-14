# Current Repository State

This document describes what **actually exists** in the repository right now. It is the authoritative source for repository state.

**Last updated:** 2026-09-14

---

## Phase

**Phase 0 — Foundation**

The project is in the foundation phase. Business functionality has not yet been implemented.

---

## Root Documents

| File | Status |
|------|--------|
| `SPEC.md` | Exists — authoritative project specification |
| `AGENTS.md` | Exists — AI engineering contract |
| `README.md` | Exists — human orientation |
| `opencode.json` | Exists — opencode configuration |

---

## Services

**Status:** No services directory exists yet.

Planned services (from SPEC):

- api-gateway
- user-service
- event-service
- ticket-service
- order-service
- payment-service
- notification-service
- queue-service

None are present in the repository.

---

## Frontend

**Status:** No frontend directory exists yet.

Planned: React / TypeScript web application.

---

## Infrastructure

**Status:** No infrastructure directory exists yet.

Planned: Docker, Kubernetes, AWS.

---

## Load Tests

**Status:** No load-tests directory exists yet.

Planned: k6 tests (smoke, baseline, load, stress, spike, flash-sale).

---

## Documentation (`docs/`)

### Architecture

| Directory | Status |
|-----------|--------|
| `docs/architecture/proposals/` | 2 proposals exist |
| `docs/architecture/decisions/` | 2 ADRs exist |

Existing proposals:

- `PROJECT-001-architecture-proposal.md`
- `RESERVATION-001-architecture-proposal.md`

Existing ADRs:

- `ADR-001-reservation-concurrency-model.md`
- `ADR-002-project-001-build-tool-and-monorepo-layout.md`

### Requirements

| Directory | Status |
|-----------|--------|
| `docs/requirements/features/` | 2 product requirements exist |
| `docs/requirements/business/` | 2 business analyses exist |

Existing product requirements:

- `PROJECT-001-product-requirement.md`
- `RESERVATION-001-product-requirement.md`

Existing business analyses:

- `PROJECT-001-business-analysis.md`
- `RESERVATION-001-business-analysis.md`

### Testing

| Directory | Status |
|-----------|--------|
| `docs/testing/` | 2 test strategies exist |

Existing:

- `PROJECT-001-test-strategy.md`
- `RESERVATION-001-test-strategy.md`

### Performance

| Directory | Status |
|-----------|--------|
| `docs/performance/` | Empty |

### Security

| Directory | Status |
|-----------|--------|
| `docs/security/` | 2 security reviews exist |

Existing:

- `PROJECT-001-security-review.md`
- `RESERVATION-001-security-review.md`

### Frontend

| Directory | Status |
|-----------|--------|
| `docs/frontend/design/` | Empty |
| `docs/frontend/implementation/` | Empty |

### Onboarding

- `docs/ONBOARDING.md` — exists

---

## Tasks (`tasks/`)

| Directory | Status |
|-----------|--------|
| `tasks/backlog/` | 2 tasks exist |
| `tasks/active/` | Empty |
| `tasks/completed/` | Empty |

Existing backlog tasks:

- `PROJECT-001.md`
- `RESERVATION-001.md`

---

## AI Configuration (`.opencode/`)

| Directory/File | Status |
|----------------|--------|
| `.opencode/agents/orchestrator.md` | Exists |
| `.opencode/agents/architecture/` | Exists (sub-agents) |
| `.opencode/agents/engineering/` | Exists (sub-agents) |
| `.opencode/agents/frontend/` | Exists (sub-agents) |
| `.opencode/agents/product/` | Exists (sub-agents) |
| `.opencode/agents/quality/` | Exists (sub-agents) |

---

## Context System (`.context/`)

| File | Status |
|------|--------|
| `.context/README.md` | Exists |
| `.context/project.md` | Exists |
| `.context/current-state.md` | This file |
| `.context/workflow.md` | Exists |
| `.context/artifacts.md` | Exists |
| `.context/agents.md` | Exists |
| `.context/phases.md` | Exists |
| `.context/profiles/` | 7 profiles exist |

---

## Summary

The repository contains:

- Project specification and AI engineering contracts
- Initial planning artifacts for PROJECT-001 and RESERVATION-001
- AI agent configuration (orchestrator and specialist agents)
- Context engineering system (this `.context/` directory)

It does **not** yet contain:

- Backend services
- Frontend application
- Infrastructure code
- Load tests
- Production tests
- Runtime configuration

Any agent discussing implementation must verify actual repository contents and not assume the presence of services, APIs, databases, or infrastructure.
