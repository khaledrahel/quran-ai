# ADR-0008: Audio lifecycle and retention

- **Status:** Accepted — retention period **TBD pending WS-4**
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (D7 as amended)

## Context

The system records children reciting. Child voice is sensitive personal data and
plausibly biometric-adjacent under Saudi PDPL. Human review requires that some
recordings be retained temporarily. The PDPL review (WS-4) is unresolved.

## Options considered

1. **Retain all audio indefinitely** — best for review, tutoring, and future model
   improvement. Rejected outright: unacceptable risk, and explicitly ruled out by the PO.
2. **Process-and-discard always** — safest; makes human review impossible, and human
   review is a core MVP capability.
3. **Process-and-discard by default, consented and TTL-bound retention by exception** —
   safe default, supports review, requires consent plumbing and a deletion job.

## Decision

Option 3.

```
capture -> encrypted on device -> TLS upload -> encrypted at rest (private bucket)
  -> analyze -> DEFAULT:   delete immediately after analysis
             -> EXCEPTION: consent + open review request
                           -> TTL -> automatic deletion -> audited throughout
```

- **Default is process-and-discard.**
- Retention requires parent consent **and** an open review request.
- **The retention period is configurable and its value is TBD pending WS-4.**
  It must not be hard-coded. Until WS-4 concludes, retention defaults to disabled.
- **No indefinite storage anywhere**, device included. The on-device offline queue has
  its own TTL.
- Every access to child audio writes an `access_audit` row — including reviewer and
  admin access.
- **Child audio is never used to train any model, ours or a vendor's.** Enforced
  contractually: zero-retention and no-training terms are a hard procurement requirement
  for provider selection.

## Consequences

- Most recordings cannot be re-analyzed after the fact. Accepted.
- Building a golden evaluation set requires separate, explicit, consented collection —
  it cannot be assembled from ordinary session data.
- Consent revocation must trigger deletion, so consent state is load-bearing.
- A deletion job and its monitoring are required infrastructure, not a nice-to-have.

## Religious-content impact

`None`.

## Privacy / child-safety impact

**This is the core child-safety decision of the project.**

## Reversibility

`Easy` to change the configured period. `Irreversible` for any audio already deleted —
which is the intended direction of the asymmetry.

## Review trigger

**WS-4 concludes** — the retention period is then set. Also: any change to the
human-review workflow that alters what reviewers need to hear.
