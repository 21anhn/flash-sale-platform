# Context Profile: Security

Use this profile when the work type is:

- Security review
- Threat modeling
- Authentication/authorization review
- Abuse case analysis
- Input validation review
- Secret management review

---

## Load Order

1. [`.context/current-state.md`](../current-state.md) — understand what exists
2. [`AGENTS.md`](../../AGENTS.md) — review security standards and artifact rules
3. Relevant sections of [`SPEC.md`](../../SPEC.md) — understand security requirements
4. Existing artifacts in:
   - `docs/security/` — check for existing security reviews
   - `docs/architecture/proposals/` — understand architecture trust boundaries
   - `docs/requirements/business/` — understand sensitive data flows
   - `tasks/backlog/` and `tasks/active/` — understand task context
5. Relevant source code — inspect auth, validation, secret handling only when needed

---

## Key Questions to Answer

### Security Reviewer

- What are the trust boundaries?
- What sensitive data is handled?
- What authentication mechanisms are used?
- What authorization rules apply?
- What input validation is required?
- What abuse scenarios exist?
- What rate-limiting is needed?
- What replay attack risks exist?
- What data leakage risks exist?
- Are secrets managed correctly?
- Are dependencies vulnerable?

---

## Security Checklist

### Minimum Requirements (from SPEC)

- JWT authentication
- RBAC
- Password hashing
- Input validation
- Rate limiting
- Request size limits
- Secret management
- Secure headers
- Service authentication

### AWS Security (when applicable)

- IAM
- Security Groups
- Secrets Manager
- KMS
- WAF
- Private subnets

---

## Output Artifacts

| Agent | Output Location | Status |
|-------|-----------------|--------|
| Security Reviewer | `docs/security/<FEATURE-ID>-security-review.md` | PROPOSED |

---

## When to Involve Solution Architect

Add SA when the security issue affects:

- Architecture
- Trust boundaries
- Data ownership
- Service boundaries

---

## Status

**Profile:** security
**Version:** 1.0
**Status:** IMPLEMENTED
**Last updated:** 2026-09-14
