"use client";

import Image from "next/image";
import { useState } from "react";
import { MASCOT_COLORS } from "../app/mascotColors";
import { BackButton } from "./BackButton";
import { PrimaryButton } from "./PrimaryButton";
import { ConfirmCancelDialog } from "./ConfirmCancelDialog";
import { MascotDisplay } from "./MascotDisplay";

type MascotParts = {
  face: string;
  hair: string;
  body: string;
  hairColor?: string;
};

type MascotCreationProps = {
  /** Initial selected parts */
  initialParts?: Partial<MascotParts>;
  /** Called when any part is selected */
  onPartSelect?: (parts: MascotParts) => void;
  /** Called when the Save button is clicked */
  onSave?: (parts: MascotParts) => void;
  /** Called when the back button is clicked */
  onBack?: () => void;
};

// Step-based flow: face → hair → body
type Step = "face" | "hair" | "body";

// Hair color palette - specific colors for hair selection
const HAIR_COLORS = [
  "#00B78C", // Teal/Dark Cyan
  "#0479FF", // Bright Blue
  "#17E0FE", // Cyan/Light Blue
  "#2FFF00", // Bright Green/Lime Green
  "#B0B0B0", // Gray
  "#BB00FF", // Bright Purple/Magenta
  "#CE44A2", // Pink/Rose
  "#E451FE", // Light Purple/Lavender
  "#F1B708", // Gold/Orange-Yellow
  "#FF1F00", // Bright Red
  "#FF4000", // Orange-Red/Vermilion
];

// Category definitions
type Category = "face" | "hair" | "body";

const CATEGORIES: Category[] = ["face", "hair", "body"];

// Face options - 10 faces in order
const FACE_OPTIONS = Array.from({ length: 10 }, (_, i) => `head${String(i + 1)}`);

// Hair options - 13 hairs from hair folder (hair1, hair2, ..., hair13) - no zero-padding
const HAIR_OPTIONS = Array.from({ length: 13 }, (_, i) => `hair${i + 1}`);

// Body options - 15 bodies from suit folder
const BODY_OPTIONS = Array.from({ length: 15 }, (_, i) => `body${String(i + 1)}`);

const CATEGORY_OPTIONS: Record<Category, string[]> = {
  face: FACE_OPTIONS,
  hair: HAIR_OPTIONS,
  body: BODY_OPTIONS,
};

const CATEGORY_PATHS: Record<Category, string> = {
  face: "/assets/icons/mascots/heads",
  hair: "/assets/icons/mascots/hair",
  body: "/assets/icons/mascots/body",
};

