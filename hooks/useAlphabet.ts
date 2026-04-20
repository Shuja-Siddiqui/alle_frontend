"use client";

import { useMemo } from "react";
import { textToAlphabet, type LetterData, type AlphabetVariant } from "../utils/textToAlphabet";

/**
 * Hook that converts text to alphabet letter data
 * 
 * @param text - The text to convert
 * @param variant - The variant to use: "default", "done", or "error"
 * @param lettersOnly - If true, filters out spaces and punctuation
 * @returns Array of LetterData objects
 * 
 * @example
 * ```tsx
 * const letters = useAlphabet("apple", "default");
 * // Returns: [
 * //   { char: "a", isLetter: true, isSpace: false, svgPath: "/assets/alphabets/Letter=A, State=Default.svg", variant: "default" },
 * //   { char: "p", isLetter: true, isSpace: false, svgPath: "/assets/alphabets/Letter=P, State=Default.svg", variant: "default" },
 * //   ...
 * // ]
 * ```
 */
export function useAlphabet(
  text: string,
  variant: AlphabetVariant = "default",
  lettersOnly = false
): LetterData[] {
  return useMemo(() => {
    const letters = textToAlphabet(text, variant);
    return lettersOnly ? letters.filter((item) => item.isLetter) : letters;
  }, [text, variant, lettersOnly]);
}

