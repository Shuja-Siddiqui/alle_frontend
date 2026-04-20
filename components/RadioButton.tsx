"use client";

import type { InputHTMLAttributes } from "react";

type RadioButtonProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  checked?: boolean;
  /** Label text shown next to the radio */
  label?: string;
};

export function RadioButton({
  checked,
  className,
  label,
  ...props
}: RadioButtonProps) {
  const isControlled = props.onChange !== undefined;

  return (
    <label
      className={`flex items-center gap-[16px] ${className ?? ""}`}
    >
      {/* Visual radio */}
      <span
        aria-hidden="true"
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "15.36px",
          border: checked ? "5.76px solid #FF00CA" : "2px solid #7478A2",
          background: checked ? "#FFFFFF" : "transparent",
          boxSizing: "border-box",
        }}
      />

      {/* Text */}
      {label && (
        <span
          style={
            checked
              ? {
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px", // 133.333%
                  letterSpacing: "-0.198px",
                }
              : {
                  color: "#7478A2",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px", // 133.333%
                  letterSpacing: "-0.198px",
                }
          }
        >
          {label}
        </span>
      )}

      {/* Visually hidden native radio for accessibility */}
      <input
        type="radio"
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? checked : undefined}
        onChange={props.onChange}
        name={props.name}
        value={props.value}
        className="sr-only"
      />
    </label>
  );
}


