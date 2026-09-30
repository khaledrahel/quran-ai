# data/quran — WRITE-ONCE

**EMPTY. No Qur'an content has been imported.**

## Rules

1. This directory is **write-once**. Content is never edited in place.
2. A correction arrives as a **new versioned dataset**, never an edit.
3. **No Unicode normalization, no whitespace trimming, no diacritic handling.**
   Byte-preserving only.
4. Claude must never generate, rewrite, normalize, correct, or approve Qur'an text
   (Amendments 3 and 4).
5. Nothing enters this directory before passing **all seven stages** of
   `docs/content-governance/quran-sourcing-protocol.md` — including **Stage 6, qualified
   human approval**.

## Current status

- Stage 6 is **BLOCKED**: WS-1 is open, no qualified reviewer identified.
- No candidate source has been evaluated. Evaluation begins week 2.
- Evaluation is technical work only and does **not** constitute selection or approval.

## Expected contents once populated

```
<source-id>-<version>/
  manifest.json      provenance, license, hashes, verification results, approval record
  <dataset files>    byte-preserved, exactly as received
```

Content hashes are verified at import, in CI on every commit, and periodically in
production. A mismatch is a **severity-1 incident** —
see `docs/runbooks/quran-integrity-incident.md`.
