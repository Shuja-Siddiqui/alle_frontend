"use client";

import Image from "next/image";

type StatCardProps = {
  /** Main title/number to display (e.g., "321") */
  title: string;
  /** Subtitle text below the title (e.g., "Total students") */
  subtitle: string;
  /** Optional muted supportive text */
  supportiveText?: string;
  /** Color for supportive text - "green" for positive, "gray" for neutral (default: gray) */
  supportiveTextColor?: "green" | "gray";
  /** Icon source path */
  iconSrc: string;
  /** Icon alt text */
  iconAlt?: string;
  /** Optional className for custom styling */
  className?: string;
};

export function StatCard({
  title,
  subtitle,
  supportiveText,
  supportiveTextColor = "gray",
  iconSrc,
  iconAlt = "",
  className,
}: StatCardProps) {
  return (
    <div
      className={`flex gap-[16px] items-center p-[24px] rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(170.49deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
      }}
    >
      {/* Left side - Info Container */}
      <div className="flex flex-1 flex-col gap-[16px] items-start">
        {/* Header row - Title and supportive text in same row */}
        <div className="flex gap-[12px] items-center w-full">
          {/* Title */}
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "42px",
              letterSpacing: "-0.396px",
              textTransform: "uppercase",
            }}
          >
            {title}
          </p>
          {/* Supportive text (muted) - optional, in same row as title */}
          {supportiveText && (
            <p
              style={{
                color: supportiveTextColor === "green" ? "#38ffa2" : "#7478a2",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "-0.154px",
              }}
            >
              {supportiveText}
            </p>
          )}
        </div>
        {/* Subtitle - below the title row */}
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "22px",
            letterSpacing: "-0.176px",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Right side - Icon Container */}
      <div
        className="flex items-center justify-center shrink-0 p-[12px] rounded-[8px]"
        style={{
          backgroundColor: "#ff00ca",
        }}
      >
        <div
          className="relative shrink-0"
          style={{
            width: "16px",
            height: "16px",
          }}
        >
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={16}
            height={16}
            className="block max-w-none size-full"
          />
        </div>
      </div>
    </div>
  );
}

