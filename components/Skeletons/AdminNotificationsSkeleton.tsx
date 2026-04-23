import React from "react";

export const AdminNotificationsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-[12px] w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between animate-pulse"
          style={{
            width: "100%",
            borderRadius: "32px",
            padding: "20px 24px",
            border: "1px solid rgba(75, 91, 170, 0.38)",
            background:
              "linear-gradient(83deg, #1C1142 -4.82%, #12113A 54.46%, #0E1738 95.43%)",
          }}
        >
          <div className="flex flex-col gap-[8px] items-start">
            <div
              className="rounded-full bg-[#2A2F67]"
              style={{ width: "280px", height: "24px" }}
            />
            <div
              className="rounded-full bg-[#2A2F67]"
              style={{ width: "360px", height: "20px" }}
            />
            <div
              className="rounded-full bg-[#2A2F67]"
              style={{ width: "140px", height: "24px" }}
            />
          </div>
          <div className="flex items-center gap-[8px]">
            <div
              className="rounded-full bg-[#2A2F67]"
              style={{ width: "76px", height: "14px" }}
            />
            <div
              className="rounded-full bg-[#FF00CA]"
              style={{ width: "8px", height: "8px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

