# Context Profile: Performance

Use this profile when the work type is:

- Performance investigation
- Benchmark design
- Load test planning
- Bottleneck analysis
- Optimization planning
- Capacity testing

---

## Load Order

1. [`.context/current-state.md`](../current-state.md) — understand what exists
2. [`AGENTS.md`](../../AGENTS.md) — review performance standards and artifact rules
3. Relevant sections of [`SPEC.md`](../../SPEC.md) — understand performance requirements and metrics
4. Existing artifacts in:
   - `docs/performance/` — check for existing performance plans/reports
   - `docs/architecture/proposals/` — understand architecture to benchmark
   - `docs/architecture/decisions/` — understand accepted performance-related ADRs
   - `tasks/backlog/` and `tasks/active/` — understand task context
5. Relevant source code — inspect performance-critical paths only when needed

---

## Key Questions to Answer

### Performance Engineer

- What is the workload definition?
- What is the target concurrency?
- What is the target request rate?
- What latency distribution is acceptable?
- What throughput is required?
- What resource usage is expected?
- What is the acceptable error rate?
- What is the bottleneck evidence?
- What is the test environment?
- What is the test duration?
- What is the comparison baseline?

---

## Performance Work Rules

1. **Measure before optimizing** — never claim something is faster without evidence.
2. **Baseline first** — establish a baseline before making changes.
3. **Benchmark after change** — run benchmarks after every change.
4. **Document evidence** — performance claims must include:
   - Workload definition
   - Concurrency
   - Request rate
   - Latency distribution (p50, p95, p99)
   - Throughput
   - Resource usage
   - Error rate
   - Bottleneck evidence
   - Environment
   - Test duration
   - Comparison baseline

---

## Required Metrics

Every performance test must report:

```text
RPS
Concurrency
p50
p95
p99
error rate
CPU
memory
DB CPU
DB connections
Redis hit ratio
Kafka lag
```

---

## Test Categories

| Category | Purpose |
|----------|---------|
| Smoke | Verify the system works under minimal load |
| Baseline | Establish performance baseline |
| Load | Verify performance under expected load |
| Stress | Find breaking point |
| Spike | Verify behavior under sudden traffic increase |
| Soak | Verify stability over extended period |
| Concurrency | Verify correctness under concurrent access |
| Capacity | Determine maximum capacity |

---

## Output Artifacts

| Agent | Output Location | Status |
|-------|-----------------|--------|
| Performance Engineer | `docs/performance/<FEATURE-ID>-performance-plan.md` | PROPOSED |
| Performance Engineer | `docs/performance/<FEATURE-ID>-benchmark-report.md` | PROPOSED |

---

## When to Involve Backend Reviewer

Add Backend Reviewer when the investigation reveals implementation-level issues that require code changes.

---

## Status

**Profile:** performance
**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
