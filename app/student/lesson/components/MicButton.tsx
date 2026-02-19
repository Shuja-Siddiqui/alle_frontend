"use client";

import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";
import { useState, useEffect } from "react";
import React from "react";

type MicButtonIcon = "mic" | "play" | "pause";

type MicButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Initial icon to show; toggles mic <-> pause on click */
  icon: MicButtonIcon;
  /** Size of the SVG (and clickable area) in pixels */
  size?: number;
};

const ICON_PATHS: Record<MicButtonIcon, string> = {
  mic: "/assets/icons/others/mic.svg",
  play: "/assets/icons/others/play.svg",
  pause: "/assets/icons/others/pause.svg",
};

export function MicButton({
  icon,
  size = 100,
  className,
  onClick,
  ...props
}: MicButtonProps) {
  const [currentIcon, setCurrentIcon] = useState<MicButtonIcon>(icon);

  // Sync with prop changes
  useEffect(() => {
    setCurrentIcon(icon);
  }, [icon]);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setCurrentIcon((prev) => {
      if (prev === "mic") return "pause";
      if (prev === "pause") return "mic";
      return prev;
    });

    onClick?.(event);
  };

  const iconSrc = ICON_PATHS[currentIcon];

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center bg-transparent border-none p-0 ${className ?? ""}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={handleClick}
      {...props}
    >
      <Image src={iconSrc} alt={currentIcon} width={size} height={size} />
    </button>
  );
}



