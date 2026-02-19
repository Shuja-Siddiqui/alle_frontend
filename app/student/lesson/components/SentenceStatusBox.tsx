import React from "react";
import { AlphabetDisplay } from "../../../../components/AlphabetDisplay";

type SentenceStatusBoxProps = {
  /** Sentence to display */
  sentence: string;
  /** Variant: "initial", "default", "success", or "error" */
  variant?: "initial" | "default" | "success" | "error";
  /** Letter width for AlphabetDisplay (default: 50) */
  letterWidth?: number;
  /** Letter height for AlphabetDisplay (default: 50) */
  letterHeight?: number;
  /** Gap between letters (default: 4) */
  letterGap?: number;
  /** Custom className */
  className?: string;
};

const VARIANT_STYLES: Record<"initial" | "default" | "success" | "error", React.CSSProperties> = {
  initial: {
    borderRadius: "42px",
    border: "3px solid #DE21FF",
    boxShadow: "0 0 0 0.859px #E451FE",
  },
  default: {
    borderRadius: "42px",
    border: "3px solid #DE21FF",
    boxShadow: "0 0 0 0.859px #E451FE",
  },
  error: {
    borderRadius: "42px",
    border: "3px solid #FA1D6E",
    background: "#0B0F37",
    boxShadow: "0 4px 38.1px 0 #FA1D6E inset",
  },
  success: {
    borderRadius: "42px",
    border: "3px solid #33FFAE",
    background: "#0B2637",
    boxShadow: "0 8px 36.2px 0 rgba(51, 255, 174, 0.25) inset",
  },
};

export function SentenceStatusBox({
  sentence,
  variant = "default",
  letterWidth = 67.51, // Calculated: spacer = 95 * 0.4 = 38px, with gap=1px gives 38+1+1 = 40px word spacing
  letterHeight = 50,
  letterGap = 1, // Reduced gap between letters (1px for tight letter spacing)
  className,
}: SentenceStatusBoxProps) {
  const variantStyle = VARIANT_STYLES[variant];

  // Map StatusBox variant to AlphabetDisplay variant
  const getAlphabetVariant = (): "default" | "done" | "error" => {
    if (variant === "success") return "done";
    if (variant === "error") return "error";
    return "default";
  };

  return (
    <div
      className={className}
      style={{
        ...variantStyle,
        /* Sentence practice layout: inline-flex, min-height 250px, padding 40px, gap 40px, flex-wrap */
        display: "inline-flex",
        minHeight: "250px",
        padding: "40px",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        gap: "40px",
        flexWrap: "wrap",
        boxSizing: "border-box",
      }}
    >
      {/* Alphabet Display for the sentence - no images, only text
          letterGap reduced for tighter letter spacing
          letterWidth set to 100px so spacer = 40px (100 * 0.4 = 40px) for word spacing */}
      <AlphabetDisplay
        text={sentence}
        variant={getAlphabetVariant()}
        letterWidth={letterWidth}
        letterHeight={letterHeight}
        gap={letterGap}
        spaceHandling="spacer"
        applyBoxModel={false}
        exactGap={true} // Use gap value as-is without reduction
      />
    </div>
  );
}

