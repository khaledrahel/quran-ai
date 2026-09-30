# ADR-0011: FlutterFlow custom package seam

- **Status:** Accepted
- **Date:** 2026-09-30
- **Decision owner:** Khaled (PO)
- **Approved by:** Khaled — 2026-09-30 (F6, F7)

## Context

FlutterFlow is the approved tool for the application UI. It is strong for screens,
navigation, CRUD, and dashboards, and awkward for the recitation path: microphone
control, chunked recording, encryption, offline queueing, waveform rendering, and upload
state. FlutterFlow regenerates its code, so hand-edits to generated output are silently
lost.

## Options considered

1. **Everything in FlutterFlow** — one tool; the hardest and most safety-critical code
   ends up unversioned, untestable, and unreviewable.
2. **Abandon FlutterFlow for the learner app** — full control; discards the approved
   stack and the PO's ability to work on the UI directly.
3. **FlutterFlow for UI, a custom Flutter package for the audio pipeline** — keeps the
   stack, puts the hard code in version control under test.

## Decision

Option 3.

```
FlutterFlow (UI source of truth)
   |  push
   v
flutterflow/main branch --PR--> main --> apps/flutterflow/  (READ-ONLY mirror)
   |
   |  pubspec dependency
   v
packages/quran_recitation_kit   <-- Claude Code owns, tests, versions
   ^
   +-- FlutterFlow custom actions/widgets are THIN WRAPPERS calling into it
```

| | Rule |
|---|---|
| Yes | FlutterFlow owns screens, navigation, state binding, Supabase CRUD, dashboards |
| Yes | The package owns audio, encryption, queueing, upload, waveform — all real logic |
| Yes | Custom actions in FlutterFlow are thin wrappers, a few lines each |
| No | Never hand-edit generated code in `apps/flutterflow/` |
| No | Never put business logic, thresholds, or secrets in FlutterFlow |
| No | Never let FlutterFlow call an AI provider directly — it goes through our backend |

## Consequences

- Safety-critical audio code is versioned, tested in CI, and reviewable.
- The seam is the most fragile part of the setup and is therefore de-risked by a
  dedicated **week-1 spike** (F7) before anything depends on it.
- The package ships with a standalone `example/` harness so it can be tested on real
  devices without FlutterFlow in the loop.
- FlutterFlow plan capabilities need verification: GitHub integration, custom pub-package
  dependencies, microphone permissions in generated iOS and Android builds, and
  compatibility with Apple Kids Category / Google Families SDK restrictions.

## Religious-content impact

`None` directly. Related rule: no religiously sensitive string is hard-coded in
FlutterFlow — all such text is a versioned `content_artifact` fetched at runtime.

## Privacy / child-safety impact

**Direct.** On-device encryption, offline-queue TTL, and upload handling all live in the
package, where they can be reviewed and tested — rather than in generated UI code, where
they could not be.

## Reversibility

`Easy` in one direction: the package is plain Flutter, so moving the learner app to
native Flutter later would not require rewriting it. That is a deliberate hedge.

## Review trigger

The week-1 spike (F7) fails on any of its four questions; or FlutterFlow proves unable
to embed the package acceptably.
