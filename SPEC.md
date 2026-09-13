# Flash Sale Distributed Ticketing Platform

> A production-oriented distributed ticketing platform and distributed-systems laboratory designed to study microservices, high traffic, concurrency, scalability, resilience, observability, cloud infrastructure, and AI-assisted engineering.

---

# 1. Project Vision

Build a production-like distributed ticketing platform capable of handling extreme traffic spikes during flash-sale events.

The project is intentionally designed as both:

1. A realistic ticketing platform.
2. A distributed systems laboratory.

The primary scenario is:

```text
Event:
    Concert A

Total tickets:
    10,000

Potential concurrent users:
    500,000+

Scenario:
    Ticket sale opens at exactly 20:00:00

Expected invariant:
    sold + reserved <= total inventory
```

The system must never oversell tickets, even under:

- High concurrency
- Request retries
- Duplicate messages
- Service failures
- Database contention
- Redis failures
- Kafka delays
- Network failures
- Partial outages

---

# 2. Project Philosophy

## 2.1 Correctness Before Performance

The most important rule:

```text
Never oversell tickets.
```

Performance is important, but correctness has higher priority.

---

## 2.2 Measure Before Optimizing

No performance claim should be accepted based only on intuition.

Every important optimization must have:

- Baseline
- Proposed change
- Benchmark
- Metrics
- Analysis
- Trade-offs
- Conclusion

---

## 2.3 Start Simple

Do not introduce:

- Kafka
- Redis
- Kubernetes
- gRPC
- Service mesh
- CQRS
- Event sourcing

without a clear reason.

The architecture should evolve because the system encounters real problems.

---

## 2.4 The Human Developer Is the Primary Implementer

The human developer owns implementation.

AI agents must NOT directly implement production code unless explicitly requested.

The preferred workflow is:

```text
Requirement
    ↓
Agent Analysis
    ↓
Agent Proposal
    ↓
Detailed Implementation Plan
    ↓
Human asks Leader
    ↓
Leader explains / challenges / compares alternatives
    ↓
Human decides
    ↓
Human writes code
    ↓
Agents review
    ↓
Tests
    ↓
Benchmark
    ↓
Decision / Documentation
```

---

# 3. AI Agent Engineering Model

The project uses multiple specialized AI agents.

Agents are reviewers, analysts, architects, testers, and technical advisors.

They are not autonomous programmers by default.

---

# 4. Agent Roles

## 4.1 PM Agent

Responsibilities:

- Clarify requirements
- Define business goals
- Define acceptance criteria
- Prioritize scope
- Identify missing requirements
- Prevent unnecessary scope expansion

PM must not dictate technical implementation.

---

## 4.2 Business QA Agent

Responsibilities:

- Review business flows
- Identify edge cases
- Validate state transitions
- Define business test scenarios
- Verify business invariants

Example:

```text
Reservation expires
    ↓
Inventory must become available again
```

---

## 4.3 Solution Architect Agent

Responsibilities:

- Define system architecture
- Define service boundaries
- Define data ownership
- Evaluate communication patterns
- Evaluate consistency
- Identify scalability problems
- Identify architectural trade-offs
- Propose ADRs

SA should explain WHY a design is recommended.

---

## 4.4 Tech Lead Agent

The Tech Lead is the primary technical discussion partner.

The Tech Lead is identified as:

```text
keui3u6
```

Responsibilities:

- Review proposed implementation
- Explain implementation approaches
- Challenge technical decisions
- Compare alternatives
- Identify hidden complexity
- Review code after the human implements it
- Explain concurrency problems
- Explain performance implications
- Explain maintainability concerns

The Tech Lead must not automatically write implementation code.

---

## 4.5 Performance Agent

Responsibilities:

- Define load tests
- Analyze bottlenecks
- Analyze database performance
- Analyze Redis
- Analyze Kafka
- Analyze JVM
- Analyze network behavior
- Analyze Kubernetes scaling
- Compare benchmark results

---

## 4.6 Security Agent

Responsibilities:

