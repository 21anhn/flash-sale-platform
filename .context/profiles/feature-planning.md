# Context Profile: Feature Planning

Use this profile when the work type is:

- New feature definition
- Requirement clarification
- Scope change
- Product planning
- Business analysis
- Delivery planning

---

## Load Order

1. [`.context/current-state.md`](../current-state.md) — understand what exists
2. [`AGENTS.md`](../../AGENTS.md) — review artifact rules and workflow
3. Relevant sections of [`SPEC.md`](../../SPEC.md) — understand intended behavior
4. Existing artifacts in:
   - `docs/requirements/features/` — check for related product requirements
   - `docs/requirements/business/` — check for related business analysis
   - `tasks/backlog/` — check for related tasks
5. Load relevant context profiles for downstream work if known

---

## Key Questions to Answer

### Product Owner

- What is the business goal?
- What is in scope?
- What is out of scope?
- What are the acceptance criteria?
- What is the priority?
- What are the dependencies?
- What open questions remain?

### Business Analyst

- Who are the actors?
- What are the preconditions?
- What is the main flow?
- What are the alternative flows?
- What are the failure flows?
- What are the state transitions?
- What business rules apply?
- What invariants must hold?
- What edge cases exist?
- What are the acceptance scenarios?

### Project Manager

- What tasks must be created?
- What are the dependencies between tasks?
- What is the recommended sequence?
- Which agents are required?
- What is the Definition of Done?
- What verification is required?

---

## Output Artifacts

| Agent | Output Location | Status |
|-------|-----------------|--------|
| Product Owner | `docs/requirements/features/<FEATURE-ID>-product-requirement.md` | PROPOSED |
| Business Analyst | `docs/requirements/business/<FEATURE-ID>-business-analysis.md` | PROPOSED |
| Project Manager | `tasks/backlog/<FEATURE-ID>.md` | BACKLOG |

---

## Human Approval Gates

- Gate 1: Product / Requirement Approval — human confirms scope and acceptance criteria
- Gate 2: Architecture Approval — only after requirement is clear

Do not proceed to architecture planning until requirements are sufficiently defined.

---

## Status

**Profile:** feature-planning
**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
