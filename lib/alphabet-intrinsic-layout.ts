/**
 * Shared alphabet **word-row** layout for SVG letters.
 *
 * **Reuse:** Import `computeWordLetterSlotLayout` (and optionally `alphabetIntrinsicWidthRatio`)
 * from any UI that renders words via `AlphabetDisplay` — e.g. `WordStatusBox`, `SentenceStatusBox`,
 * or future pages. Pass the returned `capHeight` as `letterHeight` / fallback `letterWidth`, and
 * pass `slotWidthsPx` as `AlphabetDisplay`’s `perLetterSlotWidths`.
 *
 * Width/height ratios come from `public/assets/alphabets/letter-*-default.svg` viewBoxes
 * (default/done/error match for letters checked).
 */

/** Use as `innerRowMaxPx` when the row is not width-capped (e.g. each word in a wrapping sentence). */
export const ALPHABET_ROW_UNCONSTRAINED_WIDTH = Number.MAX_SAFE_INTEGER;const ALPHABET_INTRINSIC_WIDTH_RATIO: Record<string, number> = {
  A: 135 / 135,
  B: 108 / 135,
  C: 121 / 135,
  D: 117 / 135,
  E: 95 / 135,
  F: 93 / 135,
  G: 122 / 135,
  H: 119 / 135,
  I: 33 / 135,
  J: 93 / 135,
  K: 119 / 135,
  L: 89 / 135,
  M: 151 / 135,
  N: 115 / 135,
  O: 126 / 135,
  P: 105 / 135,
  Q: 118 / 135,
  R: 110 / 135,
  S: 108 / 135,
  T: 115 / 135,
  U: 113 / 135,
  V: 135 / 135,
  W: 191 / 135,
  X: 127 / 136,
  Y: 132 / 135,
  Z: 107 / 135,
};

const DEFAULT_WIDTH_RATIO = 115 / 135;

/** viewBox width ÷ height for a single A–Z letter (matches default SVG set). */
export function alphabetIntrinsicWidthRatio(letter: string): number {
  const key = letter.toUpperCase();
  if (!/^[A-Z]$/.test(key)) return DEFAULT_WIDTH_RATIO;
  return ALPHABET_INTRINSIC_WIDTH_RATIO[key] ?? DEFAULT_WIDTH_RATIO;
}

export type WordSlotLayout = {
  /** Shared cap height for every letter in the row */
  capHeight: number;
  /** Slot width in px per letter, same order as `letters` */
  slotWidthsPx: number[];
};

/**
 * Picks a cap height and per-letter slot widths so the row fits `innerRowMaxPx`,
 * preserves uniform letter height, and uses intrinsic SVG proportions for width.
 */
export function computeWordLetterSlotLayout(args: {
  letters: string[];
  capHeightMax: number;
  gap: number;
  innerRowMaxPx: number;
}): WordSlotLayout {
  const { letters, capHeightMax, gap, innerRowMaxPx } = args;
  if (letters.length === 0) {
    return { capHeight: capHeightMax, slotWidthsPx: [] };
  }

  const ratios = letters.map((ch) => alphabetIntrinsicWidthRatio(ch));
  const sumRatio = ratios.reduce((a, b) => a + b, 0);
  const gapTotal = Math.max(0, letters.length - 1) * gap;
  const rowContentBudget = Math.max(1, innerRowMaxPx - gapTotal);
  const heightFromRow = rowContentBudget / sumRatio;
  const capHeight = Math.min(capHeightMax, heightFromRow);

  let slotWidthsPx = ratios.map((r) => Math.round(capHeight * r));

  const rowTotal = () => slotWidthsPx.reduce((s, w) => s + w, 0) + gapTotal;

  while (rowTotal() > innerRowMaxPx) {
    const maxW = Math.max(...slotWidthsPx);
    const idx = slotWidthsPx.findIndex((w) => w === maxW);
    if (idx === -1 || slotWidthsPx[idx] <= 1) break;
    slotWidthsPx[idx] -= 1;
  }

  return { capHeight, slotWidthsPx };
}
