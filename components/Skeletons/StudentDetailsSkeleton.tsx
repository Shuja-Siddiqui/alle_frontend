import React from "react";
import { BadgeSkeleton } from "./BadgeSkeleton";

export const StudentDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Navbar skeleton */}
      <div className="w-full" style={{ padding: "24px 32px" }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-[16px]">
            <div
              className="rounded-full bg-[#252a66] animate-pulse"
              style={{ width: 36, height: 36 }}
            />
          </div>
          <div className="flex gap-[28px] items-center">
            <div
              className="rounded-full bg-[#252a66] animate-pulse"
              style={{ width: 52, height: 52 }}
            />
            <div
              className="rounded-[76px] bg-[#252a66] animate-pulse"
              style={{ width: 180, height: 52 }}
            />
          </div>
        </div>
      </div>

      {/* Main content area skeleton */}
      <div
        className="flex-1 overflow-auto"
        style={{
          padding: "0 32px 32px 32px",
        }}
      >
        <div className="flex flex-col gap-[24px] items-start">
          {/* Top Row: Student Info and Engagement */}
          <div className="flex gap-[24px] items-start">
            {/* StudentInfoCard skeleton */}
            <div
              className="rounded-[32px] animate-pulse"
              style={{
                width: 558,
                height: 240,
                backgroundImage:
                  "linear-gradient(170.34deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
              }}
            >
              <div className="flex gap-[16px] items-center p-[24px]">
                <div
                  className="rounded-full bg-[#252a66]"
                  style={{ width: 64, height: 64 }}
                />
                <div className="flex flex-col gap-[8px]">
                  <div
                    className="h-[20px] rounded-full bg-[#252a66]"
                    style={{ width: 180 }}
                  />
                  <div
                    className="h-[16px] rounded-full bg-[#252a66]"
                    style={{ width: 220 }}
                  />
                </div>
              </div>
            </div>

            {/* StudentEngagementCard skeleton */}
            <div
              className="rounded-[32px] animate-pulse"
              style={{
                width: 364,
                height: 240,
                backgroundImage:
                  "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
              }}
            >
              <div className="flex flex-col gap-[16px] p-[24px]">
                <div
                  className="h-[20px] rounded-full bg-[#252a66]"
                  style={{ width: 160 }}
                />
                <div
                  className="h-[40px] rounded-full bg-[#252a66]"
                  style={{ width: 120 }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: 140 }}
                />
              </div>
            </div>
          </div>

          {/* Middle Row: Stats Bar skeleton */}
          <div
            className="rounded-[32px] animate-pulse"
            style={{
              width: 1000,
              height: 96,
              backgroundImage:
                "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
            }}
          >
            <div className="flex gap-[24px] items-center h-full px-[24px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-[8px] flex-1">
                  <div
                    className="h-[18px] rounded-full bg-[#252a66]"
                    style={{ width: 80 }}
                  />
                  <div className="h-[10px] rounded-full bg-[#252a66]" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row: Learning Time and Badges */}
          <div className="flex gap-[24px] items-start">
            {/* LearningTimeChart skeleton */}
            <div
              className="rounded-[32px] animate-pulse"
              style={{
                width: 558,
                height: 288,
                backgroundImage:
                  "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
              }}
            >
              <div className="flex flex-col gap-[16px] p-[24px] h-full">
                <div
                  className="h-[24px] rounded-full bg-[#252a66]"
                  style={{ width: 200 }}
                />
                <div className="flex-1 flex items-end gap-[8px]">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#252a66] rounded-[8px]"
                      style={{
                        width: 16,
                        height: `${32 + (i % 4) * 18}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* StudentBadgesGrid skeleton */}
            <div
              className="rounded-[32px] animate-pulse"
              style={{
                width: 364,
                height: 288,
                backgroundImage:
                  "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
              }}
            >
              <div className="grid grid-cols-4 gap-[16px] p-[24px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <BadgeSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

