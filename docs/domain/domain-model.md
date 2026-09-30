# Domain Model

**Status:** Approved 2026-09-30 (D1) · **This is a design document, not a schema.**

No migrations have been written. Table and column names below are illustrative; the
*structure* is what was approved. Schema design begins in week 2 and is presented for
approval before any migration is applied.

---

## 1. Identity and tenancy

```
organizations      (id, name)                      -- created, UNUSED in MVP. Future B2B seam.
family_accounts    (id, organization_id NULL, owner_user_id, country, locale, tier)
guardians          (family_account_id, user_id, role)  -- MVP writes exactly one row
user_profiles      (user_id, role: parent|reviewer|admin, locale)
learners           (id, family_account_id, display_name, age_band, birth_year NULL,
                    reading_ability, learning_mode, status)
```

**Deliberate choices**

- `organizations` and `guardians` exist from day one carrying **no MVP logic**. This is
  the cheapest way to keep future multi-tenancy and a second guardian possible without
  building enterprise tenancy now. Two degenerate tables, zero features.
- **Learner PII is minimized by schema, not by policy.** No photo column. No legal-name
  column. A column that does not exist cannot leak.
- Learner limit per family is a **configurable entitlement**, default 5 — never a constant.

## 2. Qur'an reference data — immutable, versioned (ADR-0007)

```
quran_sources  (id, name, riwayah, mushaf_edition, text_encoding, license, license_url,
                source_url, retrieved_at, content_hash, verification_status,
                approved_by, approved_at, version, provenance)
surahs         (number, name_ar, name_en, ayah_count, revelation_type)
ayat           (id, source_id, surah_no, ayah_no, text_uthmani, text_imlaei,
                page_no, juz, hizb, hizb_quarter, sajda, line_no, content_hash)
ayah_words     (id, ayah_id, position, text, char_start, char_end)
mushaf_pages   (edition, page_no, first_ayah_id, last_ayah_id, line_count)
```

- **Write-once.** A correction is a new source version, never an `UPDATE`.
- The application has **no write path** to these tables outside the verified import pipeline.
- `ayah_words` provides the word → ayah → page → juz mapping and anchors L1 alignment.
- `verification_status` starts at `technically_verified_pending_religious_approval` and
  may only be advanced by a qualified human reviewer.

## 3. Curriculum and planning

```
curricula          (id, type: preset|school|teacher|custom, owner_scope: system|family, name)
curriculum_items   (curriculum_id, sequence, scope_type: ayah_range|page|surah|juz, scope_ref)
learning_plans     (id, learner_id, curriculum_id, goal, daily_minutes, start_date,
                    version, status)
plan_segments      (id, plan_id, scope_ref, role: new|revision|consolidation,
                    target_date, status)
sessions           (id, learner_id, plan_id, scheduled_for, started_at, completed_at,
                    planned_minutes, actual_minutes, status)
session_activities (id, session_id, order, type: listen|read|repeat|recite|review,
                    segment_ref, outcome)
```

The AI adapts pace, repetition, and revision mix **within** the chosen curriculum. It
never reorders the family's chosen sequence.

## 4. Recitation and analysis — the vendor-neutral boundary (ADR-0006)

```
recitation_attempts    (id, learner_id, session_activity_id, target_segment_ref,
                        recorded_at, duration_ms, audio_object_key NULL,
                        retention_policy, audio_expires_at, device_class, status)
analysis_jobs          (id, attempt_id, provider_code, model, stage, status,
                        cost_estimate, latency_ms, requested_at, completed_at, error_code)
analysis_results       (id, attempt_id, job_id, schema_version, normalized_payload)
word_observations      (attempt_id, ayah_word_id,
                        status: correct|missed|substituted|inserted|hesitant|indeterminate,
                        confidence, t_start, t_end)
fluency_metrics        (attempt_id, pace_wpm, pause_count, longest_pause_ms, restarts)
tajweed_signals        (attempt_id, rule_code, measured_value, expected_range,
                        verdict, confidence, advisory)
confidence_assessments (attempt_id, band, overall_confidence, per_signal,
                        decision: feedback|advisory|abstain, reason_codes,
                        thresholds_version, policy_version)
delivered_feedback     (attempt_id, template_id, template_version, locale,
                        rendered_text, shown_at)
```

