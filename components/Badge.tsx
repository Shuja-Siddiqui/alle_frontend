"use client";

import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
  selected?: boolean;
  children?: ReactNode;
};

export function Badge({ text, selected = false, children, className, ...props }: BadgeProps) {
  const content = text ?? children;

  return (
    <div
      className={`flex h-[44px] items-center justify-center gap-[10px] rounded-[60px] bg-[rgba(67,75,147,0.10)] px-4 py-[10px] ${className ?? ""}`}
      {...props}
    >
      <span
        style={
          selected
            ? {
                color: "#FF00CA",
                textAlign: "center",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "22px",
                letterSpacing: "-0.198px",
              }
            : {
                color: "#7478A2",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.198px",
              }
        }
      >
        {content}
      </span>
    </div>
  );
}





















