# ADR-0001: Monorepo repository structure

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (F1)

## Context

The project spans a FlutterFlow app, a custom Flutter package, TypeScript backend
services, Supabase schema and functions, a future Next.js reviewer console, and a
substantial governance/documentation surface. The team is one part-time Product Owner
plus one engineering agent.

## Options considered

1. **Monorepo** — one repository, all concerns. Atomic cross-cutting changes, one CI
   configuration, one place to look. Larger checkout; needs internal discipline.
2. **Polyrepo** — separate repositories per component. Cleaner boundaries and independent
   release cadence; significant coordination overhead, cross-repo changes become
   multi-PR dances, five CI setups to maintain.

## Decision

Single monorepo, with the structure documented in `README.md` and enforced by convention.

## Consequences

- Cross-cutting changes (schema + service + package) land in one reviewable PR.
- Documentation, decisions, and governance live beside the code they govern, which
  matters because this project's governance is not optional paperwork.
- Requires discipline about directory boundaries; `CLAUDE.md` carries those rules.
- If the team grows or the reviewer console needs independent deployment cadence,
  extracting it later is straightforward.

## Religious-content impact

`None` directly. Indirectly positive: the Qur'an sourcing protocol, the approval log,
and the verification harness sit in the same repository as the code that consumes them,
so provenance is not separated from implementation.

## Privacy / child-safety impact

`None` directly. The structure isolates `supabase/seed/` (synthetic only) and
`data/quran/` (write-once) as named, rule-bearing locations.

## Reversibility

`Easy` — splitting a monorepo later is mechanical.

## Review trigger

A second full-time engineer joins, or the reviewer console needs an independent
release cadence.
