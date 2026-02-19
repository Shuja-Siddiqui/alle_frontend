"use client";

type PerformanceMarkersProps = {
  /** Average accuracy percentage */
  averageAccuracy: number;
  /** Total number of errors */
  totalErrors: number;
  /** Top error sound (e.g., "/s/") */
  topError: string;
  /** Number of correct answers */
  correctAnswers: number;
  /** Number of incorrect answers */
  incorrectAnswers: number;
  /** Partial mastery percentage */
  partialMastery: number;
  /** Critical errors percentage */
  criticalErrors: number;
  /** Optional className */
  className?: string;
};

export function PerformanceMarkers({
  averageAccuracy,
  totalErrors,
  topError,
  correctAnswers,
  incorrectAnswers,
  partialMastery,
  criticalErrors,
  className,
}: PerformanceMarkersProps) {
  return (
    <div
      className={`flex flex-col gap-[32px] items-start px-[32px] py-[24px] rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(74.40196452499231deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
        width: "752px",
      }}
    >
      {/* Student Performance Markers Section */}
      <div className="flex flex-col gap-[20px] items-start w-full">
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
          Student performance markers
        </p>
        <div className="flex gap-[16px] items-start w-full">
          {/* Average Accuracy Card */}
          <div
            className="flex flex-1 gap-[24px] h-[103px] items-center px-[24px] py-[16px] rounded-[32px]"
            style={{
              border: "1px solid #e451fe",
            }}
          >
            <div className="flex flex-col gap-[12px] items-start">
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
                {averageAccuracy}%
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
                Average accuracy
              </p>
            </div>
            {/* Progress Bar */}
            <div
              className="relative flex flex-col gap-[10px] h-[14px] items-start rounded-[32px] shrink-0"
              style={{
                backgroundColor: "#434b93",
                width: "120px",
              }}
            >
              <div
                className="relative h-[14px] rounded-bl-[32px] rounded-tl-[32px] shrink-0"
                style={{
                  backgroundColor: "#ff00ca",
                  width: `${averageAccuracy}%`,
                }}
              >
                {/* Progress Indicator */}
                <div
                  className="absolute bg-[#ff00c8] h-[27px] rounded-[11.898px]"
                  style={{
                    width: "5px",
                    right: "-2.5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Total Errors Card */}
          <div
            className="flex flex-1 flex-col h-[103px] items-start justify-center px-[24px] py-[16px] rounded-[32px]"
            style={{
              border: "1px solid #434b93",
            }}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-[4px] items-start">
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
                  {totalErrors} errors
                </p>
                <p
                  style={{
                    color: "#7478a2",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "18px",
                    letterSpacing: "-0.132px",
                  }}
                >
                  Total mistakes
                </p>
              </div>
              <div className="flex flex-col gap-[4px] items-start">
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
                  {topError}
                </p>
                <p
                  style={{
                    color: "#7478a2",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "18px",
                    letterSpacing: "-0.132px",
                  }}
                >
                  Top error
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="flex flex-col gap-[20px] items-start w-full">
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
          Statistics
        </p>
        <div className="flex gap-[24px] items-start w-full">
          <div className="flex flex-1 flex-col gap-[4px] items-start">
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
              {correctAnswers}
            </p>
            <p
              style={{
                color: "#7478a2",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "18px",
                letterSpacing: "-0.132px",
              }}
            >
              Correct answers
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-[4px] items-start">
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
              {incorrectAnswers}
            </p>
            <p
              style={{
                color: "#7478a2",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "18px",
                letterSpacing: "-0.132px",
              }}
            >
              Incorrect answers
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-[4px] items-start">
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
              {partialMastery}%
            </p>
            <p
              style={{
                color: "#7478a2",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "18px",
                letterSpacing: "-0.132px",
              }}
            >
              Partial mastery
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-[4px] items-start">
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
              {criticalErrors}%
            </p>
            <p
              style={{
                color: "#7478a2",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "18px",
                letterSpacing: "-0.132px",
              }}
            >
              Critical errors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

