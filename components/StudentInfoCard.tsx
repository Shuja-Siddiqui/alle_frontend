"use client";

import Image from "next/image";

type StudentInfoCardProps = {
  /** Student avatar image source */
  avatarSrc: string;
  /** Student avatar alt text */
  avatarAlt: string;
  /** Student name */
  name: string;
  /** Student email */
  email: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Optional className */
  className?: string;
};

export function StudentInfoCard({
  avatarSrc,
  avatarAlt,
  name,
  email,
  progress,
  className,
}: StudentInfoCardProps) {
  return (
    <div
      className={`flex flex-col gap-[32px] items-start justify-center p-[44px] relative rounded-[51.22px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(173.69859411986604deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        width: "751px",
        height: "174px",
      }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left side: Avatar and Info */}
        <div className="flex gap-[24px] items-center">
          {/* Avatar */}
          <div className="relative shrink-0" style={{ width: "86px", height: "86px" }}>
            <Image
              src={avatarSrc}
              alt={avatarAlt}
              width={86}
              height={86}
              className="block max-w-none size-full rounded-full"
            />
          </div>

          {/* Name and Email */}
          <div className="flex flex-col gap-[12px] items-start justify-center">
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "30px",
                letterSpacing: "-0.264px",
                textTransform: "uppercase",
              }}
            >
              {name}
            </p>
            <div className="flex gap-[4px] items-center">
              <p
                style={{
                  color: "#ff00c8",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "1.5",
                  letterSpacing: "-0.176px",
                }}
              >
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Progress with Battery Icon */}
        <div className="flex gap-[12px] items-center">
          {/* Battery Icon */}
          <div
            className="relative shrink-0"
            style={{
              width: "30.282px",
              height: "39.863px",
            }}
          >
            <Image
              src="/assets/icons/others/battery.svg"
              alt="Battery"
              width={30}
              height={40}
              className="block max-w-none"
              style={{ width: "30.282px", height: "39.863px" }}
            />
          </div>

          {/* Progress Text */}
          <div className="flex flex-col gap-[4px] items-start justify-center">
            <p
              style={{
                color: "#ff00c8",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "-0.198px",
                textTransform: "uppercase",
              }}
            >
              {progress}%
            </p>
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "-0.28px",
              }}
            >
              Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

