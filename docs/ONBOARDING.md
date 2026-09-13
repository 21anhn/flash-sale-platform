# New Member Onboarding

Welcome to the **Flash Sale Distributed Ticketing Platform**.

This project is both a production-oriented ticketing platform and a distributed-systems laboratory. We build a realistic flash-sale system while experimenting with concurrency, high traffic, microservices, event-driven architecture, Kubernetes, AWS, and AI-assisted engineering.

---

## 1. Read These First

Start with the authoritative documents at the repository root:

| File | Purpose |
|------|---------|
| [`SPEC.md`](../SPEC.md) | Authoritative project specification: vision, invariants, phases, APIs, tech stack, acceptance criteria. |
| [`AGENTS.md`](../AGENTS.md) | Human/AI engineering contract: workflow, artifact structure, decision authority, code-review standards. |
| [`README.md`](../README.md) | High-level overview, current phase, and quick orientation. |

Read them in this order: **README → SPEC → AGENTS**.

---

## 2. Project Overview

- **Goal:** Sell limited tickets during flash-sale events without ever overselling.
- **Core invariant:** `sold + reserved <= total_inventory`.
- **Primary scenario:** 10,000 tickets, 500,000+ concurrent users, sale opens at a fixed time.
- **Approach:** Start simple, then evolve through defined phases.
- **Human-first:** You own implementation and final technical decisions. AI agents assist, challenge, and review.

### Development Phases

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

See [`SPEC.md`](../SPEC.md) §37 for phase details.

---

## 3. Repository Layout

### Root Documents

```text
flash-sale-platform/
├── SPEC.md          # Authoritative spec
├── AGENTS.md        # AI engineering contract
├── README.md        # Quick orientation
├── services/        # Backend services (planned)
├── frontend/        # React/TypeScript web app (planned)
├── load-tests/      # k6 load tests (planned)
├── infrastructure/  # Docker, Kubernetes, AWS (planned)
├── docs/            # AI-generated planning and decision artifacts
└── tasks/           # Implementation tasks
```

> **Note:** The repository is currently in **Phase 0 — Foundation**. Many directories are planned but not yet populated. Always verify the actual repository state rather than assuming something exists.

### `docs/` — Artifact Structure

```text
docs/
├── requirements/
│   ├── features/       # Product requirements (Product Owner)
│   └── business/       # Business analysis, flows, invariants (Business Analyst)
├── architecture/
│   ├── proposals/      # Architecture proposals (Solution Architect)
│   └── decisions/      # Architecture Decision Records / ADRs (Tech Lead)
├── testing/            # Test strategy, scenarios, QA reports
├── performance/        # Benchmark and load-test plans/reports
├── security/           # Security reviews and findings
└── frontend/           # UI/UX design and frontend implementation plans
    ├── design/
    └── implementation/
```

Artifact naming convention:

```text
<FEATURE-ID>-<artifact-name>.md
```

Examples:

```text
RESERVATION-001-product-requirement.md
RESERVATION-001-business-analysis.md
RESERVATION-001-architecture-proposal.md
RESERVATION-001-test-strategy.md
```

Documentation must clearly state its status: **PROPOSED**, **ACCEPTED**, **IMPLEMENTED**, or **VERIFIED**.

### `tasks/` — Task Tracking

```text
tasks/
├── backlog/     # Work not yet started
├── active/      # Work in progress
└── completed/   # Done (only after human confirmation)
```

Every task should contain:

- Task ID, Type, Title, Phase, Feature
- Goal and source requirement
- Dependencies, priority, status
- Required agents
- Human implementation responsibility
- Verification requirements
- Definition of Done

Task states:

```text
BACKLOG → READY → IN_PROGRESS → BLOCKED → IN_REVIEW → VERIFYING → DONE
```

A task is **not** done just because an AI agent produced a proposal or review.

---

## 4. Working with AI Agents

AI agents are reviewers, analysts, architects, testers, and technical advisors. They do **not** autonomously implement production code unless you explicitly ask.

### Specialist Agents

