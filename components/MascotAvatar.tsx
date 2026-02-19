import Image from "next/image";
import type { CSSProperties } from "react";

type MascotAvatarProps = {
  /** Path to mascot image, e.g. /assets/mascots/mascot1.png */
  imageSrc: string;
  /** Optional alt text for the mascot image */
  alt?: string;
  className?: string;
};

export function MascotAvatar({
  imageSrc,
  alt = "Mascot",
  className,
}: MascotAvatarProps) {
  const circleSize = 201.742;
  const imageHeight = 251.75; // Height of the mascot image
  const imageWidth = 197.067; // Width of the mascot image
  
  const circleStyle: CSSProperties = {
    width: `${circleSize}px`,
    height: `${circleSize}px`,
    borderRadius: "50%",
    border: "3.372px solid rgba(255, 255, 255, 0.24)",
    boxShadow: "0 0 0 2.197px #E451FE",
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 0,
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        overflow: "visible",
      }}
      aria-label={alt}
    >
      {/* Circle frame behind the image */}
      <div style={circleStyle} />

      {/* Mascot image - extends from bottom of circle upward, head goes above */}
      <div
        style={{
          position: "relative",
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          zIndex: 1,
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          style={{
            objectFit: "contain",
            objectPosition: "bottom center",
          }}
        />
      </div>
    </div>
  );
}

