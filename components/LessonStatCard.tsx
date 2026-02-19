"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export type LessonType = "intro" | "practice" | "blending" | "reading" | "mastery-check" | "wrap-up";

type LessonStatCardProps = {
  /** Lesson number and title (e.g., "Lesson 1: AI vowel team") */
  lessonTitle: string;
  /** Lesson description */
  description: string;
  /** Lesson type */
  lessonType: LessonType;
  /** Sound letter (e.g., "S", "A", "T") */
  sound: string;
  /** Number of students */
  students: number;
  /** Estimated time (e.g., "1 min.", "2 min.") */
  estimatedTime: string;
  /** Module ID for navigation */
  moduleId?: string;
  /** Lesson ID for navigation */
  lessonId?: string;
  /** Arrow icon source path */
  arrowIconSrc?: string;
  /** Optional click handler (overrides default navigation) */
  onClick?: () => void;
  /** Optional className */
  className?: string;
};

const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  intro: "Intro",
  practice: "Practice",
  blending: "Blending",
  reading: "Reading",
  "mastery-check": "Mastery Check",
  "wrap-up": "Wrap-up",
};

export function LessonStatCard({
  lessonTitle,
  description,
  lessonType,
  sound,
  students,
  estimatedTime,
  moduleId,
  lessonId,
  arrowIconSrc = "/assets/icons/others/pink_forward.svg",
  onClick,
  className,
}: LessonStatCardProps) {
  const router = useRouter();

  function handleArrowClick() {
    if (onClick) {
      onClick();
    } else if (moduleId && lessonId) {
      router.push(`/admin/modules/${moduleId}/lessons/${lessonId}`);
    }
  }

  return (
    <div
      className={`flex gap-[24px] items-center px-[32px] py-[24px] rounded-[32px] ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(38.56230626374987deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
      }}
      onClick={onClick}
    >
      {/* Lesson Info Section */}
      <div className="flex flex-1 gap-[44px] items-center">
        {/* Lesson Details */}
        <div
          className="flex flex-col gap-[12px] items-start"
          style={{ width: "385px" }}
        >
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "1.5",
              letterSpacing: "-0.198px",
            }}
          >
            {lessonTitle}
          </p>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "1.5",
              letterSpacing: "-0.176px",
            }}
          >
            {description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex gap-[48px] items-center">
          {/* Lesson Type */}
          <div className="flex flex-col gap-[8px] items-start" style={{ width: "149px" }}>
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.5",
                letterSpacing: "-0.198px",
              }}
            >
              {LESSON_TYPE_LABELS[lessonType]}
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
              Lesson type
            </p>
          </div>

          {/* Sound */}
          <div className="flex flex-col gap-[8px] items-start" style={{ width: "80px" }}>
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.5",
                letterSpacing: "-0.198px",
              }}
            >
              {sound}
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
              Sound
            </p>
          </div>

          {/* Students */}
          <div className="flex flex-col gap-[8px] items-start">
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.5",
                letterSpacing: "-0.198px",
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

          {/* Estimated Time */}
          <div className="flex flex-col gap-[8px] items-start">
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.5",
                letterSpacing: "-0.198px",
              }}
            >
              {estimatedTime}
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
              Estimated time
            </p>
          </div>
        </div>
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
          alt="View lesson details"
          width={36}
          height={36}
          className="block max-w-none size-full"
        />
      </button>
    </div>
  );
}

