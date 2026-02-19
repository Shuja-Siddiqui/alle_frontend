"use client";

import type { ReactNode } from "react";
import { PrimaryButton } from "./PrimaryButton";

type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  /** Variant label, e.g. "Success" – controls the heading text */
  variant?: ToastVariant;
  /** Optional custom title; if omitted, the capitalized variant is used */
  title?: string;
  /** Main message shown under the title */
  description: ReactNode;
  /** Label for the action button, e.g. "OK" */
  actionLabel: string;
  /** Called when the action button is clicked */
  onAction?: () => void;
  /** Optional className to control placement (e.g. fixed bottom-center) */
  className?: string;
};

export function Toast({
  variant = "success",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: ToastProps) {
  const heading = title ?? `${variant.charAt(0).toUpperCase()}${variant.slice(1)}!`;

  return (
    <div
      className={`inline-flex w-[560px] min-w-[475px] min-h-[199px] flex-col items-center gap-[44px] rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.8)] ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(166.34deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
      }}
    >
      {/* Message */}
      <div className="flex flex-col items-center gap-[16px] text-center">
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "42px",
            letterSpacing: "-0.396px",
            textTransform: "uppercase",
          }}
        >
          {heading}
        </p>
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "150%",
            letterSpacing: "-0.198px",
          }}
        >
          {description}
        </p>
      </div>

      {/* Action button: PrimaryButton, default size, filled, full width */}
      <div className="w-full">
        <PrimaryButton
          type="button"
          text={actionLabel}
          className="w-full"
          onClick={onAction}
        />
      </div>
    </div>
  );
}


