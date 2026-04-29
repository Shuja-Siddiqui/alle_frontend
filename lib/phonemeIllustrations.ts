export type PhonemeIllustration = {
  emoji: string;
  label: string;
  cdnUrl: string;
};

const OPENMOJI_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg";

const EMOJI_HEX_BY_PHONEME: Record<string, { hex: string; emoji: string; label: string }> = {
  // Consonants
  M: { hex: "1F468", emoji: "👨", label: "man" },
  N: { hex: "1F44A", emoji: "👊", label: "knock" },
  P: { hex: "1F388", emoji: "🎈", label: "pop" },
  T: { hex: "1F338", emoji: "🌸", label: "tap" },
  K: { hex: "1F431", emoji: "🐱", label: "cat" },
  B: { hex: "1F3C0", emoji: "🏀", label: "ball" },
  D: { hex: "1F43A", emoji: "🐺", label: "dog" },
  G: { hex: "1F389", emoji: "🎉", label: "go" },
  S: { hex: "1F440", emoji: "👀", label: "see" },
  F: { hex: "1F41F", emoji: "🐟", label: "fish" },
  R: { hex: "1F697", emoji: "🚗", label: "red car" },
  W: { hex: "1F4A7", emoji: "💧", label: "water" },
  Y: { hex: "1F9A9", emoji: "🦩", label: "yo-yo style sound" },
  HH: { hex: "1F3E0", emoji: "🏠", label: "house" },
  CH: { hex: "1F366", emoji: "🍦", label: "chill" },
  JH: { hex: "1F95B", emoji: "🥛", label: "jug" },

  // Vowels
  AE: { hex: "1F34E", emoji: "🍎", label: "apple" },
  IH: { hex: "1F99E", emoji: "🦞", label: "igloo-like short i" },
  AO: { hex: "1F34A", emoji: "🍊", label: "orange" },
  AA: { hex: "1F40F", emoji: "🐏", label: "father sound" },
  EH: { hex: "1F413", emoji: "🐓", label: "egg sound" },
  IY: { hex: "1F95D", emoji: "🥝", label: "eat sound" },
  OW: { hex: "1F989", emoji: "🦉", label: "owl" },
  AH: { hex: "1F98B", emoji: "🦋", label: "umbrella sound" },
};

const DEFAULT_ILLUSTRATION = { hex: "1F31F", emoji: "🌟", label: "sound" };

export function getPhonemeIllustration(phonemeCode: string): PhonemeIllustration {
  const key = String(phonemeCode || "").trim().toUpperCase();
  const resolved = EMOJI_HEX_BY_PHONEME[key] || DEFAULT_ILLUSTRATION;
  return {
    emoji: resolved.emoji,
    label: resolved.label,
    cdnUrl: `${OPENMOJI_CDN_BASE}/${resolved.hex}.svg`,
  };
}

