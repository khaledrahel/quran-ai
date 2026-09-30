/**
 * Contract tests for the fixture provider + normalizer.
 *
 * These run entirely offline against synthetic fixtures. No provider, no network, no
 * real audio, no Qur'an text (testing strategy; ADR-0006).
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import type { AnalysisRequest } from '../adapters/types.ts';
import { ProviderError } from '../adapters/types.ts';
import { FixtureProvider } from '../adapters/fixture/fixture-provider.ts';
import { normalizeFixtureResult, NormalizationError } from './fixture-normalizer.ts';
import { ANALYSIS_SCHEMA_VERSION } from '../../shared/domain.ts';

/**
 * Synthetic request. Surah/ayah numbers are structural coordinates, not text.
 * Word ids are placeholders with no relationship to any real word identifier.
 */
function request(wordCount = 3): AnalysisRequest {
  return {
    attemptId: 'attempt-test-1',
    audioRef: {
      objectKey: 'synthetic/tone-3s.wav',
      durationMs: 3000,
      mimeType: 'audio/wav',
      sampleRateHz: 16_000,
    },
    target: { from: { surah: 114, ayah: 1 }, to: { surah: 114, ayah: 3 } },
    expectedWords: Array.from({ length: wordCount }, (_, i) => ({
      id: `synthetic-word-${i + 1}`,
      ayah: { surah: 114, ayah: 1 },
      position: i + 1,
    })),
    locale: 'ar',
  };
}

describe('FixtureProvider', () => {
  test('is marked as a fixture so it cannot be mistaken for production', async () => {
    const provider = new FixtureProvider();
    assert.equal(provider.descriptor.isFixture, true);
    assert.equal(provider.descriptor.code, 'fixture');
  });

  test('reports zero cost', async () => {
    const envelope = await new FixtureProvider().align(request());
    assert.equal(envelope.costEstimateUsd, 0);
  });

  test('rejects audio that is too short', async () => {
    const provider = new FixtureProvider();
    const tooShort: AnalysisRequest = {
      ...request(),
      audioRef: { ...request().audioRef, durationMs: 100 },
    };
    await assert.rejects(
      () => provider.align(tooShort),
      (e: unknown) => e instanceof ProviderError && e.code === 'AUDIO_TOO_SHORT',
    );
  });

  test('propagates a simulated provider failure as ProviderError', async () => {
    const provider = new FixtureProvider({
      failWith: new ProviderError('TIMEOUT', 'fixture', 'simulated timeout'),
    });
    await assert.rejects(
      () => provider.align(request()),
      (e: unknown) => e instanceof ProviderError && e.code === 'TIMEOUT',
    );
  });

  test('is deterministic - same input yields the same payload', async () => {
    const a = await new FixtureProvider({ scenario: 'hesitant' }).align(request());
    const b = await new FixtureProvider({ scenario: 'hesitant' }).align(request());
    assert.deepEqual(a.payload, b.payload);
  });
});

