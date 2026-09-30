# ADR-0005: Secrets management

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (F11)

## Context

The project will hold Supabase service-role keys, AI/ASR provider keys, mobile signing
credentials, and CI secrets. It involves a low-code UI tool (FlutterFlow) whose generated
output is committed to the repository — a well-known route for accidental key exposure.

## Options considered

1. **Environment variables + platform secret stores** (GitHub Actions secrets, Supabase
   Edge Function secrets) — standard, sufficient at this scale, no extra infrastructure.
2. **Dedicated secret manager** (Vault, Doppler) — stronger rotation and audit; more
   infrastructure and cost than a pre-MVP project warrants.

## Decision

Platform-native secret stores plus gitignored `.env` files locally. A committed
`.env.example` carries placeholders only.

| Secret | Lives in | Never in |
|---|---|---|
| Supabase service-role key | Backend env / Edge Function secrets | Repo, FlutterFlow, client |
| Supabase anon key | Client — public by design; RLS is the protection | — |
| AI/ASR provider keys | Backend only | Repo, client, logs |
| Mobile signing | Build service | Repo |
| CI secrets | GitHub Actions encrypted secrets | Anywhere else |

**Rules:**
- Secret scanning enabled on the repository.
- A leaked key is **rotated**, never merely deleted from a file — git history is permanent.
- **Never ask the PO to paste a secret into chat.** Tell them where to place it.
- The PO uses a password manager for account credentials.

## Consequences

- No additional infrastructure or cost.
- Depends on discipline, so secret scanning in CI is mandatory rather than optional.
- FlutterFlow must never be given a provider key; all provider calls go through our backend
  (also required by ADR-0006).

## Religious-content impact

`None`.

## Privacy / child-safety impact

**Direct.** The service-role key bypasses RLS. Its exposure would expose every child
record in the system. This is the single highest-value secret in the project.

## Reversibility

`Easy` — migrating to a dedicated secret manager later is straightforward.

## Review trigger

Team grows beyond ~3 people with credential access, or a compliance requirement
demands centralized rotation and audit.
