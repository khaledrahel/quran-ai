# ADR-0004: Forward-only versioned migrations

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (F9)

## Context

Supabase offers a dashboard that can alter schema directly. Changes made there are
invisible to the repository and silently desynchronize environments. The project has
tables where an accidental change is severe: `ayat`, `quran_sources`, `content_artifacts`,
and the audio/consent tables.

## Options considered

1. **Dashboard-driven schema** — fast; unversioned, unreviewable, undiffable, and
   impossible to reproduce locally.
2. **Forward-only versioned SQL migrations in the repo** — every change reviewed,
   diffable, reproducible, applied by CI.
3. **Up/down reversible migrations** — theoretically cleaner rollback; down-migrations
   are rarely correct in practice and create false confidence about data loss.

## Decision

Forward-only versioned SQL migrations in `supabase/migrations/`, timestamp-prefixed,
applied by CI. **No schema changes through the Supabase dashboard on staging or
production — ever.** Rollback is addressed by a forward fix plus a restore plan,
not by a down-migration.

| Environment | Application |
|---|---|
| Local | `supabase db reset` — full rebuild from migrations + synthetic seed |
| Staging | Automatic on merge to `main` |
| Production | **Manual approval gate, never automatic** |

## Consequences

- Every environment is reproducible from the repository.
- Slower than clicking, which is the point.
- Every migration is reviewed for its rollback path *before* merge.
- **Any migration touching `ayat`, `quran_sources`, `content_artifacts`, or the
  audio/consent tables requires explicit PO approval.**
- RLS policies are migrations too — versioned and tested, never clicked.

## Religious-content impact

**Direct.** Qur'an tables are write-once (ADR-0007). This ADR is the mechanism that
prevents an ad-hoc dashboard edit to Qur'an text, which would be undetectable and severe.

## Privacy / child-safety impact

**Direct.** RLS policies are the primary protection for child data. Versioning them as
tested migrations means an authorization boundary cannot be weakened by an untracked click.

## Reversibility

`Easy` now. The discipline is the asset; abandoning it later is what would be costly.

## Review trigger

Migration volume makes CI application impractical, or a genuine need for a rollback
mechanism emerges that a forward fix cannot serve.
