# Context Profile: Architecture

Use this profile when the work type is:

- Architecture planning
- System boundary design
- Data ownership decisions
- Consistency model selection
- ADR creation
- Architecture review

---

## Load Order

1. [`.context/current-state.md`](../current-state.md) — understand what exists
2. [`AGENTS.md`](../../AGENTS.md) — review artifact rules, proposal format, and technical discussion standard
3. Relevant sections of [`SPEC.md`](../../SPEC.md) — understand intended architecture and constraints
4. Existing artifacts in:
   - `docs/architecture/proposals/` — check for related proposals
   - `docs/architecture/decisions/` — check for related ADRs
   - `docs/requirements/features/` — understand the requirement driving architecture
   - `docs/requirements/business/` — understand business constraints
5. Relevant source code — only if verifying current implementation state

---

## Key Questions to Answer

### Solution Architect

- Where should the behavior belong?
- Which service, class, or component owns the behavior?
- What are the service boundaries?
- What is the data ownership model?
- What consistency model is required?
- What are the concurrency considerations?
- What are the failure semantics?
- What are the scalability implications?
- What are the architectural trade-offs?
- Is an ADR justified?

### Tech Lead

- Why is this design recommended?
- What alternatives exist?
- What hidden complexity exists?
- What concurrency problems exist?
- What are the performance implications?
- What are the maintainability concerns?
- What happens when things fail?

---

## Technical Discussion Standard

When discussing architecture, explicitly cover:

1. **Architecture** — where the change belongs
2. **Responsibility** — which service/class owns the behavior
3. **Data** — tables, transactions, indexes, cache, events, data ownership
4. **Control Flow** — request or execution lifecycle
5. **Concurrency** — race conditions, locks, atomicity, idempotency, duplicate requests/messages
6. **Failure** — timeouts, retries, partial failures, crash recovery, inconsistency, dependency failures
7. **Observability** — logs, metrics, traces
8. **Testing** — what tests must prove
9. **Trade-offs** — alternative approaches

---

## Output Artifacts

| Agent | Output Location | Status |
|-------|-----------------|--------|
| Solution Architect | `docs/architecture/proposals/<FEATURE-ID>-architecture-proposal.md` | PROPOSED |
| Tech Lead | `docs/architecture/decisions/<ADR-ID>-<decision-name>.md` | PROPOSED / ACCEPTED |

---

## Human Approval Gates

- Gate 2: Architecture Approval — human decides whether to accept, reject, modify, or request another proposal
- An architecture proposal is NOT an approved architecture

---

## Status

**Profile:** architecture
**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
