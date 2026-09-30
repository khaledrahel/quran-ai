# Setup Checklist — Unblocking the Spike

**Status:** NOT STARTED · Owner: Khaled (PO) · 2026-09-30

Verified on this machine: **git 2.54.0 ✅ · Node v24.15.0 ✅**
Everything else below is missing.

Steps 1–5 unblock the spike. Steps 6–9 can run in parallel.

---

## 1. GitHub remote — 20 min · unblocks step 1 of the gate

1. Create a **private** repository named `quran-ai` at https://github.com/new
   — no README, no .gitignore, no license (we already have them)
2. Enable MFA on your account if not already: Settings → Password and authentication
3. Send me the repository URL. I will then run:
   ```
   git remote add origin <url>
   git push -u origin main
   ```
   Two commits, 72 files, no secrets — verified.

**Optional but recommended:** install the GitHub CLI (`winget install GitHub.cli`, then
`gh auth login`). It would let me handle branch protection and PRs directly instead of
walking you through the web UI each time.

## 2. FlutterFlow plan verification — 30 min · **BLOCKS THE SPIKE**

This is the highest-priority item. Answer three questions:

| Question | Where to look |
|---|---|
| Does my plan include **GitHub integration**? | FlutterFlow → Settings → Integrations |
| Can I add a **custom pub package dependency**? | Custom Code → Dependencies |
| Can that dependency come from a **git URL**, or only pub.dev? | Same screen |

Report exactly what you see, including plan name. **The package structure depends on
these answers** — this is why no package code is written yet.

## 3. Supabase staging — 20 min

1. Create an account at https://supabase.com
2. New project, name it `quran-ai-staging`
3. Region: any — **staging is synthetic-only, so region does not matter here**
   (production region stays blocked on WS-4)
4. Save the database password in your password manager
5. Create a **private** storage bucket named `spike-audio` (Storage → New bucket,
   leave "Public" OFF)
6. Copy `.env.example` to `.env` and fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   from Settings → API

**Do not paste these into chat.** Put them in `.env`, which is gitignored. I read them
from the file.
**Do not create a production project.**

## 4. Password manager — 20 min

1Password, Bitwarden, or similar. You are about to create six accounts.

## 5. Local toolchain — 2–4 hours, mostly downloads

Install in this order:

| # | Tool | How | Note |
|---|---|---|---|
| 5.1 | **Flutter SDK** | https://docs.flutter.dev/get-started/install/windows | Add to PATH; run `flutter doctor` |
| 5.2 | **Android Studio** | https://developer.android.com/studio | Large. Includes the Android SDK and `adb`. |
| 5.3 | Android device setup | Enable Developer Options → USB Debugging on your phone | `flutter devices` should list it |
| 5.4 | **Docker Desktop** | https://www.docker.com/products/docker-desktop/ | Needs WSL2. Heaviest install. **Not needed for the spike** — defer if short on time. |
| 5.5 | **Supabase CLI** | `npm install -g supabase` | Not needed for the spike |

**For the spike, only 5.1–5.3 are required.** Docker and the Supabase CLI are for local
database work in the next gate.

Run `flutter doctor` when done and send me the output — it diagnoses most setup problems
on its own.

## 6. Physical Android device — needed for the spike

Any modern Android phone with a working microphone, USB debugging enabled.

## 7. Apple Developer account — start now, takes days to weeks

https://developer.apple.com/programs/ — USD 99/year. Individual enrollment is faster than
organization; organization requires a D-U-N-S number and is slow.

Needed for TestFlight iOS validation. **Android validation proceeds without it.**

## 8. Physical iPhone — for iOS validation

Any modern iPhone. Needed for the iOS half of the spike once TestFlight is available.

## 9. WS-4 PDPL review — start in parallel, blocks nothing here

See `docs/workstreams/ws-4-pdpl-residency.md`. First decision: engage counsel now, or
self-research first?

---

## Minimum to start the spike

```
1. GitHub repo              20 min
2. FlutterFlow verified     30 min   <- blocks everything
3. Supabase staging         20 min
5.1-5.3 Flutter + Android   2-3 hours
6. Android device           you have one
```

**Roughly half a day.** Apple Developer, Docker, Supabase CLI, and WS-4 all run in
parallel and do not hold up the spike.

## Sequence once unblocked

```
You: steps 1-3        ->  I push the repo, confirm Supabase access
You: step 5           ->  I write the package for the confirmed dependency model
Together: spike parts B, C, D
Me: spike report against the nine requested headings
```
