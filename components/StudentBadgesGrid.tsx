"use client";

import { useState } from "react";
import Image from "next/image";
import { AllBadgesOverlay } from "./AllBadgesOverlay";

type Badge = {
  /** Badge image source */
  imageSrc: string;
  /** Whether the badge is earned (true) or locked (false) */
  earned: boolean;
  /** Badge alt text */
  alt?: string;
  /** Badge title (e.g., "First Landing") */
  title?: string;
  /** Badge description (e.g., "Completed first lesson") */
  description?: string;
};

type StudentBadgesGridProps = {
  /** Array of badge data */
  badges: Badge[];
  /** Optional className */
  className?: string;
};

const defaultBadges: Badge[] = [
  {
    imageSrc: "/assets/icons/badges/badge1.svg",
    earned: true,
    title: "First Landing",
    description: "Completed first lesson",
  },
  { imageSrc: "/assets/icons/badges/badge2.svg", earned: true },
  { imageSrc: "/assets/icons/badges/badge3.svg", earned: true },
  { imageSrc: "/assets/icons/badges/badge4.svg", earned: true },
  { imageSrc: "/assets/icons/badges/badge10.svg", earned: false },
  { imageSrc: "/assets/icons/badges/badge11.svg", earned: false },
  { imageSrc: "/assets/icons/badges/badge12.svg", earned: false },
  { imageSrc: "/assets/icons/badges/badge18.svg", earned: false },
];

