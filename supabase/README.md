# Supabase

**No schema exists yet.** Schema design is presented for PO approval in week 2 before any
migration is written.

| Directory | Contents |
|---|---|
| `migrations/` | Forward-only versioned SQL (ADR-0004) |
| `functions/` | Edge Functions |
| `policies/` | RLS policies — versioned as migrations, reviewed as a unit |
| `tests/` | pgTAP: RLS and constraint tests |
| `seed/` | **Synthetic data only** |

## Rules

- **No schema changes through the Supabase dashboard** on staging or production. Ever.
  A dashboard change is invisible to the repository and desynchronizes every environment.
- Forward-only migrations. Rollback is a forward fix plus a restore plan, not a
  down-migration.
- **Migrations touching `ayat`, `quran_sources`, `content_artifacts`, or the audio/consent
  tables require explicit PO approval.**
- RLS is deny-by-default on every table and is tested in CI.
- `seed/` contains synthetic data only — never real child data, in any environment.

## Environments (ADR-0003)

| Env | Data | Status |
|---|---|---|
| Local (Docker) | Synthetic | To be set up |
| Staging | **Synthetic only** | To be created, week 1 |
| Production | Real | **BLOCKED on WS-4** |

## Storage

Bucket `recitation-audio` — created in P2. Private, RLS-gated, short-TTL signed URLs,
lifecycle deletion job. **Never public.** See ADR-0008.
