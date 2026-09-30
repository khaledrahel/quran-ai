# MVP Scope

**Status:** Approved 2026-09-30 (product proposal v0.1, D11 as amended)

This document is the scope boundary. Work that is not in the IN list does not start —
see `docs/engineering/definition-of-ready.md` rule 1.

## IN — the core learning loop

1. Parent account creation and family setup
2. Learner profile creation (minimal PII: nickname + age band)
3. Initial assessment — parent self-report plus 2–3 child spot checks
4. Curriculum selection (preset / school plan / custom) and plan generation
5. Daily session, 10–20 minutes, adaptive length
6. Guided practice — **Mode A and Mode B** (see below)
7. Audio recording with offline queueing
8. AI recitation analysis — L1 + L2 + advisory L4-limited, with confidence handling
9. Adaptive revision recommendations (Qur'an-specific model)
10. Multidimensional mastery tracking
11. Parent insight report
12. Human review: request → reviewer console → structured correction → feeds mastery
13. Entitlements, quotas, usage and cost tracking

## Learning modes

| | **Mode A — Reading-capable** | **Mode B — Talqeen / pre-reading** |
|---|---|---|
| Mushaf text | Visible, word-highlighted | Not required for the task |
| Loop | Read → memorize → recite | **Listen → Repeat → Record → basic L1 → Retry** |
| Analysis | Full L1/L2 alignment | **Basic L1 only** |
| Scope | Full | **Deliberately minimal** |

**Mode B is retained in MVP** (D11 as amended) at exactly the loop above. It must not grow
into an Arabic literacy product, and it must not materially delay the MVP. Any proposal
to extend Mode B requires PO approval.

## Recitation fidelity — the public promise

| Level | Capability | MVP | Presentation |
|---|---|---|---|
| **L1** | Word/ayah correctness, omissions, substitutions, order | Core | Clear feedback |
| **L2** | Fluency, pacing, hesitation, restarts | Core | Clear feedback |
| **L4-limited** | Duration-measurable tajweed only (madd length, ghunnah duration) | Advisory beta | **Explicitly advisory, never authoritative** |
| **L3** | Makhraj / phoneme-level pronunciation | **Deferred** | Not offered. Routed to human. |
| Other tajweed rules | Idghaam, ikhfaa, qalqalah quality | **Deferred** | Not offered. |

## Confidence policy

| Band | To the child | System |
|---|---|---|
| HIGH | Clear, specific feedback | Record result and evidence |
| MEDIUM | Cautious, advisory wording; invite another attempt | Record, reduced mastery weight |
| LOW | **Never says the child was wrong. Never invents a correction.** "Let's try that again." | Abstain; optional parent flag; eligible for human review |

## OUT — explicitly not MVP

Tutor marketplace · social and community features · leaderboards and advanced
gamification · live video tutoring · conversational AI tutor · **any free-text AI chat
with the child** · tafsir browsing · any fatwa capability · multi-madhhab content ·
additional riwayat · B2B / school tenancy · second guardian · makhraj correction ·
self-hosted models · web or desktop learner app.

## Qur'an baseline

Hafs an Asim · Madani Mushaf · 604-page pagination · one riwayah.

## Pilot target

~25 families (20–30), mixed ages and levels, including a small number of Mode B learners.

## Timeline

Target 12 weeks. Contingency to 16 weeks.

> **Do not compress trust, Qur'an verification, child safety, or privacy work to meet
> the target.** (D12 as amended)
