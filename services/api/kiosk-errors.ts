import { ApiError } from '@/services/api/client';

export type KioskErrorKind =
  | 'maintenance'
  | 'no_counters'
  | 'no_branches'
  | 'invalid_code'
  | 'network'
  | 'generic';

const NO_COUNTER_RE = /no counters configured/i;
const NO_BRANCH_RE = /no branches/i;
const MAINTENANCE_RE = /maintenance/i;

/** Classify API / validate failures for user-facing copy. */
export function classifyKioskError(error: unknown, fallbackMessage?: string): KioskErrorKind {
  if (error instanceof ApiError) {
    if (error.status === 503 || MAINTENANCE_RE.test(error.message)) {
      return 'maintenance';
    }
    if (NO_COUNTER_RE.test(error.message)) {
      return 'no_counters';
    }
  }

  const msg =
    (error instanceof Error ? error.message : null) ??
    (typeof fallbackMessage === 'string' ? fallbackMessage : '') ??
    '';

  if (MAINTENANCE_RE.test(msg)) return 'maintenance';
  if (NO_COUNTER_RE.test(msg)) return 'no_counters';
  if (NO_BRANCH_RE.test(msg)) return 'no_branches';

  return 'generic';
}

/** Prefer API maintenance text when present; otherwise use i18n fallback. */
export function resolveKioskErrorMessage(
  kind: KioskErrorKind,
  copy: {
    maintenance: string;
    noCounters: string;
    noBranches: string;
    invalidKioskCode: string;
    networkError: string;
    createError?: string;
  },
  rawMessage?: string | null,
): string {
  if (kind === 'maintenance') {
    return rawMessage && rawMessage.trim() && !/^HTTP\s*503/i.test(rawMessage)
      ? rawMessage
      : copy.maintenance;
  }
  if (kind === 'no_counters') return copy.noCounters;
  if (kind === 'no_branches') return copy.noBranches;
  if (kind === 'invalid_code') return copy.invalidKioskCode;
  if (kind === 'network') return copy.networkError;
  return rawMessage?.trim() || copy.createError || copy.networkError;
}
