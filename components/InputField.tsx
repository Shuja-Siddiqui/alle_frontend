import Image from "next/image";
import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  /** Optional icon at the end of the input, e.g. /assets/icons/others/eye.svg */
  endIconSrc?: string;
  endIconAlt?: string;
  endIconWidth?: number;
  endIconHeight?: number;
  /** Optional click handler for the end icon */
  onEndIconClick?: () => void;
};

export function InputField({
  label,
  id,
  className,
  endIconSrc,
  endIconAlt = "",
  endIconWidth = 20,
  endIconHeight = 20,
  onEndIconClick,
  ...props
}: InputFieldProps) {
  const inputId =
    id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-3 block"
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "150%",
            letterSpacing: "-0.176px",
          }}
        >
          {label}
        </label>
      )}
      <div
        className={`flex h-[70px] shrink-0 self-stretch items-center rounded-[51.22px] border-2 border-[#434B93] py-4 px-6 ${endIconSrc ? "justify-between" : ""} ${className ?? ""}`}
        style={{
          display: "flex",
          background:
            "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
        }}
      >
        <input
          id={inputId}
          className="flex-1 bg-transparent text-white placeholder:text-[#7478A2] outline-none"
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "24px",
            letterSpacing: "-0.198px",
          }}
          {...props}
        />
        {endIconSrc && (
          <button
            type="button"
            onClick={onEndIconClick}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: onEndIconClick ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={endIconSrc}
              alt={endIconAlt}
              width={endIconWidth}
              height={endIconHeight}
            />
          </button>
        )}
      </div>
    </div>
  );
}


