# WS-5 — Accounts and Tooling

**Status:** OPEN · **Owner:** Khaled (PO) · **Needed by:** Week 2 (some items longer)

## Checklist

| Item | Needed by | Lead time | Status |
|---|---|---|---|
| GitHub account + private repo + MFA | Week 1 | Minutes | Not started |
| Password manager | Week 1 | Minutes | Not started |
| Supabase account + **staging** project | Week 1 | Minutes | Not started |
| FlutterFlow plan — verify GitHub integration + custom packages | Week 1 | Minutes | **Blocks F7 spike** |
| Local tooling (see `docs/engineering/local-setup.md`) | Week 1 | 2–4 hours | Not started |
| **Physical iPhone for early iOS validation** | Week 1–2 | Varies | **Amendment 1** |
| Apple Developer account | Before P9 | **Days to weeks** | Not started |
| Google Play developer account | Before P9 | Days | Not started |
| Business entity for store publishing | Before P9 | **Weeks** | Not started |
| Supabase **production** project | After WS-4 | — | **BLOCKED** |

## Long-lead items — start now

**Apple Developer enrollment** and **business entity registration** are measured in weeks,
not minutes. They are needed at P9 but should be started in week 1, because they are pure
calendar time that cannot be compressed later.

## iOS validation (Amendment 1)

iOS device testing is **not deferred to P9**. A physical iPhone plus TestFlight or
FlutterFlow cloud build is used during the week-1 audio spike to validate microphone
permissions, recording, upload, playback, and the custom package on real iOS hardware.

**A Mac purchase is not required at this stage.**

Note: TestFlight distribution requires an Apple Developer account, which has a lead time.
If the account is not ready in week 1, the spike validates Android first and iOS as soon
as enrollment completes. This sequencing risk is tracked here.

## Credential handling

- Never paste a secret into chat
- Place values in a local `.env` (gitignored) or directly into GitHub Actions secrets
- MFA on every account
- Service-role keys never leave the backend

## Progress log

| Date | Update | By |
|---|---|---|
| 2026-09-30 | Workstream opened. No accounts confirmed. | Claude |
