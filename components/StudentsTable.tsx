"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ProgressInfoDialog } from "./ProgressInfoDialog";

export type LanguageCode = "en" | "es" | "fr" | "hi" | "ar";

export type StudentRowData = {
  /** Student ID for navigation */
  id: string;
  /** Student avatar image source */
  avatarSrc: string;
  /** Student avatar alt text */
  avatarAlt?: string;
  /** Student name */
  name: string;
  /** Student grade (e.g., "9", "12") */
  grade: string;
  /** Language code */
  language: LanguageCode;
  /** Language display name (e.g., "English", "Spanish") */
  languageName: string;
  /** Success rate percentage (0-100) */
  successRate: number;
  /** Progress text (e.g., "Module 2, Lesson 3") */
  progress: string;
  /** Whether progress has a warning icon */
  progressHasWarning?: boolean;
  /** Status text (e.g., "Active", "Inactive") */
  status: string;
  /** Optional click handler for the row */
  onClick?: () => void;
};

type StudentsTableProps = {
  /** Array of student data to display */
  students: StudentRowData[];
  /** Optional className for custom styling */
  className?: string;
};

const LANGUAGE_FLAG_MAP: Record<LanguageCode, string> = {
  en: "/assets/icons/flags/english.svg",
  es: "/assets/icons/flags/spanish.svg",
  fr: "/assets/icons/flags/france.svg",
  hi: "/assets/icons/flags/india.svg",
  ar: "/assets/icons/flags/arabic.svg",
};

// Helper function to determine success rate icon based on percentage
const getSuccessRateIcon = (percentage: number): string => {
  // High success rate (>= 50%) - positive icon
  if (percentage >= 50) {
    return "/assets/icons/admin/success_rate_positive.svg";
  }
  // Low success rate (< 50%) - negative icon
  return "/assets/icons/admin/success_rate_negative.svg";
};

// Helper function to determine progress warning icon
const getProgressWarningIcon = (): string => {
  return "/assets/icons/admin/progress_warning.svg";
};

