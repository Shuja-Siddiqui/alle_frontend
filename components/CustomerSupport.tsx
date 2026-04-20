"use client";

import { PrimaryButton } from "./PrimaryButton";

type CustomerSupportProps = {
  onContactClick?: () => void;
};

export function CustomerSupport({ onContactClick }: CustomerSupportProps) {
  return (
    <div
      className="relative flex items-center justify-between overflow-hidden p-[32px] rounded-[36px] w-full"
      style={{
        backgroundImage: "linear-gradient(175.93deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
      }}
    >
      {/* Content */}
      <div className="flex flex-col gap-[16px] items-start relative shrink-0">
        <p
          style={{
            color: "#FFF",
            fontFamily: "Orbitron",
            fontSize: "28px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "150%",
            letterSpacing: "-0.176px",
          }}
        >
          Customer support
        </p>
        <p
          style={{
            color: "#FFF",
            fontFamily: "Orbitron",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "150%",
            letterSpacing: "-0.176px",
            width: "546px",
            whiteSpace: "pre-wrap",
          }}
        >
          {`We're here to help with any questions or support you need. Feel free to contact us at help@edu.portal or use the form.`}
        </p>
      </div>

      {/* Button */}
      <div className="relative shrink-0">
        <PrimaryButton
          text="Contact us"
          onClick={onContactClick}
          className="w-[285px]!"
        />
      </div>
    </div>
  );
}

