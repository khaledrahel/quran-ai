# Testing Strategy

**Status:** Approved (F13) · 2026-09-30

| Layer | What | Priority |
|---|---|---|
| **Qur'an integrity** | Structural counts (114 / 6,236 / 604 / 30 / 60 / 240), per-surah counts, basmalah handling, content hashes, encoding stability | **Highest — gates everything** |
| **Unit** | Confidence engine, mastery projection, decay, scheduler v0, plan generation | High |
| **RLS / authorization** | pgTAP: parent cannot read another family; reviewer cannot read unassigned requests; learner cannot reach billing | **High — child data protection** |
| **Contract** | Provider adapters against **recorded fixtures** | High |
| **Pipeline integration** | Attempt → analysis → confidence → mastery → review, end to end on staging | Medium |
| **Golden audio set** | Small, consented, controlled set of real recitations with known expected outcomes | **High — BLOCKED on WS-1/WS-2** |
| **Device** | Real iOS and Android; real microphone; offline/online transitions | Medium — manual, PO |
| **Accessibility and RTL** | Arabic layout, font rendering, child-size touch targets | Medium |

## Design consequence

The confidence, mastery, and scheduler engines are written as **pure, deterministic
functions** precisely so they can be tested exhaustively without audio or vendors. That
is why they live in `services/` rather than inside Edge Functions.

## Contract tests never call a paid API

Provider adapters are tested against recorded fixtures. This keeps the suite fast, free,
and runnable in CI — and it is what allows the full pipeline to be built while provider
selection is blocked on WS-4.

## Golden audio set

This is how the question "is the AI actually right?" gets answered. It cannot be
assembled from ordinary session data, because ordinary audio is discarded by default
(ADR-0008). It requires separate, explicit, consented collection and qualified labelling
— which is why it is blocked on WS-1 and WS-2.

## Never in tests

- Real child data
- Real Qur'an text written or modified by test code
- Live provider calls
- Production credentials