export function StudentsTable({ students, className }: StudentsTableProps) {
  const [hoveredStudentId, setHoveredStudentId] = useState<string | null>(null);
  const [dialogPosition, setDialogPosition] = useState<{ top: number; left: number } | null>(null);
  const progressCellRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringDialogRef = useRef<boolean>(false);

  function handleProgressCellMouseEnter(studentId: string, event: React.MouseEvent<HTMLDivElement>) {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Don't open if we're already hovering over a dialog
    if (isHoveringDialogRef.current && hoveredStudentId !== studentId) {
      return;
    }

    const cell = event.currentTarget;
    const rect = cell.getBoundingClientRect();
    setHoveredStudentId(studentId);
    setDialogPosition({
      top: rect.bottom + 8, // 8px gap below the cell
      left: rect.left,
    });
  }

  function handleProgressCellMouseLeave() {
    // Only close if we're not hovering over the dialog
    if (!isHoveringDialogRef.current) {
      // Add a small delay to allow mouse to move to dialog
      closeTimeoutRef.current = setTimeout(() => {
        if (!isHoveringDialogRef.current) {
          setHoveredStudentId(null);
          setDialogPosition(null);
        }
      }, 100);
    }
  }

  function handleDialogMouseEnter() {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    isHoveringDialogRef.current = true;
  }

  function handleDialogMouseLeave() {
    isHoveringDialogRef.current = false;
    // Close the dialog after a short delay
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredStudentId(null);
      setDialogPosition(null);
    }, 100);
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`flex flex-col gap-[24px] p-[24px] rounded-[32px] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(174.2464869018644deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
      }}
    >
      {/* Header Row */}
      <div
        className="flex items-center justify-between w-full"
        style={{
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "1.5",
          color: "#7478a2",
          letterSpacing: "-0.154px",
        }}
      >
        <p style={{ width: "250px", flexShrink: 0 }}>Student</p>
        <p style={{ width: "100px", flexShrink: 0 }}>Grade</p>
        <p style={{ width: "110px", flexShrink: 0 }}>Language</p>
        <p style={{ width: "104px", flexShrink: 0 }}>Success rate</p>
        <p style={{ width: "204px", flexShrink: 0 }}>Progress</p>
        <p style={{ width: "69px", flexShrink: 0 }}>Status</p>
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div
          className="flex flex-col gap-[16px] h-[144px] items-center justify-center text-white"
        >
          <p
            style={{
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "22px",
              letterSpacing: "-0.176px",
              color: "#FFFFFF",
            }}
          >
            No results found
          </p>
          <p
            style={{
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1.5",
              letterSpacing: "-0.154px",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Check the spelling or try a different name or email.
          </p>
        </div>
      )}

      {/* Data Rows */}
      {students.length > 0 && students.map((student, index) => (
        <div
          key={index}
          className={`flex items-center justify-between w-full ${
            student.onClick ? "cursor-pointer" : ""
          }`}
          onClick={student.onClick}
        >
          {/* Student Column - Avatar + Name */}
          <div
            className="flex gap-[12px] items-center"
            style={{ width: "250px", flexShrink: 0 }}
          >
            {/* Avatar */}
            <div
              className="relative shrink-0"
              style={{
                width: "32px",
                height: "32px",
              }}
            >
              <Image
                src={student.avatarSrc}
                alt={student.avatarAlt || student.name}
                width={32}
                height={32}
                className="block max-w-none size-full rounded-full"
              />
            </div>
            {/* Name */}
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "22px",
                color: "#FFFFFF",
                letterSpacing: "-0.176px",
              }}
            >
              {student.name}
            </p>
          </div>

          {/* Grade Column */}
          <p
            style={{
              width: "100px",
              flexShrink: 0,
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "22px",
              color: "#FFFFFF",
              letterSpacing: "-0.176px",
            }}
          >
            {student.grade}
          </p>

          {/* Language Column - Flag + Name */}
          <div
            className="flex gap-[12px] items-center"
            style={{ width: "110px", flexShrink: 0 }}
          >
            {/* Flag */}
            <div
              className="relative shrink-0"
              style={{
                width: "24px",
                height: "24px",
              }}
            >
              <Image
                src={LANGUAGE_FLAG_MAP[student.language]}
                alt={student.languageName}
                width={24}
                height={24}
                className="block max-w-none size-full"
              />
            </div>
            {/* Language Name */}
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "22px",
                color: "#FFFFFF",
                letterSpacing: "-0.176px",
              }}
            >
              {student.languageName}
            </p>
          </div>

          {/* Success Rate Column - Icon + Percentage */}
          <div
            className="flex gap-[12px] items-start"
            style={{ width: "104px", flexShrink: 0 }}
          >
            {/* Success Rate Icon */}
            <div
              className="relative shrink-0"
              style={{
                width: "20px",
                height: "20px",
              }}
            >
              <Image
                src={getSuccessRateIcon(student.successRate)}
                alt="Success rate"
                width={20}
                height={20}
                className="block max-w-none size-full"
              />
            </div>
            {/* Percentage */}
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "22px",
                color: "#FFFFFF",
                letterSpacing: "-0.176px",
              }}
            >
              {student.successRate}%
            </p>
          </div>

          {/* Progress Column - Optional Warning Icon + Text */}
          <div
            ref={(el) => {
              progressCellRefs.current[student.id] = el;
            }}
            className="relative flex items-center"
            style={{ width: "204px", flexShrink: 0 }}
            onMouseEnter={(e) => handleProgressCellMouseEnter(student.id, e)}
            onMouseLeave={handleProgressCellMouseLeave}
          >
            {student.progressHasWarning && (
              <div
                className="relative shrink-0 mr-[12px]"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              >
                <Image
                  src={getProgressWarningIcon()}
                  alt="Warning"
                  width={20}
                  height={20}
                  className="block max-w-none size-full"
                />
              </div>
            )}
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "22px",
                color: "#FFFFFF",
                letterSpacing: "-0.176px",
              }}
            >
              {student.progress}
            </p>
          </div>

          {/* Progress Info Dialog - rendered outside the cell to allow hover */}
          {hoveredStudentId === student.id && dialogPosition && (
            <ProgressInfoDialog
              studentId={student.id}
              visible={true}
              position={dialogPosition}
              onMouseEnter={handleDialogMouseEnter}
              onMouseLeave={handleDialogMouseLeave}
            />
          )}

          {/* Status Column */}
          <p
            style={{
              width: "69px",
              flexShrink: 0,
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "22px",
              color: "#FFFFFF",
              letterSpacing: "-0.176px",
            }}
          >
            {student.status}
          </p>
        </div>
      ))}
    </div>
  );
}

