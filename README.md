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
└── README.md
```

The current focus is establishing the project foundation before implementing business functionality.

## Documentation

* [`SPEC.md`](SPEC.md) — authoritative project specification
* [`AGENTS.md`](AGENTS.md) — AI engineering instructions and human/AI development workflow

## License

Not defined yet.
