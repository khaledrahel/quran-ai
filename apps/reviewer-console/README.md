# Reviewer Console

Minimal internal web application for qualified reviewers. **Built in P7 (weeks 8–10).**
Next.js, against Supabase, RLS-protected.

## Interim solution (weeks 1–8)

Supabase Studio plus a minimal signed-URL audio viewer. Two or three reviewers do not
need a polished console, and building one early would delay the core loop.

## What a reviewer must be able to do

- See the review request and the learner context needed to judge it
- See the target ayah
- Hear the relevant recording, **when it was retained under consent**
- See the AI analysis and its confidence band
- Record a **structured** correction
- Mark reviewed or needs-follow-up
- Add a short note

## Rules

- Reviewers are scoped to **assigned requests only** — never the whole learner base
- **Every audio access writes an `access_audit` row**
- Least privilege; no access to billing, parent data, or other families
- Corrections are structured data, not free text, so they can feed the mastery engine
- Turnaround target: up to 24 hours. Not positioned as instant correction.

## Blocked on

WS-2 — no reviewers have been identified yet.
