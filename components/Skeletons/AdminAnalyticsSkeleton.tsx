import React from "react";

export const AdminAnalyticsSkeleton: React.FC = () => {
  return (
    <div
      className="flex-1 overflow-auto"
      style={{
        padding: "40px 40px 32px 40px",
      }}
    >
      {/* Navbar skeleton */}
      <div style={{ marginBottom: "24px" }}>
        <div className="flex items-center justify-between">
          <div
            className="h-[30px] rounded-full bg-[#252a66] animate-pulse"
            style={{ width: "180px" }}
          />
          <div className="flex gap-[12px] items-center">
            <div
              className="h-[32px] rounded-full bg-[#252a66] animate-pulse"
              style={{ width: "120px" }}
            />
            <div
              className="h-[40px] rounded-full bg-[#252a66] animate-pulse"
              style={{ width: "40px" }}
            />
          </div>
        </div>
      </div>

      {/* Stats cards row skeleton */}
      <div className="flex gap-[24px] items-center" style={{ marginBottom: "24px" }}>
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

      {/* Charts row skeleton */}
      <div className="flex gap-[24px] items-start">
        {/* Left: Retention chart skeleton */}
        <div
          className="relative overflow-clip rounded-[32px] animate-pulse"
          style={{
            backgroundImage:
              "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
            width: "364px",
            height: "608px",
          }}
        >
          <div className="flex flex-col gap-[24px] p-[24px]">
            <div
              className="h-[30px] rounded-full bg-[#252a66]"
              style={{ width: "180px" }}
            />
            <div className="flex items-center gap-[16px] mt-[32px]">
              <div
                className="rounded-full bg-[#252a66]"
                style={{ width: "140px", height: "140px" }}
              />
              <div className="flex flex-col gap-[12px]">
                <div
                  className="h-[18px] rounded-full bg-[#252a66]"
                  style={{ width: "120px" }}
                />
                <div
                  className="h-[16px] rounded-full bg-[#252a66]"
                  style={{ width: "140px" }}
                />
              </div>
            </div>
            <div className="mt-auto flex items-center gap-[12px]">
              <div
                className="rounded-full bg-[#252a66]"
                style={{ width: "28px", height: "28px" }}
              />
              <div
                className="h-[20px] rounded-full bg-[#252a66]"
                style={{ width: "220px" }}
              />
            </div>
          </div>
        </div>

        {/* Right: Activity chart + sliders skeleton */}
        <div className="flex flex-col gap-[24px] items-start flex-1">
          {/* Activity chart skeleton */}
          <div
            className="rounded-[32px] animate-pulse"
            style={{
              width: "752px",
              height: "288px",
              backgroundImage:
                "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
            }}
          >
            <div className="flex flex-col gap-[16px] p-[24px] h-full">
              <div
                className="h-[24px] rounded-full bg-[#252a66]"
                style={{ width: "220px" }}
              />
              <div className="flex-1 flex items-end gap-[8px]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#252a66] rounded-[8px]"
                    style={{
                      width: "16px",
                      height: `${40 + (i % 5) * 16}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Struggle sliders skeleton */}
          <div
            className="rounded-[32px] animate-pulse"
            style={{
              width: "752px",
              height: "192px",
              backgroundImage:
                "linear-gradient(141.48deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
            }}
          >
            <div className="flex flex-col gap-[16px] p-[24px] h-full">
              <div
                className="h-[24px] rounded-full bg-[#252a66]"
                style={{ width: "260px" }}
              />
              <div className="flex flex-col gap-[12px]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-[6px]">
                    <div
                      className="h-[16px] rounded-full bg-[#252a66]"
                      style={{ width: "280px" }}
                    />
                    <div className="h-[10px] rounded-full bg-[#252a66]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

