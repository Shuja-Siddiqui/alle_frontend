"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type SelectOption = {
  label: string;
  value: string;
  /** Icon name from public/assets/icons/flags, e.g. "english" -> /assets/icons/flags/english.svg */
  iconName?: string;
};

type SelectFieldProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function SelectField({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(
    value,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === internalValue);

  function handleSelect(val: string) {
    setInternalValue(val);
    onChange?.(val);
    setOpen(false);
  }

  // Check if w-full is passed in className
  const hasFullWidth = className?.includes("w-full");
  // Extract width classes to apply to inner div, keep other classes for outer div
  const widthClasses = className?.match(/\bw-\S+/g)?.join(" ") || "";
  const otherClasses = className?.replace(/\bw-\S+/g, "").trim() || "";

  return (
    <div className={`space-y-2 ${otherClasses} ${hasFullWidth ? "w-full" : ""}`} ref={containerRef}>
      {label && (
        <span
          className="text-gray-300"
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontWeight: 500,
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "150%",
            letterSpacing: "-0.011em",
          }}
        >
          {label}
        </span>
      )}

      <div className={`relative ${hasFullWidth ? "block w-full" : "inline-block"} ${widthClasses || "w-[413px]"}`}>
        {/* Trigger */}
        <button
          type="button"
          className={`flex h-[70px] w-full items-center justify-between border-2 px-6 pr-12 text-left text-white outline-none transition ${
            open
              ? "rounded-[51.22px] border-[#434B93]"
              : "rounded-full border-[#434B93] bg-white/5 focus:border-pink-400 focus:bg-white/10"
          }`}
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontWeight: 500,
            fontStyle: "normal",
            fontSize: "18px",
            lineHeight: "150%",
            letterSpacing: "-0.011em",
            ...(open && {
              background:
                "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            }),
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span
            className={`flex items-center gap-2 ${
              selectedOption ? "" : "text-[#7478A2]"
            }`}
          >
            {selectedOption?.iconName && (
              <Image
                src={`/assets/icons/flags/${selectedOption.iconName}.svg`}
                alt={selectedOption.label}
                width={24}
                height={24}
              />
            )}
            <span>{selectedOption?.label ?? placeholder}</span>
          </span>

          <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2">
            <Image
              src={open ? "/assets/icons/others/chevron_up.svg" : "/assets/icons/others/chevron_down.svg"}
              alt={open ? "Close" : "Open"}
              width={16}
              height={16}
            />
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 right-0 z-20 mt-2 flex w-[418px] flex-col items-start gap-[22px] overflow-hidden rounded-[24px] border border-[#434B93] bg-[#050821]/95 p-6 shadow-xl backdrop-blur-md">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`flex w-full items-center justify-between gap-2 text-left transition hover:bg-white/10 ${
                  opt.value === internalValue ? "text-pink-brand" : "text-white"
                }`}
                style={{
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  letterSpacing: "-0.011em",
                }}
                onClick={() => handleSelect(opt.value)}
              >
                <div className="flex items-center gap-2">
                  {opt.iconName && (
                    <Image
                      src={`/assets/icons/flags/${opt.iconName}.svg`}
                      alt={opt.label}
                      width={20}
                      height={20}
                    />
                  )}
                  <span>{opt.label}</span>
                </div>
                {opt.value === internalValue && (
                  <Image
                    src="/assets/icons/others/tick_pink.svg"
                    alt="Selected"
                    width={20}
                    height={20}
                  />
                )}
              </button>
            ))}
            {/* Decorative scroll bar */}
            <div
              className="pointer-events-none"
              style={{
                position: "absolute",
                right: "12px",
                top: "60px",
                width: "4px",
                height: "80px",
                borderRadius: "40px",
                background: "#434B93",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
