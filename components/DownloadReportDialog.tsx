"use client";

import { useState } from "react";
import { BackButton } from "./BackButton";
import { PrimaryButton } from "./PrimaryButton";
import { RadioButton } from "./RadioButton";
import { SelectField } from "./SelectField";

export type DownloadReportFormData = {
  dateRange: string | null;
  format: "PDF" | "CSV" | null;
};

type DownloadReportDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when back button is clicked or backdrop is clicked */
  onClose: () => void;
  /** Called when Download button is clicked */
  onDownload: (data: DownloadReportFormData) => void;
  /** Called when Reset button is clicked */
  onReset?: () => void;
};

export function DownloadReportDialog({
  open,
  onClose,
  onDownload,
  onReset,
}: DownloadReportDialogProps) {
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [format, setFormat] = useState<"PDF" | "CSV" | null>(null);

  function handleReset() {
    setDateRange(null);
    setFormat(null);
    onReset?.();
  }

  function handleDownload() {
    if (dateRange && format) {
      onDownload({ dateRange, format });
    }
  }

  // Reset form when dialog closes
  if (!open) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(0, 0, 32, 0.80)",
        }}
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          className="relative flex flex-col gap-[44px] items-center p-[44px] rounded-[51.22px]"
          style={{
            backgroundImage: "linear-gradient(160.11deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
            border: "2px solid #e451fe",
            width: "656px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex gap-[16px] items-center relative w-full">
            <BackButton onClick={onClose} text="" />
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
              Download report
            </p>
          </div>

          {/* Date Range Section */}
          <div className="flex flex-col gap-[12px] items-start justify-center relative w-full" style={{ height: "106px" }}>
            <SelectField
              label="Date range"
              placeholder="Select date range"
              options={[
                { value: "last-week", label: "Last week" },
                { value: "last-month", label: "Last month" },
                { value: "last-3-months", label: "Last 3 months" },
                { value: "custom", label: "Custom range" },
              ]}
              value={dateRange || undefined}
              onChange={(value) => setDateRange(value)}
              className="w-full!"
            />
          </div>

          {/* Format Section */}
          <div className="flex flex-col items-start relative w-full">
            <div className="flex flex-col gap-[12px] items-start justify-center relative w-full">
              <p
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "1.5",
                  letterSpacing: "-0.176px",
                }}
              >
                Format
              </p>
              <div className="flex gap-[36px] items-start relative w-full">
                {/* PDF Option */}
                <RadioButton
                  checked={format === "PDF"}
                  onChange={() => setFormat("PDF")}
                  name="format"
                  value="PDF"
                  label="PDF"
                />

                {/* CSV Option */}
                <RadioButton
                  checked={format === "CSV"}
                  onChange={() => setFormat("CSV")}
                  name="format"
                  value="CSV"
                  label="CSV"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-[32px] items-start justify-center relative w-full">
            {/* Reset Button */}
            <div className="flex-1">
              <PrimaryButton
                text="Reset"
                variant="outline"
                onClick={handleReset}
                className="w-full"
                style={{
                  height: "70px",
                  borderColor: "#ff12ef",
                  boxShadow: "0px 0px 0px 1.602px #e451fe",
                }}
              />
            </div>

            {/* Download Button */}
            <div className="flex-1">
              <PrimaryButton
                text="Download"
                variant="filled"
                onClick={handleDownload}
                className="w-full"
                style={{
                  height: "70px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

