"use client";

import type { ButtonHTMLAttributes } from "react";

type ToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** Optional label shown next to the toggle */
  label?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type">;

export function Toggle({
  checked,
  onChange,
  label,
  className,
  ...props
}: ToggleProps) {
  const handleClick = () => {
    onChange?.(!checked);
  };

  return (
    <label
      className={`flex items-center justify-between self-stretch ${
        className ?? ""
      }`}
    >
      {label && (
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "150%", // 24px
            letterSpacing: "-0.176px",
          }}
        >
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={handleClick}
        className="relative inline-flex items-center rounded-[30px] transition-colors duration-200 ease-out"
        style={{
          width: "55px",
          height: "32px",
          background: checked ? "#FF00CA" : "#434B93",
          opacity: props.disabled ? 0.7 : 1,
          cursor: props.disabled ? "not-allowed" : "pointer",
        }}
        aria-pressed={checked}
        disabled={props.disabled}
        {...props}
      >
        {/* Thumb */}
        <span
          className="absolute inline-block rounded-full transition-all duration-200 ease-out"
          style={{
            width: "24px",
            height: "24px",
            left: "5px",
            transform: checked ? "translateX(20px)" : "translateX(0)",
            // OFF state: gradient thumb with shadow on inactive track
            // ON state: plain white thumb on pink track
            background: checked
              ? "#FFFFFF"
              : "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            filter: checked
              ? "none"
              : "drop-shadow(0 3px 1px rgba(0, 0, 0, 0.06)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.15))",
          }}
        />
      </button>
    </label>
  );
}


