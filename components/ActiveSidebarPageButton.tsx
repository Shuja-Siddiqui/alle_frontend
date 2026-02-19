"use client";

import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";

type ActiveSidebarPageButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  iconSrc: string;
  iconAlt?: string;
};

export function ActiveSidebarPageButton({
  text,
  iconSrc,
  iconAlt = "",
  className,
  ...props
}: ActiveSidebarPageButtonProps) {
  return (
    <button
      type="button"
      className={`flex gap-[12px] items-center px-[16px] py-[12px] rounded-[76.829px] w-full ${className ?? ""}`}
      style={{
        backgroundImage:
          "radial-gradient(71.43% 3119.6% at 20.08% -0.37%, rgba(255, 18, 239, 0.7) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(83.49762272351322deg, rgb(245, 41, 249) 1.6525%, rgb(7, 86, 255) 57.202%, rgb(255, 33, 199) 89.222%)",
        boxShadow: "0px 0px 0px 0px #e451fe",
        cursor: "pointer",
        border: "none",
        height: "44px", // 20px content + 12px top + 12px bottom
        width: "188px", // Full width of menu container
      }}
      {...props}
    >
      {/* Icon */}
      <div
        className="relative shrink-0"
        style={{
          width: "16px",
          height: "16px",
        }}
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={16}
          height={16}
          className="block max-w-none size-full"
        />
      </div>
      {/* Label */}
      <p
        style={{
          color: "#FFFFFF",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "20px",
          letterSpacing: "-0.28px",
        }}
      >
        {text}
      </p>
    </button>
  );
}