- Threat modeling
- Authentication review
- Authorization review
- API security
- Input validation
- Secrets
- Dependency vulnerabilities
- Abuse scenarios
- Rate-limit bypass
- Replay attacks
- Data leakage

---

# 5. Mandatory Agent Workflow

For every non-trivial feature, agents should follow this process.

## Step 1 — Understand

Agent analyzes:

- Requirement
- Existing architecture
- Existing code
- Existing APIs
- Existing database
- Existing constraints

No implementation should be proposed before understanding the existing system.

---

## Step 2 — Propose

Agent proposes:

```text
Problem
Proposed solution
Why
Alternatives
Trade-offs
Affected components
Risks
Testing strategy
```

---

## Step 3 — Implementation Specification

Before the human writes code, the agent must describe exactly what needs to change.

Example:

```text
Feature:
Reservation expiration

Files/components affected:

ticket-service
    ReservationController
    ReservationService
    ReservationRepository
    Reservation entity
    ReservationScheduler

Database:
    reservations table
    reservation_status index

Events:
    ReservationExpired

Redis:
    reservation:{reservationId}

Tests:
    ReservationServiceTest
    ReservationIntegrationTest
```

The agent should explain responsibilities and interactions.

---

## Step 4 — Human Discusses With Tech Lead

The human developer asks:

```text
@keui3u6

How would you implement this?

Why this approach?

What alternatives exist?

What concurrency issues exist?

What happens if the service crashes?

What happens if the DB transaction succeeds but Kafka publish fails?

What should I watch out for when coding this?
```

The Tech Lead explains the implementation approach.

---

## Step 5 — Human Implements

The human writes the actual code.

Agents should not silently implement the feature.

---

## Step 6 — Code Review

After implementation:

```text
Human Code
    ↓
Tech Lead Review
    ↓
Business QA
    ↓
Security Review
    ↓
Performance Review
```

Only relevant reviewers need to participate for small changes.

---

## Step 7 — Verification

Run:

- Unit tests
- Integration tests
- Contract tests
- E2E tests
- Security tests
- Performance tests

where applicable.

---

## Step 8 — Document

If the change affects architecture:

Create an ADR.

If the change affects performance:

Create a benchmark.

If the change exposes a production-like incident:

Create an incident report.

---

# 6. Agent Proposal Format

Every technical proposal should use this structure:

```text
# Proposal

## Problem

What problem are we solving?

## Context

What currently exists?

## Proposed Solution

What should change?

## Architecture Impact

Which services/components are affected?

## Data Impact

Which tables/events/cache keys are affected?

## API Impact

Which APIs change?

## Implementation Plan

What should the developer implement?

## Alternatives

What other approaches were considered?

## Trade-offs

Pros:
-

Cons:
-

## Failure Scenarios

What happens when things fail?

## Testing

What tests should be written?

## Performance

What performance implications exist?

## Security

What security implications exist?

## Observability

What logs/metrics/traces are needed?

## Questions For Tech Lead

What needs technical discussion before implementation?
```

---

# 7. Implementation Description Rules

When an agent proposes implementation, it must describe the code structure clearly.

Bad:

```text
Add reservation handling.
```

Good:

```text
ticket-service

ReservationController
    POST /reservations

ReservationService
    reserve()

ReservationRepository
    findAvailableInventoryForUpdate()

Reservation entity
    status
    expiresAt

ReservationExpirationScheduler
    periodically finds expired reservations

Kafka:
    ReservationExpired

Metrics:
    reservation.success
    reservation.failure
    reservation.expired
```

The goal is for the human developer to understand what to implement without the agent taking ownership of the implementation.

---

# 8. Technology Stack

## Backend

Primary:

```text
Java
Spring Boot
```

Expected technologies:

- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- Spring Kafka
- Spring Boot Actuator
- Micrometer
- Resilience4j

---

## Frontend

```text
React
TypeScript
```

---

## Database

```text
PostgreSQL
```

PostgreSQL is the authoritative transactional data store.

---

