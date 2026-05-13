"use client";

import { useState } from "react";
import Image from "next/image";
import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type SoundRingSlot = {
    label: string;
    /** `passed` = cleared (pink), `failed` = red */
    status: "passed" | "failed";
};

type StarRingProps = {
    className?: string;
    /** Selected circle number (1-based). */
    selectedCircle?: number;
    /** Initial value (number of circles to light up). */
    initialValue?: number;
    /** Called when a circle is clicked */
    onCircleClick?: (circleNumber: number) => void;
    /** Optional label shown under title (e.g. "6/45") */
    progressLabel?: string;
    /** Optional sound labels displayed outside each circle slot */
    soundLabels?: string[];
    /**
     * When set to a 45-length array, each dot/label uses pass (pink) vs fail (red).
     * Legacy `selectedCircle` fill (green) is used only when this is omitted.
     */
    slots?: Array<SoundRingSlot | null>;
};

export function StarRing({ 
    className, 
    selectedCircle: externalSelectedCircle, 
    initialValue, 
    onCircleClick,
    progressLabel,
    soundLabels = [],
    slots,
}: StarRingProps) {
    const containerSize = 424.667;
    const radius = containerSize / 2; // 204.5px
    const centerX = radius;
    const centerY = radius;
    const numCircles = 45;
    const smallCircleSize = 17.898; // Size of each small circle
    const labelRadiusOffset = 22;
    const useSlotOutcomes =
        Array.isArray(slots) && slots.length === numCircles;
    
    const effectiveInitialValue = initialValue ?? 0;
    const reduceMotion = useReducedMotion();
    
    // Initialize internal state with the initial value
    const [internalSelectedCircle, setInternalSelectedCircle] = useState<number | null>(effectiveInitialValue);

    // Use external selected circle if provided, otherwise use internal state
    const selectedCircle = externalSelectedCircle ?? internalSelectedCircle;

    // Generate positions for circles around the perimeter
    // Start at 90 degrees (top of circle) by offsetting by -π/2
    // Round values to prevent hydration mismatches
    const circlePositions = Array.from({ length: numCircles }, (_, i) => {
        // Start at 90 degrees (top) by subtracting π/2, then distribute evenly
        const angle = (i / numCircles) * 2 * Math.PI - Math.PI / 2; // -π/2 to start at top
        const x = Math.round((centerX + radius * Math.cos(angle)) * 100) / 100;
        const y = Math.round((centerY + radius * Math.sin(angle)) * 100) / 100;
        return { x, y, angle };
    });

    const handleCircleClick = async (circleNumber: number) => {
        if (externalSelectedCircle === undefined) {
            // Update internal state
            setInternalSelectedCircle(circleNumber);
        }
        
        // Call custom callback
        onCircleClick?.(circleNumber);
    };

    return (
        <div
            className={`relative overflow-visible flex flex-col items-center justify-center ${className ?? ""}`}
            style={{
                width: `${containerSize}px`,
                height: `${containerSize}px`,
                borderRadius: "50%",
                backgroundImage: "url('/assets/icons/others/circle_bg.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            data-name="Star Ring"
            data-node-id="2133:338"
        >
            {/* Rotating perimeter: circles + labels */}
            <motion.div
                className="absolute inset-0"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={
                    reduceMotion
                        ? undefined
                        : { duration: 48, repeat: Infinity, ease: "linear" }
                }
                style={{ transformOrigin: "50% 50%" }}
            >
                {circlePositions.map((pos, index) => {
                    const circleNumber = index + 1; // 1-based numbering
                    const isSelected = selectedCircle !== null && circleNumber <= selectedCircle;
                    const slot = useSlotOutcomes ? slots?.[index] ?? null : null;
                    const labelFromSlot = slot?.label?.trim() ?? "";
                    const labelFromLegacy = soundLabels[index] ? String(soundLabels[index]).toUpperCase() : "";
                    const label = labelFromSlot || labelFromLegacy;
                    const labelX = Math.round((centerX + (radius + labelRadiusOffset) * Math.cos(pos.angle)) * 100) / 100;
                    const labelY = Math.round((centerY + (radius + labelRadiusOffset) * Math.sin(pos.angle)) * 100) / 100;

                    let circleBg = "#FFFFFF";
                    let circleFilter = "none";
                    if (useSlotOutcomes && slot) {
                        if (slot.status === "failed") {
                            circleBg = "#EF4444";
                            circleFilter = "drop-shadow(0 0 3px rgba(239, 68, 68, 0.85))";
                        } else {
                            circleBg = "#E451FE";
                            circleFilter = "drop-shadow(0 0 3px rgba(228, 81, 254, 0.75))";
                        }
                    } else if (!useSlotOutcomes && isSelected) {
                        circleBg = "#75FF1A";
                        circleFilter = "drop-shadow(0 0 2.258px #98FF55)";
                    }

                    const labelColor =
                        useSlotOutcomes && slot
                            ? slot.status === "failed"
                                ? "#F87171"
                                : "#F9A8FF"
                            : "#E451FE";
                    const labelShadow =
                        useSlotOutcomes && slot
                            ? slot.status === "failed"
                                ? "0 0 6px rgba(248, 113, 113, 0.65)"
                                : "0 0 6px rgba(228, 81, 254, 0.55)"
                            : "0 0 6px rgba(228, 81, 254, 0.55)";

                    return (
                        <Fragment key={index}>
                            <div
                                className="absolute rounded-full transition-all duration-150"
                                onClick={onCircleClick ? () => handleCircleClick(circleNumber) : undefined}
                                style={{
                                    width: `${smallCircleSize}px`,
                                    height: `${smallCircleSize}px`,
                                    left: `${pos.x.toFixed(2)}px`,
                                    top: `${pos.y.toFixed(2)}px`,
                                    backgroundColor: circleBg,
                                    filter: circleFilter,
                                    transform: "translate(-50%, -50%)",
                                    cursor: onCircleClick ? "pointer" : "default",
                                }}
                            />
                            {label ? (
                                <motion.div
                                    className="absolute select-none"
                                    style={{
                                        left: `${labelX.toFixed(2)}px`,
                                        top: `${labelY.toFixed(2)}px`,
                                        transform: "translate(-50%, -50%)",
                                        color: labelColor,
                                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        letterSpacing: "0.6px",
                                        textTransform: "uppercase",
                                        textShadow: labelShadow,
                                        pointerEvents: "none",
                                    }}
                                    animate={reduceMotion ? undefined : { rotate: -360 }}
                                    transition={
                                        reduceMotion
                                            ? undefined
                                            : { duration: 48, repeat: Infinity, ease: "linear" }
                                    }
                                >
                                    {label}
                                </motion.div>
                            ) : null}
                        </Fragment>
                    );
                })}
            </motion.div>

            {/* Megaphone icon */}
            <Image
                alt="Megaphone"
                src="/assets/icons/others/megaphone_icon.png"
                width={88.08}
                height={86.245}
                data-name="image 335"
                data-node-id="2133:342"
            />

            {/* Text with volume percentage */}
            <div
                className="text-center text-white uppercase whitespace-nowrap"
                style={{
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "31.182px",
                    lineHeight: "35.08px",
                    letterSpacing: "-0.343px",
                }}
                data-node-id="2133:341"
            >
                <p className="mb-0">sound</p>
                <p>star ring</p>
                {progressLabel && (
                    <p style={{ fontSize: "18px", marginTop: "8px", color: "#75FF1A" }}>
                        {progressLabel}
                    </p>
                )}
            </div>
        </div>
    );
}

