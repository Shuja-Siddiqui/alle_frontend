"use client";

import { useState } from "react";
import Image from "next/image";
import { BackButton } from "./BackButton";
import { motion } from "framer-motion";

type Badge = {
  imageSrc: string;
  earned: boolean;
  alt?: string;
  title?: string;
  description?: string;
  criteriaText?: string;
  criteriaLabel?: string;
};

type AllBadgesOverlayProps = {
  badges: Badge[];
  visible: boolean;
  onClose: () => void;
  className?: string;
};

export function AllBadgesOverlay({
  badges,
  visible,
  onClose,
  className,
}: AllBadgesOverlayProps) {
  const pathPoints = [
    { x: 14, y: 20 },
    { x: 38, y: 14 },
    { x: 72, y: 22 },
    { x: 84, y: 40 },
    { x: 64, y: 56 },
    { x: 34, y: 50 },
    { x: 16, y: 68 },
    { x: 44, y: 82 },
    { x: 78, y: 76 },
  ];
  const [hoveredBadgeIndex, setHoveredBadgeIndex] = useState<number | null>(
    null,
  );

  if (!visible) return null;

  function handleBadgeMouseEnter(index: number) {
    setHoveredBadgeIndex(index);
  }

  function handleBadgeMouseLeave() {
    setHoveredBadgeIndex(null);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className ?? ""}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
      onClick={onClose}
    >
      <div
        data-badge-overlay-container
        className="relative flex flex-col items-center gap-8 rounded-[42px] p-8 md:p-10"
        style={{
          border: "2px solid #e451fe",
          backgroundImage:
            "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          width: "min(1040px, 94vw)",
          maxHeight: "92vh",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full items-center">
          <BackButton text="Badge Path" onClick={onClose} />
        </div>

        <div
          className="relative w-full"
          style={{
            minHeight: "560px",
            overflow: "hidden",
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient
                id="badgePathStroke"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#E451FE" />
                <stop offset="100%" stopColor="#7D8BFF" />
              </linearGradient>
            </defs>
            <path
              d="M 20 18 C 26 14, 30 13, 32 14
                 M 44 15 C 53 16, 60 19, 66 21
                 M 74 24 C 79 28, 82 33, 82 36
                 M 82 44 C 78 48, 72 53, 68 54
                 M 58 55 C 52 54, 46 52, 40 51
                 M 30 52 C 24 56, 20 61, 18 64
                 M 22 71 C 28 76, 34 80, 38 81
                 M 50 81 C 58 80, 65 78, 72 77"
              fill="none"
              stroke="url(#badgePathStroke)"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {badges.map((badge, index) => {
            const point =
              pathPoints[index] ?? pathPoints[pathPoints.length - 1];

            return (
              <motion.div
                key={`${badge.title ?? "badge"}-${index}`}
                className="absolute"
                style={{
                  left: `calc(${point.x}% - 52px)`,
                  top: `calc(${point.y}% - 52px)`,
                  width: "104px",
                }}
                onMouseEnter={() => handleBadgeMouseEnter(index)}
                onMouseLeave={handleBadgeMouseLeave}
                initial={{ y: 0, scale: 1, rotate: 0 }}
                animate={{
                  y: [0, -4, 0],
                  scale: [1, 1.04, 1],
                  rotate: [0, -1.5, 1.5, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: index * 0.12,
                }}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={badge.imageSrc}
                    alt={badge.alt || `Badge ${index + 1}`}
                    width={84}
                    height={84}
                    style={{
                      objectFit: "contain",

                      filter: badge.earned
                        ? "drop-shadow(0 0 8px rgba(228,81,254,0.65))"
                        : "none",
                    }}
                  />
                  <p
                    className="mt-1 text-center"
                    style={{
                      color:
                        hoveredBadgeIndex === index
                          ? "#FFFFFF"
                          : badge.earned
                            ? "#FFFFFF"
                            : "#9AA3DF",
                      fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.2px",
                      textTransform: "uppercase",
                    }}
                  >
                    {badge.criteriaLabel || `Badge ${index + 1}`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
