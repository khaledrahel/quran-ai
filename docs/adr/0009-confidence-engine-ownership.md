# ADR-0009: Confidence engine ownership

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (D3)

## Context

The product's central safety promise is that it gives confident feedback only where it
can be justified, and abstains visibly where it cannot. Telling a child memorizing
Qur'an that they were wrong, when they were not, is a trust-destroying event — worse
than giving no feedback at all.

ASR providers return their own confidence scores. Those scores describe the vendor's
certainty about a transcription, not our certainty about a pedagogical judgement, and
they are not comparable across vendors.

## Options considered

1. **Use the provider's confidence directly** — simple; ties a safety-critical decision
   to an opaque, vendor-specific, non-portable number that changes meaning when the
   vendor changes.
2. **Own the confidence engine; treat vendor confidence as one input** — our thresholds,
   our bands, our versioned policy, portable across vendors.

## Decision

We own the confidence engine. It lives in `services/orchestrator/confidence/`.

- Vendor confidence is **one input among several** — never the decision.
- The engine is a **pure, deterministic function**, exhaustively testable without audio
  or a vendor.
- Thresholds are a versioned `content_artifact` (`threshold_config`), not code constants,
  so they can be reviewed and approved by a qualified reviewer.
- Output is written to `confidence_assessments`, **separate from `analysis_results`**,
  carrying `band`, `decision`, `reason_codes`, `thresholds_version`, `policy_version`.

| Band | To the child | System |
|---|---|---|
| HIGH | Clear, specific feedback | Record result and evidence |
| MEDIUM | Cautious, advisory wording; invite another attempt | Record, reduced mastery weight |
| LOW | **Never says the child was wrong. Never invents a correction.** | Abstain; optional parent flag; eligible for human review |

## Consequences

- Every past decision remains explainable, because the thresholds version that produced
  it is stored alongside it. We can answer "why did the app tell my son he was wrong
  on 3 March?"
- Thresholds can be tuned from pilot data without redeploying the app.
- Requires its own test suite and a documented tuning process.
- Changing a vendor does not change the meaning of a confidence band.

## Religious-content impact

**Direct.** This engine decides when the system speaks about a child's recitation and
when it stays silent. Its thresholds and the feedback wording it selects are both
religiously sensitive content requiring qualified approval (WS-1).

## Privacy / child-safety impact

**Direct.** Abstention is a child-safety feature, not only a quality feature.

## Reversibility

`Easy` for threshold values — that is the point of externalizing them. `Costly` for the
engine's architecture once the mastery engine consumes its output.

## Review trigger

Pilot data shows the bands are miscalibrated; reviewer/AI agreement is measured and
found low; or a provider change alters the input distribution.
