# Services

TypeScript backend (ADR-0002). **Not yet implemented.**

| Directory | Purpose | Phase |
|---|---|---|
| `content-pipeline/` | Qur'an source verification harness — protocol stages 1–5, 7 | P1, week 2 |
| `orchestrator/` | Analysis jobs, provider adapters, normalization, confidence, mastery | P5–P6 |
| `shared/` | Domain types shared across services | As needed |

## orchestrator/ layout

```
adapters/        AsrProvider / AlignmentProvider / TajweedAnalyzer implementations
normalization/   THE vendor boundary - vendor response -> our schema
confidence/      confidence engine (pure, deterministic, versioned thresholds)
mastery/         event -> projection, decay, scheduler v0
```

## Rules

- **No vendor-shaped data crosses `normalization/`.** (ADR-0006)
- `confidence/` and `mastery/` are **pure deterministic functions** so they can be tested
  exhaustively without audio or a vendor.
- Qur'an text is read-only; no service writes to `ayat` or `quran_sources`. (ADR-0007)
- No secrets in code.
- Contract tests use recorded fixtures and **never call a paid API**.

## Provider status

**No ASR/AI provider is selected.** Blocked on WS-4. Until then the orchestrator runs
against a fixture adapter, which is what keeps provider selection off the critical path.
