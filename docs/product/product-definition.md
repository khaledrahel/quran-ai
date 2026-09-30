# Product Definition

**Status:** Approved 2026-09-30 (product proposal v0.1) · **Version:** 1.0

## Product statement

> An Arabic-first Qur'an learning companion that helps a parent give their child a
> structured, personalized hifz and recitation practice — with AI that assists the
> learning process and never claims religious authority.

## Defining characteristic

**Calibrated honesty.** The product gives confident feedback only where it can be
technically justified, abstains visibly where it cannot, and routes uncertainty to
qualified humans.

A wrong correction told to a child memorizing Qur'an is a trust-destroying event, and it
is worse than no feedback at all. The confidence policy exists to make abstention a
first-class product behaviour rather than a failure mode.

## Personas

| Persona | Priority | Core need |
|---|---|---|
| **Parent** (account owner) | Primary | "Is my child actually progressing, and what should they do today?" |
| **Child learner** (6–15) | Primary — user, not customer | A short, clear, encouraging daily session they can complete |
| **Qualified reviewer** (internal panel) | MVP-supporting | Efficiently resolve uncertain cases with structured corrections |
| Adult hifz learner | Secondary — **not** MVP-optimized | — |
| Teacher / academy | Future (B2B2C) | — |

## Market

Primary: Arabic-speaking Muslim families in Saudi Arabia, then GCC, then the wider
Muslim market. Arabic is the primary UX and content language; English is second.
Mainstream Sunni Qur'an learning.

## The learning loop

```
Assess -> Profile -> Plan -> Learn -> Practice -> Recite -> Analyze -> Review -> Master -> Replan
             ^                                                  |
             +------------ mastery + human correction ----------+
```

## What makes this project different from a normal app build

1. **Qur'an text is immutable reference data with a provenance chain** — not application
   content. Never generated, never normalized, never edited. (ADR-0007)
2. **Religiously sensitive material is versioned, approved content — not code.** Tajweed
   rules, feedback wording, and confidence thresholds live in approvable tables, because
   the person qualified to approve them does not yet exist. (WS-1)
3. **Child audio is the most sensitive asset in the system**, and its default lifecycle
   is process-and-discard. (ADR-0008)

## Principles

> **AI assists the learning process. It does not become the source of religious truth.**

> **AI adapts the learning journey. It does not replace the parent's or teacher's
> learning plan.**

> **Correctly identify what we can reliably identify, and safely abstain from what we
> cannot.**

> **Autonomy for implementation. Human approval for decisions and irreversible actions.**

## Commercial model

Family account with multiple learners (default limit 5, configurable). Free tier or
trial plus a paid family subscription. Pricing is a hypothesis to be validated, not
hard-coded. Entitlements are configurable.

## Largest risk

Not engineering. Three human-supply workstreams — a qualified religious reviewer (WS-1),
a reviewer panel (WS-2), and 25 pilot families (WS-3) — are open, and they gate the
product's core trust claims.
