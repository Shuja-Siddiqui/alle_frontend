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
    const containerSize = 424.667;
    const radius = containerSize / 2; // 204.5px
    const centerX = radius;
    const centerY = radius;
    const numCircles = 45;
    const smallCircleSize = 17.898; // Size of each small circle
    
    // Volume control hook
    const { volume, setVolume, saveVolume } = useVolumeControl();
    const [showVolumePrompt, setShowVolumePrompt] = useState(false);
    
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

    // Show a friendly prompt when sound is muted (0%)
    useEffect(() => {
        if (!syncWithVolume) return;
        if (volume === 0) {
            setShowVolumePrompt(true);
        } else {
            setShowVolumePrompt(false);
        }
    }, [volume, syncWithVolume]);

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
            if (newVolume > 0) {
                setShowVolumePrompt(false);
            }
            
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
            {showVolumePrompt && (
                <div
                    className="absolute z-20"
                    style={{
                        top: "-76px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "310px",
                        padding: "12px 14px",
                        borderRadius: "16px",
                        border: "2px solid #E451FE",
                        background: "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
                        color: "#FFFFFF",
                        textAlign: "center",
                        boxShadow: "0 0 16px rgba(255, 0, 200, 0.35)",
                        animation: "softPulse 1.6s ease-in-out infinite",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                            fontSize: "12px",
                            lineHeight: "16px",
                            margin: 0,
                        }}
                    >
                        Sound is muted. Increase volume to hear lesson audio.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowVolumePrompt(false)}
                        style={{
                            marginTop: "8px",
                            border: "1px solid #E451FE",
                            borderRadius: "10px",
                            padding: "4px 10px",
                            color: "#75FF1A",
                            background: "transparent",
                            fontSize: "11px",
                            cursor: "pointer",
                        }}
                    >
                        Got it
                    </button>
                    <style jsx>{`
                        @keyframes softPulse {
                            0%,
                            100% {
                                transform: translateX(-50%) scale(1);
                                box-shadow: 0 0 10px rgba(255, 0, 200, 0.2);
                            }
                            50% {
                                transform: translateX(-50%) scale(1.02);
                                box-shadow: 0 0 20px rgba(117, 255, 26, 0.35);
                            }
                        }
                    `}</style>
                </div>
            )}

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

