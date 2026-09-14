# AI Engineering Workflow

This document describes the **standard workflow** for AI-assisted engineering on this project.

For the full contract, see [`AGENTS.md`](../AGENTS.md).

---

## Human + AI Development Model

The human developer is the **primary engineer and final decision maker**.

AI agents are:

- Analysts
- Architects
- Technical advisors
- Reviewers
- Testers
- Performance engineers
- Security reviewers

AI agents **must NOT** autonomously implement production code unless explicitly requested.

---

## Standard Workflow

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
Tech Lead Discussion
    ↓
Human Decision
    ↓
Human Implementation
    ↓
Code Review
    ↓
Tests
    ↓
Benchmark (if relevant)
    ↓
Documentation / ADR (if needed)
    ↓
Done
```

---

## Workflow by Request Type

### New Business Feature

```text
PO → BA → PM → SA → Tech Lead → Human
```

After implementation:

```text
Backend Reviewer → Business QA → Test Engineer → Security / Performance (if relevant)
```

### Requirement Clarification

```text
PO → BA
```

Do not invoke SA or Tech Lead unless technical analysis is required.

### Architecture Planning

```text
SA → Tech Lead → Human Decision
```

If architecturally significant: create or update ADR in `docs/architecture/decisions/`.

### Backend Implementation Preparation

```text
SA (if architecture unclear) → Tech Lead → Human
```

The human performs the implementation.

### Backend Implementation Review

```text
Backend Reviewer
```

Add Security Reviewer or Performance Engineer when relevant.

### Business Verification

```text
Business QA
```

Verifies against product requirements, business analysis, acceptance criteria, and invariants.

### Test Strategy

```text
Test Engineer
```

Add Business QA when business behavior must be verified.

### Performance Investigation

```text
Performance Engineer → Human Implementation / Optimization → Benchmark → Evidence → Documentation
```

### Security Investigation

```text
Security Reviewer
```

Add SA when the issue affects architecture or trust boundaries.

### Frontend Feature

```text
PO → BA → UI Designer → FE Engineer → Human
```

---

## Human Approval Gates

### Gate 1: Product / Requirement Approval

Before significant architecture or implementation planning:

```text
PO → BA → PM
```

If business behavior remains unresolved, stop and surface open questions.

### Gate 2: Architecture Approval

After SA produces an architecture proposal:

```text
SA → Tech Lead → HUMAN
```

The human decides: accept, reject, modify, or request another proposal.

**An architecture proposal is not an approved architecture.**

### Gate 3: Technical Implementation Decision

After technical discussion:

```text
Tech Lead → HUMAN
```

The human decides the implementation approach and may disagree with any agent.

### Gate 4: Completion

After implementation:

```text
Review → QA → Required Verification → HUMAN
```

A task must not be marked DONE merely because AI agents report success.

---

## No Premature Escalation

Do not invoke downstream agents before upstream inputs are sufficiently defined.

- Do not invoke SA when the business requirement is still ambiguous.
- Do not invoke Tech Lead before an architecture proposal exists (unless the human explicitly requests early exploration).
- Do not invoke Performance Engineer before the performance objective is defined.
- Do not invoke Security Reviewer when there is no meaningful security impact.
- Do not invoke UI Designer or FE Engineer for backend-only work.
- Do not invoke all reviewers automatically for every change.

**Use the smallest useful team.**

---

## Agent Handoff Protocol

When handing work between agents, preserve:

1. User request
2. Relevant requirements
3. Previous agent output
4. Open questions
5. Decisions already made
6. Constraints
7. Relevant repository artifacts
8. Expected output from the next agent

Do not discard unresolved questions.
Do not allow downstream agents to silently override upstream business decisions.

---

## Decision Recording

When an architectural or technical decision is made:

1. Identify whether an ADR is required.
2. Record the decision when appropriate.
3. Reference the decision from affected tasks.
4. Distinguish clearly between: **PROPOSED**, **ACCEPTED**, **REJECTED**, **SUPERSEDED**.

Never describe a proposal as an accepted decision.

---

## Scope Control

Prevent scope creep:

1. Identify new scope.
2. Determine whether it belongs to the current feature.
3. Ask PO to decide when product-related.
4. Ask PM to re-plan when scope changes.
5. Ask SA when the change has architectural impact.

Do not silently expand the current task.

---

## Status

**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
