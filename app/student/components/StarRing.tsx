"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useVolumeControl } from "@/hooks/useVolumeControl";

type StarRingProps = {
    className?: string;
    /** Selected circle number (1-based). If not provided, uses volume control. */
    selectedCircle?: number;
    /** Initial value (number of circles to light up). Defaults to volume-based. */
    initialValue?: number;
    /** Called when a circle is clicked */
    onCircleClick?: (circleNumber: number) => void;
    /** Whether to sync with volume control (default: true) */
    syncWithVolume?: boolean;
};

export function StarRing({ 
    className, 
    selectedCircle: externalSelectedCircle, 
    initialValue, 
    onCircleClick,
    syncWithVolume = true 
}: StarRingProps) {
    const containerSize = 409;
    const radius = containerSize / 2; // 204.5px
    const centerX = radius;
    const centerY = radius;
    const numCircles = 45;
    const smallCircleSize = 17.898; // Size of each small circle
    
    // Volume control hook
    const { volume, setVolume, saveVolume } = useVolumeControl();
    
    // Convert volume (0-100) to circle count (0-45)
    const volumeToCircles = (vol: number) => Math.round((vol / 100) * numCircles);
    const circlesToVolume = (circles: number) => Math.round((circles / numCircles) * 100);
    
    // Calculate default initial value
    const defaultInitialValue = syncWithVolume ? volumeToCircles(volume) : Math.floor(numCircles / 2);
    const effectiveInitialValue = initialValue ?? defaultInitialValue;
    
    // Initialize internal state with the initial value
    const [internalSelectedCircle, setInternalSelectedCircle] = useState<number | null>(effectiveInitialValue);

    // Sync with volume changes
    useEffect(() => {
        if (syncWithVolume && externalSelectedCircle === undefined) {
            setInternalSelectedCircle(volumeToCircles(volume));
        }
    }, [volume, syncWithVolume, externalSelectedCircle]);

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
        
        // Sync with volume control
        if (syncWithVolume) {
            const newVolume = circlesToVolume(circleNumber);
            console.log(`🔊 StarRing: Setting volume to ${newVolume}% (${circleNumber}/${numCircles} circles)`);
            
            // Update volume locally for instant feedback
            setVolume(newVolume);
            
            // Save to backend (async, doesn't block UI)
            try {
                await saveVolume(newVolume);
                console.log(`✅ StarRing: Volume saved to backend`);
            } catch (error) {
                console.error(`❌ StarRing: Failed to save volume:`, error);
            }
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
            {/* Small circles around the perimeter */}
            {circlePositions.map((pos, index) => {
                const circleNumber = index + 1; // 1-based numbering
                const isSelected = selectedCircle !== null && circleNumber <= selectedCircle;

                return (
                    <div
                        key={index}
                        className="absolute rounded-full cursor-pointer transition-all duration-150"
                        onClick={() => handleCircleClick(circleNumber)}
                        style={{
                            width: `${smallCircleSize}px`,
                            height: `${smallCircleSize}px`,
                            left: `${pos.x.toFixed(2)}px`,
                            top: `${pos.y.toFixed(2)}px`,
                            backgroundColor: isSelected ? "#75FF1A" : "#FFFFFF",
                            filter: isSelected ? "drop-shadow(0 0 2.258px #98FF55)" : "none",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                );
            })}

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
                {syncWithVolume && (
                    <p style={{ fontSize: "18px", marginTop: "8px", color: "#75FF1A" }}>
                        {volume}%
                    </p>
                )}
            </div>
        </div>
    );
}

