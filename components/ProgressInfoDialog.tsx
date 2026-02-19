"use client";

import { useRouter } from "next/navigation";

type ProgressInfoDialogProps = {
  /** Student ID for navigation */
  studentId: string;
  /** Whether the dialog is visible */
  visible: boolean;
  /** Position for the dialog (top, left) */
  position?: { top: number; left: number };
  /** Called when mouse enters the dialog */
  onMouseEnter?: () => void;
  /** Called when mouse leaves the dialog */
  onMouseLeave?: () => void;
  /** Optional className */
  className?: string;
};

export function ProgressInfoDialog({
  studentId,
  visible,
  position,
  onMouseEnter,
  onMouseLeave,
  className,
}: ProgressInfoDialogProps) {
  const router = useRouter();

  if (!visible) return null;

  function handleShowProfile() {
    router.push(`/admin/students/${studentId}`);
  }

  return (
    <div
      className={`fixed z-50 flex flex-col gap-[12px] items-start p-[16px] rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundColor: "#1b1f4e",
        border: "1px solid #e451fe",
        width: "306px",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
      }}
      onMouseEnter={(e) => {
        // Keep dialog visible when hovering over it
        e.stopPropagation();
        onMouseEnter?.();
      }}
      onMouseLeave={onMouseLeave}
    >
      {/* Title and Description */}
      <div className="flex flex-col gap-[8px] items-start w-full">
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "1.5",
            letterSpacing: "-0.198px",
          }}
        >
          Repeated attempts detected
        </p>
        <p
          style={{
            color: "#7478a2",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.5",
            letterSpacing: "-0.154px",
            whiteSpace: "pre-wrap",
            minWidth: "100%",
          }}
        >
          This lesson was tried multiple times without progress.
        </p>
      </div>

      {/* Show Profile Button */}
      <button
        type="button"
        onClick={handleShowProfile}
        style={{
          color: "#ff00ca",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "1.5",
          letterSpacing: "-0.198px",
          textTransform: "uppercase",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          whiteSpace: "pre-wrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        Show profile
      </button>
    </div>
  );
}

