"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";

type XpSliderProps = {
  /** Current XP value */
  value: number;
  /** Minimum XP, defaults to 0 */
  min?: number;
  /** Maximum XP needed to fill the bar */
  max: number;
  /** Called when user drags the slider thumb */
  onChange?: (value: number) => void;
  /** Optional label, e.g. "XP" or "LEVEL 1" */
  label?: string;
  /** Hide the XP numbers display */
  hideNumbers?: boolean;
  /** Width of the XP bar in pixels */
  barWidth?: number;
  /** Height of the XP bar in pixels */
  barHeight?: number;
  /** Width of the battery icon in pixels */
  batteryWidth?: number;
  /** Height of the battery icon in pixels */
  batteryHeight?: number;
  /** Width of the container (includes battery and bar) */
  containerWidth?: number;
  /** Height of the container (includes battery and bar) */
  containerHeight?: number;
  className?: string;
};

export function XpSlider({
  value,
  min = 0,
  max,
  onChange,
  label = "XP",
  hideNumbers = false,
  barWidth = 449.667,
  barHeight = 57.852,
  batteryWidth = 119.445,
  batteryHeight = 157.236,
  containerWidth,
  containerHeight,
  className,
}: XpSliderProps) {
  const clamped = Math.min(Math.max(value, min), max);
  const percent = ((clamped - min) / (max - min)) * 100;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    onChange?.(next);
  };

  return (
    <div className={`flex flex-col gap-[10px] ${className ?? ""}`}>
      {!hideNumbers && (
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              letterSpacing: "0.08em",
            }}
            className="uppercase text-[#B0B3FF]"
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
            }}
            className="text-white"
          >
            {clamped} / {max}
          </span>
        </div>
      )}

      {/* Wrapper div - relative positioning */}
      <div
        className="relative"
        style={{
          width: containerWidth ? `${containerWidth}px` : "auto",
          height: containerHeight ? `${containerHeight}px` : `${Math.max(barHeight, batteryHeight)}px`,
          overflow: "visible",
        }}
      >
        {/* Shade background - absolute, positioned on right side, covers ~50% of XP bar */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-30px",
            top: "50%",
            transform: "translateY(-50%)",
            width: `187px`, // 50% of bar width
            height: `150px`,
            backgroundImage: "url('/assets/icons/others/xp_shade.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />

        {/* Main container so battery sits over the start of the slider */}
        <div
          className="flex items-center justify-end relative"
          style={{
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <div className="relative" style={{ width: `${barWidth}px`, height: `${barHeight}px` }}>
            {/* Visual XP bar */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: `${barHeight}px`, // Full height for pill shape
                background: "transparent",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  borderRadius: "108.305px 0 0 108.305px",
                  background:
                    "linear-gradient(90deg, #FFB6E1 0%, #FF00CA 100%)",
                }}
              />

              {/* End progress bar marker */}
              <div
                className="pointer-events-none"
                style={{
                  position: "absolute",
                  left: `${percent}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: `${barWidth * 0.0294}px`, // Proportional to bar width
                  height: `${barHeight * 1.393}px`, // Proportional to bar height
                  borderRadius: `${barHeight * 0.541}px`,
                  background: "#FF00C8",
                }}
              />
            </div>

            {/* Battery icon sitting at the very start of the slider */}
            <div
              className="pointer-events-none absolute top-0 -translate-y-1/2"
              style={{
                left: `${-batteryWidth * 0.67}px`,
              }}
            >
              <Image
                src="/assets/icons/others/battery.svg"
                alt="XP battery"
                width={batteryWidth}
                height={batteryHeight}
                style={{
                  aspectRatio: `${batteryWidth / batteryHeight}`,
                }}
              />
            </div>

            {/* Transparent native range input for interaction */}
            <input
              type="range"
              min={min}
              max={max}
              value={clamped}
              onChange={handleChange}
              className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


