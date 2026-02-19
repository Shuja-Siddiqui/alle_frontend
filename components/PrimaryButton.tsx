import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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
  style,
  ...props
}: PrimaryButtonProps) {
  const content = text ?? children;

  const isMedium = size === "medium";

  return (
    <button
      className={`relative flex items-center justify-center overflow-hidden border-2 border-[#FFFFFF3D] text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.99] ${
        isMedium
          ? "h-[70px] w-[262px] gap-[4px] rounded-full px-[23.902px] py-[9.612px]"
          : "h-[70px] w-[413px] gap-3 rounded-[76.83px] px-[23.9px] py-[9.61px]"
      } ${className ?? ""}`}
      style={{
        ...(variant === "filled"
          ? {
              backgroundImage:
                "linear-gradient(88.47deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%), radial-gradient(71.43% 3119.6% at 20.08% -0.37%, rgba(255, 18, 239, 0.7) 0%, rgba(255, 255, 255, 0) 100%)",
            }
          : {
              backgroundColor: "transparent",
            }),
        boxShadow: "0px 0px 0px 1.6px #E451FE",
        ...style,
      }}
      {...props}
    >
      {/* Decorative stars */}
      {!hideStars && (
        <div className="pointer-events-none absolute inset-0">
        {isMedium ? (
          // Single star for medium size (like dialog confirm)
          <div className="absolute left-[45px] bottom-0 opacity-80">
            <Image
              src="/assets/icons/others/star2.png"
              alt=""
              width={39}
              height={39}
            />
          </div>
        ) : (
          <>
            {/* Top star */}
            <div className="absolute right-[80px] top-0 opacity-70">
              <Image
                src="/assets/icons/others/star1.png"
                alt=""
                width={40}
                height={40}
              />
            </div>
            {/* Bottom stars */}
            <div className="absolute left-[50px] bottom-0 opacity-60">
              <Image
                src="/assets/icons/others/star2.png"
                alt=""
                width={40}
                height={40}
              />
            </div>
            <div className="absolute right-[120px] bottom-0 opacity-60">
              <Image
                src="/assets/icons/others/star3.png"
                alt=""
                width={40}
                height={40}
              />
            </div>
          </>
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
            ...(iconColor && {
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
          color: "#FFFFFF",
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

