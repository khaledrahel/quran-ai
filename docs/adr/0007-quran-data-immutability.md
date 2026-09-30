# ADR-0007: Qur'an data immutability

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (D5, Amendments 3 and 4)

## Context

Qur'an text is the one piece of data in this system where a silent error is both
undetectable by users at scale and unacceptable. Ordinary application data practices —
updates, normalization, cleanup migrations, ORM round-tripping — are all hazards here.

## Options considered

1. **Treat Qur'an text as ordinary application content** — normal CRUD. Unacceptable:
   any bug, migration, or normalization step can silently corrupt it.
2. **Write-once immutable versioned reference data** — corrections arrive as new
   versioned sources. More storage, more import discipline, no in-place edit path.

## Decision

Qur'an text is **write-once immutable versioned reference data.**

- The application has **no code path that writes to `ayat` or `quran_sources`** outside
  the verified import pipeline.
- Corrections are a **new versioned source**, never an `UPDATE`.
- **No Unicode normalization, no whitespace trimming, no diacritic handling.**
  Byte-preserving only. The Unicode form is pinned and recorded at import.
- Content hashes are verified at import **and** periodically in production.
- Reads go through a single centralized retrieval service with no write path.
- Claude must never generate, rewrite, normalize, correct, or approve Qur'an text
  (Amendments 3 and 4).
- **Only a qualified human reviewer may mark a source religiously approved.** Not Claude,
  not the PO. Until then a source remains at
  `verification_status = technically_verified_pending_religious_approval`.

## Consequences

- Fixing a genuine source error requires a new version and a re-approval, which is slow.
  That is the correct speed for this data.
- Storage cost of retaining versions is negligible.
- A hash mismatch is a **severity-1 incident** with a runbook, not a bug ticket.
- Import is gated by the seven-stage protocol in
  `docs/content-governance/quran-sourcing-protocol.md`.

## Religious-content impact

**This is the core religious-integrity decision of the project.** Every other safeguard
depends on it holding.

## Privacy / child-safety impact

`None`.

## Reversibility

`Irreversible` in spirit. This is a foundational commitment and is not intended to be
revisited.

## Review trigger

None anticipated. Any proposal to relax this requires PO approval and qualified
religious review.
