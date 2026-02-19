"use client";

type LessonObjectiveProps = {
  /** Lesson objective text */
  objective: string;
  /** Array of tags/skills (e.g., ["Blending", "Sound recognition"]) */
  tags?: string[];
  /** Optional className */
  className?: string;
};

export function LessonObjective({
  objective,
  tags = [],
  className,
}: LessonObjectiveProps) {
  return (
    <div
      className={`flex flex-col h-[329px] items-start justify-between px-[32px] py-[24px] rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(82.30428116961191deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
      }}
    >
      <div className="flex flex-col gap-[24px] items-start">
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
          Lesson objective
        </p>
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "-0.154px",
            width: "300px",
          }}
        >
          {objective}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-[12px] items-start w-full">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-[12px] py-[12px] rounded-[60px] shrink-0"
              style={{
                backgroundColor: "#434b93",
              }}
            >
              <p
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "-0.28px",
                  textAlign: "center",
                }}
              >
                {tag}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

