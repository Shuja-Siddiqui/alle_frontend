const LETTER_TO_PRIMARY_PHONEME: Record<string, string> = {
  A: "AE",
  B: "B",
  C: "K",
  D: "D",
  E: "EH",
  F: "F",
  G: "G",
  H: "HH",
  I: "IH",
  J: "JH",
  K: "K",
  L: "L",
  M: "M",
  N: "N",
  O: "AO",
  P: "P",
  Q: "K",
  R: "R",
  S: "S",
  T: "T",
  U: "AH",
  V: "V",
  W: "W",
  X: "K",
  Y: "Y",
  Z: "Z",
};

export function resolvePhonemeCode(input: string): string {
  const raw = String(input || "").trim().replace(/^\/|\/$/g, "");
  if (!raw) return "";
  const upper = raw.toUpperCase();
  return LETTER_TO_PRIMARY_PHONEME[upper] || upper;
}
