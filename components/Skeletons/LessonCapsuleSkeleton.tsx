import React from "react";

export const LessonCapsuleSkeleton: React.FC = () => {
  const rows = Array.from({ length: 5 });

  return (
    <div className="flex flex-col gap-[16px]">
      {rows.map((_, index) => (
        <div
          key={index}
          className="flex gap-[24px] items-center px-[32px] py-[24px] rounded-[32px] animate-pulse"
          style={{
            backgroundImage:
              "linear-gradient(38.56230626374987deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
          }}
        >
          {/* Left content skeleton */}
          <div className="flex flex-1 gap-[44px] items-center">
            {/* Lesson title/description block */}
            <div className="flex flex-col gap-[12px]" style={{ width: "385px" }}>
              <div
                className="h-[18px] rounded-full bg-[#252a66]"
                style={{ width: "220px" }}
              />
              <div
                className="h-[16px] rounded-full bg-[#252a66]"
                style={{ width: "280px" }}
              />
            </div>

            {/* Right stats skeleton */}
            <div className="flex gap-[48px] items-center">
              <div className="flex flex-col gap-[8px]" style={{ width: "149px" }}>
                <div
                  className="h-[18px] rounded-full bg-[#252a66]"
                  style={{ width: "80px" }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: "60px" }}
                />
              </div>
              <div className="flex flex-col gap-[8px]" style={{ width: "80px" }}>
                <div
                  className="h-[18px] rounded-full bg-[#252a66]"
                  style={{ width: "40px" }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: "50px" }}
                />
              </div>
              <div className="flex flex-col gap-[8px]" style={{ width: "80px" }}>
                <div
                  className="h-[18px] rounded-full bg-[#252a66]"
                  style={{ width: "40px" }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: "70px" }}
                />
              </div>
              <div className="flex flex-col gap-[8px]" style={{ width: "100px" }}>
                <div
                  className="h-[18px] rounded-full bg-[#252a66]"
                  style={{ width: "70px" }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: "80px" }}
                />
              </div>
            </div>
          </div>

          {/* Right arrow skeleton */}
          <div
            className="rounded-full bg-[#252a66]"
            style={{ width: "36px", height: "36px" }}
          />
        </div>
      ))}
    </div>
  );
};

