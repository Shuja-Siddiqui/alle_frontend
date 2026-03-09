"use client";

import Image from "next/image";

/** Progress steps: 0, 5, 10, ..., 100 (gap of 5) */
const STEP_GAP = 5;

const PROGRESS_BAR_BASE = "/assets/icons/progressbar";

type XpProgressBarProps = {
  /** Current value (e.g. XP). Default 0. */
  value?: number;
  /** Maximum value (e.g. max XP for level). Default 100. */
  max?: number;
  /** Or pass percentage directly (0–100); overrides value/max if provided */
  percent?: number;
  /** Optional label above the bar */
  label?: string;
  /** Hide the numeric display (e.g. "45 / 100") */
  hideNumbers?: boolean;
  /** Width of the bar image */
  width?: number;
  /** Height of the bar image */
  height?: number;
  className?: string;
};

/**
 * Floors a 0–100 percentage to the previous 5% step (0, 5, 10, …, 100)
 * so the correct image is shown: e.g. 16% → 15% image, 20% → 20% image.
 */
function getStepForImage(p: number): number {
  const clamped = Math.min(100, Math.max(0, p));
  const step = Math.floor(clamped / STEP_GAP) * STEP_GAP;
  return step;
}

/**
 * Returns the public path for State=X%.svg.
 * Percent sign in URL must be encoded as %25.
 */
function getProgressBarSrc(step: number): string {
  return `${PROGRESS_BAR_BASE}/State=${step}%25.svg`;
}

export function XpProgressBar({
  value = 0,
  max = 100,
  percent: percentProp,
  label = "XP",
  hideNumbers = false,
  width,
  height,
  className,
}: XpProgressBarProps) {
  const percent =
    percentProp !== undefined
      ? Math.min(100, Math.max(0, percentProp))
      : max <= 0
        ? 0
        : ((value / max) * 100);
  const step = getStepForImage(percent);
  const src = getProgressBarSrc(step);

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
            {Math.round(value)} / {max}
          </span>
        </div>
      )}
      <Image
        src={src}
        alt={`Progress ${step}%`}
        width={width ?? 217}
        height={height ?? 43}
        style={width != null || height != null ? { width: width ?? "auto", height: height ?? "auto" } : undefined}
      />
    </div>
  );
}
