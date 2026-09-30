# Runbook: Data / Privacy Incident

Covers suspected or confirmed exposure of child data, audio, or personal information.

## Triggers

- Unauthorized access to child audio or learner records
- RLS failure exposing cross-family data
- Audio retained beyond its TTL, or the deletion job silently failing
- A provider processing data outside agreed terms
- Any breach notification from a processor

## Immediate response

1. **Contain** — revoke the affected credential or access path. Disable the affected
   feature if necessary.
2. **Preserve evidence** — access audit logs, storage logs, deployment version.
3. **Alert the PO immediately.**
4. **Determine scope** — which learners, which data, what period, who accessed it.

## Assessment

1. What data was exposed, and to whom?
2. Were children's records involved? (Assume the most sensitive classification.)
3. Was audio involved?
4. How long was the exposure open?
5. Is this notifiable under Saudi PDPL? **Notification obligations and timelines are a
   WS-4 deliverable and must be filled in here once known.**

## Resolution

- Close the exposure
- Rotate every credential that could have been involved
- Delete any data that should not exist — for example audio past its TTL
- Verify the deletion actually completed

## Communication

Affected parents are notified where required or where transparency serves them. The PO
decides, with legal input where notification is mandatory.

## Post-incident

- Written post-mortem
- Add the failure mode to the RLS or privacy test suite so it cannot recur silently
- Update the data map and, if a structural decision changes, write an ADR

## Note on the deletion job

A deletion job that silently stops is itself a privacy incident, not merely a bug. It
requires monitoring and alerting, and its failure follows this runbook.
