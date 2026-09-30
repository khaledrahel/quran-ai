# CLAUDE.md — Engineering Rules for This Repository

These rules are binding on every session. Read this file before doing any work.
Last updated: 2026-09-30 · Approved by: Khaled (Product Owner)

---

## 0. What this project is

An Arabic-first Qur'an learning companion for children aged ~6-15, owned by a parent
account. It provides structured hifz planning, daily practice, AI-assisted recitation
analysis with calibrated confidence, multidimensional mastery tracking, and escalation
to qualified human reviewers.

**Governing principle:**

> AI assists the learning process. It does not become the source of religious truth.

---

## 1. Absolute prohibitions

These are not preferences. They have no exceptions, and no deadline justifies breaking them.

### 1.1 Religious content

- **NEVER** generate, rewrite, normalize, correct, reformat, transliterate, or
  "clean up" Qur'an text. Not in code, not in tests, not in fixtures, not in
  documentation, not in a comment, not as an example.
- **NEVER** author, invent, or infer a Tajweed rule.
- **NEVER** produce religious guidance, rulings, or fatwa-type content.
- **NEVER** mark any Qur'an source, Tajweed rule set, or religiously sensitive content
  as `approved`. Only a qualified human reviewer may do that. Not Claude. Not the PO.
- **NEVER** present AI-generated content as religiously authoritative.

If a task appears to require any of the above, **stop and ask the PO.**

### 1.2 Qur'an data integrity

- Qur'an text is immutable reference data. It is **write-once**.
- The application has **no code path that writes to `ayat` or `quran_sources`**
  outside the verified import pipeline.
- Corrections are published as a **new versioned source**, never as an `UPDATE`.
- Never apply Unicode normalization, whitespace trimming, or diacritic handling to
  Qur'an text. Byte-preserving only.
- A hash mismatch on Qur'an data is a **severity-1 incident**, not a bug ticket.
  See `docs/runbooks/quran-integrity-incident.md`.

### 1.3 Vendor boundary

- **NEVER** let vendor-shaped data cross the normalization boundary.
- No ASR/AI provider response is stored raw in a learner-facing table, passed to the
  mastery engine, or sent to FlutterFlow.
- Provider responses are normalized into our schema at the adapter boundary.
  See ADR-0006.
- Confidence is computed by **our** engine. Vendor confidence is one input, never the
  decision. See ADR-0009.

### 1.4 Secrets

- **NEVER** commit a secret, key, token, or credential.
- **NEVER** put a secret in FlutterFlow or in any client-side code.
- **NEVER** ask the PO to paste a secret into chat. Tell them where to place it.
- A leaked key is **rotated**, never merely deleted from a file. Git history is forever.

### 1.5 Irreversible and production actions — require explicit PO approval

- Creating production infrastructure
- Selecting a production ASR/AI provider
- Selecting the production Supabase region
- Running migrations against production
- Any destructive migration
- Deleting data in any environment
- Publishing to the App Store or Google Play
- Importing real child data anywhere
- Importing or publishing Qur'an content

### 1.6 Child data

- Never log child audio, ayah content, or PII.
- Never copy real data into staging or local. Staging is **synthetic only**. See ADR-0003.
- Every access to child audio writes an `access_audit` row. No exceptions, including
  admin and reviewer access.
- Minimize by schema, not by policy: if a field is not needed, the column does not exist.

---

## 2. Working model

> **Autonomy for implementation. Human approval for decisions and irreversible actions.**

For any significant decision:

1. Analyze
2. Propose
3. Explain trade-offs
4. **Ask for explicit approval**
5. Only then implement

Routine, reversible implementation steps within an already-approved design may proceed
autonomously.

The PO is the Product Owner, not a full-time developer. When a manual action is required:
give exact, step-by-step instructions, say why it is needed, and estimate the time.

---

## 3. Blocked decisions (as of 2026-09-30)

Do not build anything that depends on these until they are resolved:

| Blocked | Gated on |
|---|---|
| Production Supabase region | WS-4 PDPL/residency review |
| Production storage | WS-4 |
| Production audio retention period | WS-4 |
| Final ASR provider | WS-4 + contractual data-use review |
| Final AI provider | WS-4 |
| Any religiously approved content | WS-1 qualified reviewer |

**These do NOT block:** local Supabase, synthetic data, staging, provider-neutral
interfaces, mocked/fixture-based AI responses, security/RLS testing, the FlutterFlow
spike, the Qur'an verification harness (technical stages only).

---

## 4. Repository conventions

- Monorepo. Structure and rationale: ADR-0001.
- Services are TypeScript: ADR-0002.
- `apps/flutterflow/` is a **read-only mirror** of FlutterFlow-generated code.
  Never hand-edit it; edits are silently overwritten. See ADR-0011.
- All real logic lives in `packages/quran_recitation_kit/` (Dart) or `services/` (TS).
- FlutterFlow custom actions are thin wrappers only.
- `supabase/seed/` is synthetic data only.
- `data/quran/` is write-once.
- Migrations are forward-only versioned SQL: ADR-0004.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).

---

## 5. Before marking work complete

Check `docs/engineering/definition-of-done.md`. The three project-specific gates:

- No Qur'an text written, modified, or normalized by application code
- No religiously sensitive string hard-coded — it is a versioned `content_artifact` row
- No vendor-shaped data crossing the normalization boundary

---

## 6. Key documents

| Topic | Path |
|---|---|
| Product definition | `docs/product/product-definition.md` |
| MVP scope (in/out) | `docs/product/mvp-scope.md` |
| Domain model | `docs/domain/domain-model.md` |
| Qur'an sourcing protocol | `docs/content-governance/quran-sourcing-protocol.md` |
| Privacy and data map | `docs/privacy/` |
| Decisions | `docs/adr/` |
| Workstreams | `docs/workstreams/` |
| Definition of Done / Ready | `docs/engineering/` |
