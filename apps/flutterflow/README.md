# apps/flutterflow — READ-ONLY MIRROR

**DO NOT HAND-EDIT ANYTHING IN THIS DIRECTORY.**

FlutterFlow regenerates this code. Any manual edit is silently overwritten and lost.

## How code arrives here

```
FlutterFlow  --push-->  flutterflow/main branch  --PR-->  main  -->  this directory
```

The PR step exists so every FlutterFlow change is reviewed before it lands.

## Where real logic goes instead

| Need | Where it lives |
|---|---|
| Audio, encryption, queueing, upload | `packages/quran_recitation_kit/` |
| Business logic, analysis, confidence, mastery | `services/` |
| Religiously sensitive text | `content_artifacts` rows, fetched at runtime |
| Secrets | Backend only — never here |

FlutterFlow custom actions are **thin wrappers** that call into the package. A few lines each.

## Never

- Hand-edit generated code
- Put business logic or thresholds in FlutterFlow
- Put a secret in FlutterFlow
- Let FlutterFlow call an AI provider directly — it goes through our backend

## Status

Empty. The FlutterFlow project is not yet connected. The week-1 spike (F7) validates
this seam before anything depends on it.
