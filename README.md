# Flash Sale Distributed Ticketing Platform

A production-oriented distributed ticketing platform and distributed-systems laboratory.

The project is designed to build a realistic ticketing system while experimentally studying:

* Distributed systems
* Concurrency
* High traffic
* Scalability
* Resilience
* Consistency
* Kafka
* Redis
* PostgreSQL
* Kubernetes
* AWS
* Observability
* Performance engineering
* Chaos engineering
* AI-assisted software engineering

## Core Invariant

The system must never oversell tickets.

```text
sold + reserved <= total_inventory
```

Correctness has higher priority than performance.

## Project Approach

The project starts simple and evolves progressively.

```text
Phase 0 — Foundation
        ↓
Phase 1 — Modular Monolith
        ↓
Phase 2 — Microservices
        ↓
Phase 3 — Event Driven
        ↓
Phase 4 — High Traffic
        ↓
Phase 5 — Distributed Consistency
        ↓
Phase 6 — Observability
        ↓
Phase 7 — Kubernetes
        ↓
Phase 8 — AWS
        ↓
Phase 9 — Chaos Engineering
        ↓
Phase 10 — Optimization
```

Technologies are introduced when there is a concrete engineering reason or when they are needed for an intentional experiment.

## Technology Stack

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* Spring Validation
* Spring Kafka
* Spring Boot Actuator
* Micrometer
* Resilience4j

### Frontend

* React
* TypeScript

### Data

* PostgreSQL
* Redis
* Apache Kafka

### Infrastructure

* Docker
* Kubernetes
* Terraform

### Cloud

* AWS

Potential AWS services include:

* EKS
* RDS PostgreSQL
* ElastiCache Redis
* MSK
* S3
* ALB
* CloudFront
* WAF
* CloudWatch
* IAM
* Secrets Manager
* KMS

### Load Testing

* k6

## Development Model

The human developer is the primary engineer and production-code implementer.

AI agents act primarily as:

* Analysts
* Architects
* Technical advisors
* Reviewers
* Testers
* Performance engineers
* Security reviewers

The preferred workflow is:

```text
Requirement
    ↓
Understand
    ↓
Analyze
    ↓
Proposal
    ↓
Implementation Specification
    ↓
Technical Discussion
    ↓
Human Implementation
    ↓
Code Review
    ↓
Tests
    ↓
Benchmark
    ↓
Documentation
```

AI agents must not autonomously implement production code unless explicitly requested.

See [`AGENTS.md`](AGENTS.md) for the AI engineering contract.

## Repository Structure

The repository will evolve over time.

The planned high-level structure is:

```text
flash-sale-platform/
├── SPEC.md
├── AGENTS.md
├── README.md
├── services/
├── frontend/
├── load-tests/
├── infrastructure/
└── docs/
```

This represents the planned structure, not necessarily the current repository state.

## Current Status

**Phase 0 — Foundation**

Current repository:

```text
flash-sale-platform/
├── SPEC.md
├── AGENTS.md
├── README.md
├── .context/          # AI context routing system
├── .opencode/         # AI agent configuration
├── docs/              # Planning and decision artifacts
└── tasks/             # Implementation tasks
```

The current focus is establishing the project foundation before implementing business functionality.

## Working With AI Agents

This project uses a structured AI-assisted engineering workflow. The human developer is the primary implementer and final decision maker. AI agents act as analysts, architects, advisors, and reviewers.

### Quick Start for AI Collaboration

If you are starting work with AI agents, follow this flow:

```text
README (this file)
    ↓
AGENTS.md — AI engineering contract
    ↓
.context/README.md — context routing entry point
    ↓
.context/current-state.md — what actually exists now
    ↓
Relevant task in tasks/backlog/ or tasks/active/
    ↓
Relevant context profile in .context/profiles/
    ↓
@orchestrator — coordinate specialist agents
    ↓
Specialist agents (PO, BA, SA, Tech Lead, etc.)
    ↓
Human decision
    ↓
Human implementation
    ↓
AI review (Backend Reviewer, Business QA, Security, Performance)
    ↓
Verification
    ↓
Documentation / ADR if needed
```

### Context System

The `.context/` directory is the navigation layer for AI agents. It tells an agent what to load before starting a specific type of work.

| File | Purpose |
|------|---------|
| `.context/README.md` | Context system entry point and loading policy |
| `.context/current-state.md` | Actual repository state (authoritative) |
| `.context/project.md` | Concise project identity and stack |
| `.context/workflow.md` | Standard AI engineering workflow |
| `.context/artifacts.md` | Artifact locations and creation rules |
| `.context/agents.md` | Agent roles and responsibilities |
| `.context/phases.md` | Development phases and current status |

### Context Profiles

Load the relevant profile for your current work type:

| Profile | When to Use |
|---------|-------------|
| `.context/profiles/feature-planning.md` | New feature, requirement clarification, scope change |
| `.context/profiles/architecture.md` | Architecture planning, ADR creation |
| `.context/profiles/backend-implementation.md` | Implementation preparation, technical discussion |
| `.context/profiles/backend-review.md` | Code review |
| `.context/profiles/testing.md` | Test strategy, QA, verification |
| `.context/profiles/security.md` | Security review, threat modeling |
| `.context/profiles/performance.md` | Performance work, benchmarking |

### Artifact Locations

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

### Key Rules

- AI agents **must not** autonomously implement production code unless explicitly requested.
- The human developer makes all final architecture and implementation decisions.
- Every agent-created artifact must identify the agent, role, task, artifact type, status, and production code impact.
- Agents may modify `.context/`, `docs/`, and `tasks/` but not production source code unless authorized.
- Agents may create branches and PRs, but **must never merge their own PRs**.

For the full AI engineering contract, see [`AGENTS.md`](AGENTS.md).

---

## Documentation

* [`SPEC.md`](SPEC.md) — authoritative project specification
* [`AGENTS.md`](AGENTS.md) — AI engineering instructions and human/AI development workflow
* [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — new member onboarding guide

## License

Not defined yet.
