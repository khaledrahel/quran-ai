# CI/CD Workflows

**No workflow files exist yet.** They are created on days 4–5 of week 1, once the
toolchain is installed and there is something to lint and test. Creating them now would
only produce a permanently failing pipeline.

Planned pipeline — see `docs/engineering/branching-and-ci.md`.

## On every pull request

1. Lint and format — Dart, TypeScript, SQL
2. Unit tests
3. **Qur'an integrity verification** — dataset hashes and structural counts
4. RLS policy tests
5. Dependency vulnerability scan
6. Secret scan
7. Build `quran_recitation_kit`

Step 3 runs on every commit deliberately: Qur'an text corruption cannot reach any
environment without a red build.

## On merge to main

Migrations to staging, Edge Functions to staging, smoke tests.

## To production

**Manual approval gate.** Migration and deploy are separate, explicitly approved steps.
