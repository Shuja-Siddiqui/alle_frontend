"use client";

import Image from "next/image";

type AdminNavbarProps = {
  /** Page title to display on the left */
  title: string;
  /** Called when notification icon is clicked */
  onNotificationClick?: () => void;
  /** Called when Add student button is clicked */
  onAddStudentClick?: () => void;
  /** Called when Download report button is clicked */
  onDownloadReportClick?: () => void;
  /** Show download report button instead of add student button */
  showDownloadReport?: boolean;
  className?: string;
};

export function AdminNavbar({
  title,
  onNotificationClick,
  onAddStudentClick,
  onDownloadReportClick,
  showDownloadReport = false,
  className,
}: AdminNavbarProps) {
  return (
    <div
      className={`flex items-center justify-between w-full ${className ?? ""}`}
    >
      {/* Page title - left side */}
      <h1
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
        {title}
      </h1>

      {/* Right side - Notification and Add student button */}
      <div className="flex gap-[28px] items-center">
        {/* Notification icon */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative shrink-0 cursor-pointer bg-transparent border-none p-0"
          style={{
            width: "52px",
            height: "52px",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <div
            className="absolute"
            style={{
              inset: "-1.65%",
            }}
          >
            <Image
              src="/assets/icons/admin/notification.svg"
              alt="Notifications"
              width={54}
              height={54}
              className="block max-w-none size-full"
            />
          </div>
        </button>

        {/* Add student or Download report button */}
        {showDownloadReport ? (
          <button
            type="button"
            onClick={onDownloadReportClick}
            className="relative flex gap-[4px] h-[52px] items-center justify-center px-[24px] py-[8px] rounded-[76.829px] overflow-hidden"
            style={{
              border: "2px solid rgba(255, 255, 255, 0.24)",
              backgroundImage:
                "linear-gradient(82.35deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%)",
              boxShadow: "0px 0px 0px 1.602px #E451FE",
              cursor: "pointer",
            }}
          >
            {/* Decorative stars */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "144px",
                top: "-13px",
                width: "29.263px",
                height: "29.263px",
              }}
            >
              <div style={{ transform: "rotate(-30deg)" }}>
                <Image
                  src="/assets/icons/others/star2.png"
                  alt=""
                  width={21}
                  height={21}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "194px",
                top: "37px",
                width: "26.555px",
                height: "26.555px",
              }}
            >
              <div style={{ transform: "rotate(-30deg)" }}>
                <Image
                  src="/assets/icons/others/star2.png"
                  alt=""
                  width={19}
                  height={19}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "42px",
                top: "36px",
                width: "35.32px",
                height: "35.32px",
              }}
            >
              <div style={{ transform: "rotate(-23deg)" }}>
                <Image
                  src="/assets/icons/others/star2.png"
                  alt=""
                  width={27}
                  height={27}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>

            {/* Button text */}
            <span
              className="relative z-10"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "-0.198px",
                textTransform: "uppercase",
              }}
            >
              Download report
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddStudentClick}
            className="relative flex gap-[4px] h-[52px] items-center justify-center px-[24px] py-[8px] rounded-[76.829px] overflow-hidden"
            style={{
              border: "2px solid rgba(255, 255, 255, 0.24)",
              backgroundImage:
                "linear-gradient(84.2deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%)",
              boxShadow: "0px 0px 0px 1.602px #E451FE",
              cursor: "pointer",
            }}
          >
            {/* Decorative stars */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "144px",
                top: "-13px",
                width: "29.263px",
                height: "29.263px",
              }}
            >
              <div style={{ transform: "rotate(-30deg)" }}>
                <Image
                  src="/assets/icons/others/star2.png"
                  alt=""
                  width={21}
                  height={21}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "194px",
                top: "37px",
                width: "26.555px",
                height: "26.555px",
              }}
            >
              <div style={{ transform: "rotate(-30deg)" }}>
                <Image
                  src="/assets/icons/others/star2.png"
                  alt=""
                  width={19}
                  height={19}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "42px",
                top: "36px",
                width: "35.32px",
                height: "35.32px",
              }}
            >
              <div style={{ transform: "rotate(-23deg)" }}>
                <Image
                  src="/assets/icons/others/star2.png"
                  alt=""
                  width={27}
                  height={27}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>

            {/* Button text */}
            <span
              className="relative z-10"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "-0.198px",
                textTransform: "uppercase",
              }}
            >
              Add student
            </span>
          </button>
        )}
      </div>
    </div>
  );
}



