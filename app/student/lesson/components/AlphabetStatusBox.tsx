import Image from "next/image";
import React from "react";
import { AlphabetDisplay } from "../../../../components/AlphabetDisplay";

type AlphabetStatusBoxProps = {
  /** Single letter to display (A-Z, a-z) */
  letter: string;
  /** Variant: "initial", "default", "success", or "error" */
  variant?: "initial" | "default" | "success" | "error";
  /** Optional visual image to show below the alphabet */
  visualImageSrc?: string;
  /** Letter width for AlphabetDisplay (default: 107.063) */
  letterWidth?: number;
  /** Letter height for AlphabetDisplay (default: 134.92) */
  letterHeight?: number;
  /** Gap between letters (default: 6) */
  letterGap?: number;
  /** Custom className */
  className?: string;
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

export function AlphabetStatusBox({
  letter,
  variant = "default",
  visualImageSrc,
  letterWidth = 107.063,
  letterHeight = 134.92,
  letterGap = 6,
  className,
}: AlphabetStatusBoxProps) {
  const variantStyle = VARIANT_STYLES[variant];

  // Map StatusBox variant to AlphabetDisplay variant
  const getAlphabetVariant = (): "default" | "done" | "error" => {
    if (variant === "success") return "done";
    if (variant === "error") return "error";
    return "default"; // initial and default both use "default"
  };

  // Only use visual image if explicitly provided
  // Don't auto-resolve as the file may not exist for all letters
  const resolvedVisualImageSrc = visualImageSrc;

  return (
    <div
      className={className}
      style={{
        ...variantStyle,
        display: "flex",
        width: "280px",
        height: "250px",
        padding: "45px 77px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
        flexDirection: resolvedVisualImageSrc ? "column" : "row",
        boxSizing: "border-box",
      }}
    >
      {/* Alphabet Display - uses its own default height and width, fits within padding area */}
      <AlphabetDisplay
        text={letter}
        variant={getAlphabetVariant()}
        letterWidth={letterWidth}
        letterHeight={letterHeight}
        gap={letterGap}
        spaceHandling="skip"
        applyBoxModel={false}
      />

      {/* Visual Image Below (if provided) */}
      {resolvedVisualImageSrc && (
        <Image
          src={resolvedVisualImageSrc}
          alt={`${letter} visual`}
          width={107}
          height={107}
          style={{
            objectFit: "contain",
          }}
        />
      )}
    </div>
  );
}

