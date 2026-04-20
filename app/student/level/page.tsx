"use client";

import { useState, useEffect } from "react";
import { XpSlider } from "../../../components/XpSlider";
import { MascotAvatar } from "../../../components/MascotAvatar";

export default function LevelPage() {
  const [currentXp, setCurrentXp] = useState(0);
  const maxXp = 100; // TODO: Get from actual level data

  // Animate XP increase
  useEffect(() => {
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
  }, [maxXp]);

  return (
    <div
      className="relative flex flex-col items-center justify-center font-sans"
      style={{
        width: "1440px",
        height: "calc(100vh - 40px - 60.864px)",
        padding: "0 32px 32px 32px",
      }}
    >
      {/* XP Slider */}
      <div className="mb-8">
        <XpSlider
          value={50}
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

