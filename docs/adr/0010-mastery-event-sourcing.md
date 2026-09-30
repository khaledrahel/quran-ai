# ADR-0010: Mastery event sourcing

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (D2)

## Context

Mastery in Qur'an memorization is multidimensional and decays over time. The PO has
explicitly required that a Qur'an-specific adaptive model be developed and validated
rather than adopting SM-2 or FSRS unexamined. That means the model **will** change during
and after the pilot — and when it changes, past learner state must not become meaningless.

## Options considered

1. **Mutable current-state table** — simple and fast. A model change cannot be applied
   retroactively, history is lost, and a bug silently corrupts learner state with no way
   to reconstruct the truth.
2. **Append-only event ledger with a projected state table** — history preserved, model
   changes replayable, fully auditable. Costs more storage and a projection mechanism.

## Decision

Option 2.

```
mastery_events   append-only ledger: ai | human | self_report | system_decay
      |
      v  projection
mastery_states   current state per learner per scope
```

- `mastery_states` is a **projection** of `mastery_events`, never an independent truth.
- **Five dimensions are preserved separately forever**: memorization, retention,
  accuracy, fluency, tajweed. A single UI progress figure may be *computed* for display
  but is never stored as the truth.
- **Human corrections outrank AI** — events with `source = human` carry override weight.
- Decay is a scheduled `system_decay` event stream, both time-based and performance-based.
- The scheduler is versioned (`model_version`) so results are attributable to a model.

## Consequences

- **The model can be improved and the history replayed.** This is the property that makes
  a Qur'an-specific adaptive model safe to iterate on, rather than a one-way bet.
- Full auditability: every mastery change traces to its evidence — an attempt, a reviewer
  decision, or a decay event.
- Reviewer corrections become labelled training and evaluation data as a side effect of
  the normal workflow.
- More storage, and projection logic that must be correct. Accepted.
- Projection must be re-runnable from scratch, and that path must be tested, or the
  benefit is theoretical.

## Religious-content impact

`None` directly. Indirectly: human corrections from qualified reviewers are preserved
permanently and always outrank AI judgements.

## Privacy / child-safety impact

The ledger is learner performance data, not audio. It must be included in data export
and deletion requests. Retention of the ledger follows learner-account lifecycle,
not audio retention (ADR-0008).

## Reversibility

`Costly` — event sourcing is hard to retrofit and hard to remove once depended upon.
Chosen deliberately because model evolution is certain.

## Review trigger

Event volume creates performance problems (addressed with snapshots, not by abandoning
the ledger), or the mastery model stabilizes such that replay is no longer valuable.
