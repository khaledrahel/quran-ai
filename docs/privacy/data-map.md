# Data Map and Minimization Inventory

**Status:** Draft v1.0 · 2026-09-30 · Feeds the WS-4 PDPL review

> **Principle:** minimize by schema, not by policy. If a field is not needed, the column
> does not exist. A column that does not exist cannot leak.

## Personal data inventory

| Data | Subject | Collected | Justification |
|---|---|---|---|
| Email / phone | Parent | Yes | Account ownership, authentication |
| Display name | Parent | Yes | Personalization |
| Country / locale | Parent | Yes | Language, residency handling |
| Nickname or first name | Child | Yes | Personalization in-session |
| Age band | Child | Yes | Pedagogical adaptation |
| Birth year | Child | Optional | Finer plan adaptation; may be dropped |
| Reading ability | Child | Yes | Selects Mode A or Mode B |
| Learning goals / preferences | Child | Yes | Plan generation |
| **Voice recording** | Child | Yes — minimized, TTL-bound | Core function |
| Performance / mastery data | Child | Yes | Core function |
| **Full legal name** | Child | **No** | Not needed — no column exists |
| **Photo / avatar image** | Child | **No** | Not needed — no column exists |
| **Precise location** | Either | **No** | Not needed |
| **Device advertising ID** | Either | **No** | Not needed |
| **Contacts, calendar, gallery** | Either | **No** | Never requested |

## Special-category considerations

**Child voice is the most sensitive asset in the system.** It is plausibly
biometric-adjacent under Saudi PDPL. WS-4 must determine its classification and the
obligations that follow, before any production processing.

## Data flows

```
Child device  --TLS-->  Supabase Storage (private, encrypted at rest)
                             |
                             v
                   Analysis Orchestrator
                             |
                             v   ADAPTER BOUNDARY  <-- the only point audio leaves our control
                   ASR / Alignment provider   [NOT SELECTED - blocked on WS-4]
                             |
                             v
              Normalized result -> confidence -> mastery
                             |
                             v
              Audio deleted (default) or retained under TTL + consent
```

**Every access to child audio writes an `access_audit` row** — including reviewer and
admin access.

## Third-party processors

| Processor | Data | Status |
|---|---|---|
| Supabase | All application data, audio | Region **BLOCKED on WS-4** |
| ASR / AI provider | Child audio | **NOT SELECTED — blocked on WS-4** |
| FlutterFlow | Build-time only; no runtime user data | Verify in week 1 |
| Apple / Google | Store distribution, push | Standard |

**No third-party analytics SDK will process child data.**

## Retention

| Data | Retention |
|---|---|
| Child audio — default | **Deleted immediately after analysis** |
| Child audio — review exception | Consent + open review request; **period TBD pending WS-4**; auto-deleted |
| On-device offline queue | TTL-bound; never indefinite |
| Mastery events | Learner account lifecycle |
| Access audit | Retained for accountability; period TBD |
| Account data | Until deletion request |

## Subject rights

Export and deletion requests are handled through `data_requests`. Deletion cascades to
audio, mastery events, and consent records. Parent acts for the child.

## Open questions for WS-4

1. Classification of child voice data under PDPL.
2. Whether processing must occur inside Saudi Arabia.
3. Cross-border transfer conditions, and whether they can be met.
4. Lawful basis and the form parental consent must take.
5. Mandatory retention limits for children's data.
6. Breach notification obligations and timelines.
7. Whether a DPIA or equivalent is required before the pilot.
