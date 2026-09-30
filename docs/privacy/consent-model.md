# Consent Model

**Status:** Draft v1.0 · 2026-09-30 · Final form pending WS-4

The parent is the legal account owner. The child does not create an account and has no
independent credentials. The parent consents on the child's behalf.

## Consent types

| Type | Covers | Required for |
|---|---|---|
| `audio_processing` | Recording and analysis of the child's recitation | Any recitation feature |
| `audio_retention` | Temporary retention of a recording for human review | Human review only |
| `human_review` | A qualified reviewer listening and giving feedback | Escalation and review |
| `comms` | Product and progress communications | Non-essential messaging |

Each is **granular and independently revocable**. `audio_processing` may be granted
without `audio_retention`.

## Properties

- Recorded per family account and per learner
- Versioned against the privacy policy version in force at the time
- Timestamped, with the granting user recorded
- Revocable at any time
- **Revocation of `audio_retention` triggers deletion of retained audio**

## Enforcement

Consent is checked **server-side** before any audio is processed or retained. Client
state is never trusted. Absence of consent is treated as refusal, never as a default yes.

## Open questions for WS-4

1. The form parental consent must take under PDPL for a child's voice data.
2. Whether separate consent is required for cross-border transfer.
3. Whether any age threshold requires the child's own assent in addition.
4. Record-keeping obligations for consent history.
