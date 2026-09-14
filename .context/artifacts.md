# Artifact System

This document maps **artifact types to their locations** and explains the rules for creating and updating artifacts.

For the full artifact contract, see [`AGENTS.md`](../AGENTS.md) §16.

---

## Artifact Directory Structure

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
└── frontend/
    ├── design/         # UI/UX design (UI Designer)
    └── implementation/ # Frontend implementation plans (FE Engineer)

tasks/
├── backlog/            # Work not yet started
├── active/             # Work in progress
└── completed/          # Done (only after human confirmation)
```

---

## Artifact Ownership

| Agent | Creates | Location |
|-------|---------|----------|
| Product Owner | Product requirements | `docs/requirements/features/` |
| Business Analyst | Business analysis | `docs/requirements/business/` |
| Project Manager | Tasks, delivery plans | `tasks/backlog/`, `tasks/active/`, `tasks/completed/` |
| Solution Architect | Architecture proposals | `docs/architecture/proposals/` |
| Tech Lead | ADRs, technical decisions | `docs/architecture/decisions/` |
| Test Engineer | Test strategy | `docs/testing/` |
| Business QA | QA reports, acceptance verification | `docs/testing/` |
| Performance Engineer | Performance plans, benchmark reports | `docs/performance/` |
| Security Reviewer | Security reviews, findings | `docs/security/` |
| UI Designer | UI/UX specifications | `docs/frontend/design/` |
| FE Engineer | Frontend implementation plans | `docs/frontend/implementation/` |

---

## Artifact Naming Convention

```text
<FEATURE-ID>-<artifact-name>.md
```

Examples:

```text
RESERVATION-001-product-requirement.md
RESERVATION-001-business-analysis.md
RESERVATION-001-architecture-proposal.md
RESERVATION-001-test-strategy.md
RESERVATION-001-performance-plan.md
RESERVATION-001-security-review.md
```

Avoid generic filenames such as `plan.md`, `analysis.md`, `design.md`, `feature.md` unless the document is explicitly project-wide.

---

## Artifact Status

Every artifact must distinguish between:

| Status | Meaning |
|--------|---------|
| **PROPOSED** | Draft or proposal — not yet accepted |
| **ACCEPTED** | Approved by the human developer |
| **IMPLEMENTED** | Code has been written |
| **VERIFIED** | Tests and verification confirm it works |

**These states are not equivalent.**

- PROPOSED architecture ≠ ACCEPTED architecture
- ACCEPTED architecture ≠ IMPLEMENTED architecture
- IMPLEMENTED feature ≠ VERIFIED feature

Documentation must reflect the actual repository state.

---

## Artifact Creation Rules

1. Before creating a new artifact, check whether an existing artifact covers the same subject.
2. Update existing artifacts when appropriate.
3. Create a new artifact only when it represents a distinct artifact or decision.
4. Do not create duplicate planning documents merely because multiple agents participated.
5. Not every agent response requires a file.
6. Create persistent documentation only when it provides: traceability, approved requirement, architectural proposal/decision, implementation planning, test strategy, verification evidence, performance evidence, security findings, frontend design, or important operational knowledge.

---

## Task Structure

Every task must contain:

- Task ID
- Title
- Phase
- Feature
- Goal
- Source requirement
- Relevant SPEC section when applicable
- Dependencies
- Priority
- Status
- Required agents
- Human implementation responsibility
- Verification requirements
- Definition of Done

Task states:

```text
BACKLOG → READY → IN_PROGRESS → BLOCKED → IN_REVIEW → VERIFYING → DONE
```

A task must not be moved to DONE merely because an AI agent produced a proposal or review.

---

## Forbidden Directories

Do not create:

- `docs/planning/`
- `docs/analysis/`
- `docs/design/`
- `docs/misc/`
- Ad-hoc planning directories

Unless explicitly approved by the human developer.

---

## Traceability

Every created task must reference, where applicable:

- Source requirement
- SPEC section
- Phase
- Feature
- Acceptance criteria
- Dependencies
- Architecture decision / ADR
- Verification requirements

Traceability should allow the team to answer:

- "Why does this task exist?"
- "What requirement does it satisfy?"
- "What architecture decision supports it?"
- "How will we verify it?"

---

## Status

**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
