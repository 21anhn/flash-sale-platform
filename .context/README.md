# AI Context Engineering System

This directory is the **navigation and context-routing layer** for AI agents working on the Flash Sale Distributed Ticketing Platform.

It is NOT a duplicate of `SPEC.md`, `AGENTS.md`, or the architecture documents. It tells an agent **what to load** before starting a specific type of work.

---

## Context Loading Policy

1. **Start here** — read `.context/README.md` (this file).
2. **Read `.context/current-state.md`** to understand the actual repository state.
3. **Identify the work type** — use the profiles below.
4. **Load only the relevant context profile** from `.context/profiles/`.
5. **Load only relevant artifacts** — requirements, tasks, architecture docs, ADRs that relate to the current work.
6. **Inspect source code only when necessary** — for repository-state verification or when reviewing implementation.
7. **Never read the entire repository by default.**

---

## Context Profiles

| Profile | Purpose | When to Load |
|---------|---------|--------------|
| [`.context/profiles/feature-planning.md`](profiles/feature-planning.md) | Product requirement, business analysis, delivery planning | New feature, requirement clarification, scope change |
| [`.context/profiles/architecture.md`](profiles/architecture.md) | Architecture proposals, ADRs, system boundaries | Architecture planning, ADR creation, boundary changes |
| [`.context/profiles/backend-implementation.md`](profiles/backend-implementation.md) | Implementation preparation, technical discussion | Before human writes production code |
| [`.context/profiles/backend-review.md`](profiles/backend-review.md) | Code review context and standards | After human implements code |
| [`.context/profiles/testing.md`](profiles/testing.md) | Test strategy, coverage, verification | Test planning, QA, post-implementation verification |
| [`.context/profiles/security.md`](profiles/security.md) | Security review context | Security review, threat modeling |
| [`.context/profiles/performance.md`](profiles/performance.md) | Performance and benchmarking context | Performance work, load testing, optimization |

---

## Core Reference Documents

These are the **authoritative** project documents. Load them when the work type requires it, but do not treat them as the only source of truth for implementation state.

| Document | Authority | Purpose |
|----------|-----------|---------|
| [`SPEC.md`](../SPEC.md) | Authoritative specification | Vision, invariants, phases, APIs, tech stack |
| [`AGENTS.md`](../AGENTS.md) | Authoritative AI contract | Workflow, artifact structure, agent roles, decision authority |
| [`README.md`](../README.md) | Human orientation | Current phase, quick start, project overview |

---

## Authority Model

Distinguish clearly between levels of authority:

| Level | Source | Trust |
|-------|--------|-------|
| Human decisions | Developer conversation / PR review | Highest — overrides everything |
| SPEC | [`SPEC.md`](../SPEC.md) | Authoritative for intended behavior |
| Accepted ADRs | `docs/architecture/decisions/` | Authoritative for architecture |
| Accepted architecture | `docs/architecture/proposals/` with status ACCEPTED | Authoritative for design |
| Current implementation | Actual source code in repository | Authoritative for what exists now |
| Proposals / planning | `docs/architecture/proposals/` with status PROPOSED | Advisory only — not accepted |
| Tasks / plans | `tasks/backlog/`, `tasks/active/` | Planning artifacts — not implementation |

**A proposal must never be described as an accepted decision.**

---

## Agent Identity

Every agent-created artifact must identify:

- **Agent** — agent identifier (e.g., `keui3u6`)
- **Role** — agent role (e.g., Tech Lead)
- **Task / Feature** — task or feature ID (e.g., `RESERVATION-001`)
- **Artifact** — artifact type (e.g., Architecture Proposal, Test Strategy)
- **Status** — `PROPOSED`, `ACCEPTED`, `IMPLEMENTED`, `VERIFIED`
- **Production Code Impact** — `YES` or `NO`

Example:

```text
Agent: keui3u6
Role: Tech Lead
Task: RESERVATION-001
Artifact: Technical Review
Status: PROPOSED
Production Code Impact: NO
```

---

## Git / PR Policy

### What Agents May Modify

- `.context/**`
- `docs/**`
- `tasks/**`

### What Agents May NOT Modify

- `services/**`
- `frontend/**`
- `infrastructure/**`
- Application source code
- Production tests
- Runtime configuration

Unless **explicitly authorized** by the human developer.

### Commit Metadata

Every agent commit MUST identify the agent:

```text
Agent: <agent-id>
Role: <agent-role>
Task: <task-id>
Artifact: <artifact-type>
Production Code: NO
```

### PR Requirements

PRs created by agents must clearly identify:

- Agent and role
- Task / feature
- Purpose
- Artifacts changed
- Whether production code was changed
- Whether a human decision is required

**Agents must never merge their own PRs.** The human developer reviews and merges.

---

## Quick Navigation

| Need | Start Here |
|------|------------|
| What exists right now? | [`.context/current-state.md`](current-state.md) |
| How does the AI workflow work? | [`.context/workflow.md`](workflow.md) |
| What artifacts exist and where? | [`.context/artifacts.md`](artifacts.md) |
| What agents exist and what do they do? | [`.context/agents.md`](agents.md) |
| What phase is the project in? | [`.context/phases.md`](phases.md) |
| Planning a new feature? | [`.context/profiles/feature-planning.md`](profiles/feature-planning.md) |
| Reviewing architecture? | [`.context/profiles/architecture.md`](profiles/architecture.md) |
| Preparing to implement? | [`.context/profiles/backend-implementation.md`](profiles/backend-implementation.md) |
| Reviewing code? | [`.context/profiles/backend-review.md`](profiles/backend-review.md) |
| Defining tests? | [`.context/profiles/testing.md`](profiles/testing.md) |
| Security review? | [`.context/profiles/security.md`](profiles/security.md) |
| Performance work? | [`.context/profiles/performance.md`](profiles/performance.md) |

---

## Status

**Context system version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