export function StudentBadgesGrid({
  badges = defaultBadges,
  className,
}: StudentBadgesGridProps) {
  const [hoveredBadgeIndex, setHoveredBadgeIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
    isOnRightSide?: boolean;
  } | null>(null);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const [showAllBadgesOverlay, setShowAllBadgesOverlay] = useState(false);

  function handleBadgeMouseEnter(
    index: number,
    event: React.MouseEvent<HTMLDivElement>
  ) {
    const badgeElement = event.currentTarget;
    const rect = badgeElement.getBoundingClientRect();
    const containerElement = badgeElement.closest('[data-badge-container]') as HTMLElement;
    const containerRect = containerElement?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    // Calculate if badge is on left or right side of container
    const badgeCenterX = rect.left + rect.width / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const isOnRightSide = badgeCenterX > containerCenterX;
    
    setHoveredBadgeIndex(index);
    
    // Position tooltip below the badge
    // Calculate position relative to container
    const relativeTop = rect.bottom - containerRect.top + 12; // 12px gap below the badge
    const relativeLeft = rect.left - containerRect.left; // Left edge of badge relative to container
    const relativeRight = containerRect.right - rect.right; // Distance from right edge of container
    
    setTooltipPosition({
      top: relativeTop,
      left: isOnRightSide ? relativeRight : relativeLeft, // Use right distance if on right side
      isOnRightSide, // Store this for alignment
    });
  }

  function handleBadgeMouseLeave() {
    // Only close if not hovering over tooltip
    if (!isHoveringTooltip) {
      setHoveredBadgeIndex(null);
      setTooltipPosition(null);
    }
  }

  function handleTooltipMouseEnter() {
    setIsHoveringTooltip(true);
  }

  function handleTooltipMouseLeave() {
    setIsHoveringTooltip(false);
    setHoveredBadgeIndex(null);
    setTooltipPosition(null);
  }

  return (
    <div
      className={`overflow-clip relative rounded-[36px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(162.4323224520596deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        display: "flex",
        width: "557px",
        padding: "32px",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "28px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "1.5",
            letterSpacing: "-0.308px",
            textTransform: "uppercase",
          }}
        >
          Badges
        </p>
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-180">
            <button
              type="button"
              onClick={() => setShowAllBadgesOverlay(true)}
              className="block cursor-pointer relative"
              style={{ width: "36px", height: "36px" }}
            >
              <Image
                src="/assets/icons/others/pink_forward.svg"
                alt="View all badges"
                width={36}
                height={36}
                className="block max-w-none size-full rotate-180"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div
        data-badge-container
        className="flex flex-wrap gap-[26px] items-center relative shrink-0 w-full"
        style={{ justifyContent: "center" }}
      >
        {badges.map((badge, index) => (
          <div
            key={index}
            data-badge-index={index}
            className="overflow-clip relative shrink-0"
            style={{
              width: "103.317px",
              height: "85.323px",
            }}
            onMouseEnter={(e) => handleBadgeMouseEnter(index, e)}
            onMouseLeave={handleBadgeMouseLeave}
          >
            {badge.earned ? (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "70.135px",
                  height: "82.189px",
                }}
              >
                <Image
                  src={badge.imageSrc}
                  alt={badge.alt || `Badge ${index + 1}`}
                  width={70}
                  height={82}
                  className="block max-w-none"
                  style={{
                    width: "143.75%",
                    height: "122.67%",
                    objectFit: "contain",
                  }}
                />
              </div>
            ) : (
              <>
                {/* Locked badge (dimmed) */}
                <div
                  className="absolute flex items-center justify-center mix-blend-luminosity opacity-24"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70.135px",
                    height: "82.189px",
                  }}
                >
                  <Image
                    src={badge.imageSrc}
                    alt={badge.alt || `Locked badge ${index + 1}`}
                    width={70}
                    height={82}
                    className="block max-w-none"
                    style={{
                      width: "143.75%",
                      height: "122.67%",
                      objectFit: "contain",
                    }}
                  />
                </div>
          
              </>
            )}
          </div>
        ))}
      </div>

      {/* Badge Tooltip - Only show for earned badges with title */}
      {hoveredBadgeIndex !== null &&
        tooltipPosition &&
        badges[hoveredBadgeIndex]?.earned &&
        badges[hoveredBadgeIndex]?.title && (
          <div
            className="absolute z-50 flex gap-[12px] items-center p-[16px] rounded-[32px]"
            style={{
              backgroundColor: "#1b1f4e",
              border: "1px solid #e451fe",
              top: `${tooltipPosition.top}px`,
              ...(tooltipPosition.isOnRightSide
                ? {
                    right: `${tooltipPosition.left}px`,
                    transform: "translateX(0) translateY(0) scale(1)", // Align to right edge
                  }
                : {
                    left: `${tooltipPosition.left}px`,
                    transform: "translateY(0) scale(1)",
                  }),
              opacity: 1,
              transition:
                "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
              pointerEvents: "auto",
              maxWidth: "calc(100% - 64px)", // Ensure it doesn't overflow container (accounting for padding)
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            {/* Badge Image */}
            <div
              className="overflow-clip relative shrink-0"
              style={{
                width: "103.317px",
                height: "85.323px",
              }}
            >
              <div
                className="absolute flex items-center justify-center"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "70.135px",
                  height: "82.189px",
                }}
              >
                <Image
                  src={badges[hoveredBadgeIndex].imageSrc}
                  alt={badges[hoveredBadgeIndex].alt || `Badge ${hoveredBadgeIndex + 1}`}
                  width={70}
                  height={82}
                  className="block max-w-none"
                  style={{
                    width: "143.75%",
                    height: "122.67%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>

            {/* Badge Info */}
            <div className="flex flex-col gap-[8px] items-start justify-center relative shrink-0">
              <p
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "24px",
                  letterSpacing: "-0.198px",
                  textTransform: "uppercase",
                }}
              >
                {badges[hoveredBadgeIndex].title}
              </p>
              <p
                style={{
                  color: "#7478a2",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "-0.28px",
                  width: "192px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {badges[hoveredBadgeIndex].description}
              </p>
            </div>
          </div>
        )}

      {/* All Badges Overlay */}
      <AllBadgesOverlay
        badges={badges}
        visible={showAllBadgesOverlay}
        onClose={() => setShowAllBadgesOverlay(false)}
      />
    </div>
  );
}

