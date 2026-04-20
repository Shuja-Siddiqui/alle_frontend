import type { ReactNode } from "react";
import { AlphabetStatusBox } from "./AlphabetStatusBox";
import { WordStatusBox } from "./WordStatusBox";
import { SentenceStatusBox } from "./SentenceStatusBox";

type StatusVariant = "initial" | "default" | "success" | "error";

type StatusBoxProps = {
  variant?: StatusVariant;
  /** Text key used to resolve the image, e.g. "S" or "sat" */
  text?: string;
  /** Children are accepted for backwards-compat but are ignored visually */
  children?: ReactNode;
  className?: string;
  /** Optional direct image src override, e.g. "/assets/icons/phonemes/s_error.png" */
  imageSrc?: string;
  /** When true, renders image above and text below with larger layout */
  showTextBelowImage?: boolean;
  /** When true, uses AlphabetDisplay to show text as alphabet SVGs instead of images */
  useAlphabetDisplay?: boolean;
  /** Letter width for AlphabetDisplay (default: 60) */
  letterWidth?: number;
  /** Letter height for AlphabetDisplay (default: 60) */
  letterHeight?: number;
  /** Gap between letters for AlphabetDisplay (default: 4) */
  letterGap?: number;
};


export function StatusBox({
  variant = "error",
  text='S',
  className,
  imageSrc,
  showTextBelowImage,
  useAlphabetDisplay,
  letterWidth = 60,
  letterHeight = 60,
  letterGap = 4,
}: StatusBoxProps) {
  // Detect content type
  const trimmedText = text?.trim() || "";
  const isSingleLetter = trimmedText.length === 1 && /^[a-zA-Z]$/.test(trimmedText);
  const isWord = trimmedText.length > 1 && !trimmedText.includes(" "); // Word: multiple chars, no spaces
  const isSentence = trimmedText.includes(" "); // Sentence: contains spaces
  
  // Determine which component to use
  const useAlphabetComponent = isSingleLetter;
  const useWordComponent = isWord && !isSentence;
  const useSentenceComponent = isSentence;

  // Use appropriate component based on content type
  if (useAlphabetComponent && text) {
    // Single letter - use AlphabetStatusBox
    // Only show visual image if explicitly provided via imageSrc or showTextBelowImage is true
    // Don't auto-resolve visual image path as it may not exist for all letters
    const visualImageSrc = showTextBelowImage && imageSrc
      ? imageSrc
      : undefined;
    
    return (
      <AlphabetStatusBox
        letter={text}
        variant={variant}
        visualImageSrc={visualImageSrc}
        letterWidth={letterWidth}
        letterHeight={letterHeight}
        letterGap={letterGap}
        className={className}
      />
    );
  }

  if (useWordComponent && text) {
    // Word - use WordStatusBox (variable width/height, Figma layout)
    return (
      <WordStatusBox
        word={text}
        variant={variant}
        wordImageSrc={imageSrc}
        letterHeight={letterHeight}
        letterGap={letterGap}
        className={className}
      />
    );
  }

  if (useSentenceComponent && text) {
    // Sentence - use SentenceStatusBox
    return (
      <SentenceStatusBox
        sentence={text}
        variant={variant}
        letterWidth={letterWidth}
        letterHeight={letterHeight}
        letterGap={letterGap}
        className={className}
      />
    );
  }

  // Fallback: if no text provided, return null
  return null;
}



