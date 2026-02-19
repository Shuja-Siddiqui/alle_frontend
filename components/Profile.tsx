"use client";

import Image from "next/image";

type ProfileProps = {
  /** Profile image URL */
  imageSrc?: string;
  /** Alt text for the profile image */
  alt?: string;
  /** Size of the profile image in pixels */
  size?: number;
  /** Called when the profile is clicked */
  onClick?: () => void;
  className?: string;
};

export function Profile({
  imageSrc,
  alt = "Profile",
  size = 46,
  onClick,
  className,
}: ProfileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 rounded-full ${className ?? ""}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: "2px solid #E451FE",
        boxShadow: "0 0 0 2px rgba(228, 81, 254, 0.3)",
      }}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="rounded-full object-cover"
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full w-full h-full"
          style={{
            backgroundColor: "#131743",
          }}
        >
          <span
            style={{
              color: "#E451FE",
              fontSize: `${size * 0.5}px`,
              fontWeight: 700,
            }}
          >
            ?
          </span>
        </div>
      )}
    </button>
  );
}