## Cache

```text
Redis
```

---

## Message Broker

```text
Apache Kafka
```

---

## Optional .NET

```text
ASP.NET Core
```

Only introduce .NET when there is a specific engineering experiment or service requirement.

Possible experiment:

```text
Spring Boot Ticket Service
        VS
ASP.NET Core Ticket Service
```

Benchmark:

- RPS
- p50
- p95
- p99
- CPU
- Memory
- GC
- Throughput

---

## Optional Python

Python is reserved for AI/ML-related functionality.

Possible features:

- Traffic anomaly detection
- Incident analysis
- AI operations assistant
- Sales forecasting
- Natural-language analytics
- Recommendation systems

Python should not implement ordinary business logic unnecessarily.

---

# 9. Cloud Platform

Primary cloud platform:

```text
AWS
```

AWS should be introduced progressively.

---

# 10. AWS Architecture

Production-like target architecture:

```text
                         Internet
                            │
                            ▼
                       Route 53
                            │
                            ▼
                       CloudFront
                            │
                            ▼
                           WAF
                            │
                            ▼
                    Application Load
                       Balancer
                            │
                            ▼
                     EKS / Kubernetes
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       Services          Services          Services
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
           ┌────────────────┼─────────────────┐
           │                │                 │
           ▼                ▼                 ▼
        Redis             Kafka           PostgreSQL
      ElastiCache      MSK / Kafka       RDS PostgreSQL
```

The exact AWS architecture may evolve through ADRs.

---

# 11. AWS Services

Potential services:

## Compute

```text
Amazon EKS
EC2
ECS
```

EKS is preferred for the production-like Kubernetes phase.

---

## Database

```text
Amazon RDS for PostgreSQL
```

Potential future experiments:

- Read replicas
- Multi-AZ
- Connection pooling
- Failover

---

## Cache

```text
Amazon ElastiCache for Redis
```

---

## Messaging

Potential:

```text
Amazon MSK
```

Kafka remains the application-level messaging technology.

---

## Storage

```text
Amazon S3
```

Potential uses:

- Event images
- Reports
- Benchmark artifacts
- Logs/exports
- AI datasets

---

## Networking

Potential:

```text
VPC
Public Subnets
Private Subnets
Security Groups
NAT Gateway
Internet Gateway
ALB
```

---

## Observability

Potential:

```text
CloudWatch
Prometheus
Grafana
OpenTelemetry
```

---

## Security

Potential:

```text
IAM
Secrets Manager
KMS
AWS WAF
Security Groups
```

---

# 12. Cloud Development Strategy

Do not start with a full AWS architecture.

Development stages:

```text
Local
  ↓
Docker Compose
  ↓
Local Kubernetes
  ↓
AWS Development Environment
  ↓
AWS Production-like Environment
```

---

# 13. Local Environment

Local development should be possible without AWS.

Required local infrastructure:

```text
PostgreSQL
Redis
Kafka
Services
Frontend
```

Docker Compose should be the initial environment.

---

# 14. Kubernetes

Kubernetes should be introduced after the services work correctly locally.

Initial goals:

- Deployments
- Services
- ConfigMaps
- Secrets
- Ingress
- HPA
- Resource limits
- Readiness probes
- Liveness probes

Later:

- PodDisruptionBudget
- Cluster autoscaling
- Service mesh
- Advanced scheduling

---

# 15. Microservices

Initial target services:

```text
api-gateway
user-service
event-service
ticket-service
order-service
payment-service
notification-service
queue-service
```

Services must have clear responsibilities.

---

# 16. Data Ownership

A service must not directly access another service's database tables.

Bad:

```text
Order Service
     ↓
Ticket Service DB
```

Preferred:

```text
Order Service
     ↓
Ticket Service API
```

or:

```text
Order Created
     ↓
Kafka
     ↓
Ticket Service
```

---

# 17. Core Business Invariants

The following invariants are mandatory.

## Inventory

```text
sold + reserved <= total_inventory
```

## Order

