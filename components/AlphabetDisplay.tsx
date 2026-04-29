"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { textToAlphabet, type LetterData, type AlphabetVariant } from "../utils/textToAlphabet";

type AlphabetDisplayProps = {
  /** The text to display as alphabet SVGs (e.g., "apple", "I have car") */
  text: string;
  /** Variant of the alphabet: "default", "done", or "error" */
  variant?: AlphabetVariant;
  /** Width of each letter SVG */
  letterWidth?: number;
  /** Height of each letter SVG */
  letterHeight?: number;
  /** Gap between letters */
  gap?: number;
  /** Whether to show only letters (skip spaces and punctuation) */
  lettersOnly?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Custom style for the container */
  style?: React.CSSProperties;
  /** Custom className for each letter */
  letterClassName?: string;
  /** Custom style for each letter */
  letterStyle?: React.CSSProperties;
  /** How to handle spaces: 'skip' (don't show), 'spacer' (show empty space), 'dash' (show dash) */
  spaceHandling?: "skip" | "spacer" | "dash";
  /** Whether to apply Figma box model (content: 126x160, padding: 45px top/bottom, 77px left/right, border: 3px, margin: 42px) */
  applyBoxModel?: boolean;
  /** Scale factor for each letter image relative to its container (default: 0.85) */
  letterScaleFactor?: number;
  /** When true, the gap value is used as-is without the default 0.6 reduction (default: false) */
  exactGap?: boolean;
  /**
   * Optional per-letter slot widths (px), in order of each **letter** glyph rendered.
   * When set, each letter cell uses its entry; spaces/punctuation still use `letterWidth`.
   * Build with `computeWordLetterSlotLayout` from `lib/alphabet-intrinsic-layout.ts`.
   */
  perLetterSlotWidths?: number[];
};

type RenderRowParams = {
  letterData: LetterData[];
  letterWidth: number;
  letterHeight: number;
  letterScaleFactor: number;
  spaceHandling: "skip" | "spacer" | "dash";
  letterClassName?: string;
  letterStyle?: React.CSSProperties;
  perLetterSlotWidths?: number[];
};

function renderAlphabetFlexRowItems({
  letterData,
  letterWidth,
  letterHeight,
  letterScaleFactor,
  spaceHandling,
  letterClassName,
  letterStyle,
  perLetterSlotWidths,
}: RenderRowParams): ReactNode[] {
  let letterSlotIndex = 0;

  return letterData.map((item, index) => {
    if (item.isSpace) {
      if (spaceHandling === "skip") {
        return null;
      }
      if (spaceHandling === "dash") {
        return (
          <div
            key={`space-${index}`}
            className={letterClassName}
            style={{
              width: `${letterWidth * 0.3}px`,
              height: `${letterHeight}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...letterStyle,
            }}
          >
            <span
              style={{
                color: "#FFF",
                fontSize: `${letterHeight * 0.4}px`,
              }}
            >
              -
            </span>
          </div>
        );
      }
      return (
        <div
          key={`space-${index}`}
          style={{
            width: `${letterWidth * 0.4}px`,
            height: `${letterHeight}px`,
          }}
        />
      );
    }

    if (!item.isLetter) {
      return (
        <div
          key={`char-${index}`}
          className={letterClassName}
          style={{
            width: `${letterWidth}px`,
            height: `${letterHeight}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...letterStyle,
          }}
        >
          <span
            style={{
              color: "#FFF",
              fontSize: `${letterHeight * 0.6}px`,
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            }}
          >
            {item.char}
          </span>
        </div>
      );
    }

    const slotW = perLetterSlotWidths?.[letterSlotIndex] ?? letterWidth;
    if (perLetterSlotWidths) {
      letterSlotIndex += 1;
    }

    return (
      <div
        key={`letter-${index}-${item.char}`}
        className={letterClassName}
        style={{
          width: `${slotW}px`,
          height: `${letterHeight}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          ...letterStyle,
        }}
      >
        {item.svgPath && (
          <Image
            src={item.svgPath}
            alt={item.char}
            width={slotW}
            height={letterHeight}
            style={{
              width: `${slotW * letterScaleFactor}px`,
              height: `${letterHeight * letterScaleFactor}px`,
              maxWidth: `${slotW * letterScaleFactor}px`,
              maxHeight: `${letterHeight * letterScaleFactor}px`,
              objectFit: "contain",
              objectPosition: "center",
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement("span");
                fallback.textContent = item.char.toUpperCase();
                fallback.style.color = "#FFF";
                fallback.style.fontSize = `${letterHeight * 0.6}px`;
                fallback.style.fontFamily = "var(--font-orbitron), system-ui, sans-serif";
                parent.appendChild(fallback);
              }
            }}
          />
        )}
      </div>
    );
  });
}

/**
 * Component that displays text as alphabet SVG images.
 *
 * Example usage:
 * ```tsx
 * <AlphabetDisplay text="apple" letterWidth={50} letterHeight={50} />
 * <AlphabetDisplay text="I have car" gap={8} spaceHandling="spacer" />
 * ```
 */
export function AlphabetDisplay({
  text,
  variant = "default",
  letterWidth = 67.51,
  letterHeight = 50,
  gap = 4,
  lettersOnly = false,
  className,
  style,
  letterClassName,
  letterStyle,
  spaceHandling = "spacer",
  applyBoxModel = true,
  letterScaleFactor = 1.0951,
  exactGap = false,
  perLetterSlotWidths,
}: AlphabetDisplayProps) {
  const letterData = lettersOnly
    ? textToAlphabet(text, variant).filter((item) => item.isLetter)
    : textToAlphabet(text, variant);

  if (letterData.length === 0) {
    return null;
  }

  const contentStyle: React.CSSProperties = applyBoxModel
    ? {
        width: "126px",
        height: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxSizing: "border-box",
        border: "3px solid transparent",
      }
    : {};

  const renderedGap = exactGap ? gap : Math.max(gap * 0.6, 2);

  const rowParams: RenderRowParams = {
    letterData,
    letterWidth,
    letterHeight,
    letterScaleFactor,
    spaceHandling,
    letterClassName,
    letterStyle,
    perLetterSlotWidths,
  };

  const rowItems = renderAlphabetFlexRowItems(rowParams);

  const lettersContainer = (
    <div
      className="flex items-center"
      style={{
        gap: `${renderedGap}px`,
        ...contentStyle,
      }}
    >
      {rowItems}
    </div>
  );

  if (applyBoxModel) {
    return (
      <div className={className} style={style}>
        {lettersContainer}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${className || ""}`}
      style={{
        gap: `${renderedGap}px`,
        ...style,
      }}
    >
      {rowItems}
    </div>
  );
}
