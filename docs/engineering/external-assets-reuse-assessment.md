# External Assets Reuse Assessment — TarteelAI Repositories

**Status:** ANALYSIS ONLY · **Date:** 2026-09-30 · **Author:** Claude (engineering)
**Nothing has been added, copied, vendored, forked, cloned, or integrated.**

> **This document approves nothing.** No Qur'an source is selected or approved. No ASR
> provider is selected. No dependency is added. No ADR is changed. All findings are
> inputs to decisions the PO and a qualified reviewer must make later.

Method: GitHub REST API metadata, public READMEs, and the QUL website, read remotely.
No repository was cloned. Licence conclusions are **engineering observations requiring
legal confirmation**, not legal advice.

---

## Summary table

| Repository | License | Last push | State | Recommendation |
|---|---|---|---|---|
| [quranic-universal-library](#5-quranic-universal-library) | MIT *(code; data unclear)* | 2026-09-30 | Very active, 1,036★ | **REFERENCE ONLY → candidate-source evaluation** |
| [tarteel-ml](#2-tarteel-ml) | MIT | 2021-11-10 | **ARCHIVED** | **REFERENCE ONLY** |
| [NeMo](#4-nemo) | Apache-2.0 | 2025-05-07 | Stale fork | **REFERENCE ONLY — use upstream, DEFER** |
| [voice](#1-voice) | MIT | 2023-12-07 | Stale fork, React Native | **REJECT as dependency / REFERENCE ONLY** |
| [quran-ttx](#3-quran-ttx) | **NONE DECLARED** | 2025-07-02 | Active | **REJECT — licence conflict risk** |

**Headline finding:** the most valuable repository (QUL) needs careful per-resource
licence work before anything from it can pass Stage 2 of our sourcing protocol. The
riskiest (quran-ttx) surfaced a **licensing problem that affects our own Mode A mushaf
rendering regardless of whether we ever touch that repository** — see
[Cross-cutting finding](#cross-cutting-finding-kfgqpc-fonts).

---

## 1. voice

`TarteelAI/voice` — https://github.com/TarteelAI/voice

| | |
|---|---|
| **1. Purpose** | React Native voice-recognition library for iOS/Android. A **fork** of `react-native-voice/voice`. Objective-C/Java native modules wrapping platform speech APIs. |
| **2. Maintenance** | **Stale fork.** Created and last pushed 2023-12-07 — a single day of activity, ~2.8 years ago. Upstream (`react-native-voice/voice`, 2,163★) was last pushed 2026-01-31, so the fork is roughly two years behind. |
| **3. License** | MIT (inherited from upstream). Permissive, commercial use fine. |
| **4. MVP use** | **None as code.** This is **React Native; we are Flutter.** Architecturally incompatible with ADR-0011. |
| **5. Future use** | None. |
| **6. Code reuse** | **No.** Wrong framework. Even the native Objective-C/Java could not drop into a Flutter plugin without a rewrite, and mature Flutter audio packages already exist. |
| **7. Data reuse** | None — no data. |
| **8. Reference value** | **Low but non-zero.** Useful only for reading how a production Qur'an app handled: iOS/Android microphone permission flows, on-device vs. cloud recognition switching, and interrupted-recording edge cases. Concept-level lessons for `quran_recitation_kit`, nothing more. |
| **9. Integration** | N/A — not integrating. |
| **10. Privacy / child data** | Notable as a *warning*: platform speech APIs (Apple Speech, Google) may transmit audio to the OS vendor and can fall outside our consent and residency model. **Any on-device recognition path must be assessed under WS-4 before use.** A useful reminder that "on-device" in marketing does not always mean on-device. |
| **11. Qur'an governance** | None. |
| **12. Security** | Stale fork with ~2 years of unpatched upstream changes. Not a concern since we will not depend on it. |
| **13. Dependency risk** | High if used — abandoned fork, wrong ecosystem. Avoided by not using it. |
| **14. Vendor-neutrality conflict** | **Yes, if used as a recognition path.** It binds recognition to OS vendors *inside the client*, which is exactly the leakage ADR-0006 forbids. Recognition belongs behind our backend adapter boundary, not in the app. |
| **15. Recommendation** | **REJECT as a dependency. REFERENCE ONLY** for permission-handling lessons, per the PO's instruction. |

---

## 2. tarteel-ml

`TarteelAI/tarteel-ml` — https://github.com/TarteelAI/tarteel-ml

| | |
|---|---|
| **1. Purpose** | Pre-processing and training scripts for the Tarteel Dataset — crowdsourced Qur'an recitation audio. Jupyter/Python: audio preprocessing (ffmpeg/ffprobe), model selection, training, validation, demos. Self-described as "mostly experimental". |
| **2. Maintenance** | **ARCHIVED.** Last push 2021-11-10; created 2018. 232★, 73 forks, 14 open issues left unresolved at archive. Read-only, ~5 years stale. |
| **3. License** | MIT. Permissive. **Note:** the MIT licence covers the *scripts*. The **Tarteel Dataset itself is a separate artifact with separate terms** — crowdsourced human recitation audio, not covered by this repository's licence. |
| **4. MVP use** | **None directly.** Archived, pre-dates modern ASR by roughly two generations of architecture. We are not training a model in MVP. |
| **5. Future use** | **Genuine research value** if we ever pursue our own acoustic model or fine-tuning (post-MVP, and only if WS-4 forces self-hosting). The preprocessing decisions — segmentation, normalization, feature extraction for *Qur'anic Arabic specifically* — are the non-obvious part and remain informative. |
| **6. Code reuse** | **No.** Archived, Python 3.7-era, experimental. Any reuse would be reimplementation informed by reading it. |
| **7. Data reuse** | **The Tarteel Dataset is potentially interesting and must be treated with care.** It is crowdsourced recitation audio from real people, plausibly including minors. Its consent basis, licence, and demographic composition would all need explicit assessment before any use. **Do not assume availability or permissibility.** Not an MVP concern. |
| **8. Reference value** | **Highest of the four non-QUL repos.** The most relevant published prior art on Qur'anic recitation ML, from a team that shipped a real product. Worth reading before designing our alignment approach. |
| **9. Integration** | None. Reference reading only. |
| **10. Privacy / child data** | **Significant cautionary value.** This is a corpus of voice recordings gathered from volunteers. If we ever build a golden evaluation set (currently blocked on WS-1/WS-2), the consent, minor-participation, and retention questions raised here are exactly the ones we will face — see ADR-0008. Reading how they handled it is instructive; **inheriting their consent basis is not possible.** |
| **11. Qur'an governance** | Indirect: if their preprocessing normalized Qur'an text for training, that is a pattern we must **not** copy (ADR-0007 forbids normalization). Worth reading specifically to see what they did and deliberately diverge. |
| **12. Security** | N/A — no runtime use. Archived dependencies would be unpatched if ever installed; don't install. |
| **13. Dependency risk** | N/A. Never a dependency. |
| **14. Vendor-neutrality conflict** | **None.** Reading research does not bind us to a vendor. |
| **15. Recommendation** | **REFERENCE ONLY.** Read before finalizing the alignment strategy in P5. Build and train nothing, per the PO's instruction. |

---

## 3. quran-ttx

`TarteelAI/quran-ttx` — https://github.com/TarteelAI/quran-ttx

> ⚠️ **This repository carries the clearest legal risk of the five, and investigating it
> surfaced a finding that affects our product independently of it.**

| | |
|---|---|
| **1. Purpose** | "TTX copies of mushaf page TTF font files." **TTX is the XML decompilation format produced by fontTools** — that is, these are decompiled/disassembled representations of mushaf page fonts, almost certainly the KFGQPC Madani mushaf fonts. |
| **2. Maintenance** | Active-ish: created 2021-02-10, last push 2025-07-02. Small (9★, 5 forks, 1 open issue). Shell-based. |
| **3. License** | **NO LICENCE DECLARED.** No `LICENSE` file (verified HTTP 404). The README's entire licence statement is a bare link to `dm.qurancomplex.gov.sa/copyright-2/` — **which is itself a dead link (HTTP 404)**. Effect: **no usable licence grant.** Under default copyright, absence of a licence means no permission to use. |
| **4. MVP use** | **None. Do not use.** |
| **5. Future use** | **None from this repository.** The underlying *need* (mushaf-faithful page rendering for Mode A) is real and must be solved through a properly licensed route. |
| **6. Code reuse** | No. |
| **7. Data reuse** | **No — and specifically prohibited-looking.** Published KFGQPC terms permit use, copying, and distribution free of charge, but state the font "cannot be Sold, Modified, Altered, Translated, Reverse Engineered, Decompiled, Disassembled, Reproduced". **A TTX file is by definition a decompiled font.** The tension is direct and factual. |
| **8. Reference value** | **Low, and not worth the risk.** It could in principle inform how mushaf page layout maps to glyphs, but mushaf layout data is available from QUL under clearer terms. There is no reason to go near this one. |
| **9. Integration** | None. |
| **10. Privacy / child data** | None. |
| **11. Qur'an governance** | **Severe if misused.** These fonts encode Qur'an text as glyphs. Using decompiled Qur'an fonts would violate ADR-0007's byte-preservation and provenance requirements as well as the source licence. A rendering error from a mishandled font is a **Qur'an-integrity incident** ([runbook](../runbooks/quran-integrity-incident.md)). |
| **12. Security** | Font files are a known parser-exploit vector; decompiled fonts from an unlicensed third party are an unnecessary supply-chain risk. |
| **13. Dependency risk** | Unlicensed, single-purpose, tiny maintainer base. |
| **14. Vendor-neutrality conflict** | Not a vendor issue — a licensing and integrity issue. |
| **15. Recommendation** | **REJECT.** Do not clone, vendor, or import. Do not import fonts, per the PO's instruction — and the reason is stronger than caution: there is no licence permitting it. |

### Cross-cutting finding: KFGQPC fonts

This matters **whether or not we ever look at quran-ttx again**, because Mode A requires
displaying mushaf text.

Published KFGQPC terms indicate:

- Free to **use, copy, distribute**
- **Cannot be** sold, modified, altered, translated, reverse engineered, decompiled,
  disassembled, or reproduced
- Commercial use and modification require **express written approval** from KFGQPC

**We are building a commercial product.** Two consequences:

1. **Written permission from KFGQPC may be required** for our intended use. That is a
   procurement task with an unknown and potentially long lead time, and it belongs to a
   workstream — not to engineering.
2. **We must not modify, subset, or re-encode the fonts**, which rules out common
   optimization techniques (font subsetting to reduce app size is a standard mobile
   practice and appears to be prohibited here).

**This needs legal review**, ideally folded into WS-4 since counsel will already be
engaged. I am flagging a factual tension between published terms and intended use;
I am not qualified to give the legal conclusion.

Sources: [Open Hub — KFGQPC licence](https://openhub.net/licenses/KFGQPC) ·
[qpc-fonts](https://github.com/nuqayah/qpc-fonts) ·
[KFGQPC](https://qurancomplex.gov.sa/en/epub-exhibition/)

---

## 4. NeMo

`TarteelAI/NeMo` — https://github.com/TarteelAI/NeMo

| | |
|---|---|
| **1. Purpose** | A **fork of NVIDIA NeMo** — a large conversational-AI/speech toolkit (ASR, TTS, NLP). Relevant components: ASR models, **forced alignment**, CTC-based decoding. |
| **2. Maintenance** | **Stale fork.** Last push 2025-05-07 (~16 months ago); 7★, 0 forks. Upstream (`NVIDIA-NeMo/Speech`, 18,525★) was pushed **today, 2026-09-30**. The fork is far behind and has no visible divergent purpose. |
| **3. License** | Apache-2.0 (from upstream). Permissive, commercial use permitted, patent grant included. **Favourable.** |
| **4. MVP use** | **None. DEFER.** We are not self-hosting ASR in MVP (ADR-0006), and provider selection is blocked on WS-4. |
| **5. Future use** | **Potentially significant.** If WS-4 concludes that in-Saudi or self-hosted processing is required, a self-hostable Apache-2.0 toolkit becomes a leading candidate. Its **forced-alignment** capability maps directly onto our L1 approach — aligning audio against *known* target text rather than open transcription. |
| **6. Code reuse** | **Not from this fork — from upstream.** There is no reason to use a 16-month-stale fork when upstream is active. If we ever go this route, we use `NVIDIA-NeMo` directly. |
| **7. Data reuse** | No datasets of interest here. |
| **8. Reference value** | **High, architecturally.** Reading how NeMo structures forced alignment and confidence estimation informs our adapter and confidence-engine design (ADR-0009) even if we never deploy it. |
| **9. Integration** | Heavy: Python, GPU, model weights, serving infrastructure. Would sit **behind our adapter boundary** as one `AsrProvider`/`AlignmentProvider` implementation — which is precisely what ADR-0006 was designed to make possible. |
| **10. Privacy / child data** | **Potentially the most privacy-favourable option available.** Self-hosting means child audio need never reach a third-party processor — it could resolve the hardest WS-4 questions outright. Counterweight: we would then own the security, patching, and operational burden for a system processing children's voices. Not an MVP-scale undertaking. |
| **11. Qur'an governance** | Neutral as a tool. **Critical caveat:** any ASR output is a *hypothesis about audio*, never a source of Qur'an text. ADR-0007 holds regardless — model output must never write to `ayat`. |
| **12. Security** | Large ML dependency surface; self-hosting inference for children's audio is a substantial security responsibility. Upstream is actively maintained, which helps. |
| **13. Dependency risk** | Using the stale fork: high. Using active upstream: moderate and manageable. Operational cost of self-hosting is the real risk. |
| **14. Vendor-neutrality conflict** | **No — it reinforces neutrality.** A self-hostable Apache-2.0 option is the strongest possible hedge against vendor lock-in, and exactly the escape hatch ADR-0006 anticipates. |
| **15. Recommendation** | **REFERENCE ONLY now; DEFER as an implementation option pending WS-4.** If pursued, use **upstream NVIDIA NeMo**, not this fork. Build and train nothing yet, per the PO's instruction. |

---

## 5. quranic-universal-library

`TarteelAI/quranic-universal-library` (QUL) — https://github.com/TarteelAI/quranic-universal-library · https://qul.tarteel.ai/

> **The most relevant repository of the five, and the only one warranting formal
> candidate-source evaluation.**

| | |
|---|---|
| **1. Purpose** | "A comprehensive collection of Quran resources" — a Ruby application plus an extensive resource library, published at qul.tarteel.ai with import/export tooling and content versioning. |
| **2. Maintenance** | **Very active.** Last push **2026-09-30 (today)**; created 2024-06-11. 1,036★, 133 forks, 201 open issues. Healthy, well-adopted, evidently maintained. |
| **3. License** | **MIT — for the repository/code.** ⚠️ **Critical gap:** neither the README nor the site states licensing, provenance, or attribution terms for the **resources themselves**. Each translation, tafsir, recitation, and mushaf layout has its own upstream rights holder, and an MIT licence on the application does **not** convey rights to third-party content it distributes. Verified: README has no licensing section; the site states only "Special thanks to all those whose contributions made this project possible." |
| **4. MVP use** | **Potentially high value — as a candidate source entering our seven-stage protocol.** Specifically: Qur'an script (Uthmani/Imlaei), Qur'an metadata (surah/ayah/juz/hizb), and **mushaf layouts** (the 604-page mapping our planning depends on). **Nothing may be used until Stage 2 licensing and Stage 6 religious approval are satisfied.** |
| **5. Future use** | Broad: translations, tafsirs, transliteration, morphology/grammar, topics, similar ayahs, mutashabihat, ayah themes. Most map to explicitly post-MVP features. |
| **6. Code reuse** | **No.** Ruby; our backend is TypeScript (ADR-0002). No reason to adopt it. Its **export formats** are interesting as an interchange target for our content pipeline. |
| **7. Data reuse** | **The central question. Promising but unresolved.** Relevant to us: Qur'an script (Unicode and images) · mushaf layouts · Qur'an metadata · recitations and **segment data** · fonts · word-by-word data. Each requires individual provenance and licence determination. |
| **8. Reference value** | **High independent of data use.** Their resource taxonomy, versioning approach, and segment-data model are directly comparable to problems we are solving, and QUL is a de-facto community standard worth being interoperable with. |
| **9. Integration** | No code integration. The realistic path: obtain specific resources through our **own** verification pipeline, with provenance recorded per `data/quran/`. Their export formats may inform our importer. |
| **10. Privacy / child data** | **None** — reference data, no personal data. A mild positive: licensed reference recitation audio could serve Mode B without recording anything. |
| **11. Qur'an governance** | **This is the governance-critical item.** Non-negotiables: (a) **1,036 stars is not provenance** — popularity is not verification; (b) it must pass **all seven stages** including **Stage 6 qualified human approval**, which is blocked on WS-1; (c) **byte-preservation** applies — no normalization on import; (d) **per-resource** licensing must be established, not inferred from the repository's MIT licence; (e) basmalah handling and ayah numbering must be tested explicitly, not trusted. |
| **12. Security** | Not a runtime dependency, so minimal. Any downloaded dataset is untrusted input until hashed and structurally verified. |
| **13. Dependency risk** | Low — we would take versioned, hashed data snapshots, not a live dependency. Our write-once model (ADR-0007) makes us immune to upstream changes by design. |
| **14. Vendor-neutrality conflict** | **None.** This is reference data, not a vendor. Our sourcing protocol already assumes multiple candidate sources and cross-comparison (Stage 5), for which QUL is a strong Stage 5 comparator. |
| **15. Recommendation** | **REFERENCE ONLY now → formal candidate-source evaluation in P1.** Register as a candidate in [candidate-sources.md](../content-governance/candidate-sources.md). **Approve nothing.** |

### Resources worth evaluating, in priority order

| Priority | Resource | Why | Blocked by |
|---|---|---|---|
| 1 | **Mushaf layouts** (604-page Madani mapping) | Page is our practical hifz planning unit; this mapping is hard to source reliably | Stage 2 licence + Stage 6 |
| 2 | **Qur'an script** (Uthmani + Imlaei) | Core reference data for both modes | Stage 2 + Stage 6 |
| 3 | **Qur'an metadata** (surah/ayah/juz/hizb/quarter) | Structural verification and progress aggregation | Stage 2 + Stage 6 |
| 4 | **Word-by-word data** | Anchors L1 forced alignment (`ayah_words`) | Stage 2 + Stage 6 |
| 5 | **Recitation + segment data** | Reference audio for Mode B; segment timings may inform alignment | Stage 2 + **per-reciter rights** |
| 6 | Translations, tafsir, morphology, themes | All post-MVP | — |

### Provenance and licensing metadata — the gap to close

Our Stage 1 and 2 gates require, **per resource**: original source and publisher ·
upstream rights holder · licence text and URL · commercial-use permission · attribution
requirements · text version identifier · retrieval date · content hash.

**QUL does not currently surface most of this publicly.** Closing the gap means asking
the QUL maintainers directly about per-resource provenance and licensing. That is a
reasonable, low-cost outreach step and a **prerequisite to Stage 2** — not something
engineering can resolve by reading code.

---

## License summary

| Repository | Declared | Commercial use | Concern |
|---|---|---|---|
| quranic-universal-library | **MIT** (code) | Code: yes | ⚠️ **Resource licences unstated — must be established per resource** |
| tarteel-ml | **MIT** | Yes (scripts) | Tarteel Dataset is separately licensed |
| NeMo | **Apache-2.0** | Yes, with patent grant | Favourable; use upstream |
| voice | **MIT** | Yes | Wrong framework; irrelevant |
| quran-ttx | **NONE** | **No permission exists** | 🔴 Dead licence link; decompiled fonts vs. KFGQPC no-decompile terms |

**Legal review items for WS-4/counsel:** (1) KFGQPC font terms vs. our commercial,
possibly-subsetted use; (2) whether MIT on a repository conveys any rights to third-party
resources it redistributes; (3) rights in recitation audio, which involve the reciter.

---

## Open questions

1. Per-resource provenance and licensing for every QUL resource we might use.
2. Whether KFGQPC written permission is required for our use of mushaf fonts.
3. Whether font subsetting — standard mobile practice — is permitted at all.
4. Rights position for reference recitation audio (reciter + publisher).
5. Tarteel Dataset licence and consent basis, if it is ever relevant.
6. Whether QUL's mushaf layout data matches the KFGQPC Madani 604-page pagination exactly.

---

## Changes to existing decisions

**None made.** Per instruction, no ADR is modified. For future consideration:

| ADR | Why it may need revisiting | When |
|---|---|---|
| [0011](../adr/0011-flutterflow-custom-package-seam.md) FlutterFlow seam | Mushaf font licensing may constrain rendering and app-size optimization | After font licence clarity |
| [0006](../adr/0006-vendor-abstraction-boundary.md) Vendor boundary | Self-hosted NeMo would be a new adapter class — **the ADR anticipates this; no change expected** | After WS-4 |
| [0007](../adr/0007-quran-data-immutability.md) Qur'an immutability | May need an explicit sub-section on **font and glyph provenance**, which it does not currently cover | After font licence clarity |
| [0008](../adr/0008-audio-lifecycle-and-retention.md) Audio lifecycle | Self-hosted ASR would materially improve the privacy position | After WS-4 |

**Genuine gap identified:** ADR-0007 governs Qur'an *text* but says nothing about
**fonts and rendered glyphs**, which are also a route to displaying Qur'an incorrectly.
Worth addressing once the font licensing position is known.

## Assessment log

| Date | Action | By |
|---|---|---|
| 2026-09-30 | Five repositories assessed remotely. Nothing cloned, imported, or integrated. | Claude |