A user must not receive multiple logical orders from one idempotent request.

## Reservation

An expired reservation must eventually release inventory.

## Authorization

A user cannot access another user's private order.

## Payment

Payment failure must not leave inventory permanently unavailable.

---

# 18. Reservation Lifecycle

```text
AVAILABLE
    │
    ▼
RESERVED
    │
    ├── Payment Success ──> SOLD
    │
    ├── Timeout ──────────> AVAILABLE
    │
    └── Cancellation ────> AVAILABLE
```

Default TTL:

```text
10 minutes
```

Configurable.

---

# 19. Order Lifecycle

```text
PENDING
   │
   ▼
RESERVED
   │
   ▼
PAYMENT_PENDING
   │
   ├── SUCCESS ──> CONFIRMED
   │
   └── FAILED ──> CANCELLED
```

---

# 20. Kafka Events

Initial events:

```text
UserRegistered
EventCreated
EventPublished
TicketSaleOpened
TicketReserved
ReservationExpired
OrderCreated
PaymentRequested
PaymentSucceeded
PaymentFailed
OrderConfirmed
OrderCancelled
NotificationRequested
```

Events must include:

```text
event_id
event_type
aggregate_id
timestamp
producer
schema_version
correlation_id
payload
```

---

# 21. Transactional Outbox

Critical event-producing transactions must use the Outbox Pattern.

Example:

```text
BEGIN

Create Order

Create Outbox Event

COMMIT
```

Then:

```text
Outbox Publisher
      ↓
Kafka
```

This prevents the dual-write problem.

---

# 22. Idempotency

Critical APIs must support:

```text
Idempotency-Key
```

Especially:

```text
Create Reservation
Create Order
Payment
```

Repeated requests must not produce duplicate business operations.

---

# 23. Distributed Transactions

Do not use distributed database transactions.

Preferred:

```text
Transactional Outbox
+
Kafka
+
Saga
+
Compensation
+
Idempotent Consumers
```

---

# 24. Virtual Queue

The virtual queue protects the purchasing system from flash-sale traffic.

Example:

```text
500,000 users
       ↓
Virtual Queue
       ↓
Admission Controller
       ↓
5,000 active buyers
```

Configurable:

```text
max_active_users
admission_rate
token_ttl
queue_ttl
```

---

# 25. Rate Limiting

Support:

- IP rate limiting
- User rate limiting
- Endpoint rate limiting
- Event rate limiting

Rate limits must be configurable.

---

# 26. API

Initial APIs:

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/events
GET    /api/v1/events/{eventId}

GET    /api/v1/events/{eventId}/tickets

POST   /api/v1/events/{eventId}/queue
GET    /api/v1/events/{eventId}/queue/status

POST   /api/v1/reservations
GET    /api/v1/reservations/{id}

POST   /api/v1/orders
GET    /api/v1/orders/{id}
GET    /api/v1/orders

POST   /api/v1/orders/{id}/payment
```

---

# 27. Observability

All services must support:

```text
trace_id
span_id
request_id
```

Metrics:

```text
RPS
p50
p95
p99
error rate
CPU
memory
DB connections
DB latency
Redis latency
Redis hit ratio
Kafka throughput
Kafka lag
queue length
reservation success rate
reservation failure rate
```

Use:

```text
OpenTelemetry
Prometheus
Grafana
CloudWatch
```

where appropriate.

---

# 28. Load Testing

Primary tool:

```text
k6
```

Test categories:

```text
Smoke
Baseline
Load
Stress
Spike
Soak
Concurrency
Capacity
```

Example flash-sale test:

```text
500,000 virtual users
limited inventory
traffic spike
```

The test must verify both:

```text
Performance
+
Business correctness
```

---

# 29. Performance Metrics

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

# 30. Performance Experiments

Potential experiments:

```text
PostgreSQL only
        ↓
PostgreSQL + Redis
        ↓
Kafka async
        ↓
Virtual Queue
        ↓
Horizontal scaling
        ↓
