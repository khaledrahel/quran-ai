# ADR-0002: TypeScript for backend services

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (F2)

## Context

`services/` contains the Qur'an content verification pipeline, the analysis orchestrator,
the confidence engine, and the mastery engine. Supabase Edge Functions run Deno
(TypeScript). The PO is not a full-time developer and will maintain tooling on a
Windows machine.

## Options considered

1. **TypeScript everywhere** — one backend language, matches Edge Functions natively,
   shared domain types between services, one toolchain for the PO to install.
2. **Python for the content pipeline, TypeScript for the orchestrator** — Python has
   richer Arabic text-processing libraries; costs a second toolchain, a second CI setup,
   and a second set of dependency/security surfaces.

## Decision

TypeScript for all of `services/`. Dart remains the language of
`packages/quran_recitation_kit/` (unavoidable — it is a Flutter package).

## Consequences

- One backend toolchain to install, learn, and maintain.
- Domain types are shared between the orchestrator and the content pipeline via
  `services/shared/`, so the vendor-neutral analysis schema has a single definition.
- The content pipeline's needs are hashing, structural counting, and byte comparison —
  none of which require Python's NLP ecosystem. Arabic *processing* is deliberately
  not something we do: we preserve bytes, we do not analyze text.
- If deep Arabic morphological analysis is ever needed, it would be a separate,
  explicitly-bounded service and a new ADR.

## Religious-content impact

`None` — but note the reasoning above: choosing TypeScript is defensible precisely
because we never transform Qur'an text. If that ever changed, this ADR should be revisited,
and so should the decision to change it.

## Privacy / child-safety impact

`None`.

## Reversibility

`Easy` at this stage — no service code exists yet. `Costly` once the orchestrator is built.

## Review trigger

A requirement appears for morphological or phonetic analysis that has no viable
TypeScript implementation.