| Agent | When to Invoke | Artifacts |
|-------|----------------|-----------|
| **Product Owner (PO)** | Clarify goals, scope, priority, acceptance criteria | `docs/requirements/features/` |
| **Business Analyst (BA)** | Detail workflows, state transitions, invariants, edge cases | `docs/requirements/business/` |
| **Project Manager (PM)** | Plan delivery, dependencies, milestones, Definition of Done | `tasks/` |
| **Solution Architect (SA)** | Design system boundaries, consistency, concurrency, scalability | `docs/architecture/proposals/` |
| **Tech Lead** (`keui3u6`) | Discuss implementation approach, challenge decisions, review code | `docs/architecture/decisions/` (ADRs) |
| **Backend Reviewer** | Review implemented code for correctness and maintainability | Review comments |
| **Test Engineer** | Define test strategy, coverage, integration plans | `docs/testing/` |
| **Business QA** | Validate business behavior and invariants | `docs/testing/` |
| **Performance Engineer** | Benchmarks, load tests, bottleneck analysis | `docs/performance/` |
| **Security Reviewer** | Threat modeling, auth, abuse cases, secrets | `docs/security/` |
| **UI Designer** | User flows, screen states, interaction design | `docs/frontend/design/` |
| **FE Engineer** | Frontend technical design and integration planning | `docs/frontend/implementation/` |

### Default Feature Workflow

```text
Requirement
    ↓
PO / BA clarify scope and acceptance criteria
    ↓
PM plans delivery and creates tasks
    ↓
SA proposes architecture
    ↓
Tech Lead discusses implementation with you
    ↓
YOU decide and implement
    ↓
Backend Reviewer / Business QA / Test Engineer review
    ↓
Security / Performance review if relevant
    ↓
Verification and tests
    ↓
Documentation / ADR if needed
    ↓
Done (human-confirmed)
```

### How to Start a Feature

1. Read the relevant parts of `SPEC.md` and `AGENTS.md`.
2. Check existing `docs/` and `tasks/` for related artifacts.
3. Ask the Orchestrator or relevant agent to clarify/analyze.
4. Let agents produce requirements, business analysis, and architecture proposal.
5. Discuss with the Tech Lead (`keui3u6`) before writing code.
6. You implement. Agents review.
7. Move the task through the states and verify.

---

## 5. Rules and Invariants

### Correctness Before Performance

The system must **never oversell tickets**. The most important invariant is:

```text
sold + reserved <= total_inventory
```

Do not sacrifice correctness for throughput.

### Measure Before Optimizing

Never claim something is faster without evidence. Important performance changes follow:

```text
Baseline → Change → Benchmark → Metrics → Analysis → Trade-off → Conclusion
```

### Start Simple

Do not introduce technologies such as Kafka, Redis, Kubernetes, gRPC, service mesh, CQRS, event sourcing, or distributed locks without a concrete engineering reason or an intentional experiment.

### Human Ownership

- You make final architecture and implementation decisions.
- You write production code.
- AI agents propose, explain, challenge, and review.

### Distributed Systems Checklist

When analyzing critical operations, explicitly consider:

- Consistency
- Concurrency
- Idempotency
- Failure and recovery
- Ordering and delivery semantics
- Backpressure
- Observability

### Code Review Standard

Reviews must evaluate correctness, architecture, concurrency, database behavior, transactions, error handling, security, performance, observability, maintainability, and test coverage. "LGTM" is not enough.

---

## 6. Quick Reference

| Need | Look Here |
|------|-----------|
| Project vision and spec | [`SPEC.md`](../SPEC.md) |
| AI workflow and artifact rules | [`AGENTS.md`](../AGENTS.md) |
| Current phase and status | [`README.md`](../README.md) |
| Product requirements | `docs/requirements/features/` |
| Business analysis | `docs/requirements/business/` |
| Architecture proposals | `docs/architecture/proposals/` |
| Architecture decisions (ADRs) | `docs/architecture/decisions/` |
| Test strategy | `docs/testing/` |
| Performance plans | `docs/performance/` |
| Security reviews | `docs/security/` |
| Tasks not started | `tasks/backlog/` |
| Tasks in progress | `tasks/active/` |
| Completed tasks | `tasks/completed/` |

---

## 7. Where to Begin

If you are joining the project today:

1. Read this guide.
2. Read [`README.md`](../README.md), [`SPEC.md`](../SPEC.md), and [`AGENTS.md`](../AGENTS.md).
3. Explore `tasks/backlog/` to see what is planned.
4. Explore `docs/` to see existing requirements and architecture.
5. Ask the Tech Lead (`keui3u6`) or Orchestrator about the current priority.
6. Pick a task from `tasks/backlog/`, move it to `tasks/active/`, and follow the workflow.