Kubernetes autoscaling
```

Each change requires benchmark evidence.

---

# 31. Concurrency Experiments

Compare:

1. PostgreSQL pessimistic locking
2. PostgreSQL optimistic locking
3. Redis atomic operations
4. Redis Lua
5. Distributed lock
6. Kafka serialized processing

The goal is to understand:

- Correctness
- Throughput
- Latency
- Failure modes
- Operational complexity

---

# 32. Failure Injection

Support controlled failures:

```text
Payment:
10% failure

Ticket:
2s latency

Redis:
unavailable

Kafka:
consumer delay

PostgreSQL:
connection exhaustion
```

---

# 33. Chaos Engineering

Future experiments:

- Kill service
- Restart database
- Restart Redis
- Delay Kafka consumer
- Inject network latency
- Inject packet loss
- CPU saturation
- Memory pressure

Every experiment must be documented.

---

# 34. Security

Minimum:

- JWT authentication
- RBAC
- Password hashing
- Input validation
- Rate limiting
- Request size limits
- Secret management
- Secure headers
- Service authentication

AWS security:

- IAM
- Security Groups
- Secrets Manager
- KMS
- WAF
- Private subnets

---

# 35. Testing Strategy

## Unit Tests

Business logic.

## Integration Tests

PostgreSQL, Redis, Kafka and service boundaries.

Testcontainers should be considered.

## Contract Tests

API/service contracts.

## E2E Tests

Complete purchase flows.

## Business Tests

Verify invariants.

## Performance Tests

Verify capacity and scalability.

## Security Tests

Verify authentication, authorization, abuse prevention and data protection.

---

# 36. Repository Structure

```text
flash-sale-platform/

├── SPEC.md
├── AGENTS.md
├── README.md
│
├── services/
│   ├── api-gateway/
│   ├── user-service/
│   ├── event-service/
│   ├── ticket-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── notification-service/
│   └── queue-service/
│
├── frontend/
│   └── web/
│
├── load-tests/
│   ├── smoke/
│   ├── baseline/
│   ├── load/
│   ├── stress/
│   ├── spike/
│   └── flash-sale/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── aws/
│
└── docs/
    ├── architecture/
    ├── adr/
    ├── api/
    ├── benchmarks/
    ├── experiments/
    └── incidents/
```

---

# 37. Development Phases

## Phase 0 — Foundation

Implement:

- Repository
- CI
- Coding standards
- Docker Compose
- PostgreSQL
- Basic documentation
- Migration system

---

## Phase 1 — Modular Monolith

Implement:

```text
Authentication
Events
Tickets
Reservation
Orders
Mock Payment
React UI
```

Architecture:

```text
React
   ↓
Spring Boot
   ↓
PostgreSQL
```

Goal:

Complete business flow.

---

## Phase 2 — Microservices

Extract:

```text
User
Event
Ticket
Order
Payment
```

Introduce:

- API Gateway
- Service boundaries
- Data ownership

---

## Phase 3 — Event Driven

Introduce:

```text
Kafka
Transactional Outbox
Domain Events
Async Notifications
```

---

## Phase 4 — High Traffic

Introduce:

```text
Redis
Rate Limiting
Virtual Queue
Load Testing
Horizontal Scaling
```

---

## Phase 5 — Distributed Consistency

Introduce:

```text
Idempotency
Saga
Compensation
Retry
DLQ
Circuit Breaker
```

---

## Phase 6 — Observability

Introduce:

```text
OpenTelemetry
Prometheus
Grafana
Distributed Tracing
Structured Logging
```

---

## Phase 7 — Kubernetes

Introduce:

```text
Kubernetes
HPA
Readiness
Liveness
Resource Limits
```

---

## Phase 8 — AWS

Move toward:

```text
AWS
EKS
RDS PostgreSQL
ElastiCache Redis
MSK Kafka
S3
ALB
WAF
CloudWatch
IAM
Secrets Manager
KMS
```

---

## Phase 9 — Chaos Engineering

Introduce controlled failures.

---

## Phase 10 — Optimization

Benchmark:

```text
Database
Redis
Kafka
JVM
HTTP
Connection Pools
Thread Pools
Kubernetes
AWS Infrastructure
```

---

# 38. Architecture Decision Records

Significant decisions require ADRs.

Examples:

```text
ADR-001 PostgreSQL as source of truth

