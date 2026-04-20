"use client";

import Image from "next/image";

type StudentStatCardProps = {
  /** Student avatar image source */
  avatarSrc: string;
  /** Student avatar alt text */
  avatarAlt?: string;
  /** Student name */
  studentName: string;
  /** Student grade (e.g., "12 Grade") */
  grade: string;
  /** Number of modules completed */
  modules: number;
  /** Number of lessons completed */
  lessons: number;
  /** Optional className for custom styling */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
};

export function StudentStatCard({
  avatarSrc,
  avatarAlt = "Student avatar",
  studentName,
  grade,
  modules,
  lessons,
  className,
  style,
}: StudentStatCardProps) {
  return (
    <div
      className={`flex flex-col gap-[19px] items-start p-[24px] rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(170.34deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        ...style,
      }}
    >
      {/* Top Section - Student Info and Grade */}
      <div className="flex flex-1 items-center justify-between w-full">
        {/* Student Info - Avatar and Name */}
        <div className="flex gap-[12px] items-center">
          {/* Avatar */}
          <div
            className="relative shrink-0"
            style={{
              width: "24px",
              height: "24px",
            }}
          >
            <Image
              src={avatarSrc}
              alt={avatarAlt}
              width={24}
              height={24}
              className="block max-w-none size-full rounded-full"
            />
          </div>
          {/* Student Name */}
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
            {studentName}
          </p>
        </div>

        {/* Grade Badge */}
        <div
          className="flex items-center justify-center px-[10px] py-[4px] rounded-[60px] shrink-0"
          style={{
            backgroundColor: "rgba(255, 0, 202, 0.1)",
          }}
        >
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "22px",
              letterSpacing: "-0.132px",
              textAlign: "center",
            }}
          >
            {grade}
          </p>
        </div>
      </div>

      {/* Bottom Section - Stats (Module and Lessons) */}
      <div className="flex gap-[16px] items-center w-[324px]">
        {/* Module Stat */}
        <div
          className="flex flex-1 items-center justify-between px-[16px] py-[8px] rounded-[12px]"
          style={{
            backgroundColor: "#21265d",
          }}
        >
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "22px",
              letterSpacing: "-0.176px",
            }}
          >
            {modules}
          </p>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "18px",
              letterSpacing: "-0.132px",
            }}
          >
            Module
          </p>
        </div>

        {/* Lessons Stat */}
        <div
          className="flex flex-1 items-center justify-between px-[16px] py-[8px] rounded-[12px]"
          style={{
            backgroundColor: "#21265d",
          }}
        >
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "22px",
              letterSpacing: "-0.176px",
            }}
          >
            {lessons}
          </p>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "18px",
              letterSpacing: "-0.132px",
            }}
          >
            Lessons
          </p>
        </div>
      </div>
    </div>
  );
}



