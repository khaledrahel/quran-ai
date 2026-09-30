# The Learning Loop

**Status:** Approved 2026-09-30

```
Assess -> Profile -> Plan -> Learn -> Practice -> Recite -> Analyze -> Review -> Master -> Replan
```

## 1. Assess

Structured parent self-report plus 2–3 child spot-check recitations. **Deliberately not
dependent on the AI recitation engine** — the assessment is a new family's first two
minutes, and a bad first assessment produces a bad plan.

Outputs: memorized scope · approximate quality · **reading ability** · recitation
baseline · tajweed baseline where measurable · goal · daily time · preferred curriculum ·
initial learner profile · initial plan.

Optional: human initial assessment for families wanting higher confidence. This also
gives the reviewer queue a purpose from day one.

## 2. Profile

Minimal learner record: nickname, age band, reading ability, learning mode (A or B),
goals, preferences. No photo, no legal name.

## 3. Plan

Within the parent's or teacher's chosen curriculum. The AI adjusts pace, repetition, and
revision mix. **It never reorders the family's chosen sequence.**

## 4. Learn / 5. Practice

Daily session, 10–20 minutes, adaptive to age, focus capacity, workload, performance,
and parent preference.

## 6. Recite

Audio captured by `quran_recitation_kit`: encrypted on device, offline-queued if needed,
uploaded over TLS.

## 7. Analyze

Staged, to control cost and risk:

```
Stage 1 (cheap)  ASR + forced alignment against the KNOWN target text
                 -> word observations, fluency metrics
Stage 2 (cond.)  duration-measurable tajweed signals, advisory only
                 -> confidence engine -> band + decision
```

Aligning against known text is substantially easier and cheaper than open transcription.
That is why L1 is achievable at MVP.

## 8. Review

Low confidence, parent request, milestone, or random audit creates a `review_request`.
A qualified reviewer records a structured correction, which becomes a `mastery_event`
with `source = human` and outranks the AI.

## 9. Master

Five dimensions tracked separately and permanently: memorization, retention, accuracy,
fluency, tajweed. Mastery decays — both time-based and performance-based. Projected from
an append-only event ledger (ADR-0010).

## 10. Replan

The adaptive engine adjusts the plan within the chosen curriculum, and the loop continues.
