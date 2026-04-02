import React from "react";

export const LessonDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-[24px]">
      {/* Lesson Stats Card skeleton */}
      <div
        className="flex items-center justify-between px-[24px] py-[24px] rounded-[32px] animate-pulse"
        style={{
          border: "2px solid #e451fe",
          backgroundImage:
            "linear-gradient(37.28210745629837deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
        }}
      >
        <div className="flex flex-col gap-[8px] items-start">
          <div
            className="h-[24px] rounded-full bg-[#252a66]"
            style={{ width: "220px" }}
          />
          <div
            className="h-[16px] rounded-full bg-[#252a66]"
            style={{ width: "160px" }}
          />
        </div>
        <div className="flex gap-[64px] items-center">
          {[80, 60, 50, 90].map((w, i) => (
            <div key={i} className="flex flex-col gap-[8px] items-start">
              <div
                className="h-[24px] rounded-full bg-[#252a66]"
                style={{ width: `${w}px` }}
              />
              <div
                className="h-[14px] rounded-full bg-[#252a66]"
                style={{ width: "80px" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Objective + Performance Markers skeleton row */}
      <div className="flex gap-[24px] items-start">
        {/* Lesson Objective skeleton */}
        <div
          className="flex flex-col h-[329px] items-start justify-between px-[32px] py-[24px] rounded-[32px] animate-pulse"
          style={{
            backgroundImage:
              "linear-gradient(82.30428116961191deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
          }}
        >
          <div className="flex flex-col gap-[16px] items-start">
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "140px" }}
            />
            <div
              className="h-[14px] rounded-full bg-[#252a66]"
              style={{ width: "260px" }}
            />
            <div
              className="h-[14px] rounded-full bg-[#252a66]"
              style={{ width: "220px" }}
            />
            <div
              className="h-[14px] rounded-full bg-[#252a66]"
              style={{ width: "200px" }}
            />
          </div>
          <div className="flex flex-wrap gap-[12px] items-start w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[32px] rounded-[60px] bg-[#252a66]"
                style={{ width: i === 1 ? "80px" : i === 2 ? "100px" : "70px" }}
              />
            ))}
          </div>
        </div>

        {/* Performance Markers skeleton */}
        <div
          className="flex flex-col gap-[24px] items-start px-[32px] py-[24px] rounded-[32px] animate-pulse"
          style={{
            backgroundImage:
              "linear-gradient(74.40196452499231deg, rgb(41, 6, 94) 4.8221%, rgb(25, 10, 81) 54.463%, rgb(21, 26, 76) 95.432%)",
            width: "752px",
          }}
        >
          <div className="h-[18px] rounded-full bg-[#252a66]" style={{ width: "220px" }} />
          <div className="flex gap-[16px] items-start w-full">
            <div
              className="flex flex-1 gap-[24px] h-[103px] items-center px-[24px] py-[16px] rounded-[32px] bg-[#1b204f]"
              style={{ border: "1px solid #e451fe" }}
            >
              <div className="flex flex-col gap-[12px] items-start">
                <div
                  className="h-[24px] rounded-full bg-[#252a66]"
                  style={{ width: "60px" }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: "120px" }}
                />
              </div>
              <div
                className="h-[14px] rounded-full bg-[#252a66]"
                style={{ width: "120px" }}
              />
            </div>
            <div
              className="flex flex-1 flex-col h-[103px] items-start justify-center px-[24px] py-[16px] rounded-[32px] bg-[#1b204f]"
              style={{ border: "1px solid #434b93" }}
            >
              <div className="flex flex-col gap-[8px] items-start w-full">
                <div
                  className="h-[18px] rounded-full bg-[#252a66]"
                  style={{ width: "80px" }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: "100px" }}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-[24px] items-start w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-1 flex-col gap-[8px] items-start">
                <div
                  className="h-[24px] rounded-full bg-[#252a66]"
                  style={{ width: "60px" }}
                />
                <div
                  className="h-[14px] rounded-full bg-[#252a66]"
                  style={{ width: "100px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