describe('normalizeFixtureResult', () => {
  test('produces a neutral result for a perfect recitation', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'perfect' }).align(req);
    const result = normalizeFixtureResult(envelope, req);

    assert.equal(result.schemaVersion, ANALYSIS_SCHEMA_VERSION);
    assert.equal(result.attemptId, req.attemptId);
    assert.equal(result.words.length, 3);
    assert.ok(result.words.every((w) => w.status === 'correct'));
    assert.deepEqual(result.levels, ['L1', 'L2']);
  });

  test('maps vendor vocabulary to ours', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'one_missed_word' }).align(req);
    const result = normalizeFixtureResult(envelope, req);

    // vendor "skip" -> our "missed"
    assert.equal(result.words[1]?.status, 'missed');
  });

  test('converts seconds to milliseconds', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'perfect' }).align(req);
    const result = normalizeFixtureResult(envelope, req);

    assert.equal(result.fluency.durationMs, 3000);
    assert.equal(result.words[0]?.startMs, 0);
    assert.equal(result.words[0]?.endMs, 700);
  });

  test('captures hesitation as fluency data, not as an error', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'hesitant' }).align(req);
    const result = normalizeFixtureResult(envelope, req);

    assert.equal(result.fluency.pauseCount, 1);
    assert.equal(result.fluency.longestPauseMs, 1700);
    assert.equal(result.fluency.restartCount, 1);
    assert.equal(result.words[0]?.status, 'hesitant');
  });

  test('low provider confidence maps to indeterminate, never to a claim of error', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'low_confidence' }).align(req);
    const result = normalizeFixtureResult(envelope, req);

    // The critical safety property: uncertainty must NOT become "missed"/"substituted".
    assert.ok(result.words.every((w) => w.status === 'indeterminate'));
    assert.ok(result.words.every((w) => w.status !== 'missed'));
    assert.ok(result.providerConfidence < 0.5);
  });

  test('tajweed signals are always advisory and reference an approved rule set version', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'tajweed_madd_short' }).align(req);
    const result = normalizeFixtureResult(envelope, req);

    assert.equal(result.tajweed.length, 1);
    const signal = result.tajweed[0]!;
    assert.equal(signal.advisory, true);
    assert.equal(signal.withinRange, false);
    assert.equal(signal.measuredMs, 420);
    // WS-1 is open, so no rule set is approved.
    assert.equal(signal.ruleSetVersion, 'unapproved');
    assert.ok(result.levels.includes('L4_LIMITED'));
  });

  test('accepts an explicit approved rule set version when one exists', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'tajweed_madd_short' }).align(req);
    const result = normalizeFixtureResult(envelope, req, { ruleSetVersion: 'ruleset-2026-01' });

    assert.equal(result.tajweed[0]?.ruleSetVersion, 'ruleset-2026-01');
  });

  test('drops vendor noise entirely', async () => {
    const req = request();
    const envelope = await new FixtureProvider({ scenario: 'perfect' }).align(req);
    const result = normalizeFixtureResult(envelope, req);

    const serialized = JSON.stringify(result);
    for (const vendorField of ['_internal', 'request_id', 'engine_version', 'billing', 'token_id']) {
      assert.ok(!serialized.includes(vendorField), `vendor field "${vendorField}" leaked`);
    }
  });

  test('keeps provider identity in provenance only, for cost and audit', async () => {
    const req = request();
    const envelope = await new FixtureProvider().align(req);
    const result = normalizeFixtureResult(envelope, req);

    assert.equal(result.provenance.providerCode, 'fixture');
    assert.equal(result.provenance.latencyMs, 1200);
    assert.equal(result.provenance.costEstimateUsd, 0);
  });

  test('rejects a malformed payload rather than guessing', () => {
    const envelope = {
      providerCode: 'fixture',
      model: 'fixture-v1',
      requestedAt: '1970-01-01T00:00:00.000Z',
      completedAt: '1970-01-01T00:00:01.200Z',
      latencyMs: 1200,
      costEstimateUsd: 0,
      payload: { nonsense: true },
    };

    assert.throws(() => normalizeFixtureResult(envelope, request()), NormalizationError);
  });

  test('rejects a token that was not in the expected word list', () => {
    const envelope = {
      providerCode: 'fixture',
      model: 'fixture-v1',
      requestedAt: '1970-01-01T00:00:00.000Z',
      completedAt: '1970-01-01T00:00:01.200Z',
      latencyMs: 1200,
      costEstimateUsd: 0,
      payload: {
        request_id: 'x',
        engine_version: 'fixture-v1',
        billing: { units: 1, unit_price_usd: 0 },
        result: {
          overall_score: 0.9,
          tokens: [{ token_id: 'not-expected', idx: 1, state: 'ok', score: 0.9, t0_sec: 0, t1_sec: 1 }],
          timing: { total_sec: 3, silence_windows: [], restart_markers: [] },
          prosody: [],
        },
        _internal: {},
      },
    };

    assert.throws(() => normalizeFixtureResult(envelope, request()), NormalizationError);
  });

  test('every scenario passes the boundary invariants', async () => {
    const scenarios = [
      'perfect',
      'one_missed_word',
      'hesitant',
      'low_confidence',
      'tajweed_madd_short',
    ] as const;

    for (const scenario of scenarios) {
      const req = request();
      const envelope = await new FixtureProvider({ scenario }).align(req);
      // normalizeFixtureResult calls sealResult internally; no throw == both invariants hold.
      const result = normalizeFixtureResult(envelope, req);
      assert.equal(result.schemaVersion, ANALYSIS_SCHEMA_VERSION, `scenario ${scenario}`);
    }
  });
});
