/**
 * Converts text (word, sentence, or alphabet) into an array of letter data
 * that can be used to display alphabet SVGs.
 * 
 * @param text - The text to convert (e.g., "apple", "I have car", "A")
 * @param variant - The variant to use: "default", "done", or "error"
 * @returns Array of letter data objects with character and SVG path
 */
export type AlphabetVariant = "default" | "done" | "error";

export type LetterData = {
  /** The character (letter, space, or punctuation) */
  char: string;
  /** Whether this is a letter (A-Z, a-z) */
  isLetter: boolean;
  /** Whether this is a space */
  isSpace: boolean;
  /** SVG path for the letter (null for spaces/punctuation) */
  svgPath: string | null;
  /** Variant of the letter (default, done, error) */
  variant?: AlphabetVariant;
};

/**
 * Gets the SVG path for a letter with a specific variant
 * File naming: Letter=A, State=Default.svg
 */
function getLetterSvgPath(letter: string, variant: AlphabetVariant = "default"): string {
  const uppercaseLetter = letter.toUpperCase();
  const stateName = variant.charAt(0).toUpperCase() + variant.slice(1); // "default" -> "Default"
  return `/assets/alphabets/Letter=${uppercaseLetter}, State=${stateName}.svg`;
}

export function textToAlphabet(text: string, variant: AlphabetVariant = "default"): LetterData[] {
  if (!text) return [];

  return text.split('').map((char) => {
    const isLetter = /[a-zA-Z]/.test(char);
    const isSpace = char === ' ';

    // For letters, create SVG path using the naming pattern
    let svgPath: string | null = null;
    if (isLetter) {
      svgPath = getLetterSvgPath(char, variant);
    }

    return {
      char,
      isLetter,
      isSpace,
      svgPath,
      variant,
    };
  });
}

/**
 * Alternative function that filters out non-letters
 * Use this if you only want to show letters and skip spaces/punctuation
 */
export function textToAlphabetLettersOnly(text: string, variant: AlphabetVariant = "default"): LetterData[] {
  return textToAlphabet(text, variant).filter((item) => item.isLetter);
}

