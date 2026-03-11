import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Star1Icon } from "./icons/Star1Icon";
import { Star2Icon } from "./icons/Star2Icon";
import { Star3Icon } from "./icons/Star3Icon";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  iconSrc?: string;
  iconAlt?: string;
  iconWidth?: number;
  iconHeight?: number;
  /** Color to fill the SVG icon (e.g., "#FFFFFF" for white) */
  iconColor?: string;
  children?: ReactNode;
  /** size="medium" uses the dialog confirm button size, default keeps current wide style */
  size?: "default" | "medium";
  /** variant="outline" makes background transparent, "filled" keeps gradient */
  variant?: "filled" | "outline";
  /** Hide decorative stars */
  hideStars?: boolean;
  /** Optional disabled state. When true, button is non-clickable and visually dimmed. Use for loading/API calls. */
  disabled?: boolean;
  /** Override disabled border color (e.g. "#7076AD" for dashboard/outline style). Default: rgba(45,51,108,0.24). */
  disabledBorderColor?: string;
};

export function PrimaryButton({
  text,
  iconSrc,
  iconAlt = "",
  iconWidth = 20,
  iconHeight = 20,
  iconColor,
  children,
  className,
  size = "default",
  variant = "filled",
  hideStars = false,
  disabled = false,
  disabledBorderColor,
  style,
  ...props
}: PrimaryButtonProps) {
  const content = text ?? children;

  const isMedium = size === "medium";

  return (
    <button
      disabled={disabled}
      className={`group relative flex items-center justify-center overflow-hidden border-2 text-sm font-medium transition active:scale-[0.99] disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100 ${
        disabled
          ? disabledBorderColor
            ? ""
            : "border-[rgba(45,51,108,0.24)]"
          : "border-[#FFFFFF3D] text-white"
      } ${
        !disabled && variant === "filled"
          ? "hover:brightness-110 shadow-[0px_0px_0px_1.6px_#E451FE] hover:shadow-[0px_0px_18.7px_1.602px_#ff00c8]"
          : !disabled
          ? "hover:brightness-110"
          : ""
      } ${
        isMedium
          ? "h-[70px] w-[262px] gap-[4px] rounded-full px-[23.902px] py-[9.612px]"
          : "h-[70px] w-[413px] gap-3 rounded-[76.83px] px-[23.9px] py-[9.61px]"
      } ${className ?? ""}`}
      style={{
        ...(disabled
          ? {
              backgroundColor: "#434B93",
              ...(disabledBorderColor && {
                borderColor: disabledBorderColor,
              }),
            }
          : variant === "filled"
          ? {
              backgroundImage:
                "linear-gradient(88.47deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%), radial-gradient(71.43% 3119.6% at 20.08% -0.37%, rgba(255, 18, 239, 0.7) 0%, rgba(255, 255, 255, 0) 100%)",
            }
          : {
              backgroundColor: "transparent",
            }),
        ...(disabled ? {} : variant === "outline" ? { boxShadow: "0px 0px 0px 1.6px #E451FE" } : {}),
        ...style,
      }}
      {...props}
    >
      {/* Decorative stars - PNG for default/disabled, SVG with glow for hover */}
      {!hideStars && (
        <div className="pointer-events-none absolute inset-0">
          {/* Normal/disabled: PNG stars */}
          <div
            className={`absolute inset-0 transition-opacity ${
              !disabled && variant === "filled" ? "group-hover:opacity-0" : ""
            }`}
          >
            {isMedium ? (
              <div className="absolute left-[45px] bottom-0 opacity-80">
                <Image src="/assets/icons/others/star2.png" alt="" width={39} height={39} />
              </div>
            ) : (
              <>
                <div className="absolute right-[80px] top-0 opacity-70">
                  <Image src="/assets/icons/others/star1.png" alt="" width={40} height={40} />
                </div>
                <div className="absolute left-[50px] bottom-0 opacity-60">
                  <Image src="/assets/icons/others/star2.png" alt="" width={40} height={40} />
                </div>
                <div className="absolute right-[120px] bottom-0 opacity-60">
                  <Image src="/assets/icons/others/star3.png" alt="" width={40} height={40} />
                </div>
              </>
            )}
          </div>
          {/* Hover only (filled, not disabled): SVG stars with white glow */}
          {!disabled && variant === "filled" && (
            <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
              {isMedium ? (
                <div className="absolute left-[45px] bottom-0">
                  <Star2Icon width={40} height={40} />
                </div>
              ) : (
                <>
                  <div className="absolute right-[80px] top-0">
                    <Star1Icon width={40} height={40} />
                  </div>
                  <div className="absolute left-[50px] bottom-0">
                    <Star2Icon width={40} height={40} />
                  </div>
                  <div className="absolute right-[120px] bottom-0">
                    <Star3Icon width={40} height={40} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Foreground content */}
      {iconSrc && (
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={iconWidth}
          height={iconHeight}
          style={{
            ...(disabled && {
              filter: "brightness(0.7) saturate(0.6)",
              opacity: 0.9,
            }),
            ...(iconColor && !disabled && {
              filter:
                iconColor === "#FFFFFF" || iconColor === "white"
                  ? "brightness(0) invert(1)"
                  : undefined,
            }),
          }}
        />
      )}
      <span
        className="relative z-10"
        style={{
          color: disabled ? "#7076AD" : "#FFFFFF",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "22.927px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "150%",
          letterSpacing: "-0.252px",
          textTransform: "uppercase",
        }}
      >
        {content}
      </span>
    </button>
  );
}

