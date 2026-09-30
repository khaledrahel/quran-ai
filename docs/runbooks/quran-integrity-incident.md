# Runbook: Qur'an Integrity Incident

**Severity: 1 — highest in the system.** This is not a bug ticket.

A Qur'an-integrity incident in a Qur'an app is a reputational event that cannot be
recovered by patching quietly.

## Triggers

- Content hash mismatch on `ayat` or `quran_sources` — at import, in CI, or in production
- Structural verification failure (counts, page mapping, basmalah handling)
- A user reports incorrect Qur'an text
- Any unexpected write detected against Qur'an tables

## Immediate response

1. **Halt affected sessions.** Stop serving the affected content. Do not attempt to
   correct text in place.
2. **Do not modify the data.** Preserve it exactly for investigation. Amendments 3 and 4
   apply with full force here: no regeneration, no correction, no normalization.
3. **Alert the PO immediately.**
4. **Capture evidence** — hashes, affected identifiers, deployment version, source version,
   recent migrations, access logs.

## Investigation

1. Which source version is deployed? Does its hash match the frozen manifest?
2. Was there a recent migration touching Qur'an tables? (These require PO approval —
   check the approval trail.)
3. Was the import pipeline bypassed?
4. Is the discrepancy in our data, or was it present in the upstream source?

## Resolution

- If our data is corrupted: **re-import from the frozen verified dataset.** Never patch
  individual rows.
- If the upstream source is at fault: this is a new source version requiring the full
  seven-stage protocol, **including qualified human approval**. The affected content
  stays unavailable until then.

## Communication

If users were exposed to incorrect Qur'an text, the PO decides on notification. Default
posture is transparency. Do not quietly patch and move on.

## Post-incident

- Written post-mortem
- Identify how the integrity check failed to prevent it
- Strengthen the check
- ADR if a structural decision changes
