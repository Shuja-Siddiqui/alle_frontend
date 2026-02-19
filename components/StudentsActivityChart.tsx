"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type DailyActivityData = {
  day: string;
  students: number;
  date?: string; // Optional date string like "5 Jan"
};

type StudentsActivityChartProps = {
  /** Daily student activity data */
  dailyData: DailyActivityData[];
  /** Total students this week */
  totalStudents: number;
  /** Optional className */
  className?: string;
};

const defaultData: DailyActivityData[] = [
  { day: "Fri", students: 34, date: "1 Jan" },
  { day: "Sat", students: 48, date: "2 Jan" },
  { day: "Sun", students: 61, date: "3 Jan" },
  { day: "Mon", students: 121, date: "4 Jan" },
  { day: "Thu", students: 105, date: "5 Jan" },
  { day: "Wed", students: 126, date: "6 Jan" },
  { day: "Thu", students: 147, date: "7 Jan" },
  { day: "Fri", students: 173, date: "8 Jan" },
  { day: "Sat", students: 126, date: "9 Jan" },
  { day: "Sun", students: 69, date: "10 Jan" },
  { day: "Mon", students: 206, date: "11 Jan" },
];

// Maximum value for scaling (200 based on Y-axis)
const MAX_STUDENTS = 200;

export function StudentsActivityChart({
  dailyData = defaultData,
  totalStudents = 213,
  className,
}: StudentsActivityChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate bar heights as percentages
  const maxValue = Math.max(...dailyData.map((d) => d.students), MAX_STUDENTS);

  function handleBarHover(index: number, event: React.MouseEvent<HTMLDivElement>) {
    setSelectedIndex(index);
    const barElement = event.currentTarget;
    const containerElement = barElement.closest('[data-chart-container]') as HTMLElement;
    
    if (containerElement) {
      const barRect = barElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();
      
      // Position tooltip above the bar, centered
      setTooltipPosition({
        top: barRect.top - containerRect.top - 60, // 60px above the bar
        left: barRect.left - containerRect.left + barRect.width / 2, // Centered on bar
      });
    }
  }

  function handleBarLeave() {
    setSelectedIndex(null);
    setTooltipPosition(null);
  }

  return (
    <div
      className={`flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage: "linear-gradient(166.49deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        width: "752px",
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
          Students activity
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
            whiteSpace: "pre-wrap",
          }}
        >
          <span>Students this week: </span>
          <span style={{ color: "#FFFFFF" }}>{totalStudents}</span>
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex gap-[16px] h-[273px] items-center relative w-full">
        {/* Grid Lines Background */}
        <div
          className="absolute bottom-[-0.5px] flex h-[273px] items-start justify-between left-[56px] opacity-30 rounded-[343434px] w-[648px]"
        >
          {/* Vertical grid lines */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="bg-[#434b93] rounded-[60px] shrink-0"
              style={{
                height: "236px",
                width: "1px",
              }}
            />
          ))}
          {/* Horizontal grid lines */}
          {[0, 47.5, 94.5, 141.5].map((top) => (
            <div
              key={`h-${top}`}
              className="absolute flex h-px items-center justify-center left-0"
              style={{ top: `${top}px`, width: "648px" }}
            >
              <div className="flex-none rotate-90">
                <div
                  className="bg-[#434b93] rounded-[60px]"
                  style={{
                    height: "648px",
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
          {["200", "150", "100", "50", "25", "0"].map((label, i) => (
            <p
              key={label}
              className="absolute left-0"
              style={{ top: `${i * 44}px` }}
            >
              {label}
            </p>
          ))}
        </div>

        {/* Bars and X-axis labels */}
        <div className="flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-0 relative" data-chart-container>
          {/* Tooltip */}
          {selectedIndex !== null && tooltipPosition && (
            <div
              className="absolute flex gap-[12px] items-center p-[16px] rounded-[32px] z-10"
              style={{
                backgroundColor: "#1b1f4e",
                border: "1px solid #e451fe",
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
              }}
            >
              {/* Clock icon */}
              <div className="relative shrink-0" style={{ width: "20px", height: "20px" }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5" fill="none" />
                  <line x1="10" y1="10" x2="10" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="10" y1="10" x2="13" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              {/* Tooltip text */}
              <p
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                  letterSpacing: "-0.28px",
                }}
              >
                {dailyData[selectedIndex].day}, {dailyData[selectedIndex].date || ""} - {dailyData[selectedIndex].students} students interacted
              </p>
            </div>
          )}

          {/* Bars */}
          <div className="flex h-[237px] items-end justify-between relative w-full">
            {dailyData.map((data, index) => {
              // Calculate height as percentage of max value
              const heightPercent = (data.students / maxValue) * 100;
              // Scale to max height of 236px
              const barHeight = (heightPercent / 100) * 236;
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={index}
                  ref={(el) => (barRefs.current[index] = el)}
                  className="rounded-[12px] shrink-0 cursor-pointer transition-colors"
                  onMouseEnter={(e) => handleBarHover(index, e)}
                  onMouseLeave={handleBarLeave}
                  style={{
                    height: `${barHeight}px`,
                    width: "40px",
                    backgroundColor: isSelected ? "#FF00CA" : "#434b93",
                    borderRadius: "12px",
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
            {dailyData.map((data, index) => (
              <p key={index} className="relative shrink-0" style={{ width: "40px" }}>
                {data.day}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

