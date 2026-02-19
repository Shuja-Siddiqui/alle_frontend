"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { useState, useEffect } from "react";

type RetentionMetricsProps = {
  /** Percentage value to display (0-100) */
  percentage?: number;
  /** Change percentage vs last week (e.g., +4) */
  changePercentage?: number;
  /** Optional className for custom styling */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
};

export function RetentionMetrics({
  percentage = 66,
  changePercentage = 4,
  className,
  style,
}: RetentionMetricsProps) {
  // Animated percentage state - always start at 0
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate percentage from 0 to target value - control both chart and thumb manually
  useEffect(() => {
    // Reset to 0 when percentage changes
    setAnimatedPercentage(0);
    setIsAnimating(true);

    // Small delay to ensure component is mounted and ready
    const startDelay = 100;
    const duration = 1500;
    
    const timeoutId = setTimeout(() => {
      const startTime = performance.now();
      const startValue = 0;
      const endValue = percentage;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use ease-out cubic easing
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        setAnimatedPercentage(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedPercentage(endValue);
          setIsAnimating(false);
        }
      };

      // Start animation immediately
      requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [percentage]);

  // Data for the donut chart using animated percentage
  const data = [
    { name: "Completed", value: animatedPercentage },
    { name: "Remaining", value: 100 - animatedPercentage },
  ];

  // Custom gradient for the chart
  const gradientId = "retentionGradient";

  // Colors
  const remainingColor = "#21265d"; // Dark blue

  // Calculate thumb position on the chart using animated percentage
  // Chart starts at 90 degrees (top) and goes clockwise
  // For percentage, calculate the angle: 90 - (percentage * 360 / 100)
  const chartRadius = 70; // outerRadius
  const chartCenterX = 70; // half of 140px width
  const chartCenterY = 70; // half of 140px height
  
  // Convert animated percentage to angle (in degrees)
  // startAngle is 90, and it goes clockwise, so we subtract
  const angleDegrees = 90 - (animatedPercentage * 360 / 100);
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  // Calculate thumb position on the outer edge of the chart
  const thumbX = chartCenterX + chartRadius * Math.cos(angleRadians);
  const thumbY = chartCenterY - chartRadius * Math.sin(angleRadians); // Negative because SVG Y increases downward

  return (
    <div
      className={`relative overflow-clip rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage: "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        width: "364px",
        height: "608px",
        ...style,
      }}
    >
      {/* Title */}
      <p
        className="absolute left-[60%] w-full"
        style={{
          color: "#FFFFFF",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "30px",
          letterSpacing: "-0.264px",
          textTransform: "uppercase",
          transform: "translateX(-50%)",
          top: "24px",
          whiteSpace: "pre-wrap",
        }}
      >
        Retention metrics
      </p>

      {/* Chart and Info Container - Side by side */}
      <div className="absolute flex gap-[16px] items-center" style={{ left: "24px", top: "70px" }}>
        {/* Circular Progress Chart - 140px */}
        <div className="relative shrink-0" style={{ width: "140px", height: "140px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Combined gradient: radial-gradient + linear-gradient */}
                {/* Linear gradient: linear-gradient(88deg, #F529F9 -2.73%, #0756FF 55.29%, #FF21C7 88.74%) */}
                {/* 88deg in CSS (0deg=up, 90deg=right): 88deg is almost horizontal, slightly upward */}
                {/* Convert to SVG: x1=0%, y1=~3.5%, x2=100%, y2=0% */}
                <linearGradient 
                  id={gradientId} 
                  x1="0%" 
                  y1="3.5%" 
                  x2="100%" 
                  y2="0%" 
                  gradientUnits="objectBoundingBox"
                >
                  {/* Normalize offsets from CSS: -2.73% -> 0%, 55.29% -> ~58%, 88.74% -> 100% */}
                  {/* Blend radial effect (rgba(255, 18, 239, 0.70) at start) into linear colors */}
                  <stop offset="0%" stopColor="#F529F9" stopOpacity="1" />
                  <stop offset="2%" stopColor="rgba(245, 41, 249, 0.95)" />
                  <stop offset="16.41%" stopColor="rgba(255, 18, 239, 0.85)" />
                  <stop offset="58%" stopColor="#0756FF" />
                  <stop offset="100%" stopColor="#FF21C7" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                cornerRadius={0}
                isAnimationActive={false}
              >
                {/* Use linear gradient as base - radial effect would require layering which SVG doesn't support directly */}
                <Cell key="completed" fill={`url(#${gradientId})`} />
                <Cell key="remaining" fill={remainingColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Chart Thumb Indicator - Custom Rounded Thumb */}
          <div
            className="absolute"
            style={{
              left: `${thumbX + 14}px`,
              top: `${thumbY}px`,
              transform: "translate(-50%, -50%)",
              width: "24px",
              height: "24px",
              // No CSS transitions - position is controlled entirely by JavaScript animation
              transition: "none",
            }}
          >
            {/* Outer circle with gradient and border */}
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "24.756px",
                border: "1.073px solid rgba(255, 255, 255, 0.24)",
                background: `
                  radial-gradient(3119.74% 102.03% at 20.08% -0.37%, rgba(255, 18, 239, 0.70) 0%, rgba(255, 255, 255, 0.00) 100%),
                  linear-gradient(88deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C7 89.22%)
                `,
                boxShadow: "0 0 0 0.86px #E451FE",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Inner white circle */}
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "18px",
                  background: "#FFF",
                }}
              />
            </div>
          </div>

          {/* Center Percentage Text */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: "40%",
              left: "27%",
            }}
          >
            <p
              style={{
                color: "#ff00ca",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "32px",
                letterSpacing: "-0.264px",
                textAlign: "center",
              }}
            >
              {Math.round(animatedPercentage)}%
            </p>
          </div>
        </div>

        {/* Info Text */}
        <div className="flex flex-col gap-[12px] items-start justify-center">
          {/* Change Percentage */}
          <p
            style={{
              color: "#7478a2",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "18px",
              letterSpacing: "-0.132px",
              whiteSpace: "pre-wrap",
            }}
          >
            <span style={{ color: "#38ffa2" }}>+{changePercentage}% </span>
            <span>vs last week</span>
          </p>
          {/* Description */}
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "22px",
              letterSpacing: "-0.176px",
              width: "152px",
            }}
          >
            Students engagement rate
          </p>
        </div>
      </div>

      {/* Information Box - Bottom */}
      <div
        className="absolute bottom-[24px] left-1/2 flex gap-[12px] items-center p-[16px] rounded-[20px]"
        style={{
          backgroundColor: "#21265d",
          transform: "translateX(-50%)",
          width: "316px",
        }}
      >
        {/* Info Icon */}
        <div
          className="relative shrink-0 overflow-clip"
          style={{
            width: "28px",
            height: "28px",
          }}
        >
          <div
            className="absolute flex items-center justify-center bg-white rounded-[44px]"
            style={{
              width: "22.75px",
              height: "22.75px",
              left: "2.63px",
              top: "2.63px",
            }}
          >
            <Image
              src="/assets/icons/others/info.svg"
              alt="Info"
              width={23}
              height={23}
              className="block max-w-none"
            />
          </div>
        </div>
        {/* Info Text */}
        <p
          className="flex-1 min-h-px min-w-px relative"
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "-0.154px",
            whiteSpace: "pre-wrap",
          }}
        >
          Based on lessons actively engaged with over last week
        </p>
      </div>
    </div>
  );
}

