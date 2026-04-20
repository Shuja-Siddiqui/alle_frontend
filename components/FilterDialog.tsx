"use client";

import { useState, useEffect, MouseEventHandler } from "react";
import { BackButton } from "./BackButton";
import { SelectField } from "./SelectField";
import { RadioButton } from "./RadioButton";
import { PrimaryButton } from "./PrimaryButton";

export type SuccessRateFilter = "all" | "0-20" | "20-40" | "40-60" | "60-80" | "80-100";

export type StatusFilter = "all" | "active" | "inactive";

export type FilterState = {
  successRate: SuccessRateFilter;
  module: string | null;
  lesson: string | null;
  status: StatusFilter;
};

type FilterDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Current filter state */
  filters: FilterState;
  /** Called when filters change */
  onFiltersChange: (filters: FilterState) => void;
  /** Called when Apply button is clicked */
  onApply: (filters: FilterState) => void;
  /** Called when Reset button is clicked */
  onReset: () => void;
  /** Called when back button is clicked or backdrop is clicked */
  onClose: () => void;
  /** Available modules for dropdown */
  modules?: Array<{ value: string; label: string }>;
  /** Available lessons for dropdown */
  lessons?: Array<{ value: string; label: string }>;
};

export function FilterDialog({
  open,
  filters,
  onFiltersChange,
  onApply,
  onReset,
  onClose,
  modules = [],
  lessons = [],
}: FilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Update local filters when prop changes or dialog opens
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [filters, open]);

  if (!open) return null;

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSuccessRateChange = (value: SuccessRateFilter) => {
    const newFilters = { ...localFilters, successRate: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStatusChange = (value: StatusFilter) => {
    const newFilters = { ...localFilters, status: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleModuleChange = (value: string) => {
    const newFilters = { ...localFilters, module: value || null };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLessonChange = (value: string) => {
    const newFilters = { ...localFilters, lesson: value || null };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      successRate: "all",
      module: null,
      lesson: null,
      status: "all",
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const successRateOptions: Array<{ value: SuccessRateFilter; label: string }> = [
    { value: "all", label: "All" },
    { value: "0-20", label: "0-20%" },
    { value: "20-40", label: "20-40%" },
    { value: "40-60", label: "40-60%" },
    { value: "60-80", label: "60-80%" },
    { value: "80-100", label: "80-100%" },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 32, 0.80)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="inline-flex flex-col items-center gap-[44px] rounded-[51.22px] border-2 border-[#E451FE] p-[44px]"
        style={{
          backgroundImage:
            "linear-gradient(160.5157813581455deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        }}
      >
        {/* Header */}
        <div className="flex gap-[16px] items-center w-full">
          <BackButton
            text="Filters"
            iconSrc="/assets/icons/admin/filter_back.svg"
            onClick={onClose}
            className="shrink-0"
          />
        </div>

        {/* Filter Sections */}
        <div className="flex flex-col gap-[24px] items-start w-full">
          {/* Success Rate Filter */}
          <div className="flex flex-col gap-[12px] items-start justify-center w-full">
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.5",
                color: "#FFFFFF",
                letterSpacing: "-0.176px",
              }}
            >
              Success rate
            </p>
            <div className="flex gap-[12px] items-start flex-wrap w-full">
              {successRateOptions.map((option) => {
                const isSelected = localFilters.successRate === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSuccessRateChange(option.value)}
                    className="flex h-[44px] items-center justify-center px-[16px] py-[10px] rounded-[60px] shrink-0"
                    style={{
                      backgroundColor: isSelected
                        ? "rgba(255, 0, 202, 0.1)"
                        : "rgba(67, 75, 147, 0.1)",
                      cursor: "pointer",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: isSelected ? 500 : 400,
                        lineHeight: isSelected ? "22px" : "24px",
                        color: isSelected ? "#ff00ca" : "#7478a2",
                        letterSpacing: "-0.198px",
                        textAlign: "center",
                      }}
                    >
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module and Lesson Dropdowns */}
          <div className="flex gap-[24px] items-start w-full">
            {/* Module Dropdown */}
            <div className="flex-1 min-w-0">
              <SelectField
                label="Module"
                placeholder="Select module"
                options={modules.map((m) => ({ label: m.label, value: m.value }))}
                value={localFilters.module || undefined}
                onChange={(value) => handleModuleChange(value)}
                className="w-full!"
              />
            </div>

            {/* Lesson Dropdown */}
            <div className="flex-1 min-w-0">
              <SelectField
                label="Lesson"
                placeholder="Select lesson"
                options={lessons.map((l) => ({ label: l.label, value: l.value }))}
                value={localFilters.lesson || undefined}
                onChange={(value) => handleLessonChange(value)}
                className="w-full!"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-[12px] items-start justify-center w-full">
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.5",
                color: "#FFFFFF",
                letterSpacing: "-0.176px",
              }}
            >
              Status
            </p>
            <div className="flex gap-[36px] items-start">
              {(["all", "active", "inactive"] as StatusFilter[]).map((status) => (
                <RadioButton
                  key={status}
                  checked={localFilters.status === status}
                  onChange={() => handleStatusChange(status)}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  name="status-filter"
                  value={status}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[32px] items-start justify-center w-full">
          {/* Reset Button */}
          <PrimaryButton
            text="Reset"
            variant="outline"
            onClick={handleReset}
            className="flex-1"
            style={{
              border: "2px solid #ff12ef",
              boxShadow: "0px 0px 0px 1.602px #e451fe",
            }}
          />

          {/* Apply Button */}
          <PrimaryButton
            text="Apply"
            iconSrc="/assets/icons/admin/filter_checkmark.svg"
            iconAlt="Apply"
            iconWidth={30}
            iconHeight={30}
            variant="filled"
            onClick={handleApply}
            className="flex-1"
            style={{
              boxShadow: "0px 0px 0px 1.602px #e451fe",
            }}
          />
        </div>
      </div>
    </div>
  );
}

