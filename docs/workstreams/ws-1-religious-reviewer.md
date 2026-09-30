# WS-1 — Qualified Qur'an / Tajweed Reviewer

**Status:** OPEN · **Owner:** Khaled (PO) · **Needed by:** Week 6 · **Opened:** 2026-09-30

## Why this exists

The entire trust model rests on a qualified human approving:

- The Qur'an text source and its verification result
- The Tajweed rule set the engine encodes
- The thresholds at which the app tells a child they were wrong
- The Arabic wording of feedback given to children

**No such person has been identified.** This is the largest non-engineering risk in the
project.

## What the reviewer must be able to do

| | |
|---|---|
| Qualification | Recognized Qur'an/Tajweed credentials — ijazah or equivalent institutional standing |
| Approve | Qur'an source (Stage 6 of the sourcing protocol) |
| Approve | Tajweed rule set and its technical detection claims |
| Approve | Child-facing Arabic feedback wording |
| Review | Confidence thresholds — when the system should speak and when it should abstain |
| Advise | Whether an advisory Tajweed signal is defensible at all |

## Candidate channels

- Personal and family network
- Local masjid and Qur'an halaqat
- Qur'an academies in Riyadh / the wider GCC
- Established online Qur'an education providers
- University Islamic studies faculties

## Engagement questions to resolve

1. Advisory (per-decision) or retained (ongoing) engagement?
2. Compensation model?
3. Single reviewer, or a small panel for consensus on contested rules?
4. Willingness to be named publicly — a named qualified reviewer is a significant
   trust signal to parents and may matter commercially.

## Mitigation while open

The architecture treats all religiously sensitive material as **versioned, approvable
content rather than code** (ADR-0007, ADR-0009). This is precisely what allows building
to continue. Until approval exists:

- No content is marked `approved`
- No public religious accuracy claims
- Tajweed feedback stays explicitly advisory
- Child-facing feedback stays conservative

## Progress log

| Date | Update | By |
|---|---|---|
| 2026-09-30 | Workstream opened. No candidates identified. | Claude |
