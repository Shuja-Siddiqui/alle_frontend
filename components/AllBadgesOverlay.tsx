"use client";

import { useState } from "react";
import Image from "next/image";

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

type AllBadgesOverlayProps = {
    /** Array of all badge data */
    badges: Badge[];
    /** Whether the overlay is visible */
    visible: boolean;
    /** Called when the overlay should be closed */
    onClose: () => void;
    /** Optional className */
    className?: string;
};

export function AllBadgesOverlay({
    badges,
    visible,
    onClose,
    className,
}: AllBadgesOverlayProps) {
    const [hoveredBadgeIndex, setHoveredBadgeIndex] = useState<number | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{
        top: number;
        left: number;
        isOnRightSide?: boolean;
    } | null>(null);
    const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);

    if (!visible) return null;

    function handleBackClick() {
        onClose();
    }

    function handleBadgeMouseEnter(
        index: number,
        event: React.MouseEvent<HTMLDivElement>
    ) {
        // Clear any pending close timeout
        if (!badges[index]?.earned || !badges[index]?.title) {
            setHoveredBadgeIndex(null);
            setTooltipPosition(null);
            return;
        }

        const badgeElement = event.currentTarget;
        const rect = badgeElement.getBoundingClientRect();
        const containerElement = badgeElement.closest('[data-badge-overlay-container]') as HTMLElement;

        if (!containerElement) return;

        const containerRect = containerElement.getBoundingClientRect();

        // Calculate if badge is on left or right side of container
        const badgeCenterX = rect.left + rect.width / 2;
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const isOnRightSide = badgeCenterX > containerCenterX;

        setHoveredBadgeIndex(index);

        // Position tooltip below the badge
        // Calculate position relative to container
        const relativeTop = rect.bottom - containerRect.top + 12;
        const relativeLeft = rect.left - containerRect.left;
        const relativeRight = containerRect.right - rect.right;

        setTooltipPosition({
            top: relativeTop,
            left: isOnRightSide ? relativeRight : relativeLeft,
            isOnRightSide,
        });
    }

    function handleBadgeMouseLeave() {
        // Only close if we're not hovering over the tooltip
        if (!isHoveringTooltip) {
            // Add a small delay to allow mouse to move to tooltip
            setTimeout(() => {
                if (!isHoveringTooltip) {
                    setHoveredBadgeIndex(null);
                    setTooltipPosition(null);
                }
            }, 100);
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
            className={`fixed inset-0 z-50 flex items-center justify-center ${className ?? ""}`}
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
            }}
            onClick={onClose}
        >
            <div
                data-badge-overlay-container
                className="relative flex flex-col gap-[32px] items-center p-[44px] rounded-[51.22px]"
                style={{
                    border: "2px solid #e451fe",
                    backgroundImage:
                        "linear-gradient(150.6970129955199deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflow: "visible",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Back Button and Title */}
                <div className="flex gap-[16px] items-center w-full" style={{ width: "418.41px" }}>
                    <button
                        type="button"
                        onClick={handleBackClick}
                        className="relative shrink-0 cursor-pointer bg-transparent border-none p-0"
                        style={{
                            width: "36px",
                            height: "36px",
                        }}
                    >
                        <Image
                            src="/assets/icons/others/arrow_back.svg"
                            alt="Back"
                            width={36}
                            height={36}
                            className="block max-w-none size-full"
                        />
                    </button>
                    <p
                        style={{
                            color: "#FFFFFF",
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            fontSize: "36px",
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: "42px",
                            letterSpacing: "-0.396px",
                            textTransform: "uppercase",
                        }}
                    >
                        Badges
                    </p>
                </div>

                {/* Badge Grid */}
                <div
                    className="flex flex-wrap gap-[26px] items-center justify-center relative"
                    style={{ width: "398px", minHeight: "200px" }}
                >
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className="overflow-clip relative shrink-0"
                            style={{
                                width: "80px",
                                height: "66.067px",
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
                                        width: "54px",
                                        height: "64px",
                                    }}
                                >
                                    <Image
                                        src={badge.imageSrc}
                                        alt={badge.alt || `Badge ${index + 1}`}
                                        width={54}
                                        height={64}
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
                                            width: "54px",
                                            height: "64px",
                                        }}
                                    >
                                        <Image
                                            src={badge.imageSrc}
                                            alt={badge.alt || `Locked badge ${index + 1}`}
                                            width={54}
                                            height={64}
                                            className="block max-w-none"
                                            style={{
                                                width: "143.75%",
                                                height: "122.67%",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                    {/* Lock icon overlay */}
                                    <div
                                        className="absolute flex items-center justify-center"
                                        style={{
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: "16.754px",
                                            height: "16.754px",
                                        }}
                                    >
                                        {/* Lock icon placeholder - replace with actual lock icon when available */}
                                        <div
                                            style={{
                                                width: "16.754px",
                                                height: "16.754px",
                                                backgroundColor: "#7478a2",
                                                borderRadius: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "10px",
                                                    height: "10px",
                                                    border: "2px solid #FFFFFF",
                                                    borderRadius: "2px",
                                                    borderTop: "none",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

