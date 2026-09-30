# Definition of Done

**Status:** Approved (F14) · 2026-09-30

A change is Done when **all** of the following hold.

## General

1. Acceptance criteria met
2. Unit tests written and passing
3. RLS / authorization tested wherever data access is touched
4. CI green
5. Documentation updated — an ADR if a decision was made, a runbook if operational
6. Manually verified on staging
7. **PO informed of anything requiring approval or manual action**

## Project-specific gates

These three are the mistakes that would be hardest to detect later and most damaging
if shipped.

8. **No Qur'an text written, modified, or normalized by application code**
9. **No religiously sensitive string hard-coded** — it is a versioned `content_artifact` row
10. **No vendor-shaped data crossing the normalization boundary**

## Privacy and security

11. Privacy impact considered; where child data is touched, minimization and audit confirmed
12. No secrets added to the repository, the client, or FlutterFlow
13. Any new access to child audio writes an `access_audit` row

## Not Done if

- A test was skipped "temporarily"
- A migration was applied by hand to any shared environment
- Generated FlutterFlow code was hand-edited
- Real data was used in local or staging
- A decision was made without an ADR
