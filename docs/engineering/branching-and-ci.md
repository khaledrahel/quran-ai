# Branching, CI and CD

**Status:** Approved (F3, F12) · CI workflows are **not yet implemented** — days 4–5

## Branching

Trunk-based with short-lived branches.

| Branch | Purpose | Protection |
|---|---|---|
| `main` | Always deployable to staging | Protected: no direct push, PR + green CI |
| `feat/*`, `fix/*`, `chore/*` | Short-lived, squash-merged | — |
| `flutterflow/main` | **FlutterFlow pushes here automatically** | Never hand-edited; merged via PR |
| `release/*` | Cut for production; tagged | Manual approval to deploy |

The FlutterFlow branch is a generated artifact arriving from outside the normal flow.
Treating it as a PR into `main` means every FlutterFlow change is seen before it lands.

Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).

## CI — on every pull request

1. Lint and format — Dart, TypeScript, SQL
2. Unit tests
3. **Qur'an integrity verification** — dataset hashes and structural counts
4. RLS policy tests
5. Dependency vulnerability scan
6. Secret scan
7. Build `quran_recitation_kit`

Step 3 runs on every commit deliberately: Qur'an text corruption cannot reach any
environment without a red build.

## CD

| Target | Trigger |
|---|---|
| Staging | Automatic on merge to `main` — migrations, then Edge Functions, then smoke tests |
| Production | **Manual approval gate.** Migration and deploy are separate approved steps. |

## Mobile builds

FlutterFlow's own build and deploy for MVP. A dedicated pipeline (Codemagic or similar)
only if FlutterFlow's proves insufficient. Not a week-1 decision.

## Current state

No workflow files exist yet. They are created on days 4–5 of week 1, once the toolchain
is installed and there is something to lint and test. Creating them earlier would only
produce a permanently failing pipeline.
