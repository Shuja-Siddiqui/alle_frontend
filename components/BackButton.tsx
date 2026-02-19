"use client";

import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";

type BackButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  iconSrc?: string;
};

export function BackButton({
  text = "Back",
  iconSrc = "/assets/icons/others/arrow_back.svg",
  className,
  ...props
}: BackButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center gap-[16px] self-stretch ${className ?? ""}`}
      {...props}
    >
      <Image src={iconSrc} alt="Back" width={36} height={36} />
      {text && (
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "42px", // 116.667%
            letterSpacing: "-0.396px",
            textTransform: "uppercase",
          }}
        >
          {text}
        </span>
      )}
    </button>
  );
}













