# ADR-0006: Vendor abstraction boundary

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (product proposal v0.1)

## Context

The ASR/AI provider is not selected and is blocked on WS-4. The PDPL outcome may
eliminate entire categories of vendor, and may eventually require self-hosted or
in-region processing. The product must not be locked to any vendor, and vendor-shaped
data must not contaminate the learner data model.

## Options considered

1. **Call the provider SDK directly from services and store its response** — fastest to
   build; every vendor concept leaks into the schema, the mastery engine, and the UI.
   Switching vendors becomes a rewrite plus a data migration.
2. **Adapter interfaces with a normalization layer** — provider responses are translated
   into our schema at one boundary. Costs an extra layer and a normalization test suite.

## Decision

All provider access is behind our own interfaces — `AsrProvider`, `AlignmentProvider`,
`TajweedAnalyzer` — implemented in `services/orchestrator/adapters/`. Every response is
normalized in `services/orchestrator/normalization/` into our schema before it goes anywhere.

**No vendor-shaped data may cross that boundary.** Not into the database, not into the
mastery engine, not into FlutterFlow.

```
AsrProvider / AlignmentProvider / TajweedAnalyzer
        |
        v   ADAPTER BOUNDARY
   normalization/  ->  our schema only
        |
        v
 confidence engine -> mastery engine -> UI
```

## Consequences

- Vendor replacement is an adapter plus a normalization mapping, not a rewrite.
- A fixture-based adapter lets the entire pipeline be built and tested **now**, while
  WS-4 is unresolved — this is what keeps provider selection off the critical path.
- Contract tests run against recorded fixtures, so the suite never calls a paid API.
- Costs one indirection layer and its tests. Accepted deliberately.
- Cost and latency accounting live at this boundary, giving per-provider cost tracking
  for free.

## Religious-content impact

**Indirect but important.** Vendor confidence scores must never be presented as
religious accuracy. The boundary is where vendor output stops being authoritative and
becomes one input to our own confidence engine (ADR-0009).

## Privacy / child-safety impact

**Direct.** A single boundary is also the single place where child audio leaves our
control. That makes the data flow auditable, and makes "which vendor received what"
answerable — which the PDPL review will require.

## Reversibility

`Easy` now, `Costly` later. This ADR exists specifically to keep the *provider* decision
easy to reverse.

## Review trigger

A provider offers a capability that cannot be expressed in our normalized schema —
in which case we extend the schema deliberately, rather than leaking the vendor's shape.
