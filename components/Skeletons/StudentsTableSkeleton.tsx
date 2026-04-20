import React from "react";

export const StudentsTableSkeleton: React.FC = () => {
  const rows = Array.from({ length: 6 });

  return (
    <div
      className="flex flex-col gap-[24px] p-[24px] rounded-[32px] animate-pulse"
      style={{
        backgroundImage:
          "linear-gradient(174.2464869018644deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
      }}
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between w-full opacity-60">
        <div className="h-[14px] rounded-full bg-[#252a66]" style={{ width: "250px" }} />
        <div className="h-[14px] rounded-full bg-[#252a66]" style={{ width: "100px" }} />
        <div className="h-[14px] rounded-full bg-[#252a66]" style={{ width: "110px" }} />
        <div className="h-[14px] rounded-full bg-[#252a66]" style={{ width: "104px" }} />
        <div className="h-[14px] rounded-full bg-[#252a66]" style={{ width: "204px" }} />
        <div className="h-[14px] rounded-full bg-[#252a66]" style={{ width: "69px" }} />
      </div>

      {/* Rows skeleton */}
      {rows.map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between w-full"
        >
          {/* Student column */}
          <div
            className="flex items-center gap-[12px]"
            style={{ width: "250px" }}
          >
            <div
              className="bg-[#252a66]"
              style={{ width: "32px", height: "32px", borderRadius: "999px" }}
            />
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "140px" }}
            />
          </div>

          {/* Grade */}
          <div
            className="h-[18px] rounded-full bg-[#252a66]"
            style={{ width: "60px" }}
          />

          {/* Language */}
          <div
            className="flex items-center gap-[12px]"
            style={{ width: "110px" }}
          >
            <div
              className="bg-[#252a66]"
              style={{ width: "24px", height: "24px", borderRadius: "6px" }}
            />
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "70px" }}
            />
          </div>

          {/* Success rate */}
          <div
            className="flex items-center gap-[12px]"
            style={{ width: "104px" }}
          >
            <div
              className="bg-[#252a66]"
              style={{ width: "20px", height: "20px", borderRadius: "6px" }}
            />
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "50px" }}
            />
          </div>

          {/* Progress */}
          <div
            className="flex items-center gap-[12px]"
            style={{ width: "204px" }}
          >
            <div
              className="bg-[#252a66]"
              style={{ width: "20px", height: "20px", borderRadius: "6px" }}
            />
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "150px" }}
            />
          </div>

          {/* Status */}
          <div
            className="h-[18px] rounded-full bg-[#252a66]"
            style={{ width: "60px" }}
          />
        </div>
      ))}
    </div>
  );
};

