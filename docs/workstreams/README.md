# Workstreams

Five parallel workstreams owned by the Product Owner. All are **OPEN** as of 2026-09-30.

These are procurement and discovery problems, not engineering problems. They have long
lead times and they gate the product's core trust claims. Engineering cannot resolve them.

| WS | Title | Owner | Blocks | Needed by | Status |
|----|-------|-------|--------|-----------|--------|
| WS-1 | Qualified Qur'an/Tajweed reviewer | PO | All religious approval | Week 6 | OPEN |
| WS-2 | Reviewer panel | PO | Human review loop (P7) | Week 8 | OPEN |
| WS-3 | Pilot families | PO | The pilot itself | Week 10 | OPEN |
| WS-4 | PDPL / residency review | PO | **Production + providers** | **Week 2** | OPEN — most urgent |
| WS-5 | Accounts and tooling | PO | Build, release, store | Week 2 | OPEN |

## The two that will hurt if they slip

**WS-4** blocks engineering directly — production infrastructure and provider selection
cannot proceed without it.

**WS-1** gates every religious accuracy claim the product makes. Without it, content
stays at `technically_verified_pending_religious_approval` and the product cannot make
public accuracy claims.

## Escalation

If a workstream misses its "needed by" date, the dependent phase is re-planned rather
than compressed. Per D12: **do not compress trust, Qur'an verification, child safety,
or privacy work to meet a date.**
