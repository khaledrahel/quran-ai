# PDPL / Data Residency Review Plan (WS-4)

**Status:** OPEN — **blocking** · Owner: Khaled (PO) · Target: week 2

This is the most urgent non-engineering item in the project.

## What it blocks

- Production Supabase region
- Production storage configuration
- Production audio retention period
- Final ASR provider selection
- Final AI provider selection
- Creation of any production infrastructure

## What it does NOT block (Amendment 2)

- Local Supabase development
- Synthetic data
- Staging environment
- Provider-neutral interfaces
- Mocked and fixture-based AI/ASR responses
- Security and RLS testing
- The FlutterFlow spike
- Technical stages of Qur'an source evaluation

## Deliverables

1. **Obligations analysis** — Saudi PDPL requirements for children's personal data and
   for voice data, including whether voice is treated as biometric or special category.
2. **Transfer analysis** — conditions for cross-border transfer, and whether they can
   realistically be met.
3. **Provider assessment matrix** — candidate providers evaluated on:
   - Region availability (**verified, not assumed**)
   - Contractual data-use terms: zero retention, no training on customer data
   - Sub-processor list and their locations
   - Actual processing location, not just billing or marketing region
   - Certifications and audit reports
4. **Retention determination** — the permissible period for review-flagged child audio.
5. **Written recommendation** with residual risks stated explicitly.

## Key principle

> A provider having a Saudi region is **not sufficient**. Contractual terms,
> sub-processors, and actual processing location are all assessed.

## Resourcing

Likely requires a Saudi data-protection lawyer. This is an anticipated cost and should be
budgeted. First decision for the PO: engage counsel now, or begin with self-research and
engage counsel to review the conclusions.

## Progress log

| Date | Update | By |
|---|---|---|
| 2026-09-30 | Workstream opened. Not yet started. | Claude |
