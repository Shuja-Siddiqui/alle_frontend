"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MascotAvatar } from "../../../components/MascotAvatar";
import { BlendingBoxes } from "../lesson/components/BlendingBoxes";
import { VisualBox } from "../lesson/components/VisualBox";
import { MicButton } from "../lesson/components/MicButton";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { LevelOverlay } from "../components/LevelOverlay";
import { useLevelOverlay } from "../contexts/LevelOverlayContext";
import { useLessonPageData } from "../hooks/useLessonData";
import Image from "next/image";

type StatusVariant = "initial" | "default" | "success" | "error";

export default function BlendingPage() {
  const { isOverlayOpen, setOverlayOpen } = useLevelOverlay();
  const searchParams = useSearchParams();
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("error");

  // Get data from URL params
  const lessonId = searchParams.get("lessonId") || "lesson1";
  const missionSequence = parseInt(searchParams.get("missionSequence") || "1", 10);
  const taskId = searchParams.get("taskId") || "1";

  // Fetch lesson task data
  const lessonData = useLessonPageData(lessonId, missionSequence, taskId);

  const task = lessonData?.task;
  const word = task?.word; // e.g., "SAT" - will be split into letters
  const visualItems = task?.visual || [];

  // Find first visual item with an image
  const visualImage = visualItems.find(item => item.image)?.image;

  // Split word into individual letters for blending
  // e.g., "SAT" -> ["S", "A", "T"]
  const letters = word ? word.split("").filter(char => /[a-zA-Z]/.test(char)) : [];

  // Check if variant is success
  const isSuccess = statusVariant === "success";

  // Track mic button state
  const [isMicActive, setIsMicActive] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center justify-center font-sans"
      style={{
        width: "1440px",
        height: "calc(100vh - 40px - 60.864px)",
        padding: "0 32px 32px 32px",
      }}
    >
      {/* Center Content */}
      <div className="flex flex-col items-center justify-center gap-8">
        {/* BlendingBoxes - Show letters with connectors */}
        {letters.length > 0 && (
          <BlendingBoxes
            letters={letters}
            variant={statusVariant}
            letterWidth={107.063}
            letterHeight={134.92}
            letterGap={6}
          />
        )}

        {/* VisualBox - Show visual image only when variant is error, but always reserve space */}
        {visualImage && (
          <div
            style={{
              height: "140px",
              width: "281px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              visibility: "hidden"
            }}
          >
            {statusVariant === "error" && (
              <VisualBox
                imageSrc={visualImage}
                imageWidth={107}
                imageHeight={107}
              />
            )}
          </div>
        )}

        {/* MicButton or Continue Button based on variant - fixed 101px total gap */}
        <div style={{ marginTop: "69px" }}>
          {isSuccess ? (
            <div className="flex items-center gap-8">
              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => {
                  setStatusVariant("initial");
                  setIsMicActive(false);
                }}
                style={{
                  display: "flex",
                  width: "70px",
                  height: "70px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "76.829px",
                  border: "2px solid #F529F9",
                  boxShadow: "0 0 0 1.602px #E451FE",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <Image
                  src="/assets/icons/others/refresh.svg"
                  alt="Refresh"
                  width={43.82}
                  height={43.82}
                />
              </button>

              {/* Continue Button */}
              <PrimaryButton
                text="Continue"
                size="medium"
                variant="filled"
                onClick={() => setOverlayOpen(true)}
              />
            </div>
          ) : (
            <MicButton
              icon={isMicActive ? "pause" : "mic"}
              size={100}
              onClick={() => {
                const newMicState = !isMicActive;
                setIsMicActive(newMicState);

                if (newMicState) {
                  setStatusVariant("default");
                  // TODO: Start recording logic here
                } else {
                  // TODO: Stop recording and check result
                  // If correct, set statusVariant to "success"
                  // If incorrect, set statusVariant to "error"
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Mascot Avatar - Left Bottom - Hidden when overlay is open */}
      {!isOverlayOpen && (
        <div
          className="absolute"
          style={{
            left: "32px",
            bottom: "32px",
          }}
        >
          <MascotAvatar
            imageSrc="/assets/icons/mascots/mascot.png"
            alt="Mascot"
          />
        </div>
      )}

      {/* Level Overlay */}
      <LevelOverlay
        isOpen={isOverlayOpen}
        onClose={() => setOverlayOpen(false)}
        maxXp={100}
        lessonId={lessonId}
        missionSequence={missionSequence}
      />
    </div>
  );
}

