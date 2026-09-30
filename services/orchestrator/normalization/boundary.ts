/**
 * THE VENDOR BOUNDARY (ADR-0006).
 *
 * Everything upstream may be vendor-shaped. Everything downstream is ours.
 * This module is the only place a vendor payload may be read.
 *
 * `assertNeutral` enforces the rule at RUNTIME as well as compile time, because the
 * failure mode this guards against is a normalizer quietly passing a vendor field
 * through — which types alone will not catch once `unknown` has been narrowed.
 */

import type { NormalizedAnalysisResult } from '../../shared/domain.ts';
import { ANALYSIS_SCHEMA_VERSION } from '../../shared/domain.ts';

/** Raised when vendor-shaped data is detected downstream of the boundary. */
export class BoundaryViolationError extends Error {
  readonly violations: readonly string[];

  constructor(violations: readonly string[], message: string) {
    super(message);
    this.name = 'BoundaryViolationError';
    this.violations = violations;
  }
}

/**
 * Keys that indicate a vendor shape survived normalization.
 *
 * Two families:
 *   1. snake_case — our neutral schema is exclusively camelCase, so any snake_case
 *      key is by definition foreign.
 *   2. known vendor-metadata names that happen to be camelCase or bare.
 *
 * This is a safety net, not a security control. It catches the realistic mistake:
 * spreading a vendor object into a result during a hurried change.
 */
const FORBIDDEN_KEY_PATTERNS: readonly RegExp[] = [
  /_/, // any snake_case key
  /^payload$/i,
  /^raw$/i,
  /^vendor$/i,
  /^engine$/i,
  /^billing$/i,
  /^tokens$/i,
  /^prosody$/i,
];

/** Our neutral schema has no field whose name legitimately contains an underscore. */
function isForbiddenKey(key: string): boolean {
  return FORBIDDEN_KEY_PATTERNS.some((p) => p.test(key));
}

function walk(value: unknown, path: string, violations: string[], seen: WeakSet<object>): void {
  if (value === null || typeof value !== 'object') return;

  // Cycles would mean a live object graph crossed the boundary — a violation itself.
  if (seen.has(value)) {
    violations.push(`${path}: circular reference (object graph crossed the boundary)`);
    return;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`, violations, seen));
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;
    if (isForbiddenKey(key)) {
      violations.push(`${childPath}: forbidden key "${key}" (vendor-shaped)`);
    }
    walk(child, childPath, violations, seen);
  }
}

/**
 * Throws unless `result` is free of vendor-shaped data.
 *
 * Call this at the end of EVERY normalizer. It is cheap, and it converts a silent
 * architectural erosion into a loud, immediate failure.
 */
export function assertNeutral(result: NormalizedAnalysisResult): NormalizedAnalysisResult {
  const violations: string[] = [];
  walk(result, '', violations, new WeakSet());

  if (result.schemaVersion !== ANALYSIS_SCHEMA_VERSION) {
    violations.push(
      `schemaVersion: expected ${ANALYSIS_SCHEMA_VERSION}, got ${String(result.schemaVersion)}`,
    );
  }

  if (violations.length > 0) {
    throw new BoundaryViolationError(
      violations,
      `Vendor-shaped data crossed the normalization boundary (ADR-0006): ${violations.join('; ')}`,
    );
  }

  return result;
}

/**
 * Guards against Qur'an text appearing in an analysis payload.
 *
 * Analysis references words and ayat by IDENTIFIER only. Qur'an text is resolved from
 * the verified source at read time and must never be embedded in, or copied through,
 * an analysis result (ADR-0007).
 *
 * The check is structural rather than linguistic: it flags any Arabic-script character
 * anywhere in the result. A normalized result should contain none at all.
 */
const ARABIC_SCRIPT = new RegExp('[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]');

export function assertNoQuranText(result: NormalizedAnalysisResult): NormalizedAnalysisResult {
  const violations: string[] = [];

  const scan = (value: unknown, path: string): void => {
    if (typeof value === 'string') {
      if (ARABIC_SCRIPT.test(value)) {
        violations.push(`${path}: contains Arabic script; analysis carries identifiers only`);
      }
      return;
    }
    if (value === null || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((item, i) => scan(item, `${path}[${i}]`));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      scan(child, path ? `${path}.${key}` : key);
    }
  };

  scan(result, '');

  if (violations.length > 0) {
    throw new BoundaryViolationError(
      violations,
      `Qur'an text must never appear in an analysis result (ADR-0007): ${violations.join('; ')}`,
    );
  }

  return result;
}

/** Both invariants. Every normalizer should return through this. */
export function sealResult(result: NormalizedAnalysisResult): NormalizedAnalysisResult {
  return assertNoQuranText(assertNeutral(result));
}
