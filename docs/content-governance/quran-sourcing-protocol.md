# Qur'an Content Sourcing and Verification Protocol

**Status:** Approved (D6) · **Version:** 1.0 · **Date:** 2026-09-30

> **Governing rule:** Claude never invents, modifies, regenerates, or silently normalizes
> Qur'an text. A dataset is not acceptable merely because it is popular or downloadable.

## Baseline for MVP

| Property | Value |
|---|---|
| Riwayah | Hafs an Asim |
| Mushaf edition | Madani |
| Pagination | 604 pages |
| Additional riwayat in MVP | None — architecture permits them later |

## The seven-stage gate

A candidate source passes **all** stages or it is not used.

### Stage 1 — Provenance
Record: source name, publisher, URL, retrieval date, riwayah, mushaf edition, text
encoding, version identifier.
**Fails if:** origin cannot be established.

### Stage 2 — Licensing
Explicit license permitting commercial use. License text and URL recorded.
**Fails if:** license absent, unclear, or non-commercial.

### Stage 3 — Structural verification
Automated checks:

| Check | Expected |
|---|---|
| Surah count | 114 |
| Total ayah count | 6,236 |
| Per-surah ayah counts | Match reference table |
| Page count | 604 |
| Juz | 30 |
| Hizb | 60 |
| Hizb quarters | 240 |
| Sajda positions | Present and correctly located |
| Basmalah handling | Explicitly determined and documented |

**Fails if:** any count mismatch. A mismatch halts the process; it is never "adjusted".

> **Note on basmalah.** This is the classic off-by-one source. Is the basmalah ayah 1 of
> each surah, a separate record, or absent? How is At-Tawbah handled? The harness tests
> this explicitly rather than trusting the dataset's own numbering.

### Stage 4 — Encoding integrity
- Byte-level content hash computed and recorded.
- Unicode normalization form **identified and pinned** — never applied.
- Diacritics and Qur'anic marks verified preserved exactly.

**Fails if:** any transformation has been applied to the text.

### Stage 5 — Cross-source comparison
Compare against at least one independent source. Every difference is enumerated and
explained in writing.
**Fails if:** any difference remains unexplained.

### Stage 6 — Qualified human approval
A qualified reviewer approves the source and inspects sample pages.

**Status: BLOCKED — WS-1 is open. No qualified reviewer has been identified.**

**Only a qualified human reviewer may pass this stage. Not Claude. Not the Product Owner.**

### Stage 7 — Freeze and publish
Hash recorded, dataset marked immutable, version assigned, manifest written to
`data/quran/`.

## Operating before Stage 6 exists

Stages 1–5 and 7 are automated engineering work and proceed now. Stage 6 leaves the
source at:

```
verification_status = technically_verified_pending_religious_approval
```

In that state:

- Internal and pilot use only
- **No public accuracy claims**
- Conservative feedback behaviour
- Disclaimers shown to users
- **No source is ever marked `approved`** by Claude, by automation, or by the PO

## Scope — the same protocol applies to

- Qur'an text sources
- Tajweed rule sets
- Child-facing feedback wording (Arabic)
- Confidence thresholds
- Preset curricula
- Reference recitation audio

All are `content_artifacts` with the same approval lifecycle.

## Runtime integrity

- Hash verification at import **and** periodically in production
- Hash verification runs in CI on every commit
- Ayah retrieval is centralized in one service with **no write path**
- A mismatch is a **severity-1 incident** — see `docs/runbooks/quran-integrity-incident.md`

## Registers

- Candidate sources under evaluation: `candidate-sources.md`
- Approval decisions: `approval-log.md`
