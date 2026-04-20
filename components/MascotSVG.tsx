"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

type MascotSVGProps = {
  /** Face ID (e.g., "head01") */
  face: string;
  /** Hair ID (e.g., "hair01") */
  hair: string;
  /** Body ID (e.g., "body01") */
  body: string;
  /** Hair color hex code (optional, applies filter) */
  hairColor?: string;
  /** Width of the mascot */
  width?: number;
  /** Height of the mascot */
  height?: number;
  /** Additional className */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
};

/**
 * Helper function to calculate hue rotation from hex color
 * This is a simplified approach - calculates approximate hue shift
 */
function getHueRotation(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max === min) {
    h = 0;
  } else {
    const d = max - min;
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / d + 2) * 60;
    } else {
      h = ((r - g) / d + 4) * 60;
    }
  }

  // Reference hue (default hair color - adjust based on your default)
  const referenceHue = 280; // Purple/pink default
  return h - referenceHue;
}

/**
 * Helper function to calculate saturation from hex color
 */
function getSaturation(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  if (max === min) {
    return 0;
  }

  const d = max - min;
  const l = (max + min) / 2;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

/**
 * Helper function to calculate brightness from hex color
 */
function getBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  return max;
}

/**
 * Composable mascot component that layers body, hair, and face SVGs
 * Uses Next.js Image component to load SVG files and layers them
 */
export function MascotSVG({
  face,
  hair,
  body,
  hairColor,
  width = 400,
  height = 400,
  className,
  style,
}: MascotSVGProps) {
  const baseStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: "relative",
    ...style,
  };

  const hairFilter = hairColor
    ? `hue-rotate(${getHueRotation(hairColor)}deg) saturate(${getSaturation(hairColor) * 100}%) brightness(${getBrightness(hairColor) * 100}%)`
    : undefined;

  return (
    <div className={className} style={baseStyle}>
      {/* Body layer (bottom) */}
      <div className="absolute inset-0">
        <Image
          src={`/assets/icons/suit/${body}.svg`}
          alt="Body"
          width={width}
          height={height}
          className="object-contain"
          style={{
            objectPosition: "bottom center",
          }}
        />
      </div>

      {/* Face layer (bottom) - base layer */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Image
          src={`/assets/icons/heads/${face}.svg`}
          alt="Face"
          width={205}
          height={205}
          className="object-contain"
          style={{
            objectPosition: "bottom center",
          }}
        />
      </div>

      {/* Hair layer (top) - positioned on top of head */}
      <div
        className="absolute inset-0 top-[-2%] left-[56%] transform -translate-x-1/2 "
        style={{
          filter: hairFilter,
          zIndex: 2,
        }}
      >
        <Image
          src={`/assets/icons/hair/${hair}.svg`}
          alt="Hair"
          width={205}
          height={205}
          className="object-contain"
          style={{
            objectPosition: "bottom center",
          }}
        />
      </div>
    </div>
  );
}

