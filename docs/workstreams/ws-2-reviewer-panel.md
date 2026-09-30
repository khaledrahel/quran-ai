# WS-2 — Reviewer Panel

**Status:** OPEN · **Owner:** Khaled (PO) · **Needed by:** Week 8 · **Opened:** 2026-09-30

## Why this exists

Human review is not a fallback feature — it is a core MVP capability and the mechanism
that validates the AI. Without reviewers, the escalation loop cannot be tested and the
golden audio evaluation set cannot be built.

Distinct from WS-1: WS-1 approves *content and rules*. WS-2 reviews *individual learner
recitations* in the day-to-day queue.

## Target

**2–3 qualified reviewers** for the pilot. Not a marketplace. A small controlled group.

## Workflow they serve

```
AI low confidence, or parent request
   -> review_request created
   -> reviewer sees learner context, target ayah, AI result, audio (if retained)
   -> reviewer records a structured correction + note
   -> correction becomes a mastery_event with source = human (outranks AI)
   -> also becomes labelled data for measuring AI accuracy
```

## Service commitment

- Turnaround target: **up to 24 hours**
- **Not** positioned as instant correction
- Pilot volume kept small enough to operate manually and safely
- Included in the product during the pilot; no marketplace or commission logic

## Requirements

- Qualified in Qur'an recitation and Tajweed
- Comfortable with a simple web tool
- Permission-controlled: scoped to assigned requests only
- Every access to child audio is audited
- Appropriate agreements regarding children's data before any access

## Tooling

Interim (weeks 1–8): Supabase Studio plus a minimal signed-URL audio viewer.
From P7: a minimal Next.js reviewer console (ADR/F9 approved).

## Note

The PO is **not** assumed to be a qualified reviewer.

## Progress log

| Date | Update | By |
|---|---|---|
| 2026-09-30 | Workstream opened. No reviewers identified. | Claude |