export function MascotCreation({
  initialParts,
  onPartSelect,
  onSave,
  onBack,
}: MascotCreationProps) {
  const [currentStep, setCurrentStep] = useState<Step>("face");
  const [selectedParts, setSelectedParts] = useState<MascotParts>({
    face: initialParts?.face || "head1",
    hair: initialParts?.hair || "hair1",
    body: initialParts?.body || "body1",
    hairColor: initialParts?.hairColor || "#E451FE",
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const currentOptions = CATEGORY_OPTIONS[currentStep];
  const currentSelected = selectedParts[currentStep];

  const handlePartClick = (partId: string) => {
    // Only update the current step's part, keep all other parts unchanged
    const newParts: MascotParts = {
      face: currentStep === "face" ? partId : selectedParts.face,
      hair: currentStep === "hair" ? partId : selectedParts.hair,
      body: currentStep === "body" ? partId : selectedParts.body,
      hairColor: selectedParts.hairColor,
    };
    setSelectedParts(newParts);
    onPartSelect?.(newParts);
  };

  const handleHairColorClick = (color: string) => {
    const newParts = { ...selectedParts, hairColor: color };
    setSelectedParts(newParts);
    onPartSelect?.(newParts);
  };

  const handleStepChange = () => {
    // Cycle through steps: face → hair → body → face
    const stepOrder: Step[] = ["face", "hair", "body"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const nextIndex = (currentIndex + 1) % stepOrder.length;
    setCurrentStep(stepOrder[nextIndex]);
  };

  const handleOptionLeft = () => {
    const currentIndex = currentOptions.indexOf(currentSelected);
    const previousIndex =
      currentIndex <= 0 ? currentOptions.length - 1 : currentIndex - 1;
    handlePartClick(currentOptions[previousIndex]);
  };

  const handleOptionRight = () => {
    const currentIndex = currentOptions.indexOf(currentSelected);
    const nextIndex =
      currentIndex >= currentOptions.length - 1 ? 0 : currentIndex + 1;
    handlePartClick(currentOptions[nextIndex]);
  };

  const handleSave = () => {
    // If on face step, move to hair step
    if (currentStep === "face") {
      setCurrentStep("hair");
      return;
    }
    // If on hair step, move to body step
    if (currentStep === "hair") {
      setCurrentStep("body");
      return;
    }
    // If on body step, show confirmation dialog
    if (currentStep === "body") {
      setShowConfirmDialog(true);
      return;
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmDialog(false);
    onSave?.(selectedParts);
  };

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

  const getCategoryLabel = (step: Step): string => {
    if (step === "body") return "Clothes";
    return step.charAt(0).toUpperCase() + step.slice(1);
  };

  return (
    <div className="flex min-h-screen w-full flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Back button */}
        <div className="flex items-center gap-[16px]">
          <BackButton text="Mascot creation" onClick={onBack} />
        </div>

        {/* Save button */}
        <div className="flex items-center">
          <PrimaryButton
            type="button"
            text="Save"
            size="medium"
            iconSrc="/assets/icons/others/tick_white.svg"
            iconAlt="Save"
            iconWidth={30}
            iconHeight={30}
            iconColor="#FFFFFF"
            onClick={handleSave}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="mt-[54px] flex flex-1 items-start justify-center gap-[24px]">
        {/* Left panel - Mascot preview */}
        <div
          className="relative flex h-[559px] w-[668px] flex-col items-center rounded-[51.22px] border-2 border-[#E451FE] px-[44px] pt-[44px]"
          style={{
            borderRadius: "51.22px",
            border: "2px solid #E451FE",
            background:
              "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          }}
        >
          {/* Composed mascot preview using master SVG */}
          <MascotDisplay
            headId={selectedParts.face}
            hairId={selectedParts.hair}
            bodyId={selectedParts.body}
            hairColor={selectedParts.hairColor}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: "120%",
              height: "120%",
            }}
          />
        </div>

        {/* Right panel - Category selector */}
        <div
          className="relative flex h-[559px] w-[664px] flex-col items-start gap-[32px]"
          style={{
            display: "flex",
            width: "664px",
            height: "559px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "32px",
          }}
        >
          {/* Category selector header - only contains left/right buttons and title */}
          <div
            className="flex items-center justify-between self-stretch rounded-[51.22px] border-2 border-[#434B93] px-[60px] py-[24px]"
            style={{
              display: "flex",
              padding: "24px 60px",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
              borderRadius: "51.22px",
              border: "2px solid #434B93",
              background:
                "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            }}
          >
            {/* Left arrow - navigate options */}
            <button
              type="button"
              onClick={handleOptionLeft}
              className="flex h-[44px] w-[44px] items-center justify-center"
            >
              <Image
                src="/assets/icons/others/chevron_left.svg"
                alt="Previous option"
                width={44}
                height={44}
              />
            </button>

            {/* Category title - clickable to switch categories */}
            <button
              type="button"
              onClick={handleStepChange}
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "36px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "42px",
                letterSpacing: "-0.396px",
                textTransform: "uppercase",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {getCategoryLabel(currentStep)}
            </button>

            {/* Right arrow - navigate options */}
            <button
              type="button"
              onClick={handleOptionRight}
              className="flex h-[44px] w-[44px] items-center justify-center"
            >
              <Image
                src="/assets/icons/others/chevron_right.svg"
                alt="Next option"
                width={44}
                height={44}
              />
            </button>
          </div>

          {/* Options grid - 5 columns, variable rows */}
          <div className="grid grid-cols-5 gap-x-[34px] gap-y-[14px]">
            {currentOptions.map((optionId, index) => {
              const isSelected = currentSelected === optionId;
              return (
                <button
                  key={optionId}
                  type="button"
                  onClick={() => handlePartClick(optionId)}
                  className="relative h-[105px] w-[105px] shrink-0 overflow-hidden rounded-full"
                  style={{
                    backgroundColor: "#131743",
                    border: isSelected
                      ? "2px solid #E451FE"
                      : "1px solid #434B93",
                  }}
                >
                  <Image
                    src={`${CATEGORY_PATHS[currentStep]}/${optionId}.svg`}
                    alt={`${getCategoryLabel(currentStep)} ${index + 1}`}
                    fill
                    className="object-contain p-[7px]"
                  />
                </button>
              );
            })}
          </div>

          {/* Hair color selection - show on all steps */}
          <>
            {/* HR Divider - positioned absolutely */}
            <div
              className="absolute left-0 w-full"
              style={{
                height: "1px",
                backgroundColor: "#434B93",
                top: "495px",
              }}
            />

            {/* Color options - positioned absolutely */}
            <div
              className="absolute left-0 flex flex-row flex-wrap gap-[16px] w-full"
              style={{
                top: "514px",
                height: "45px",
              }}
            >
              {HAIR_COLORS.map((color) => {
                const isSelected = selectedParts.hairColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleHairColorClick(color)}
                    className="relative h-[45px] w-[45px] shrink-0 rounded-full"
                    style={{
                      backgroundColor: color,
                      border: isSelected
                        ? "2px solid #E451FE"
                        : "2px solid #434B93",
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(228, 81, 254, 0.3)"
                        : undefined,
                    }}
                  >
                    {isSelected && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "50%",
                        }}
                      >
                        <div
                          className="h-[20px] w-[20px] rounded-full"
                          style={{
                            backgroundColor: "#FFFFFF",
                          }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        </div>
      </div>

      {/* Confirmation Dialog - shown when saving on body step */}
      <ConfirmCancelDialog
        open={showConfirmDialog}
        title="Save mascot changes?"
        confirmLabel="Yes, save"
        cancelLabel="Cancel"
        confirmIconSrc="/assets/icons/others/tick_white.svg"
        cancelIconSrc="/assets/icons/others/cancel_white.svg"
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
        onClose={handleCancelSave}
      />
    </div>
  );
}

// Helper functions for color filtering (simplified - would need more sophisticated color manipulation)
function getHueRotation(color: string): number {
  // Simplified hue rotation based on color
  const colorMap: Record<string, number> = {
    "#E451FE": 0, // Magenta
    "#F1B708": 60, // Yellow
    "#17E0FE": 180, // Cyan
    "#0479FF": 240, // Blue
    "#2FFF00": 120, // Green
    "#FF1F00": 0, // Red
    "#80D7C3": 160, // Teal
    "#BB00FF": 280, // Purple
    "#FF9C7B": 20, // Orange
    "#808080": 0, // Gray
    "#FFFFFF": 0, // White
    "#191919": 0, // Black
  };
  return colorMap[color] || 0;
}

function getSaturation(color: string): number {
  // For grayscale colors, reduce saturation
  if (color === "#808080" || color === "#FFFFFF" || color === "#191919") {
    return 0;
  }
  return 100;
}

function getBrightness(color: string): number {
  // Adjust brightness based on color
  if (color === "#191919") return 50; // Black - darker
  if (color === "#FFFFFF") return 150; // White - brighter
  return 100; // Default
}
