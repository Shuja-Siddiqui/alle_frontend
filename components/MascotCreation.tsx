"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { MASCOT_COLORS } from "../app/mascotColors";
import { BackButton } from "./BackButton";
import { PrimaryButton } from "./PrimaryButton";
import { ConfirmCancelDialog } from "./ConfirmCancelDialog";
import { MascotDisplay } from "./MascotDisplay";
import { AnimatePresence, motion } from "framer-motion";

type MascotParts = {
  head: string;
  hair: string;
  body: string;
  collar: string;
  hairColor?: string;
};

/** Partial mascot for per-part save (only fields being updated) */
export type MascotPartUpdate = Partial<{
  face: string;
  hair: string;
  body: string;
  hairColor: string;
}>;

type MascotCreationProps = {
  /** Initial selected parts */
  initialParts?: Partial<MascotParts & { face?: string }>;
  /** Called when any part is selected */
  onPartSelect?: (parts: MascotParts) => void;
  /** Called when the Save button is clicked (saves all parts) */
  onSave?: (parts: MascotParts) => void;
  /** Called when Save is clicked for a specific part (head, hair, body, or color). When provided, Save does per-part save instead of full save. */
  onSavePart?: (partial: MascotPartUpdate) => void;
  /** Called when the back button is clicked */
  onBack?: () => void;
};

// Step-based flow: head → hair → body (collar auto-applied from body: body1→collar1, body2→collar2, etc.)
type Step = "head" | "hair" | "body";

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
type Category = "head" | "hair" | "body";

const CATEGORIES: Category[] = ["head", "hair", "body"];

// Mascot options from /assets/icons/mascots (heads, hairs, body, collars)
const HEAD_OPTIONS = ["head1", "head2", "head3", "head4", "head5", "head6", "head7", "head8", "head9", "head10"];
const HAIR_OPTIONS = ["hair1", "hair2", "hair3", "hair4", "hair5", "hair6", "hair7", "hair8", "hair9", "hair10", "hair11", "hair12", "hair13", "hair14"];
const BODY_OPTIONS = ["body1", "body2", "body3", "body4", "body5", "body6", "body7", "body8", "body9", "body10", "body11", "body12", "body13", "body14", "body15"];

const CATEGORY_OPTIONS: Record<Category, string[]> = {
  head: HEAD_OPTIONS,
  hair: HAIR_OPTIONS,
  body: BODY_OPTIONS,
};

// Collar is derived from body: body1→collar1, body2→collar2, etc.
function getCollarFromBody(bodyId: string): string {
  const match = bodyId.match(/body(\d+)/i);
  const num = match ? match[1] : "1";
  return `collar${num}`;
}

// Use mascots folder with subfolders: heads/, hairs/, body/
const CATEGORY_PATHS: Record<Category, string> = {
  head: "/assets/icons/mascots/heads",
  hair: "/assets/icons/mascots/hairs",
  body: "/assets/icons/mascots/body",
};

