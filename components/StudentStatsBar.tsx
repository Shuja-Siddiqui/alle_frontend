"use client";

type StudentStatsBarProps = {
  /** Current module number */
  currentModule: number;
  /** Number of lessons completed */
  lessonsCompleted: number;
  /** Student grade */
  grade: number;
  /** Optional className */
  className?: string;
};

export function StudentStatsBar({
  currentModule,
  lessonsCompleted,
  grade,
  className,
}: StudentStatsBarProps) {
  return (
    <div
      className={`flex items-center justify-between px-[44px] py-[24px] relative rounded-[51.22px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(176.9845745951189deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        width: "1140px",
      }}
    >
      {/* Current Module */}
      <div className="flex flex-[1_0_0] flex-col gap-[12px] items-center relative rounded-[12px] text-center uppercase">
        <p
          style={{
            color: "#ff00ca",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "42px",
            letterSpacing: "-0.396px",
          }}
        >
          {currentModule}
        </p>
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "-0.198px",
          }}
        >
          Current Module
        </p>
      </div>

      {/* Lessons Completed */}
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex flex-[1_0_0] flex-col gap-[12px] h-full items-center justify-center relative rounded-[51.22px] text-center uppercase">
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "42px",
              letterSpacing: "-0.396px",
            }}
          >
            {lessonsCompleted}
          </p>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: "-0.198px",
            }}
          >
            Lessons Completed
          </p>
        </div>
      </div>

      {/* Grade */}
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex flex-[1_0_0] flex-col gap-[12px] h-full items-center justify-center relative rounded-[51.22px] text-center uppercase">
          <p
            style={{
              color: "#ff00ca",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "42px",
              letterSpacing: "-0.396px",
            }}
          >
            {grade}
          </p>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: "-0.198px",
            }}
          >
            Grade
          </p>
        </div>
      </div>
    </div>
  );
}

