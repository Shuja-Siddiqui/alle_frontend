import React from "react";

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-[32px]">
      {/* Top stats row */}
      <div className="flex gap-[24px] items-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-[16px] items-center p-[24px] rounded-[32px] animate-pulse"
            style={{
              backgroundImage:
                "linear-gradient(170.49deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
              width: "364px",
            }}
          >
            <div className="flex flex-1 flex-col gap-[16px] items-start">
              <div className="flex gap-[12px] items-center w-full">
                <div
                  className="h-[36px] rounded-full bg-[#252a66]"
                  style={{ width: "80px" }}
                />
                <div
                  className="h-[20px] rounded-full bg-[#252a66]"
                  style={{ width: "120px" }}
                />
              </div>
              <div
                className="h-[16px] rounded-full bg-[#252a66]"
                style={{ width: "140px" }}
              />
            </div>
            <div
              className="flex items-center justify-center shrink-0 p-[12px] rounded-[8px] bg-[#252a66]"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        ))}
      </div>

      {/* Retention + Students row */}
      <div
        className="flex gap-[24px] items-start justify-center"
        style={{ width: "1140px", height: "336px" }}
      >
        {/* Retention card skeleton */}
        <div
          className="shrink-0 rounded-[32px] animate-pulse"
          style={{
            width: "364px",
            height: "100%",
            backgroundImage:
              "linear-gradient(170.49deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
          }}
        >
          <div className="flex flex-col gap-[16px] p-[24px]">
            <div
              className="h-[20px] rounded-full bg-[#252a66]"
              style={{ width: "120px" }}
            />
            <div
              className="h-[140px] rounded-full bg-[#252a66]"
              style={{ width: "100%" }}
            />
            <div
              className="h-[16px] rounded-full bg-[#252a66]"
              style={{ width: "80%" }}
            />
          </div>
        </div>

        {/* Students grid skeleton */}
        <div
          className="flex flex-col shrink-0"
          style={{ width: "752px" }}
        >
          <div
            className="flex items-center justify-between mb-[19px]"
          >
            <div
              className="h-[24px] rounded-full bg-[#252a66]"
              style={{ width: "120px" }}
            />
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "80px" }}
            />
          </div>
          <div
            className="flex flex-wrap gap-[24px] flex-1"
            style={{ alignContent: "flex-start" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-[19px] items-start p-[24px] rounded-[32px] animate-pulse shrink-0"
                style={{
                  width: "363px",
                  backgroundImage:
                    "linear-gradient(170.34deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[12px] items-center">
                    <div
                      className="rounded-full bg-[#252a66]"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <div
                      className="h-[16px] rounded-full bg-[#252a66]"
                      style={{ width: "120px" }}
                    />
                  </div>
                  <div
                    className="h-[22px] rounded-[60px] bg-[#252a66]"
                    style={{ width: "70px" }}
                  />
                </div>
                <div className="flex gap-[16px] items-center w-[324px]">
                  <div
                    className="h-[40px] rounded-[12px] bg-[#252a66] flex-1"
                  />
                  <div
                    className="h-[40px] rounded-[12px] bg-[#252a66] flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules row skeleton */}
      <div style={{ marginTop: "32px" }}>
        <div
          className="flex items-start justify-between mb-[16px]"
        >
          <div
            className="h-[24px] rounded-full bg-[#252a66]"
            style={{ width: "120px" }}
          />
          <div
            className="h-[18px] rounded-full bg-[#252a66]"
            style={{ width: "80px" }}
          />
        </div>
        <div className="flex gap-[24px] justify-start items-start overflow-x-auto module-scrollbar">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-[32px] items-start p-[24px] rounded-[32px] animate-pulse shrink-0"
              style={{
                width: "558px",
                backgroundImage:
                  "linear-gradient(70.26738318578197deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-[8px] items-start">
                  <div
                    className="h-[14px] rounded-full bg-[#252a66]"
                    style={{ width: "80px" }}
                  />
                  <div
                    className="h-[18px] rounded-full bg-[#252a66]"
                    style={{ width: "220px" }}
                  />
                </div>
                <div
                  className="rounded-full bg-[#252a66]"
                  style={{ width: "36px", height: "36px" }}
                />
              </div>
              <div className="flex gap-[44px] items-center w-full">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex flex-1 flex-col gap-[8px] items-start"
                  >
                    <div
                      className="h-[24px] rounded-full bg-[#252a66]"
                      style={{ width: "60px" }}
                    />
                    <div
                      className="h-[14px] rounded-full bg-[#252a66]"
                      style={{ width: "80px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

