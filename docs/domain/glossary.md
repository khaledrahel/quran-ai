# Glossary

Shared vocabulary for an Arabic-first product built in English-language code. Where a
term has an Arabic original, it is given — the product's users think in these words.

## Qur'an and learning terms

| Term | Arabic | Meaning in this project |
|---|---|---|
| Ayah | آية | A verse. **The core learning unit** and the primary record. |
| Surah | سورة | A chapter. 114 in total. |
| Juz | جزء | One of 30 parts of the Qur'an. Used for progress aggregation. |
| Hizb | حزب | One of 60 parts; two per juz. |
| Hizb quarter | ربع حزب | One of 240 quarters. Common practical planning unit. |
| Page / Safha | صفحة | A mushaf page. 604 in the Madani mushaf. Practical hifz planning unit. |
| Mushaf | مصحف | The physical/canonical printed copy. We use the **Madani** edition. |
| Riwayah | رواية | A transmission of recitation. MVP uses **Hafs an Asim** (حفص عن عاصم). |
| Uthmani | رسم عثماني | The traditional orthography used in printed mushafs. |
| Imlaei | رسم إملائي | Modern standard orthography. Easier for learners reading digitally. |
| Hifz | حفظ | Memorization of the Qur'an. |
| Talqeen | تلقين | Teaching by having the learner listen and repeat. **Mode B.** |
| Tajweed | تجويد | The rules governing correct recitation. |
| Makhraj | مخرج | Articulation point of a letter. **L3 — deferred, not offered in MVP.** |
| Madd | مدّ | Elongation of a vowel. **Duration-measurable — advisory in MVP.** |
| Ghunnah | غنّة | Nasalization. **Duration-measurable — advisory in MVP.** |
| Qalqalah | قلقلة | Echoing quality on certain letters. Deferred. |
| Idghaam | إدغام | Merging of letters. Deferred. |
| Ikhfaa | إخفاء | Partial concealment of a letter. Deferred. |
| Basmalah | بسملة | The opening formula. **Handling is a critical verification check** — the classic off-by-one source. |
| Sajda | سجدة | A prostration marker in the text. |
| Halaqah | حلقة | A study circle. Relevant to future B2B and to pilot recruitment. |
| Maktab | مكتب | A traditional Qur'an school. Families often follow its plan. |
| Ijazah | إجازة | Certification to transmit recitation. Relevant to reviewer qualification (WS-1). |
| Qaari | قارئ | A reciter. Relevant to licensed reference audio. |

## Product terms

| Term | Meaning |
|---|---|
| **Learner** | A child profile under a family account. Not an account holder. |
| **Family account** | The parent-owned account. The legal account holder. |
| **Mode A** | Reading-capable learner. Mushaf text visible. |
| **Mode B** | Pre-reading / talqeen learner. Listen → Repeat → Record → basic L1 → Retry. |
| **Spot check** | Short recitation sample during initial assessment. Calibration, not judgement. |
| **Segment** | A scoped range of Qur'an content assigned for practice. |
| **Attempt** | One recorded recitation of a segment. |
| **Confidence band** | HIGH / MEDIUM / LOW. Determines whether the system speaks or abstains. |
| **Abstain** | The LOW-confidence behaviour. Never claims the child was wrong. |
| **Mastery dimension** | One of: memorization, retention, accuracy, fluency, tajweed. |
| **Decay** | Scheduled reduction in mastery over time without successful revision. |
| **Review request** | An escalation to a qualified human reviewer. |
| **Content artifact** | Any versioned, approvable religiously sensitive content. |

## Analysis levels

| Level | Meaning | MVP |
|---|---|---|
| **L1** | Word/ayah correctness against the known target text | Core |
| **L2** | Fluency and pacing | Core |
| **L3** | Makhraj / phoneme-level pronunciation | **Deferred** |
| **L4** | Tajweed rule compliance | **Advisory, duration-measurable rules only** |

## Engineering terms

| Term | Meaning |
|---|---|
| **Adapter boundary** | Where vendor responses are normalized. No vendor data passes it. |
| **Normalization** | Translating a vendor response into our schema. **Never** applied to Qur'an text. |
| **Projection** | `mastery_states`, derived from the `mastery_events` ledger. |
| **Write-once** | Qur'an data. Corrections are new versions, never updates. |
| **Process-and-discard** | Default audio lifecycle. |
| **Synthetic data** | Generated test data. The only data permitted in local and staging. |

> **A note on "normalization".** The word means two opposite things in this project.
> At the adapter boundary it is required. Applied to Qur'an text it is **forbidden**
> (ADR-0007). Never conflate them.
