"use client";

type LessonStatsCardProps = {
  /** Lesson title (e.g., "Lesson 1: AI vowel team") */
  lessonTitle: string;
  /** Sound and lesson type (e.g., "Sound S / Intro") */
  soundAndType: string;
  /** Grade level range (e.g., "8-9") */
  gradeLevel: string;
  /** Completion rate percentage */
  completionRate: number;
  /** Number of students */
  students: number;
  /** Estimated time (e.g., "1 min.") */
  estimatedTime: string;
  /** Optional className */
  className?: string;
};

export function LessonStatsCard({
  lessonTitle,
  soundAndType,
  gradeLevel,
  completionRate,
  students,
  estimatedTime,
  className,
}: LessonStatsCardProps) {
  return (
    <div
      className={`flex items-center justify-between px-[24px] py-[24px] rounded-[32px] ${className ?? ""}`}
      style={{
        border: "2px solid #e451fe",
        backgroundImage:
          "linear-gradient(37.28210745629837deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
      }}
    >
      {/* Left side: Lesson Info */}
      <div className="flex flex-col gap-[4px] items-start">
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
            textAlign: "center",
          }}
        >
          {soundAndType}
        </p>
      </div>

      {/* Right side: Stats */}
      <div className="flex gap-[64px] items-center">
        <div className="flex flex-col gap-[8px] items-start">
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
            {gradeLevel}
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
            Grade level
          </p>
        </div>
        <div className="flex flex-col gap-[8px] items-start">
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
            {completionRate}%
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
            Completion rate
          </p>
        </div>
        <div className="flex flex-col gap-[8px] items-start">
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
        <div className="flex flex-col gap-[8px] items-start">
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
  );
}

