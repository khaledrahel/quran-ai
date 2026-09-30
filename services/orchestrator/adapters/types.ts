/**
 * Provider adapter interfaces — the OUTER side of the vendor boundary (ADR-0006).
 *
 * Adapters talk to providers and return a `ProviderEnvelope` whose `payload` is
 * explicitly opaque and vendor-shaped. That payload must be handed to
 * `normalization/` and must never travel anywhere else: not to the database, not to
 * the mastery engine, not to FlutterFlow.
 *
 * NO PROVIDER IS SELECTED. Provider selection is blocked on WS-4 (PDPL/residency and
 * contractual data-use review). The only implementation in the repository is a
 * fixture adapter, which is what lets the pipeline be built and tested meanwhile.
 */

import type { SegmentRef, WordRef } from '../../shared/domain.ts';

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

/**
 * A recitation attempt submitted for analysis.
 *
 * Audio is passed by reference, never by value: the orchestrator resolves a
 * short-TTL signed URL at call time. Keeping bytes out of this structure means audio
 * is never incidentally logged, serialized into a job record, or retained beyond its
 * lifecycle (ADR-0008).
 */
export interface AnalysisRequest {
  readonly attemptId: string;
  readonly audioRef: AudioRef;
  /** What the learner was asked to recite. Alignment runs against KNOWN text. */
  readonly target: SegmentRef;
  /**
   * Expected word sequence, by identifier only — never Qur'an text (ADR-0007).
   * Aligning against a known sequence is far cheaper and more reliable than open
   * transcription, which is why L1 is achievable at MVP.
   */
  readonly expectedWords: readonly WordRef[];
  readonly locale: 'ar';
}

export interface AudioRef {
  readonly objectKey: string;
  readonly durationMs: number;
  readonly mimeType: string;
  readonly sampleRateHz: number;
}

// ---------------------------------------------------------------------------
// Envelope — vendor-shaped, quarantined
// ---------------------------------------------------------------------------

/**
 * Opaque vendor response.
 *
 * Typed as `unknown` deliberately: the type system then forbids reading fields off it
 * anywhere except a normalizer that has explicitly narrowed it. This makes the
 * boundary a compile-time guarantee rather than a convention.
 */
export type VendorPayload = unknown;

export interface ProviderEnvelope {
  readonly providerCode: string;
  readonly model: string;
  readonly requestedAt: string;
  readonly completedAt: string;
  readonly latencyMs: number;
  readonly costEstimateUsd: number;
  /** DO NOT READ outside normalization. See ADR-0006. */
  readonly payload: VendorPayload;
}

// ---------------------------------------------------------------------------
// Provider interfaces
// ---------------------------------------------------------------------------

export interface ProviderDescriptor {
  readonly code: string;
  readonly model: string;
  /** True only for fixtures. A fixture must never be usable in production by accident. */
  readonly isFixture: boolean;
}

/** Speech recognition. Returns vendor-shaped output for normalization. */
export interface AsrProvider {
  readonly descriptor: ProviderDescriptor;
  recognize(request: AnalysisRequest): Promise<ProviderEnvelope>;
}

/** Forced alignment of audio against the known expected word sequence (L1). */
export interface AlignmentProvider {
  readonly descriptor: ProviderDescriptor;
  align(request: AnalysisRequest): Promise<ProviderEnvelope>;
}

/**
 * Duration-measurable tajweed signals only (L4-limited, advisory).
 *
 * An analyzer MEASURES; it never decides what a rule is. Rule definitions are
 * versioned, human-approved content (ADR-0007, ADR-0009).
 */
export interface TajweedAnalyzer {
  readonly descriptor: ProviderDescriptor;
  analyze(request: AnalysisRequest): Promise<ProviderEnvelope>;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export type ProviderErrorCode =
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'AUDIO_UNREADABLE'
  | 'AUDIO_TOO_SHORT'
  | 'PROVIDER_UNAVAILABLE'
  | 'UNSUPPORTED_LOCALE'
  | 'UNKNOWN';

export class ProviderError extends Error {
  readonly code: ProviderErrorCode;
  readonly providerCode: string;

  constructor(code: ProviderErrorCode, providerCode: string, message: string) {
    super(message);
    this.name = 'ProviderError';
    this.code = code;
    this.providerCode = providerCode;
  }
}

/**
 * A provider failure must never become negative feedback to a child. It results in
 * abstention, and may create a review request. See ADR-0009 and the LOW-confidence
 * behaviour in docs/product/mvp-scope.md.
 */
export const PROVIDER_FAILURE_IS_NEVER_LEARNER_ERROR = true as const;
