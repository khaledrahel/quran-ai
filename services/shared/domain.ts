/**
 * Shared domain types — the vendor-neutral vocabulary of the analysis pipeline.
 *
 * Everything downstream of the adapter boundary speaks only these types
 * (ADR-0006). No provider-specific shape may appear here, ever.
 *
 * NOTE ON QUR'AN CONTENT: nothing in this file contains Qur'an text. Segments and
 * words are referenced by *identifier only*. Text is resolved from the verified,
 * approved source at read time and is never generated, normalized, or carried
 * inside an analysis payload (ADR-0007).
 */

// ---------------------------------------------------------------------------
// Content references — identifiers, never text
// ---------------------------------------------------------------------------

/** Structural coordinates of an ayah. Numbers only; carries no text. */
export interface AyahRef {
  readonly surah: number;
  readonly ayah: number;
}

/** A contiguous range of ayat assigned for practice. */
export interface SegmentRef {
  readonly from: AyahRef;
  readonly to: AyahRef;
}

/**
 * A word position within an ayah. `id` is an opaque identifier from the verified
 * source. There is deliberately no `text` field: analysis never handles Qur'an text.
 */
export interface WordRef {
  readonly id: string;
  readonly ayah: AyahRef;
  readonly position: number;
}

// ---------------------------------------------------------------------------
// Analysis levels (docs/product/mvp-scope.md)
// ---------------------------------------------------------------------------

/**
 * L1 word correctness · L2 fluency · L4 duration-measurable tajweed (advisory).
 * L3 (makhraj) is deliberately absent: it is not offered in MVP and is routed to
 * human review instead.
 */
export type AnalysisLevel = 'L1' | 'L2' | 'L4_LIMITED';

// ---------------------------------------------------------------------------
// L1 — word observations
// ---------------------------------------------------------------------------

export type WordStatus =
  | 'correct'
  | 'missed'
  | 'substituted'
  | 'inserted'
  | 'hesitant'
  /** The provider could not determine this word. Not an error by the learner. */
  | 'indeterminate';

export interface WordObservation {
  readonly word: WordRef;
  readonly status: WordStatus;
  /** Provider-derived certainty for this word, normalized to 0..1. */
  readonly confidence: number;
  readonly startMs?: number;
  readonly endMs?: number;
}

// ---------------------------------------------------------------------------
// L2 — fluency
// ---------------------------------------------------------------------------

export interface FluencyMetrics {
  readonly durationMs: number;
  readonly wordsPerMinute: number;
  readonly pauseCount: number;
  readonly longestPauseMs: number;
  readonly restartCount: number;
}

// ---------------------------------------------------------------------------
// L4 (limited) — advisory tajweed signals
// ---------------------------------------------------------------------------

/**
 * A measured tajweed signal.
 *
 * `ruleCode` refers to an approved `tajweed_rules` row — it is NOT a rule definition.
 * No tajweed rule is ever defined in code (ADR-0007, ADR-0009); rules are versioned,
 * human-approved content.
 *
 * `advisory` is `true` for every MVP signal and is structurally non-optional so a
 * signal cannot be emitted as authoritative by omission.
 */
export interface TajweedSignal {
  readonly ruleCode: string;
  readonly ruleSetVersion: string;
  readonly measuredMs: number;
  readonly expectedMinMs: number;
  readonly expectedMaxMs: number;
  readonly withinRange: boolean;
  readonly confidence: number;
  readonly advisory: true;
}

// ---------------------------------------------------------------------------
// The normalized result — the only analysis shape that may cross the boundary
// ---------------------------------------------------------------------------

/** Incremented when the neutral schema changes, so stored results stay interpretable. */
export const ANALYSIS_SCHEMA_VERSION = 1 as const;

export interface NormalizedAnalysisResult {
  readonly schemaVersion: typeof ANALYSIS_SCHEMA_VERSION;
  readonly attemptId: string;
  readonly target: SegmentRef;
  readonly levels: readonly AnalysisLevel[];
  readonly words: readonly WordObservation[];
  readonly fluency: FluencyMetrics;
  readonly tajweed: readonly TajweedSignal[];
  /** Overall provider certainty, 0..1. An INPUT to our confidence engine, never the decision. */
  readonly providerConfidence: number;
  readonly provenance: AnalysisProvenance;
}

/**
 * Which provider produced this result, and what it cost.
 *
 * This is the ONLY place a provider is named downstream, and it is metadata about
 * the analysis — not analysis data. It exists for cost accounting, auditability, and
 * the "which vendor received what" question WS-4 will ask. It carries no vendor payload.
 */
export interface AnalysisProvenance {
  readonly providerCode: string;
  readonly model: string;
  readonly requestedAt: string;
  readonly completedAt: string;
  readonly latencyMs: number;
  readonly costEstimateUsd: number;
}

// ---------------------------------------------------------------------------
// Confidence (types only)
// ---------------------------------------------------------------------------

/**
 * LOW means abstain: never tell the child they were wrong, never invent a correction.
 * See docs/product/mvp-scope.md and ADR-0009.
 */
export type ConfidenceBand = 'HIGH' | 'MEDIUM' | 'LOW';

export type ConfidenceDecision = 'feedback' | 'advisory' | 'abstain';

/**
 * Stored separately from the analysis result (ADR-0009) and carries the threshold
 * version that produced it, so every past decision stays explainable.
 *
 * The engine itself is NOT implemented here: its thresholds are versioned,
 * human-approvable content (`threshold_config`), which is blocked on WS-1.
 */
export interface ConfidenceAssessment {
  readonly attemptId: string;
  readonly band: ConfidenceBand;
  readonly decision: ConfidenceDecision;
  readonly overallConfidence: number;
  readonly reasonCodes: readonly string[];
  readonly thresholdsVersion: string;
  readonly policyVersion: string;
}
