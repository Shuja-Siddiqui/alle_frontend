"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Image from "next/image";

type StudentEngagementCardProps = {
  /** Engagement percentage (0-100) */
  percentage: number;
  /** Change percentage vs last week (e.g., +4) */
  changePercentage: number;
  /** Optional className */
  className?: string;
};

export function StudentEngagementCard({
  percentage = 66,
  changePercentage = 4,
  className,
}: StudentEngagementCardProps) {
  // Data for the donut chart
  const data = [
    { name: "Engaged", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  // Custom gradient for the chart
  const gradientId = "engagementGradient";

  // Colors
  const remainingColor = "#21265d"; // Dark blue

  return (
    <div
      className={`flex gap-[32px] items-center justify-center p-[44px] relative rounded-[51.22px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(167.19942403025036deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        width: "365px",
        height: "174px",
      }}
    >
      <div className="flex flex-[1_0_0] gap-[16px] items-center">
        {/* Circular Progress Chart */}
        <div className="relative shrink-0" style={{ width: "128px", height: "128px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F529F9" />
                  <stop offset="100%" stopColor="#0756FF" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={64}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                cornerRadius={0}
              >
                <Cell key="engaged" fill={`url(#${gradientId})`} />
                <Cell key="remaining" fill={remainingColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Icon in center - using analytics icon as placeholder */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: "77.27px",
              left: "1.56px",
              width: "22.634px",
              height: "22.634px",
            }}
          >
            <Image
              src="/assets/icons/admin/analytics.svg"
              alt="Engagement"
              width={23}
              height={23}
              className="block max-w-none"
            />
          </div>

          {/* Center Percentage Text */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <p
              style={{
                color: "#ff00ca",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "30px",
                letterSpacing: "-0.264px",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {percentage}%
            </p>
          </div>
        </div>

        {/* Info Text */}
        <div className="flex flex-col gap-[12px] items-start justify-center" style={{ width: "133px" }}>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "20px",
              letterSpacing: "-0.28px",
              whiteSpace: "pre-wrap",
            }}
          >
            Engagement rate
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
            <span style={{ color: "#38ffa2" }}>+{changePercentage}% </span>
            <span>vs last week</span>
          </p>
        </div>
      </div>
    </div>
  );
}

