import React from "react";

export const ModulesGridSkeleton: React.FC = () => {
  const cards = Array.from({ length: 4 });

  return (
    <div
      className="grid gap-[24px]"
      style={{
        gridTemplateColumns: "repeat(2, 558px)",
        justifyContent: "start",
      }}
    >
      {cards.map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-[16px] p-[24px] rounded-[32px] animate-pulse"
          style={{
            width: "558px",
            backgroundImage:
              "linear-gradient(174.2464869018644deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
          }}
        >
          {/* Module header skeleton */}
          <div className="flex items-center justify-between">
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "120px" }}
            />
            <div
              className="h-[18px] rounded-full bg-[#252a66]"
              style={{ width: "80px" }}
            />
          </div>

          {/* Stats row skeleton */}
          <div className="flex items-center justify-between mt-[8px]">
            <div
              className="h-[14px] rounded-full bg-[#252a66]"
              style={{ width: "90px" }}
            />
            <div
              className="h-[14px] rounded-full bg-[#252a66]"
              style={{ width: "90px" }}
            />
            <div
              className="h-[14px] rounded-full bg-[#252a66]"
              style={{ width: "90px" }}
            />
          </div>

          {/* Progress bar / content skeleton */}
          <div
            className="h-[10px] rounded-full bg-[#252a66] mt-[12px]"
            style={{ width: "100%" }}
          />

          {/* Footer skeleton */}
          <div className="flex items-center justify-between mt-[12px]">
            <div
              className="h-[14px] rounded-full bg-[#252a66]"
              style={{ width: "120px" }}
            />
            <div
              className="h-[32px] rounded-[999px] bg-[#252a66]"
              style={{ width: "120px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

