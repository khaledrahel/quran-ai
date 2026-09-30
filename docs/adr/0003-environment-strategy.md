# ADR-0003: Environment strategy — local, staging, production

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (F4, Amendment 2)

## Context

The product processes children's voice recordings in Saudi Arabia. The PDPL/residency
review (WS-4) is unresolved and blocks the production region and provider selection.
Engineering must proceed without waiting.

## Options considered

1. **Three environments, staging holds production-like real data** — best bug
   reproduction; makes staging a residency and child-safety problem, and blocks staging
   on WS-4.
2. **Three environments, staging synthetic-only** — staging carries no regulatory
   weight, so it can be created immediately in any region; costs realistic debugging.
3. **Two environments (local + production)** — cheapest; no safe integration target.

## Decision

Three environments. **Staging contains synthetic data only — never real child data,
not even pilot data, not even temporarily for debugging.**

| Env | Data | Region |
|---|---|---|
| Local (Docker) | Synthetic | Local machine |
| Staging | **Synthetic only** | Non-critical; decided after WS-4 |
| Production | Real | **BLOCKED on WS-4** |

## Consequences

- **This is the decision that unblocks roughly four weeks of engineering** while WS-4
  is outstanding. Without it, almost everything waits on a legal review.
- Reproducing a production bug means working from logs and synthetic reconstruction,
  never from a data copy. This is a real, accepted cost.
- Synthetic seed data must be good enough to exercise real edge cases, which is ongoing
  work rather than a one-off.
- No production project is created until WS-4 concludes.

## Religious-content impact

`None`.

## Privacy / child-safety impact

**Significant and positive.** Child audio and learner PII exist in exactly one
environment. A staging compromise exposes no real child. This also removes the most
common route by which production data leaks onto developer machines.

## Reversibility

`Easy` to add environments. Relaxing the synthetic-only rule would be `Irreversible` in
effect — once real data touches staging, it has touched staging.

## Review trigger

WS-4 concludes; or a class of bug proves genuinely unreproducible without real data
(in which case the answer is better synthetic data or production-side diagnostics,
not copying child records).