export function MascotCreation({
  initialParts,
  onPartSelect,
  onSave,
  onSavePart,
  onBack,
}: MascotCreationProps) {
  const [currentStep, setCurrentStep] = useState<Step>("head");
  const previewRef = useRef<HTMLDivElement | null>(null);
  const optionsGridRef = useRef<HTMLDivElement | null>(null);
  const [selectedParts, setSelectedParts] = useState<MascotParts>({
    head: initialParts?.head ?? initialParts?.face ?? "head1",
    hair: initialParts?.hair || "hair1",
    body: initialParts?.body || "body1",
    collar: initialParts?.collar || getCollarFromBody(initialParts?.body || "body1"),
    hairColor: initialParts?.hairColor || "#E451FE",
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [flyAnimation, setFlyAnimation] = useState<{
    src: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  } | null>(null);
  const [hairColorTransition, setHairColorTransition] = useState<{
    from: string;
    to: string;
  } | null>(null);

   // When initialParts change (e.g. loaded from backend or updated after save),
   // sync them into local state so reloads and profile edits reflect the saved mascot.
   useEffect(() => {
     if (!initialParts) return;
     setSelectedParts((prev) => {
       const prevBody = prev.body || "body1";
       const nextBody = initialParts.body ?? prevBody;
       return {
         head: initialParts.head ?? initialParts.face ?? prev.head ?? "head1",
         hair: initialParts.hair ?? prev.hair ?? "hair1",
         body: nextBody,
         collar: initialParts.collar ?? getCollarFromBody(nextBody),
         hairColor: initialParts.hairColor ?? prev.hairColor ?? "#E451FE",
       };
     });
   }, [
     initialParts?.head,
     initialParts?.face,
     initialParts?.hair,
     initialParts?.body,
     initialParts?.collar,
     initialParts?.hairColor,
   ]);

  const currentOptions = CATEGORY_OPTIONS[currentStep];
  const currentSelected = selectedParts[currentStep];

  const triggerFlyToPreview = (partId: string, sourceEl?: HTMLElement | null) => {
    if (!sourceEl || !previewRef.current) return;

    const sourceRect = sourceEl.getBoundingClientRect();
    const previewRect = previewRef.current.getBoundingClientRect();

    const fromX = sourceRect.left + sourceRect.width / 2;
    const fromY = sourceRect.top + sourceRect.height / 2;
    const targetYFactor = currentStep === "hair" ? 0.3 : currentStep === "head" ? 0.38 : 0.7;
    const toX = previewRect.left + previewRect.width / 2;
    const toY = previewRect.top + previewRect.height * targetYFactor;

    setFlyAnimation({
      src: `${CATEGORY_PATHS[currentStep]}/${partId}.svg`,
      fromX,
      fromY,
      toX,
      toY,
    });
  };

  const handlePartClick = (partId: string, sourceEl?: HTMLElement | null) => {
    triggerFlyToPreview(partId, sourceEl);
    const newBody = currentStep === "body" ? partId : selectedParts.body;
    const newCollar = currentStep === "body" ? getCollarFromBody(partId) : selectedParts.collar;
    const newParts: MascotParts = {
      head: currentStep === "head" ? partId : selectedParts.head,
      hair: currentStep === "hair" ? partId : selectedParts.hair,
      body: newBody,
      collar: newCollar,
      hairColor: selectedParts.hairColor,
    };
    setSelectedParts(newParts);
    onPartSelect?.(newParts);
  };

  const handleHairColorClick = (color: string) => {
    const currentColor = selectedParts.hairColor ?? "#E451FE";
    if (currentColor === color) return;

    setHairColorTransition({
      from: currentColor,
      to: color,
    });

    const newParts = { ...selectedParts, hairColor: color };
    setSelectedParts(newParts);
    onPartSelect?.(newParts);
  };

  const handleStepChange = () => {
    // Cycle through steps: head → hair → body → head
    const stepOrder: Step[] = ["head", "hair", "body"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const nextIndex = (currentIndex + 1) % stepOrder.length;
    setCurrentStep(stepOrder[nextIndex]);
  };

  const handleOptionLeft = () => {
    const currentIndex = currentOptions.indexOf(currentSelected);
    const previousIndex =
      currentIndex <= 0 ? currentOptions.length - 1 : currentIndex - 1;
    const nextOptionId = currentOptions[previousIndex];
    const sourceEl = optionsGridRef.current?.querySelector(
      `[data-option-id="${nextOptionId}"]`
    ) as HTMLElement | null;
    handlePartClick(nextOptionId, sourceEl);
  };

  const handleOptionRight = () => {
    const currentIndex = currentOptions.indexOf(currentSelected);
    const nextIndex =
      currentIndex >= currentOptions.length - 1 ? 0 : currentIndex + 1;
    const nextOptionId = currentOptions[nextIndex];
    const sourceEl = optionsGridRef.current?.querySelector(
      `[data-option-id="${nextOptionId}"]`
    ) as HTMLElement | null;
    handlePartClick(nextOptionId, sourceEl);
  };

  const handleSave = () => {
    if (onSavePart) {
      // Per-part save: save current step + hair color, then advance head → hair → body
      const hairColor = selectedParts.hairColor ?? "#E451FE";
      if (currentStep === "head") {
        onSavePart({ face: selectedParts.head, hairColor });
        setCurrentStep("hair");
      } else if (currentStep === "hair") {
        onSavePart({ hair: selectedParts.hair, hairColor });
        setCurrentStep("body");
      } else if (currentStep === "body") {
        onSavePart({ body: selectedParts.body, hairColor });
      }
      return;
    }
    // Legacy full-save flow (signup etc.): advance steps, confirm at body
    if (currentStep === "head") {
      setCurrentStep("hair");
      return;
    }
    if (currentStep === "hair") {
      setCurrentStep("body");
      return;
    }
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
    if (step === "head") return "Head";
    return step.charAt(0).toUpperCase() + step.slice(1);
  };

  return (
    <div className="flex  w-full flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Back button */}
        <div className="flex items-center gap-[16px]">
          <BackButton text="Mascot creation" onClick={onBack} />
        </div>

        {/* Save button - saves current part when onSavePart, otherwise advances steps */}
        <div className="flex items-center">
          <PrimaryButton
            type="button"
            text={onSavePart ? `Save ${getCategoryLabel(currentStep)}` : "Save"}
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
          ref={previewRef}
          className="relative flex h-[559px] w-[668px] flex-col items-center rounded-[51.22px] border-2 border-[#E451FE] px-[44px] pt-[44px]"
          style={{
            borderRadius: "51.22px",
            border: "2px solid #E451FE",
            background:
              "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          }}
        >
          {/* Composed mascot preview using master SVG (collar auto-derived from body) */}
          <MascotDisplay
            headId={selectedParts.head}
            hairId={selectedParts.hair}
            bodyId={selectedParts.body}
            collarId={getCollarFromBody(selectedParts.body)}
            hairColor={hairColorTransition?.from ?? selectedParts.hairColor}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          {/* Hair color fill animation: new color wipes from left to right */}
          {hairColorTransition && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              onAnimationComplete={() => setHairColorTransition(null)}
            >
              <MascotDisplay
                headId={selectedParts.head}
                hairId={selectedParts.hair}
                bodyId={selectedParts.body}
                collarId={getCollarFromBody(selectedParts.body)}
                hairColor={hairColorTransition.to}
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </motion.div>
          )}
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
              className="flex h-[44px] w-[44px] items-center justify-center cursor-pointer"
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
              className="flex h-[44px] w-[44px] items-center justify-center cursor-pointer"
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
          <div ref={optionsGridRef} className="grid grid-cols-5 gap-x-[34px] gap-y-[14px]">
            {currentOptions.map((optionId, index) => {
              const isSelected = currentSelected === optionId;
              return (
                <button
                  key={optionId}
                  data-option-id={optionId}
                  type="button"
                  onClick={(e) => handlePartClick(optionId, e.currentTarget)}
                  className="relative h-[105px] w-[105px] shrink-0 overflow-hidden rounded-full cursor-pointer"
                  style={{
                    backgroundColor: "#131743",
                    border: isSelected
                      ? "2px solid #E451FE"
                      : "1px solid #434B93",
                  }}
                >
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                    }}
                    animate={
                      currentStep === "head"
                        ? {
                            y: [0, -4, 0],
                            rotate: [0, -2, 2, 0],
                            scale: [1, 1.03, 1],
                          }
                        : currentStep === "hair"
                        ? {
                            y: [0, -3, 0],
                            rotate: [0, -1.5, 1.5, 0],
                            scale: [1, 1.025, 1],
                          }
                        : currentStep === "body"
                        ? {
                            y: [0, -2, 0],
                            scale: [1, 1.02, 1],
                          }
                        : undefined
                    }
                    transition={{
                      duration:
                        currentStep === "head" ? 2.2 : currentStep === "hair" ? 2.4 : 2.6,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: index * 0.08,
                    }}
                  >
                    <Image
                      style={{
                        position: "absolute",
                        left: 0,
                        top:
                          currentStep === "hair"
                            ? 50
                            : currentStep === "head"
                            ? 30
                            : -20,
                      }}
                      src={`${CATEGORY_PATHS[currentStep]}/${optionId}.svg`}
                      alt={`${getCategoryLabel(currentStep)} ${index + 1}`}
                      fill
                      className={
                        currentStep === "head" || currentStep === "hair"
                          ? "object-cover scale-[2]"
                          : currentStep === "body"
                          ? "object-cover scale-[1.1]"
                          : "object-contain p-[7px]"
                      }
                    />
                  </motion.div>
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

            {/* Color options + Save color button */}
            <div
              className="absolute left-0 flex flex-row flex-wrap items-center gap-[16px] w-full"
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
                      cursor: "pointer",
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

      <AnimatePresence>
        {flyAnimation && (
          <motion.div
            key={`${flyAnimation.src}-${flyAnimation.fromX}-${flyAnimation.fromY}-${flyAnimation.toX}-${flyAnimation.toY}`}
            className="fixed z-80 pointer-events-none"
            style={{
              left: flyAnimation.fromX - 52,
              top: flyAnimation.fromY - 52,
              width: "104px",
              height: "104px",
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: flyAnimation.toX - flyAnimation.fromX,
              y: flyAnimation.toY - flyAnimation.fromY,
              scale: 0.65,
              opacity: 0.15,
              rotate: 18,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            onAnimationComplete={() => setFlyAnimation(null)}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "999px",
                background: "rgba(228, 81, 254, 0.18)",
                filter: "blur(14px)",
              }}
            />
            <Image
              src={flyAnimation.src}
              alt="Selected mascot part"
              fill
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

