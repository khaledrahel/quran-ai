# Qur'an AI — Learning Companion

Arabic-first Qur'an learning companion for children (~6-15), owned by a parent account.
Structured hifz planning, daily practice, AI-assisted recitation analysis with calibrated
confidence, multidimensional mastery tracking, and escalation to qualified human reviewers.

> **AI assists the learning process. It does not become the source of religious truth.**

**Status:** P0 Foundations · Pre-MVP · No production infrastructure exists.

---

## Start here

| If you want to... | Read |
|---|---|
| Understand the product | `docs/product/product-definition.md` |
| Know what is in/out of MVP | `docs/product/mvp-scope.md` |
| Work on the code | `CLAUDE.md` — **binding engineering rules** |
| Understand a past decision | `docs/adr/` |
| Set up locally | `docs/engineering/local-setup.md` |
| Know what is blocked | `docs/workstreams/README.md` |

## Repository layout

```
docs/          Product, domain, decisions, governance, privacy, runbooks, workstreams
packages/      quran_recitation_kit — custom Flutter package (audio capture pipeline)
services/      TypeScript backend: content-pipeline, orchestrator, shared domain types
supabase/      Migrations, Edge Functions, RLS policies, tests, synthetic seed
apps/          flutterflow (read-only mirror) · reviewer-console (built in P7)
data/quran/    Verified Qur'an datasets — WRITE-ONCE, currently empty
tools/         Scripts and utilities
```

## Stack

FlutterFlow (UI) · custom Flutter package (audio) · Supabase (Postgres/Auth/Storage/Edge
Functions) · TypeScript services · GitHub · Next.js reviewer console (P7).

ASR/AI provider: **not selected** — blocked on the PDPL/residency review (WS-4).

## Non-negotiables

1. Qur'an text is never generated, modified, or normalized by any code or model.
2. Religiously sensitive content is versioned data requiring qualified human approval —
   never hard-coded, never AI-approved.
3. Child audio defaults to process-and-discard. Retention is a consented, TTL-bound,
   audited exception.
4. No vendor-shaped data crosses the normalization boundary.

See `CLAUDE.md` for the full set.
