export function markAttemptStart(): number {
  return Date.now();
}

export function markAttemptEnd(): number {
  return Date.now();
}

export function getTaskStartTimeIso(startMs: number | null | undefined): string {
  return startMs ? new Date(startMs).toISOString() : new Date().toISOString();
}

export function getAttemptDurationSeconds(
  startMs: number | null | undefined,
  endMs: number | null | undefined
): number | null {
  if (!startMs) return null;
  const effectiveEnd = endMs ?? Date.now();
  return Math.max(0, Math.floor((effectiveEnd - startMs) / 1000));
}
