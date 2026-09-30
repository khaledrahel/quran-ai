## What and why

<!-- What changes, and what problem it solves. Link the scope item or ADR. -->

## Definition of Done

See `docs/engineering/definition-of-done.md`.

- [ ] Acceptance criteria met
- [ ] Unit tests written and passing
- [ ] RLS / authorization tested (if data access is touched)
- [ ] CI green
- [ ] Documentation updated (ADR if a decision was made)
- [ ] Verified on staging

## Project-specific gates

- [ ] **No Qur'an text written, modified, or normalized by application code**
- [ ] **No religiously sensitive string hard-coded** (it is a versioned `content_artifact`)
- [ ] **No vendor-shaped data crossing the normalization boundary**

## Privacy and security

- [ ] Privacy impact considered; minimization and audit confirmed where child data is touched
- [ ] No secrets added to the repo, client, or FlutterFlow
- [ ] No real data used in local or staging

## PO action required

<!-- Anything needing approval or a manual step. Write "None" if none. -->

## Reversibility

<!-- Easy / Costly / Irreversible. Irreversible steps need explicit PO approval. -->
