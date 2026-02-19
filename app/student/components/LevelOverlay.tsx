"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XpSlider } from "../../../components/XpSlider";
import { MascotAvatar } from "../../../components/MascotAvatar";

type LevelOverlayProps = {
  /** Whether the overlay is visible */
  isOpen: boolean;
  /** Called when overlay should close */
  onClose?: () => void;
  /** Maximum XP for the slider */
  maxXp?: number;
  /** Lesson ID for navigation */
  lessonId?: string;
  /** Mission sequence for navigation */
  missionSequence?: number;
};

export function LevelOverlay({
  isOpen,
  onClose,
  maxXp = 100,
  lessonId = "lesson1",
  missionSequence = 1,
}: LevelOverlayProps) {
  const router = useRouter();
  const [currentXp, setCurrentXp] = useState(0);

  // Animate XP increase when overlay opens
  useEffect(() => {
    if (!isOpen) {
      setCurrentXp(0);
      return;
    }

    const targetXp = maxXp;
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 frames
    const increment = targetXp / steps;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const newXp = Math.min(increment * step, targetXp);
      setCurrentXp(newXp);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, maxXp]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose?.();
    router.push(
      `/student/mastery-check?lessonId=${lessonId}&missionSequence=${missionSequence}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center font-sans cursor-pointer"
      style={{
        opacity: 0.5,
        background: "#000020",
      }}
      onClick={handleOverlayClick}
    >
      {/* XP Slider */}
      <div style={{
        opacity: 1,
      }}>
        <XpSlider
          value={currentXp}
          max={maxXp}
          label="XP"
          barWidth={492.60}
          barHeight={60.2}
          batteryWidth={119.445}
          batteryHeight={157.236}
          hideNumbers={true}
        />
      </div>

      {/* Mascot */}
      <MascotAvatar
        imageSrc="/assets/icons/mascots/mascot.png"
        alt="Mascot"
      />
    </div>
  );
}

