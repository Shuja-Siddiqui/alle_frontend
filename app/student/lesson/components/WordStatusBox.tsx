import Image from "next/image";
import React from "react";
import { AlphabetDisplay } from "../../../../components/AlphabetDisplay";

type WordStatusBoxProps = {
  /** Word to display (e.g., "MAP", "SAT") */
  word: string;
  /** Variant: "initial", "default", "success", or "error" */
  variant?: "initial" | "default" | "success" | "error";
  /** Optional word image to show above the letters */
  wordImageSrc?: string;
  /** Letter height for AlphabetDisplay (default: 100 to match Figma) */
  letterHeight?: number;
  /** Gap between letters (default: 16 to match Figma) */
  letterGap?: number;
  /** Custom className */
  className?: string;
};

const VARIANT_STYLES: Record<
  "initial" | "default" | "success" | "error",
  React.CSSProperties
> = {
  initial: {
    borderRadius: "32px",
    border: "3px solid #DE21FF",
    boxShadow: "0 0 0 0.859px #E451FE",
  },
  default: {
    borderRadius: "32px",
    border: "1px solid #DE21FF",
    background:
      "linear-gradient(96deg, rgba(245, 41, 249, 0.16) -20.26%, rgba(255, 33, 199, 0.16) 178.8%)",
    boxShadow: "0 0 0 2.563px #E451FE",
  },
  error: {
    borderRadius: "32px",
    border: "3px solid #FA1D6E",
    background: "#0B0F37",
    boxShadow: "0 4px 38.1px 0 #FA1D6E inset",
  },
  success: {
    borderRadius: "32px",
    border: "3px solid #33FFAE",
    background: "#0B2637",
    boxShadow: "0 8px 36.2px 0 rgba(51, 255, 174, 0.25) inset",
  },
};

export function WordStatusBox({
  word,
  variant = "default",
  wordImageSrc,
  letterHeight = 100,
  letterGap = 16,
  className,
}: WordStatusBoxProps) {
  const variantStyle = VARIANT_STYLES[variant];

  // Map StatusBox variant to AlphabetDisplay variant
  const getAlphabetVariant = (): "default" | "done" | "error" => {
    if (variant === "success") return "done";
    if (variant === "error") return "error";
    return "default";
  };

  // Only show image if explicitly provided — don't auto-resolve to avoid broken images
  const resolvedWordImageSrc = wordImageSrc;

  return (
    <div
      className={className}
      style={{
        ...variantStyle,
        /* Figma: flex col, gap 40px between image and text, padding 44px 64px, auto width/height */
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px", // 40px gap between image and word text for word practice
        padding: "44px 64px",
        overflow: "clip",
        boxSizing: "border-box",
        width: "450px",
        height: "382px"
      }}
    >
      {/* Word Image (160x160 container matching Figma) */}
      {resolvedWordImageSrc && (
        <div
          style={{
            width: "160px",
            height: "160px",
            position: "relative",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <Image
            src={resolvedWordImageSrc}
            alt={word}
            fill
            sizes="160px"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* Alphabet Display for the word — letters at ~100px tall with 16px gap */}
      <AlphabetDisplay
        text={word}
        variant={getAlphabetVariant()}
        letterWidth={letterHeight} /* Square containers; objectFit:contain handles varying letter widths */
        letterHeight={letterHeight}
        gap={letterGap}
        spaceHandling="skip"
        applyBoxModel={false}
        letterScaleFactor={1} /* No shrinking — render letters at exact specified size */
        exactGap={true} /* Use gap value as-is (16px) without reduction */
      />
    </div>
  );
}
