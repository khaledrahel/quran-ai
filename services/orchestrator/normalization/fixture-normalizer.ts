/**
 * Normalizer for the fixture provider.
 *
 * This is the reference implementation of a normalizer: every real provider will get
 * one of these, and only this file family may read a vendor payload (ADR-0006).
 *
 * Responsibilities:
 *   1. Narrow the opaque `unknown` payload, validating as it goes
 *   2. Translate vendor vocabulary into ours (`skip` -> `missed`, seconds -> ms, ...)
 *   3. Drop vendor noise entirely
 *   4. Return through `sealResult`, which enforces both invariants
 */

import type {
  AnalysisLevel,
  FluencyMetrics,
  NormalizedAnalysisResult,
  TajweedSignal,
  WordObservation,
  WordStatus,
} from '../../shared/domain.ts';
import { ANALYSIS_SCHEMA_VERSION } from '../../shared/domain.ts';
import type { AnalysisRequest, ProviderEnvelope } from '../adapters/types.ts';
import type {
  FixtureProsodySignal,
  FixtureToken,
  FixtureVendorPayload,
} from '../adapters/fixture/fixture-provider.ts';
import { sealResult } from './boundary.ts';

export class NormalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NormalizationError';
  }
}

/** Vendor vocabulary -> ours. Anything unrecognized becomes `indeterminate`, never an error. */
const STATUS_MAP: Record<FixtureToken['state'], WordStatus> = {
  ok: 'correct',
  skip: 'missed',
  sub: 'substituted',
  ins: 'inserted',
  slow: 'hesitant',
  unsure: 'indeterminate',
};

function secToMs(seconds: number): number {
  return Math.round(seconds * 1000);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validates the opaque payload before any field is read.
 * An unparseable payload is a normalization failure — never learner-facing feedback.
 */
function narrow(payload: unknown): FixtureVendorPayload {
  if (!isRecord(payload)) throw new NormalizationError('Payload is not an object.');
  const result = payload['result'];
  if (!isRecord(result)) throw new NormalizationError('Payload missing "result".');
  if (!Array.isArray(result['tokens'])) throw new NormalizationError('Payload missing "result.tokens".');
  if (!isRecord(result['timing'])) throw new NormalizationError('Payload missing "result.timing".');
  if (typeof result['overall_score'] !== 'number') {
    throw new NormalizationError('Payload missing "result.overall_score".');
  }
  return payload as unknown as FixtureVendorPayload;
}

function normalizeWords(
  tokens: readonly FixtureToken[],
  request: AnalysisRequest,
): WordObservation[] {
  const byId = new Map(request.expectedWords.map((w) => [w.id, w]));

  return tokens.map((token) => {
    const word = byId.get(token.token_id);
    if (!word) {
      throw new NormalizationError(
        `Provider returned token "${token.token_id}" that is not in the expected word list.`,
      );
    }
    // Unknown vendor states degrade to `indeterminate` rather than throwing: an
    // unrecognized state must never become a claim that the child was wrong.
    const status: WordStatus = STATUS_MAP[token.state] ?? 'indeterminate';

    return {
      word,
      status,
      confidence: clamp01(token.score),
      startMs: secToMs(token.t0_sec),
      endMs: secToMs(token.t1_sec),
    };
  });
}

function normalizeFluency(payload: FixtureVendorPayload, wordCount: number): FluencyMetrics {
  const timing = payload.result.timing;
  const durationMs = secToMs(timing.total_sec);
  const minutes = durationMs / 60_000;
  const pauses = timing.silence_windows;

  const longestPauseMs = pauses.reduce((max, [start, end]) => {
    const span = secToMs(end - start);
    return span > max ? span : max;
  }, 0);

  return {
    durationMs,
    wordsPerMinute: minutes > 0 ? Math.round(wordCount / minutes) : 0,
    pauseCount: pauses.length,
    longestPauseMs,
    restartCount: timing.restart_markers.length,
  };
}

/**
 * Tajweed signals are MEASUREMENTS, not judgements.
 *
 * `ruleCode` refers to an approved `tajweed_rules` row; this function never defines a
 * rule. `advisory: true` is set unconditionally — in MVP no tajweed signal is
 * authoritative (mvp-scope.md).
 *
 * `ruleSetVersion` is supplied by the caller from approved content. Until WS-1
 * produces a qualified reviewer, callers pass `unapproved`, which downstream must
 * treat as non-authoritative.
 */
function normalizeTajweed(
  signals: readonly FixtureProsodySignal[],
  ruleSetVersion: string,
): TajweedSignal[] {
  return signals.map((signal) => {
    const measuredMs = secToMs(signal.observed_sec);
    const expectedMinMs = secToMs(signal.expect_lo_sec);
    const expectedMaxMs = secToMs(signal.expect_hi_sec);

    return {
      ruleCode: signal.kind,
      ruleSetVersion,
      measuredMs,
      expectedMinMs,
      expectedMaxMs,
      withinRange: measuredMs >= expectedMinMs && measuredMs <= expectedMaxMs,
      confidence: clamp01(signal.score),
      advisory: true,
    };
  });
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export interface NormalizeOptions {
  /**
   * Version of the approved tajweed rule set.
   * Defaults to `unapproved` because WS-1 is open and no rule set is approved.
   */
  readonly ruleSetVersion?: string;
}

export function normalizeFixtureResult(
  envelope: ProviderEnvelope,
  request: AnalysisRequest,
  options: NormalizeOptions = {},
): NormalizedAnalysisResult {
  const payload = narrow(envelope.payload);
  const words = normalizeWords(payload.result.tokens, request);
  const tajweed = normalizeTajweed(
    payload.result.prosody,
    options.ruleSetVersion ?? 'unapproved',
  );

  const levels: AnalysisLevel[] = ['L1', 'L2'];
  if (tajweed.length > 0) levels.push('L4_LIMITED');

  const result: NormalizedAnalysisResult = {
    schemaVersion: ANALYSIS_SCHEMA_VERSION,
    attemptId: request.attemptId,
    target: request.target,
    levels,
    words,
    fluency: normalizeFluency(payload, words.length),
    tajweed,
    providerConfidence: clamp01(payload.result.overall_score),
    provenance: {
      providerCode: envelope.providerCode,
      model: envelope.model,
      requestedAt: envelope.requestedAt,
      completedAt: envelope.completedAt,
      latencyMs: envelope.latencyMs,
      costEstimateUsd: envelope.costEstimateUsd,
    },
  };

  // Vendor noise (`_internal`, `billing`, `request_id`, `engine_version`) is simply
  // never read. sealResult proves none of it leaked.
  return sealResult(result);
}
