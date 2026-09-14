# Context Profile: Testing

Use this profile when the work type is:

- Test strategy definition
- Test planning
- QA verification
- Regression planning
- Integration test design

---

## Load Order

1. [`.context/current-state.md`](../current-state.md) — understand what exists
2. [`AGENTS.md`](../../AGENTS.md) — review testing standards and artifact rules
3. Relevant sections of [`SPEC.md`](../../SPEC.md) — understand testing strategy and acceptance criteria
4. Existing artifacts in:
   - `docs/testing/` — check for existing test strategies
   - `docs/requirements/features/` — understand requirements to test
   - `docs/requirements/business/` — understand business flows and invariants
   - `docs/architecture/proposals/` — understand architecture to test against
   - `tasks/backlog/` and `tasks/active/` — understand task context
5. Relevant source code — inspect existing tests and test infrastructure only when needed

---

## Key Questions to Answer

### Test Engineer

- What test layers are needed?
- What is the test coverage target?
- What integration points need testing?
- What regression risks exist?
- What test data is required?
- What environment is needed?

### Business QA

- Do the business flows work correctly?
- Are state transitions correct?
- Are business invariants preserved?
- What are the acceptance scenarios?
- What edge cases must be verified?
- What failure flows must be tested?

---

## Test Layers

| Layer | Purpose | Owner |
|-------|---------|-------|
| Unit Tests | Business logic | Human developer |
| Integration Tests | PostgreSQL, Redis, Kafka, service boundaries | Human developer |
| Contract Tests | API/service contracts | Human developer |
| E2E Tests | Complete purchase flows | Human developer |
| Business Tests | Verify invariants | Business QA |
| Performance Tests | Verify capacity and scalability | Performance Engineer |
| Security Tests | Verify auth, authz, abuse prevention | Security Reviewer |

---

## Output Artifacts

| Agent | Output Location | Status |
|-------|-----------------|--------|
| Test Engineer | `docs/testing/<FEATURE-ID>-test-strategy.md` | PROPOSED |
| Business QA | `docs/testing/<FEATURE-ID>-qa-report.md` | PROPOSED |

---

## Verification Gates

- Tests must pass before a task moves to VERIFYING
- Business QA must confirm acceptance criteria are met
- A task is NOT done just because an AI agent produced a test strategy

---

## Status

**Profile:** testing
**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
