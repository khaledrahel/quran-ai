/**
 * Fixture provider — synthetic, deterministic, offline.
 *
 * WHY THIS EXISTS: provider selection is blocked on WS-4. The fixture adapter lets the
 * whole pipeline be built and tested now, and lets contract tests run in CI without
 * ever calling a paid API (ADR-0006, testing strategy).
 *
 * Its output is deliberately given an awkward, vendor-ish shape — snake_case keys,
 * seconds instead of milliseconds, a nested envelope, extra vendor metadata — so that
 * normalization has something realistic to strip. A fixture that already looked like
 * our schema would test nothing.
 *
 * NO REAL AUDIO. NO REAL QUR'AN TEXT. NO NETWORK CALLS.
 */

import type {
  AlignmentProvider,
  AnalysisRequest,
  AsrProvider,
  ProviderDescriptor,
  ProviderEnvelope,
  TajweedAnalyzer,
} from '../types.ts';
import { ProviderError } from '../types.ts';

// ---------------------------------------------------------------------------
// The deliberately vendor-shaped payload
// ---------------------------------------------------------------------------

/**
 * Exported for the normalizer and its tests only. Nothing outside
 * `normalization/` may import this type — that is the boundary.
 */
export interface FixtureVendorPayload {
  readonly request_id: string;
  readonly engine_version: string;
  readonly billing: { readonly units: number; readonly unit_price_usd: number };
  readonly result: {
    readonly overall_score: number;
    readonly tokens: readonly FixtureToken[];
    readonly timing: {
      readonly total_sec: number;
      readonly silence_windows: readonly (readonly [number, number])[];
      readonly restart_markers: readonly number[];
    };
    readonly prosody: readonly FixtureProsodySignal[];
  };
  /** Vendor noise that must not survive normalization. */
  readonly _internal: Record<string, unknown>;
}

export interface FixtureToken {
  readonly token_id: string;
  readonly idx: number;
  /** Vendor vocabulary, not ours. Mapped in normalization. */
  readonly state: 'ok' | 'skip' | 'sub' | 'ins' | 'slow' | 'unsure';
  readonly score: number;
  readonly t0_sec: number;
  readonly t1_sec: number;
}

export interface FixtureProsodySignal {
  readonly kind: string;
  readonly observed_sec: number;
  readonly expect_lo_sec: number;
  readonly expect_hi_sec: number;
  readonly score: number;
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

/**
 * Named scenarios so tests can exercise each confidence path deterministically.
 * `low_confidence` matters most: it must lead to abstention, never to telling a
 * child they were wrong.
 */
export type FixtureScenario =
  | 'perfect'
  | 'one_missed_word'
  | 'hesitant'
  | 'low_confidence'
  | 'tajweed_madd_short';

export interface FixtureOptions {
  readonly scenario?: FixtureScenario;
  /** Simulated failure, to prove failures never become learner-facing errors. */
  readonly failWith?: ProviderError;
}

const DESCRIPTOR: ProviderDescriptor = {
  code: 'fixture',
  model: 'fixture-v1',
  isFixture: true,
};

/** Deterministic pseudo-confidence so tests never flake. */
function scoreFor(scenario: FixtureScenario): number {
  switch (scenario) {
    case 'perfect':
      return 0.97;
    case 'one_missed_word':
      return 0.91;
    case 'hesitant':
      return 0.74;
    case 'tajweed_madd_short':
      return 0.88;
    case 'low_confidence':
      return 0.31;
  }
}

function buildTokens(request: AnalysisRequest, scenario: FixtureScenario): FixtureToken[] {
  const base = scoreFor(scenario);
  return request.expectedWords.map((word, i) => {
    let state: FixtureToken['state'] = 'ok';
    if (scenario === 'one_missed_word' && i === 1) state = 'skip';
    else if (scenario === 'hesitant' && i === 0) state = 'slow';
    else if (scenario === 'low_confidence') state = 'unsure';

    return {
      token_id: word.id,
      idx: word.position,
      state,
      score: state === 'unsure' ? 0.28 : base,
      t0_sec: i * 0.8,
      t1_sec: i * 0.8 + 0.7,
    };
  });
}

function buildProsody(scenario: FixtureScenario): FixtureProsodySignal[] {
  if (scenario !== 'tajweed_madd_short') return [];
  // Duration measurement only. The rule itself is approved content, not code.
  return [
    { kind: 'madd_duration', observed_sec: 0.42, expect_lo_sec: 0.8, expect_hi_sec: 1.2, score: 0.83 },
  ];
}

function buildPayload(request: AnalysisRequest, scenario: FixtureScenario): FixtureVendorPayload {
  const tokens = buildTokens(request, scenario);
  const totalSec = request.audioRef.durationMs / 1000;

  return {
    request_id: `fixture-${request.attemptId}`,
    engine_version: 'fixture-v1',
    billing: { units: Math.max(1, Math.ceil(totalSec)), unit_price_usd: 0 },
    result: {
      overall_score: scoreFor(scenario),
      tokens,
      timing: {
        total_sec: totalSec,
        silence_windows: scenario === 'hesitant' ? [[0.9, 2.6]] : [],
        restart_markers: scenario === 'hesitant' ? [2.6] : [],
      },
      prosody: buildProsody(scenario),
    },
    _internal: { trace: 'synthetic', region: 'none', cached: false },
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Implements all three interfaces: for fixtures a single synthetic engine is simpler
 * and adequate. Real providers will be separate implementations.
 */
export class FixtureProvider implements AsrProvider, AlignmentProvider, TajweedAnalyzer {
  readonly descriptor = DESCRIPTOR;
  private readonly options: FixtureOptions;

  constructor(options: FixtureOptions = {}) {
    this.options = options;
  }

  async recognize(request: AnalysisRequest): Promise<ProviderEnvelope> {
    return this.run(request);
  }

  async align(request: AnalysisRequest): Promise<ProviderEnvelope> {
    return this.run(request);
  }

  async analyze(request: AnalysisRequest): Promise<ProviderEnvelope> {
    return this.run(request);
  }

  private async run(request: AnalysisRequest): Promise<ProviderEnvelope> {
    if (this.options.failWith) throw this.options.failWith;

    if (request.audioRef.durationMs < 500) {
      throw new ProviderError('AUDIO_TOO_SHORT', DESCRIPTOR.code, 'Audio shorter than 500ms.');
    }
    if (request.expectedWords.length === 0) {
      throw new ProviderError('UNKNOWN', DESCRIPTOR.code, 'No expected words supplied.');
    }

    const scenario = this.options.scenario ?? 'perfect';
    const requestedAt = new Date(0).toISOString();
    const completedAt = new Date(1200).toISOString();

    return {
      providerCode: DESCRIPTOR.code,
      model: DESCRIPTOR.model,
      requestedAt,
      completedAt,
      latencyMs: 1200,
      costEstimateUsd: 0,
      payload: buildPayload(request, scenario),
    };
  }
}
