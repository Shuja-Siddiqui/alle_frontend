"use client";

type DailyData = {
  day: string;
  minutes: number;
};

type LearningTimeChartProps = {
  /** Daily learning time data for the week */
  dailyData: DailyData[];
  /** Total time for the week (e.g., "2h 23m") */
  totalTime: string;
  /** Optional className */
  className?: string;
};

const defaultData: DailyData[] = [
  { day: "Mon", minutes: 13 },
  { day: "Tue", minutes: 25 },
  { day: "Wed", minutes: 39 },
  { day: "Thu", minutes: 42 },
  { day: "Fri", minutes: 26 },
  { day: "Sat", minutes: 17 },
  { day: "Sun", minutes: 33 },
];

// Maximum height for the chart (in minutes) - used to scale bars
const MAX_MINUTES = 60;

export function LearningTimeChart({
  dailyData = defaultData,
  totalTime = "2h 23m",
  className,
}: LearningTimeChartProps) {
  // Calculate bar heights as percentages
  const maxValue = Math.max(...dailyData.map((d) => d.minutes), MAX_MINUTES);

  return (
    <div
      className={`flex flex-col gap-[16px] items-start overflow-clip px-[44px] py-[32px] relative rounded-[36px] ${className ?? ""}`}
      style={{
        backgroundImage: "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
        width: "557px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "28px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "1.5",
            letterSpacing: "-0.308px",
            textTransform: "uppercase",
          }}
        >
          learning Time
        </p>
        <p
          style={{
            color: "#7478a2",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "-0.28px",
            textAlign: "right",
            width: "126px",
            whiteSpace: "pre-wrap",
          }}
        >
          <span>Total this week: </span>
          <span style={{ color: "#FFFFFF" }}>{totalTime}</span>
        </p>
      </div>

      {/* Chart Container */}
      <div
        className="flex gap-[4px] h-[220px] items-end justify-end overflow-clip p-[16px] relative rounded-[12px] w-full"
        style={{
          backgroundColor: "#21265d",
        }}
      >
        {/* Grid Lines */}
        <div
          className="absolute flex items-center justify-between left-[61px] opacity-30 rounded-[343434px] top-[16px] w-[393px]"
          style={{ height: "152px" }}
        >
          {/* Vertical grid lines */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="bg-[#434b93] rounded-[60px] shrink-0"
              style={{
                height: "152px",
                width: "1px",
              }}
            />
          ))}
          {/* Horizontal grid lines */}
          {[0, 30, 60, 90, 120, 152].map((top) => (
            <div
              key={`h-${top}`}
              className="absolute flex h-px items-center justify-center left-0"
              style={{ top: `${top}px`, width: "393px" }}
            >
              <div className="flex-none rotate-90">
                <div
                  className="bg-[#434b93] rounded-[60px]"
                  style={{
                    height: "393px",
                    width: "1px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div
          className="h-full leading-[18px] relative shrink-0 text-[#7478a2] text-[12px] tracking-[-0.132px] w-[40px]"
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          {["1h", "30m", "15m", "10m", "5m", "0m"].map((label, i) => (
            <p
              key={label}
              className="absolute left-0"
              style={{ top: `${i * 27}px` }}
            >
              {label}
            </p>
          ))}
        </div>

        {/* Bars and X-axis labels */}
        <div className="flex flex-[1_0_0] flex-col gap-[12px] h-[188px] items-start min-w-0 relative">
          {/* Bars */}
          <div className="flex flex-[1_0_0] items-end justify-between min-w-0 relative w-full">
            {dailyData.map((data, index) => {
              // Calculate height as percentage of max value
              const heightPercent = (data.minutes / maxValue) * 100;
              // Scale to max height of 152px (188px - 36px for labels)
              const barHeight = (heightPercent / 100) * 152;

              return (
                <div
                  key={index}
                  className="bg-[#434b93] rounded-[12px] shrink-0"
                  style={{
                    height: `${barHeight}px`,
                    width: "40px",
                  }}
                />
              );
            })}
          </div>

          {/* X-axis labels */}
          <div
            className="flex font-medium items-center justify-between leading-[1.5] relative shrink-0 text-[#7478a2] text-[16px] text-center tracking-[-0.176px] w-full"
            style={{
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontWeight: 500,
              whiteSpace: "pre-wrap",
            }}
          >
            {dailyData.map((data) => (
              <p key={data.day} className="relative shrink-0" style={{ width: "40px" }}>
                {data.day}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

