"use client";

import { PrimaryButton } from "./PrimaryButton";
import { AdminNotificationsMenu } from "./AdminNotificationsMenu";

type AdminNavbarProps = {
  /** Page title to display on the left */
  title: string;
  /** Called when notification icon is clicked */
  onNotificationClick?: () => void;
  /** Called when Add student button is clicked */
  onAddStudentClick?: () => void;
  /** Called when Add teacher button is clicked */
  onAddTeacherClick?: () => void;
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
  onAddTeacherClick,
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
        <AdminNotificationsMenu onOpen={onNotificationClick} />

        {/* Add student / Add teacher or Download report button */}
        {showDownloadReport ? (
          <PrimaryButton
            type="button"
            onClick={onDownloadReportClick}
            text="Download report"
            size="navbar"
            className="min-w-[220px]"
          />
        ) : (
          <div className="flex items-center gap-3">
            {onAddTeacherClick && (
              <PrimaryButton
                type="button"
                onClick={onAddTeacherClick}
                text="Add teacher"
                size="navbar"
                className="min-w-[198px]"
              />
            )}

            <PrimaryButton
              type="button"
              onClick={onAddStudentClick}
              text="Add student"
              size="navbar"
              className="min-w-[198px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}