ADR-002 Redis is not authoritative for inventory

ADR-003 Kafka for asynchronous communication

ADR-004 Transactional Outbox

ADR-005 Saga instead of distributed transaction

ADR-006 Monorepo strategy

ADR-007 Spring Boot as primary backend

ADR-008 Virtual Queue architecture

ADR-009 REST vs gRPC

ADR-010 Kafka partition strategy

ADR-011 AWS deployment architecture

ADR-012 EKS vs ECS
```

---

# 39. Definition of Done

A feature is complete only when:

- Business behavior works.
- Tests exist.
- Failure cases are considered.
- Security implications are reviewed.
- Logs exist.
- Metrics exist.
- Tracing exists where appropriate.
- API documentation exists.
- Performance implications are understood.
- Architecture impact is documented.
- ADR exists if architecture changed.

---

# 40. Human + AI Development Contract

The human developer is the primary engineer.

AI agents are:

```text
PM
SA
Tech Lead
Business QA
Performance Engineer
Security Engineer
```

The agents are responsible for:

```text
Analyze
Question
Challenge
Propose
Explain
Review
Measure
Document
```

The human is responsible for:

```text
Decide
Implement
Run experiments
Evaluate trade-offs
Accept/reject proposals
```

---

# 41. No Blind Coding

An AI agent must not respond to a feature request with implementation code as the first response.

Instead:

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
Human Implementation
```

If the human explicitly asks for code, the agent may provide code as a teaching/reference artifact, but the preferred workflow remains human implementation.

---

# 42. Technical Discussion Standard

When the human asks:

> "How should I implement this?"

The Tech Lead should answer:

### 1. Architecture

Explain where the change belongs.

### 2. Responsibility

Explain which class/service owns the behavior.

### 3. Data

Explain:

- Tables
- Transactions
- Indexes
- Cache
- Events

### 4. Control Flow

Explain the request lifecycle.

### 5. Concurrency

Explain:

- Race conditions
- Locks
- Atomicity
- Idempotency

### 6. Failure

Explain:

- Timeout
- Retry
- Partial failure
- Recovery

### 7. Observability

Explain:

- Logs
- Metrics
- Traces

### 8. Testing

Explain what tests should prove.

### 9. Trade-offs

Explain alternative approaches.

---

# 43. Code Review Standard

When reviewing human-written code, agents must evaluate whether the implementation contributes to a measurable, scalable, resilient distributed system.

They should not merely say:

```text
LGTM
```

They should evaluate:

```text
Correctness
Architecture
Concurrency
Database
Transactions
Error handling
Security
Performance
Observability
Maintainability
Test coverage
```

Every criticism should explain:

```text
Problem
Why it matters
Possible consequence
Suggested direction
```

The human decides whether to change it.

# 44. Final Engineering Objective

The purpose of this project is not merely:

> Build a ticketing application.

The purpose is:

> Build a measurable, scalable, resilient distributed system and use it as a laboratory for learning how real production systems behave under load and failure.

The project should allow the developer to answer:

- How much traffic can we handle?
- Where is the bottleneck?
- What happens when Redis fails?
- What happens when Kafka is delayed?
- What happens when PostgreSQL is overloaded?
- Can we guarantee no overselling?
- What happens when a client retries?
- What happens when a service crashes?
- How does Kubernetes react?
- How does AWS infrastructure affect performance?
- Which architecture is actually faster?
- What are the trade-offs?
- Can we prove our claims with benchmarks?

The final result is:

```text
Ticketing Platform
        +
Microservices System
        +
High-Traffic Laboratory
        +
Distributed Systems Laboratory
        +
AWS Cloud Laboratory
        +
AI-Assisted Engineering Workflow
```

