/** Number of stars used on mastery-check style summaries. */
export const MASTERY_STAR_COUNT = 5;

/**
 * Maps a correct/total score to a star count (0 … maxStars).
 * Uses proportional credit across all stars with partial rounds counting as a full star
 * (e.g. 7/10 with maxStars 5 → ceil(3.5) = 4). A perfect score yields maxStars.
 *
 * @param correct — Non-negative count of correct items (values below 0 are treated as 0).
 * @param total — Total items; must be positive for a non-zero denominator. If total ≤ 0, returns 0.
 * @param maxStars — Defaults to {@link MASTERY_STAR_COUNT}.
 */
export function starsFromCorrectTotal(
  correct: number,
  total: number,
  maxStars: number = MASTERY_STAR_COUNT
): number {
  if (!Number.isFinite(correct) || !Number.isFinite(total) || !Number.isFinite(maxStars)) {
    return 0;
  }
  if (total <= 0 || maxStars <= 0) {
    return 0;
  }
  const c = Math.max(0, correct);
  return Math.min(maxStars, Math.max(0, Math.ceil((c * maxStars) / total)));
}
