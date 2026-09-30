/**
 * Boundary invariant tests (ADR-0006, ADR-0007).
 *
 * These guard the two rules that would be hardest to detect if broken:
 *   - no vendor-shaped data downstream
 *   - no Qur'an text inside an analysis result
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import type { NormalizedAnalysisResult } from '../../shared/domain.ts';
import { ANALYSIS_SCHEMA_VERSION } from '../../shared/domain.ts';
import {
  BoundaryViolationError,
  assertNeutral,
  assertNoQuranText,
  sealResult,
} from './boundary.ts';

function neutralResult(): NormalizedAnalysisResult {
  return {
    schemaVersion: ANALYSIS_SCHEMA_VERSION,
    attemptId: 'attempt-1',
    target: { from: { surah: 114, ayah: 1 }, to: { surah: 114, ayah: 2 } },
    levels: ['L1', 'L2'],
    words: [
      {
        word: { id: 'w-1', ayah: { surah: 114, ayah: 1 }, position: 1 },
        status: 'correct',
        confidence: 0.95,
        startMs: 0,
        endMs: 700,
      },
    ],
    fluency: {
      durationMs: 3000,
      wordsPerMinute: 20,
      pauseCount: 0,
      longestPauseMs: 0,
      restartCount: 0,
    },
    tajweed: [],
    providerConfidence: 0.95,
    provenance: {
      providerCode: 'fixture',
      model: 'fixture-v1',
      requestedAt: '1970-01-01T00:00:00.000Z',
      completedAt: '1970-01-01T00:00:01.200Z',
      latencyMs: 1200,
      costEstimateUsd: 0,
    },
  };
}

describe('assertNeutral', () => {
  test('accepts a clean neutral result', () => {
    assert.doesNotThrow(() => assertNeutral(neutralResult()));
  });

  test('rejects a snake_case key anywhere in the tree', () => {
    const dirty = { ...neutralResult(), request_id: 'fixture-attempt-1' } as unknown;
    assert.throws(
      () => assertNeutral(dirty as NormalizedAnalysisResult),
      (e: unknown) => e instanceof BoundaryViolationError && /request_id/.test(e.message),
    );
  });

  test('rejects a vendor payload smuggled in a nested object', () => {
    const base = neutralResult();
    const dirty = {
      ...base,
      provenance: { ...base.provenance, payload: { engine: 'x' } },
    } as unknown;

    assert.throws(
      () => assertNeutral(dirty as NormalizedAnalysisResult),
      (e: unknown) => e instanceof BoundaryViolationError && /payload/.test(e.message),
    );
  });

  test('rejects vendor keys inside arrays', () => {
    const base = neutralResult();
    const dirty = {
      ...base,
      words: [{ ...base.words[0], raw: { score: 1 } }],
    } as unknown;

    assert.throws(() => assertNeutral(dirty as NormalizedAnalysisResult), BoundaryViolationError);
  });

  test('rejects a wrong schema version', () => {
    const dirty = { ...neutralResult(), schemaVersion: 99 } as unknown;
    assert.throws(
      () => assertNeutral(dirty as NormalizedAnalysisResult),
      (e: unknown) => e instanceof BoundaryViolationError && /schemaVersion/.test(e.message),
    );
  });

  test('reports every violation, not just the first', () => {
    const dirty = { ...neutralResult(), request_id: 'a', engine_version: 'b' } as unknown;
    try {
      assertNeutral(dirty as NormalizedAnalysisResult);
      assert.fail('expected a BoundaryViolationError');
    } catch (e) {
      assert.ok(e instanceof BoundaryViolationError);
      assert.equal(e.violations.length, 2);
    }
  });
});

describe('assertNoQuranText', () => {
  test('accepts a result containing only identifiers', () => {
    assert.doesNotThrow(() => assertNoQuranText(neutralResult()));
  });

  test('rejects Arabic script anywhere in the result', () => {
    // A single Arabic letter built from its code point: no word, no scripture,
    // and the source file stays pure ASCII. The guard is structural - ANY Arabic
    // script in an analysis result is wrong, because analysis carries ids only.
    const arabicLetter = String.fromCharCode(0x0645);
    const dirty = { ...neutralResult(), attemptId: arabicLetter } as unknown;

    assert.throws(
      () => assertNoQuranText(dirty as NormalizedAnalysisResult),
      (e: unknown) => e instanceof BoundaryViolationError && /Arabic script/.test(e.message),
    );
  });

  test('rejects Arabic script nested inside a word observation', () => {
    const base = neutralResult();
    const dirty = {
      ...base,
      words: [
        { ...base.words[0], word: { ...base.words[0]!.word, id: String.fromCharCode(0x0645) } },
      ],
    } as unknown;

    assert.throws(() => assertNoQuranText(dirty as NormalizedAnalysisResult), BoundaryViolationError);
  });
});

describe('sealResult', () => {
  test('applies both invariants and returns the result unchanged', () => {
    const input = neutralResult();
    assert.deepEqual(sealResult(input), input);
  });
});