**Why split this way**

- `analysis_results.normalized_payload` is **our** schema. No vendor JSON reaches a
  learner-facing table or the UI.
- `confidence_assessments` is separate and carries `thresholds_version`, so every past
  decision stays explainable. We can answer *"why did the app tell my son he was wrong
  on 3 March?"*
- `delivered_feedback` records **what the child actually saw**, with the approved
  template version. Fully auditable.

## 5. Mastery — event-sourced, multidimensional (ADR-0010)

```
mastery_events (id, learner_id, scope_ref, source: ai|human|self_report|system_decay,
                dimension, delta, evidence_ref, confidence, occurred_at)   -- APPEND-ONLY
mastery_states (learner_id, scope_type, scope_ref,
                memorization, retention, accuracy, fluency, tajweed,
                last_success_at, success_streak, error_rate,
                next_review_due, evidence_count, teacher_verified_at,
                model_version)                                            -- PROJECTION
```

- **Five dimensions preserved separately forever.** A single UI progress figure may be
  computed for display; it is never stored as the truth.
- `mastery_states` is a projection of the ledger, never an independent truth.
- **Human corrections outrank AI.**
- Decay is a scheduled `system_decay` event stream.
- **SM-2 and FSRS are not adopted unexamined.** A Qur'an-specific scheduler v0 is built
  and validated against pilot data. Event sourcing is what makes that safe to iterate on.

## 6. Human review

```
reviewers          (user_id, qualification, credential_notes, verified_by, verified_at, scopes)
review_requests    (id, learner_id, attempt_id NULL,
                    reason: low_confidence|parent_request|milestone|random_audit|assessment,
                    priority, status, sla_due_at)
review_decisions   (review_request_id, reviewer_id, verdict, note, time_spent_s, created_at)
review_corrections (review_decision_id, scope_ref, dimension, corrected_value, rule_code NULL)
```

Corrections write `mastery_events` with `source = human` **and** become labelled data for
measuring AI accuracy — which is how reviewer/AI agreement gets measured in the pilot.

## 7. Content governance

```
content_artifacts  (id, type, version, status: draft|in_review|approved|deprecated,
                    approved_by, approved_at, content_hash, provenance, effective_from)
tajweed_rules      (rule_set_version, code, name_ar, name_en, definition_source,
                    measurable, detection_method, confidence_ceiling, status)
feedback_templates (id, code, locale, audience: child|parent|reviewer,
                    text, tone, severity, version, approval_status)
threshold_configs  (id, version, payload, approval_status)
```

`type` is one of: `quran_source`, `tajweed_rule_set`, `feedback_template`,
`threshold_config`, `curriculum_preset`, `reference_audio`.

**No religiously sensitive string or rule is hard-coded** in the Flutter app or in a
function. It is a row with a version, provenance, and an approval status. Until a
qualified reviewer approves it, it renders in a conservative, clearly-unverified mode.
This is what allows building before WS-1 resolves.

## 8. Entitlements, usage, cost

```
plan_tiers     (code, name, limits jsonb, active)   -- no hard-coded pricing
subscriptions  (family_account_id, tier_code, status, period_start, period_end, provider_ref)
usage_ledger   (family_account_id, learner_id, metric, amount, provider_code,
                model, cost_estimate, occurred_at)
```

Metrics: analysis minutes, attempts, human reviews consumed — tracked **per family and
per learner**. This is what makes staged analysis and quotas possible, which the unit
economics require.

## 9. Privacy and audit

```
consents      (family_account_id, learner_id,
               type: audio_processing|audio_retention|human_review|comms,
               granted_by, granted_at, revoked_at, policy_version)
access_audit  (actor_user_id, action, subject_type, subject_id, occurred_at, context)
data_requests (family_account_id, type: export|delete, status, completed_at)
```

**Every access to child audio writes an `access_audit` row.** No exceptions, including
reviewer and admin access.
