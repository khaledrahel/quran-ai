# Audio Lifecycle

**Status:** Approved as ADR-0008 · retention period **TBD pending WS-4**

## Default path — process and discard

```
1. Capture           on device, encrypted at rest immediately
2. Queue (offline)   encrypted local queue, TTL-bound, never indefinite
3. Upload            TLS -> private bucket, encrypted at rest
4. Analyze           orchestrator -> adapter boundary -> normalized result
5. DELETE            immediately after analysis completes
```

## Exception path — retention for human review

Requires **both**: `audio_retention` consent **and** an open review request.

```
4. Analyze
5. Retain            TTL set from configuration (value TBD pending WS-4)
6. Review            qualified reviewer accesses -> access_audit row written
7. AUTO-DELETE       on TTL expiry, or on consent revocation, or on review closure
```

## Invariants

| | |
|---|---|
| Default | Process and discard |
| Indefinite storage | **Never** — server or device |
| Retention period | **Configurable. Never hard-coded. Currently TBD.** |
| Retention default until WS-4 | **Disabled** |
| Training use | **Never** — ours or a vendor's. Contractually enforced. |
| Access | Least privilege; every access audited |
| Encryption | In transit and at rest, device and server |

## Required infrastructure

- Scheduled deletion job with monitoring and alerting
- Deletion verification — a job that silently stops is a privacy incident
- Device-side queue expiry independent of server state
- Audit log of every access, append-only

## Blocked on WS-4

- Retention period value
- Storage region
- Whether retention is permissible at all in its current design
