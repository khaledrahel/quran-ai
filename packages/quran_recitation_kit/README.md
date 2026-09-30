# quran_recitation_kit

Custom Flutter package owning the recitation audio pipeline. **Not yet implemented** —
built in P4 (weeks 4–6).

## Why this package exists

FlutterFlow is strong for screens and awkward for microphone control, chunked recording,
encryption, offline queueing, and upload state. Equally important: FlutterFlow regenerates
its code, so anything written there is unversioned and untestable.

This package keeps the hardest and most safety-critical code in version control, under
test, and reviewable. See ADR-0011.

## Scope

- Microphone capture and permissions
- Voice activity detection and chunking
- **On-device encryption at rest, immediately**
- Offline queue with **TTL — never indefinite storage**
- Waveform rendering and recording state
- Upload with retry

## Out of scope

Analysis, transcription, confidence, and any provider call. Those are backend concerns
behind the adapter boundary (ADR-0006). This package captures audio and hands it over.

## Structure

```
lib/       implementation
test/      unit tests
example/   standalone harness app for real-device testing without FlutterFlow
```

The `example/` app matters: it lets audio behaviour be tested on real iOS and Android
hardware independently of the FlutterFlow seam.

## Rules

- No business logic, no thresholds, no religiously sensitive strings
- No secrets
- Never logs audio content
- FlutterFlow custom actions calling into this package are thin wrappers only

## Status

No `pubspec.yaml` yet, deliberately — no dependencies are installed during P0.
