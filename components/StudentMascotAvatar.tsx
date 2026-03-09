"use client";

import { useAuth } from "../contexts/AuthContext";
import { MascotDisplay } from "./MascotDisplay";

type StudentMascotAvatarProps = {
  /** Diameter of the circular frame in pixels */
  size?: number;
  className?: string;
  /** How to fit mascot inside the circle: 'overflow' (head can go above) or 'contain' (fully inside) */
  fit?: "overflow" | "contain";
};

const DEFAULT_SIZE = 128.462;
const BASE_CIRCLE_SIZE = 128; // design circle size
// These should match the actual mascot SVG viewBox dimensions
// so scaling stays proportional when we change the circle size.
const BASE_MASCOT_WIDTH = 124;
const BASE_MASCOT_HEIGHT = 255;

function getCollarFromBody(bodyId: string | undefined): string {
  const match = bodyId?.match(/body(\d+)/i);
  const num = match ? match[1] : "1";
  return `collar${num}`;
}

export function StudentMascotAvatar({
  size = DEFAULT_SIZE,
  className,
  fit = "overflow",
}: StudentMascotAvatarProps) {
  const { user } = useAuth();

  const mascot = user?.mascot as
    | {
        face?: string;
        hair?: string;
        body?: string;
        hairColor?: string;
      }
    | undefined;

  const headId = mascot?.face ?? "head1";
  const hairId = mascot?.hair ?? "hair1";
  const bodyId = mascot?.body ?? "body1";
  const collarId = getCollarFromBody(bodyId);
  const hairColor = mascot?.hairColor ?? "#E451FE";

  // Scale mascot relative to the circle size
  const scale = size / BASE_CIRCLE_SIZE;

  const overflowMascotWidth = BASE_MASCOT_WIDTH * scale;
  const overflowMascotHeight = BASE_MASCOT_HEIGHT * scale;

  // For contain mode, keep mascot fully inside the circle while preserving SVG aspect ratio (width/height)
  const aspectRatio = BASE_MASCOT_WIDTH / BASE_MASCOT_HEIGHT;
  const containMascotHeight = size;
  const containMascotWidth = size * aspectRatio;

  const mascotStyle =
    fit === "contain"
      ? {
          position: "absolute" as const,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${containMascotWidth}px`,
          height: `${containMascotHeight}px`,
        }
      : {
          // Overflow: mascot taller than circle so head pops out of the top
          position: "absolute" as const,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${overflowMascotWidth}px`,
          height: `${overflowMascotHeight}px`,
        };

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        border: "2px solid #E451FE",
        boxShadow: "0 0 0 2px rgba(228, 81, 254, 0.8)",
        background:
          "radial-gradient(100% 100% at 50% 0%, #1B1F4E 0%, #0B0F37 100%)",
        position: "relative",
        overflow: "visible",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <MascotDisplay
        headId={headId}
        hairId={hairId}
        bodyId={bodyId}
        collarId={collarId}
        hairColor={hairColor}
        style={mascotStyle}
      />
    </div>
  );
}

