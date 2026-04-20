import React from "react";
import { AlphabetDisplay } from "../../../../components/AlphabetDisplay";

type BlendingStatusBoxProps = {
  /** Single letter to display (A-Z, a-z) */
  letter: string;
  /** Variant: "initial", "default", "success", or "error" */
  variant?: "initial" | "default" | "success" | "error";
  /** Rotation angle in degrees (for tilting) */
  rotation?: number;
  /** Letter width for AlphabetDisplay (default: 107.063) */
  letterWidth?: number;
  /** Letter height for AlphabetDisplay (default: 134.92) */
  letterHeight?: number;
  /** Gap between letters (default: 6) */
  letterGap?: number;
  /** Custom className */
  className?: string;
  /** Custom padding (default: uses variant-specific padding) */
  padding?: string;
  /** Custom gap (default: uses variant-specific gap) */
  gap?: string;
};

const VARIANT_STYLES: Record<"initial" | "default" | "success" | "error", React.CSSProperties> = {
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

export function BlendingStatusBox({
  letter,
  variant = "default",
  rotation = 0,
  letterWidth = 107.063,
  letterHeight = 134.92,
  letterGap = 6,
  className,
  padding,
  gap,
}: BlendingStatusBoxProps) {
  const variantStyle = VARIANT_STYLES[variant];

  // Map StatusBox variant to AlphabetDisplay variant
  const getAlphabetVariant = (): "default" | "done" | "error" => {
    if (variant === "success") return "done";
    if (variant === "error") return "error";
    return "default"; // initial and default both use "default"
  };

  // Use variant-specific padding and gap, or custom values
  const boxPadding = padding || (variant === "error" ? "44px" : "18.125px 75.429px");
  const boxGap = gap || (variant === "error" ? "22px" : "7.543px");
  const boxWidth = variant === "error" ? "280px" : undefined;

  return (
    <div
      className={className}
      style={{
        ...variantStyle,
        display: "flex",
        width: boxWidth,
        height: "250px",
        padding: boxPadding,
        justifyContent: "center",
        alignItems: "center",
        gap: boxGap,
        alignSelf: variant === "error" ? undefined : "stretch",
        flexShrink: 0,
        flexDirection: "row",
        boxSizing: "border-box",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Alphabet Display */}
      <AlphabetDisplay
        text={letter}
        variant={getAlphabetVariant()}
        letterWidth={letterWidth}
        letterHeight={letterHeight}
        gap={letterGap}
        spaceHandling="skip"
        applyBoxModel={false}
      />
    </div>
  );
}

