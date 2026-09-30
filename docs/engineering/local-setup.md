# Local Development Setup

**Status:** Approved (F16) · Target platform: Windows 11

Nothing here is installed yet. This is the checklist for WS-5.

## Required tools

| Tool | Purpose | Notes |
|---|---|---|
| Git | Source control | Installed — 2.54.0 |
| **Docker Desktop** | Runs local Supabase | Requires WSL2. Heaviest install. |
| Supabase CLI | Migrations, local stack | |
| Node.js LTS | Services, tooling, CI parity | Installed — v24.15.0 |
| Flutter SDK | Building and testing the package | |
| Android Studio | Android emulator and device debugging | Large download |
| VS Code + Claude Code | Engineering environment | Installed |
| FlutterFlow | UI development | Browser-based |

## Realistic expectation

2–4 hours, mostly waiting on downloads, plus first-run troubleshooting. Claude gives
exact commands step by step and diagnoses failures as they appear.

## iOS testing (Amendment 1)

iOS validation is **not deferred to P9**. A physical iPhone with TestFlight or a
FlutterFlow cloud build is used during the week-1 audio spike to validate microphone
permissions, recording, upload, playback, and the custom package on real hardware.

A Mac is **not** required at this stage. A Mac would be required only for local iOS
builds and deep native debugging.

Sequencing risk: TestFlight requires an Apple Developer account, which has a lead time.
If it is not ready, the spike validates Android first and iOS immediately after
enrollment. Tracked in WS-5.

## Environment configuration

Copy `.env.example` to `.env` and fill in values. **`.env` is gitignored and must never
be committed.** Use local or staging values only — never production.

## Verify setup

Verification commands are added once the toolchain is installed. Target end state:

- `supabase start` brings up the local stack
- `supabase db reset` rebuilds schema from migrations and synthetic seed
- Service tests run and pass
- The package example app builds and runs on a device
