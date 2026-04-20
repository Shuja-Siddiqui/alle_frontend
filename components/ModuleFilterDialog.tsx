"use client";

import { useState, useEffect, MouseEventHandler } from "react";
import Image from "next/image";
import { BackButton } from "./BackButton";
import { PrimaryButton } from "./PrimaryButton";

export type ModuleCategory = "all" | "phonics" | "blending" | "reading" | "pronunciation";

export type ModuleFilterState = {
  category: ModuleCategory;
};

type ModuleFilterDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Current filter state */
  filters: ModuleFilterState;
  /** Called when filters change */
  onFiltersChange: (filters: ModuleFilterState) => void;
  /** Called when Apply button is clicked */
  onApply: (filters: ModuleFilterState) => void;
  /** Called when Reset button is clicked */
  onReset: () => void;
  /** Called when back button is clicked or backdrop is clicked */
  onClose: () => void;
};

const CATEGORIES: Array<{ value: ModuleCategory; label: string }> = [
  { value: "all", label: "All" },
  { value: "phonics", label: "Phonics" },
  { value: "blending", label: "Blending" },
  { value: "reading", label: "Reading" },
  { value: "pronunciation", label: "Pronunciation" },
];

export function ModuleFilterDialog({
  open,
  filters,
  onFiltersChange,
  onApply,
  onReset,
  onClose,
}: ModuleFilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<ModuleFilterState>(filters);

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

  const handleCategoryChange = (category: ModuleCategory) => {
    const newFilters = { ...localFilters, category };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ModuleFilterState = {
      category: "all",
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative flex flex-col gap-[44px] items-center p-[44px] rounded-[51.22px]"
        style={{
          border: "2px solid #e451fe",
          backgroundImage:
            "linear-gradient(165.95284798181837deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back Button and Title */}
        <div className="flex gap-[16px] items-center w-full">
          <BackButton
            text=""
            onClick={onClose}
            className="shrink-0"
          />
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
            Filters
          </p>
        </div>

        {/* Category Section */}
        <div className="flex flex-col gap-[12px] items-start justify-center w-full">
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
            Category
          </p>
          <div className="flex gap-[12px] items-start flex-wrap w-full">
            {CATEGORIES.map((category) => {
              const isSelected = localFilters.category === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleCategoryChange(category.value)}
                  className="flex h-[44px] items-center justify-center px-[16px] py-[10px] rounded-[60px] shrink-0 cursor-pointer border-none"
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(255, 0, 202, 0.1)"
                      : "rgba(67, 75, 147, 0.1)",
                  }}
                >
                  <p
                    style={{
                      color: isSelected ? "#ff00ca" : "#7478a2",
                      fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: isSelected ? 500 : 400,
                      lineHeight: isSelected ? "22px" : "24px",
                      letterSpacing: "-0.198px",
                      textAlign: "center",
                    }}
                  >
                    {category.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[32px] items-start justify-center w-full">
          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="relative flex flex-1 h-[70px] items-center justify-center overflow-hidden border-2 rounded-[76.829px] cursor-pointer"
            style={{
              borderColor: "#ff12ef",
              backgroundColor: "transparent",
              boxShadow: "0px 0px 0px 1.602px #e451fe",
            }}
          >
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "22.927px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "1.5",
                letterSpacing: "-0.2522px",
                textTransform: "uppercase",
              }}
            >
              Reset
            </p>
          </button>

          {/* Apply Button */}
          <PrimaryButton
            variant="filled"
            onClick={handleApply}
            className="flex-1 h-[70px]"
            hideStars={false}
            size="medium"
          >
            <div className="flex gap-[12px] items-center">
              <Image
                src="/assets/icons/admin/filter_checkmark.svg"
                alt="Apply"
                width={30}
                height={30}
                className="block max-w-none"
              />
              <span>Apply</span>
            </div>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

