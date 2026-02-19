"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

type ModuleStatCardProps = {
  /** Module number (e.g., "Module 1") */
  moduleNumber: string;
  /** Module title (e.g., "High-frequency foundations") */
  title: string;
  /** Number of lessons */
  lessons: number;
  /** Number of students */
  students: number;
  /** Weeks range (e.g., "1-2") */
  weeks: string;
  /** Grades range (e.g., "1-2") */
  grades: string;
  /** Module ID for navigation */
  moduleId?: string;
  /** Arrow icon source path */
  arrowIconSrc?: string;
  /** Optional className for custom styling */
  className?: string;
};

export function ModuleStatCard({
  moduleNumber,
  title,
  lessons,
  students,
  weeks,
  grades,
  moduleId,
  arrowIconSrc = "/assets/icons/others/pink_forward.svg",
  className,
}: ModuleStatCardProps) {
  const router = useRouter();

  function handleArrowClick() {
    if (moduleId) {
      router.push(`/admin/modules/${moduleId}`);
    }
  }

  return (
    <div
      className={`flex flex-col gap-[32px] items-start p-[24px] rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(70.26738318578197deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
      }}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between w-full">
        {/* Module Info */}
        <div className="flex flex-col gap-[8px] items-start">
          {/* Module Number */}
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
            }}
          >
            {moduleNumber}
          </p>
          {/* Module Title */}
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: "-0.198px",
              textTransform: "uppercase",
            }}
          >
            {title}
          </p>
        </div>

        {/* Arrow Icon */}
        <button
          type="button"
          onClick={handleArrowClick}
          className="flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none p-0"
          style={{
            width: "36px",
            height: "36px",
          }}
        >
          <Image
            src={arrowIconSrc}
            alt="View module details"
            width={36}
            height={36}
            className="block max-w-none size-full"
          />
        </button>
      </div>

      {/* Stats Section */}
      <div className="flex gap-[44px] items-center w-full">
        {/* Lessons Stat */}
        <div className="flex flex-1 flex-col gap-[8px] items-start">
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.264px",
            }}
          >
            {lessons}
          </p>
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
            }}
          >
            Lessons
          </p>
        </div>

        {/* Students Stat */}
        <div className="flex flex-1 flex-col gap-[8px] items-start">
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.264px",
            }}
          >
            {students}
          </p>
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
            }}
          >
            Students
          </p>
        </div>

        {/* Weeks Stat */}
        <div className="flex flex-1 flex-col gap-[8px] items-start">
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.264px",
            }}
          >
            {weeks}
          </p>
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
            }}
          >
            Weeks
          </p>
        </div>

        {/* Grades Stat */}
        <div className="flex flex-1 flex-col gap-[8px] items-start">
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.264px",
            }}
          >
            {grades}
          </p>
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.154px",
            }}
          >
            Grades
          </p>
        </div>
      </div>
    </div>
  );
}



