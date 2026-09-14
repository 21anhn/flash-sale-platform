# Agent Reference

This document summarizes the **AI agent roles and responsibilities** for the Flash Sale Distributed Ticketing Platform.

For the full contract, see [`AGENTS.md`](../AGENTS.md) §4, §16.1, and the orchestrator definition.

---

## Agent Responsibility Matrix

### Product Owner

**Owns:**

- Product goals
- Business value
- Product scope
- Product priority
- Business outcomes
- Business-level acceptance outcomes
- Product non-goals

**Does not own:** architecture, technology selection, API design, database design, implementation

**Artifacts:** `docs/requirements/features/`

---

### Business Analyst

**Owns:**

- Business workflows
- User journeys
- Business rules
- State transitions
- Business invariants
- Alternative flows
- Failure flows
- Edge cases
- Business acceptance scenarios

**Does not own:** architecture, technology selection, implementation details

**Artifacts:** `docs/requirements/business/`

---

### Project Manager

**Owns:**

- Phases
- Milestones
- Delivery planning
- Task decomposition at delivery level
- Sequencing
- Dependencies
- Priorities
- Blockers
- Task status
- Definition of Done
- Delivery traceability

**Does not own:** architecture decisions, detailed technical implementation decisions, production implementation

**Artifacts:** `tasks/backlog/`, `tasks/active/`, `tasks/completed/`

---

### Solution Architect

**Owns:**

- Architecture proposals
- System boundaries
- Module/service responsibilities
- Data ownership
- Transaction boundaries
- Consistency models
- Concurrency considerations
- Failure semantics
- Scalability considerations
- Architectural trade-offs
- ADR recommendations

**Does not own:** product decisions, final architecture decisions, production implementation

**Artifacts:** `docs/architecture/proposals/`

---

### Tech Lead (`keui3u6`)

**Owns:**

- Technical challenge
- Implementation-level technical reasoning
- Technical trade-offs
- Technical decomposition
- Review of architectural proposals
- Identifying implementation risks
- Challenging assumptions

**Does not own:** product decisions, autonomous production implementation, final technical decisions without human approval

**Artifacts:** `docs/architecture/decisions/` (ADRs)

---

### Backend Reviewer

**Owns:**

- Backend implementation review
- Correctness review
- Maintainability review
- Code quality review
- Architectural consistency review

**Does not own:** implementation, product decisions, final technical decisions

---

### Test Engineer

**Owns:**

- Test strategy
- Test design
- Test coverage analysis
- Test scenarios
- Integration test strategy
- Regression strategy

**Does not own:** product behavior decisions, production implementation

**Artifacts:** `docs/testing/`

---

### Business QA

**Owns:**

- Business acceptance verification
- Business workflow validation
- Business invariant verification
- Acceptance scenario execution

**Does not own:** architecture, implementation

**Artifacts:** `docs/testing/`

---

### Performance Engineer

**Owns:**

- Benchmark strategy
- Workload modeling
- Load testing
- Stress testing
- Spike testing
- Soak testing
- Capacity testing
- Bottleneck analysis
- Performance evidence

**Does not own:** product scope, architecture decisions, performance-related implementation

**Artifacts:** `docs/performance/`

---

### Security Reviewer

**Owns:**

- Security analysis
- Abuse cases
- Authorization concerns
- Trust boundary analysis
- Security risks
- Security review

**Does not own:** product decisions, autonomous implementation

**Artifacts:** `docs/security/`

---

### UI Designer

**Owns:**

- User experience
- Information hierarchy
- Interaction design
- UI behavior
- Visual design direction

**Does not own:** backend architecture, backend implementation

**Artifacts:** `docs/frontend/design/`

---

### FE Engineer

**Owns:**

- Frontend implementation planning
- Frontend technical design
- Frontend integration considerations
- Frontend review

**Does not own:** backend implementation, backend architecture decisions

**Artifacts:** `docs/frontend/implementation/`

---

## Orchestrator

The Orchestrator coordinates the AI engineering team. It:

- Understands the user's requested outcome
- Determines the nature of the request
- Selects only relevant specialist agents
- Sequences their work
- Maintains traceability
- Enforces artifact structure
- Respects human approval gates

See [`.opencode/agents/orchestrator.md`](../.opencode/agents/orchestrator.md) for the full orchestrator definition.

---

## Agent Identity Requirement

Every agent-created artifact must identify:

```text
Agent: <agent-id>
Role: <agent-role>
Task: <task-id>
Artifact: <artifact-type>
Status: PROPOSED | ACCEPTED | IMPLEMENTED | VERIFIED
Production Code Impact: YES | NO
```

---

## Status

**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
