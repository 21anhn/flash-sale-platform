# Context Profile: Backend Review

Use this profile when the work type is:

- Reviewing human-written backend code
- Code quality assessment
- Correctness verification
- Architecture consistency check

---

## Load Order

1. [`.context/current-state.md`](../current-state.md) — understand what exists
2. [`AGENTS.md`](../../AGENTS.md) — review code review standard
3. Relevant sections of [`SPEC.md`](../../SPEC.md) — understand intended behavior and invariants
4. Existing artifacts in:
   - `docs/architecture/proposals/` — understand proposed architecture
   - `docs/architecture/decisions/` — understand accepted ADRs
   - `docs/requirements/business/` — understand business rules and invariants
5. The code being reviewed — inspect the actual implementation

---

## Review Checklist

Every significant criticism must explain:

```text
Problem
    ↓
Why it matters
    ↓
Possible consequence
    ↓
Suggested direction
```

### Correctness

- Does the code satisfy the requirement?
- Does it preserve business invariants?
- Is the core invariant `sold + reserved <= total_inventory` maintained?

### Architecture

- Does the code follow the accepted architecture?
- Are responsibilities correctly assigned?
- Are service boundaries respected?

### Concurrency

- Are race conditions handled?
- Are locks used correctly?
- Is atomicity preserved?
- Is idempotency supported where required?

### Database

- Are transactions correct?
- Are queries efficient?
- Are indexes used appropriately?
- Is the dual-write problem avoided?

### Error Handling

- Are failures handled gracefully?
- Are timeouts configured?
- Are retries idempotent?
- Is partial failure recoverable?

### Security

- Is input validated?
- Are secrets handled correctly?
- Is authorization enforced?
- Are trust boundaries respected?

### Performance

- Are there obvious bottlenecks?
- Is N+1 query problem avoided?
- Are external calls efficient?

### Observability

- Are logs meaningful?
- Are metrics present?
- Is tracing supported?

### Maintainability

- Is the code readable?
- Are abstractions appropriate?
- Is duplication minimized?

### Test Coverage

- Are critical paths tested?
- Are edge cases covered?
- Are failure scenarios tested?

---

## Output

Review output should be:

- Clear and actionable
- Prioritized (critical vs. suggestion)
- Respectful of human ownership

The human developer decides whether and how to fix issues.

---

## Status

**Profile:** backend-review
**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
