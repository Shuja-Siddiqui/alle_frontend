import React from "react";

export const BadgeSkeleton: React.FC = () => {
  return (
    <div
      className="rounded-full bg-linear-to-br from-[#1B1F4E] to-[#0B0F37] animate-pulse"
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid rgba(228, 81, 254, 0.4)",
        boxShadow: "0 0 12px rgba(228, 81, 254, 0.35)",
      }}
    />
  );
};

