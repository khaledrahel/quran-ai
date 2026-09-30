# Spike 01 — FlutterFlow ↔ Custom Package ↔ Audio Seam

**Status:** SPECIFIED — **not yet executed** (blocked on tooling and accounts)
**Approved:** F7 · **Phase:** Technical de-risking gate · **Timebox:** 2 days of engineering time

## Purpose

Validate the single most fragile seam in the architecture (ADR-0011) **before** anything
depends on it. This spike is throwaway code. Its only output is answers.

> If this seam does not work, we learn it in week 1 rather than week 5.

## Explicitly out of scope

No app UI · no schema · no Qur'an content · no ASR provider · no real child data ·
no production anything. The spike records audio, uploads it, plays it back. Nothing more.

---

## The four questions this spike must answer

| # | Question | Why it matters |
|---|---|---|
| **Q1** | Does the FlutterFlow plan support GitHub integration and a **custom pub-package dependency**? | If not, ADR-0011's structure fails and all audio code would have to live inside FlutterFlow — unversioned and untestable |
| **Q2** | Can a custom Flutter package be consumed by FlutterFlow via **git dependency**, or must it be path/pub.dev? | Determines how the package is distributed and versioned |
| **Q3** | Do **microphone permissions and recording** work correctly in FlutterFlow-generated Android and iOS builds? | The core function of the product |
| **Q4** | Do FlutterFlow's default integrations conflict with **Apple Kids Category / Google Families** SDK restrictions? | A child-directed app cannot ship with certain SDKs; discovering this at submission would be severe |

---

## Test matrix

| ID | Test | Pass criteria |
|---|---|---|
| **T1** | FlutterFlow project created, pushed to `flutterflow/main` | Branch appears in GitHub with generated code |
| **T2** | Custom package added as a dependency | Build succeeds with the package resolved |
| **T3** | FlutterFlow custom action calls into the package | Action executes; package code runs |
| **T4** | Microphone permission requested and granted — Android | Native prompt appears; permission granted |
| **T5** | Record 5 seconds of audio — Android | File produced, non-zero length, valid duration |
| **T6** | Encrypt the recording on device | File at rest is not plain audio |
| **T7** | Upload to Supabase Storage (staging, private bucket) | Object appears; bucket is not public |
| **T8** | Download via short-TTL signed URL and play back | Audio plays; URL expires as configured |
| **T9** | Offline behaviour: record with network off, queue, reconnect | Recording queued locally, uploads on reconnect |
| **T10** | Queue TTL: queued item past TTL is deleted, not uploaded | Item removed; no upload |
| **T11** | Repeat T4–T8 on **iOS** | Same results on physical iPhone |
| **T12** | Inspect the FlutterFlow build's bundled SDKs | No SDK that violates child-directed policy |

**Android is validated first** (per your sequencing). iOS follows as soon as Apple
Developer access allows TestFlight.

---

## Procedure

### Part A — Accounts (PO)
1. GitHub repo created; local repo pushed
2. FlutterFlow plan verified for GitHub integration + custom packages (**Q1**)
3. Supabase staging project created; private bucket `spike-audio` created

### Part B — Package (Claude)
4. Minimal `quran_recitation_kit` spike build: permission, record, encrypt, queue, upload
5. Standalone `example/` app — validates audio **without FlutterFlow in the loop**, so
   that a failure can be attributed to the package or to the seam, not to both

### Part C — Seam (Claude + PO)
6. FlutterFlow project created, package added as dependency (**Q2**)
7. Thin custom action wired to the package (**T3**)
8. Push to GitHub, PR into `main` — validates the branch workflow (ADR-0011)

### Part D — Device validation (PO with Claude)
9. Android: T4–T10 on a physical device
10. iOS: T11 via TestFlight when Apple Developer access is ready
11. SDK inspection: T12

---

## Why the package code is not written yet

The package structure depends on **Q2's answer**. A git dependency, a path dependency,
and a pub.dev package have different layouts, versioning, and CI implications. Writing
the package before Q2 is answered risks building the wrong shape and rewriting it.

Q2 is answered in Part A step 2 — roughly 30 minutes of PO time.

---

## Decision rules — what each outcome means

| Outcome | Consequence |
|---|---|
| **All pass** | ADR-0011 confirmed. Proceed to the next gate: schema design and content pipeline. |
| **Q1 fails** (no custom packages on plan) | Either upgrade the plan, or **ADR-0011 is invalidated** — the learner audio screens move to native Flutter while FlutterFlow keeps the rest. This is a material architecture change requiring PO approval. |
| **Q2 restricts to pub.dev** | Package must be published (can be private/self-hosted). Adds release overhead. Minor. |
| **Q3 fails on iOS only** | Likely a permissions/Info.plist issue inside generated code. Investigate; may force native handling of the recording screen. |
| **Q3 fails on both** | Serious. Audio capture is the core function. Escalate to a native-Flutter decision. |
| **Q4 fails** | Identify and remove the offending SDK, or accept that FlutterFlow's defaults are incompatible with child-directed distribution — a **material** finding affecting store approval. |
| **T9/T10 fail** | Offline scope is reduced, per the approved fallback: record-and-queue only, no offline content caching. |

---

## Reporting

On completion, report against the PO's requested structure:

1. What worked
2. What failed
3. FlutterFlow limitations discovered
4. Custom package limitations
5. Android results
6. iOS results
7. Supabase staging results
8. Any architecture changes required
9. Recommendation for the next gate

## Data handling during the spike

- **No real child audio.** The PO's own voice, or a test tone.
- Spike recordings are deleted at the end of the spike.
- The `spike-audio` bucket is deleted when the spike closes.
- Staging remains synthetic-only (ADR-0003).

## Execution log

| Date | Step | Result | By |
|---|---|---|---|
| 2026-09-30 | Spike specified | Blocked on tooling and accounts | Claude |
