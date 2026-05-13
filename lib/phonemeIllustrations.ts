export type PhonemeIllustration = {
  emoji: string;
  label: string;
  cdnUrl: string;
};

const OPENMOJI_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg";

type IllustrationEntry = { hex: string; emoji: string; label: string };

/**
 * Primary illustration map keyed by alphabet letter (A-Z).
 * Each letter maps to an OpenMoji image of an object that represents
 * the canonical phonics mnemonic for that letter (e.g. "A is for apple").
 */
const LETTER_ILLUSTRATIONS: Record<string, IllustrationEntry> = {
  A: { hex: "1F34E", emoji: "🍎", label: "apple" },
  B: { hex: "1F3C0", emoji: "🏀", label: "ball" },
  C: { hex: "1F431", emoji: "🐱", label: "cat" },
  D: { hex: "1F436", emoji: "🐶", label: "dog" },
  E: { hex: "1F95A", emoji: "🥚", label: "egg" },
  F: { hex: "1FAAD", emoji: "🪭", label: "fan" },
  G: { hex: "1F36C", emoji: "🍬", label: "gum" },
  H: { hex: "1F3A9", emoji: "🎩", label: "hat" },
  I: { hex: "1F41B", emoji: "🐛", label: "insect" },
  J: { hex: "1F353", emoji: "🍓", label: "jam" },
  K: { hex: "1FA81", emoji: "🪁", label: "kite" },
  L: { hex: "1F4A1", emoji: "💡", label: "lamp" },
  M: { hex: "1F42D", emoji: "🐭", label: "mouse" },
  N: { hex: "1F443", emoji: "👃", label: "nose" },
  O: { hex: "1F419", emoji: "🐙", label: "octopus" },
  P: { hex: "1F437", emoji: "🐷", label: "pig" },
  Q: { hex: "1F451", emoji: "👑", label: "queen" },
  R: { hex: "1FAA8", emoji: "🪨", label: "rock" },
  S: { hex: "2600", emoji: "☀️", label: "sun" },
  T: { hex: "1F9B7", emoji: "🦷", label: "tooth" },
  U: { hex: "2602", emoji: "☂️", label: "umbrella" },
  V: { hex: "1F3BB", emoji: "🎻", label: "violin" },
  W: { hex: "1F682", emoji: "🚂", label: "wagon" },
  X: { hex: "1FA7B", emoji: "🩻", label: "x-ray" },
  Y: { hex: "1FA80", emoji: "🪀", label: "yo-yo" },
  Z: { hex: "1F993", emoji: "🦓", label: "zebra" },
};

/**
 * ARPAbet/CMU phoneme code -> representative letter.
 * The phoneme catalog passes phoneme codes (e.g. "AE", "K", "HH"); we resolve
 * each to the letter whose illustration best represents that sound.
 *
 * For phonemes shared by multiple letters (e.g. /k/ from C, K, Q, X) we pick
 * the canonical phonics-intro letter (here: C for "cat"). Change the value
 * below if you'd prefer a different letter to win the tie.
 */
const PHONEME_TO_LETTER: Record<string, string> = {
  // Consonants
  B: "B",
  D: "D",
  F: "F",
  G: "G",
  HH: "H",
  JH: "J",
  K: "C",
  L: "L",
  M: "M",
  N: "N",
  P: "P",
  R: "R",
  S: "S",
  T: "T",
  V: "V",
  W: "W",
  Y: "Y",
  Z: "Z",
  CH: "C",

  // Vowels
  AE: "A",
  AA: "A",
  AH: "U",
  AO: "O",
  EH: "E",
  IH: "I",
  IY: "E",
  OW: "O",
};

const DEFAULT_ILLUSTRATION: IllustrationEntry = {
  hex: "1F31F",
  emoji: "🌟",
  label: "sound",
};

function resolveEntry(input: string): IllustrationEntry {
  const key = String(input || "").trim().toUpperCase();
  if (!key) return DEFAULT_ILLUSTRATION;

  if (LETTER_ILLUSTRATIONS[key]) return LETTER_ILLUSTRATIONS[key];

  const letter = PHONEME_TO_LETTER[key];
  if (letter && LETTER_ILLUSTRATIONS[letter]) return LETTER_ILLUSTRATIONS[letter];

  return DEFAULT_ILLUSTRATION;
}

/**
 * Accepts either a single alphabet letter (A-Z) or an ARPAbet phoneme code
 * (e.g. "AE", "HH", "JH"). Returns the matching OpenMoji illustration.
 */
export function getPhonemeIllustration(phonemeCode: string): PhonemeIllustration {
  const resolved = resolveEntry(phonemeCode);
  return {
    emoji: resolved.emoji,
    label: resolved.label,
    cdnUrl: `${OPENMOJI_CDN_BASE}/${resolved.hex}.svg`,
  };
}

/** Convenience helper for callers that already have a single letter (A-Z). */
export function getLetterIllustration(letter: string): PhonemeIllustration {
  return getPhonemeIllustration(letter);
}
