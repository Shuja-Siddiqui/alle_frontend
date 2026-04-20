import React from "react";
import Image from "next/image";
import { BlendingStatusBox } from "./BlendingStatusBox";

type StatusVariant = "initial" | "default" | "success" | "error";

type BlendingBoxesProps = {
  /** Array of letters to display (e.g., ["S", "A", "T"]) */
  letters: string[];
  /** Variant for all boxes */
  variant?: StatusVariant;
  /** Rotation angles for each box (in degrees) */
  rotations?: number[];
  /** Letter width for AlphabetDisplay (default: 107.063) */
  letterWidth?: number;
  /** Letter height for AlphabetDisplay (default: 134.92) */
  letterHeight?: number;
  /** Gap between letters (default: 6) */
  letterGap?: number;
  /** Custom className */
  className?: string;
  /** Optional score shown above each letter (e.g., Azure) */
  topScores?: Array<number | null | undefined>;
  /** Optional score shown below each letter (e.g., SpeechSuper) */
  bottomScores?: Array<number | null | undefined>;
};

function formatScore(score?: number | null) {
  return typeof score === "number" && Number.isFinite(score) ? `${Math.round(score)}%` : "--";
}

/** Returns the correct chain image element for a given variant */
function ChainConnector({ variant }: { variant: StatusVariant }) {
  if (variant === "default" || variant === "initial") {
    return (
      <Image
        src="/assets/icons/others/pink_chain.svg"
        alt="Chain connector"
        width={60}
        height={60}
        style={{ objectFit: "contain" }}
      />
    );
  }
  if (variant === "error") {
    return (
      <Image
        src="/assets/icons/others/broken_chain.svg"
        alt="Broken chain connector"
        width={60}
        height={60}
        style={{ objectFit: "contain" }}
      />
    );
  }
  if (variant === "success") {
    return (
      <Image
        src="/assets/icons/others/green_chain.svg"
        alt="Green chain connector"
        width={60}
        height={60}
        style={{ objectFit: "contain" }}
      />
    );
  }
  return null;
}

export function BlendingBoxes({
  letters,
  variant = "default",
  rotations,
  letterWidth = 107.063,
  letterHeight = 134.92,
  letterGap = 6,
  className,
  topScores,
  bottomScores,
}: BlendingBoxesProps) {
  // Only apply rotations for error variant, otherwise keep boxes straight
  const defaultRotations = letters.map((_, index) => {
    if (variant === "error") {
      const errorRotations = [9.981, -7.443, 16.104];
      return errorRotations[index] || 0;
    }
    return 0;
  });

  const finalRotations = rotations || defaultRotations;

  // Vertical offsets for zig-zag pattern in error variant
  const verticalOffsets = letters.map((_, index) => {
    if (variant === "error") {
      const offsets = [30, -20, 15];
      return offsets[index] || 0;
    }
    return 0;
  });

  // Chain connector horizontal margin:
  // Negative margin = chain overlaps into boxes (connecting look)
  // Positive margin = chain has space from boxes
  const chainMargin = variant === "error" ? "20px" : "-14px";

  return (
    <div
      className={`flex items-center ${className || ""}`}
      style={{ position: "relative" }}
    >
      {letters.map((letter, index) => (
        <React.Fragment key={index}>
          {/* Letter Box */}
          <div
            className="flex flex-col items-center"
            style={{
              zIndex: 0,
              position: "relative",
              paddingTop: "24px",
              paddingBottom: "24px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                minHeight: "20px",
                color: "#7DD3FC",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                zIndex: 300,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {topScores ? formatScore(topScores[index]) : ""}
            </div>
            <div
              style={{
                position: "relative",
                transform:
                  verticalOffsets[index] !== 0
                    ? `translateY(${verticalOffsets[index]}px)`
                    : undefined,
              }}
            >
              <BlendingStatusBox
                letter={letter}
                variant={variant}
                rotation={finalRotations[index]}
                letterWidth={letterWidth}
                letterHeight={letterHeight}
                letterGap={letterGap}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                minHeight: "20px",
                color: "#F9A8D4",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                zIndex: 300,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {bottomScores ? formatScore(bottomScores[index]) : ""}
            </div>
          </div>

          {/* Chain connector placed inline between boxes */}
          {index < letters.length - 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                zIndex: 100,
                margin: `0 ${chainMargin}`,
                pointerEvents: "none",
              }}
            >
              <ChainConnector variant={variant} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

