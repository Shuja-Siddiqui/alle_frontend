"use client";

import Image from "next/image";

type ModuleGeneralStatsProps = {
  /** Module number and title (e.g., "Module 3: Long vowels") */
  moduleTitle: string;
  /** Number of lessons */
  lessons: number;
  /** Number of students */
  students: number;
  /** Weeks range (e.g., "5-6") */
  weeks: string;
  /** Optional className */
  className?: string;
};

export function ModuleGeneralStats({
  moduleTitle,
  lessons,
  students,
  weeks,
  className,
}: ModuleGeneralStatsProps) {
  return (
    <div
      className={`flex items-center justify-between px-[24px] py-[44px] rounded-[32px] ${className ?? ""}`}
      style={{
        border: "2px solid #e451fe",
        backgroundImage:
          "linear-gradient(47.88251480030948deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
      }}
    >
      <div className="flex flex-col gap-[12px] items-center justify-center">
        <p
          style={{
            color: "#ff00ca",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "30px",
            letterSpacing: "-0.264px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {moduleTitle}
        </p>
        <div className="flex gap-[12px] items-center justify-center">
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
              textAlign: "center",
            }}
          >
            {lessons} lessons
          </p>
          <div
            className="relative shrink-0 flex items-center justify-center"
            style={{
              width: "24px",
              height: "24px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#7478a2",
              }}
            />
          </div>
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
              textAlign: "center",
            }}
          >
            {students} students
          </p>
          <div
            className="relative shrink-0 flex items-center justify-center"
            style={{
              width: "24px",
              height: "24px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#7478a2",
              }}
            />
          </div>
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
              textAlign: "center",
            }}
          >
            {weeks} weeks
          </p>
        </div>
      </div>
    </div>
  );
}

