# Security Baseline

**Status:** Approved (F10) · 2026-09-30

| Area | Baseline |
|---|---|
| Authorization | RLS on every table, deny-by-default, tested in CI |
| Roles | `parent`, `reviewer`, `admin` — least privilege; reviewers scoped to assigned requests only |
| Audio | Private buckets, short-TTL signed URLs, encrypted in transit and at rest, every access audited |
| Entitlements | Enforced server-side only; client state never trusted |
| Secrets | Never in the repository, never in FlutterFlow, never in client code (ADR-0005) |
| Dependencies | Automated vulnerability scanning in CI; pinned versions |
| Qur'an integrity | Hash verification in CI and in production; mismatch halts |
| Admin access | MFA mandatory on GitHub, Supabase, FlutterFlow, Apple, Google |
| Logging | **No child audio, no ayah content, no PII in application logs** |
| Environments | Staging is synthetic-only; production data never copied anywhere (ADR-0003) |

## Incident runbooks

Written in P0, before they are needed:

- `docs/runbooks/quran-integrity-incident.md`
- `docs/runbooks/data-incident.md`
- `docs/runbooks/credential-compromise.md`

Writing these in week one is deliberate. A Qur'an-integrity incident in a Qur'an app is
a reputational event that cannot be recovered by patching quietly, and the response
should be decided before it is needed rather than improvised under pressure.

## Highest-value secret

The Supabase **service-role key** bypasses RLS. Its exposure would expose every child
record in the system. It lives only in backend environment configuration, never in the
client, never in FlutterFlow, never in the repository.
