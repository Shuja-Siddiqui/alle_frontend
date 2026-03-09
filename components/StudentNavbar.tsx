"use client";

import { EduPortal } from "./EduPortal";
import { Profile } from "./Profile";
import { XpProgressBar } from "./XpProgressBar";

type StudentNavbarProps = {
  /** Current XP value */
  xp?: number;
  /** Maximum XP for the bar */
  xpMax?: number;
  /** Profile image URL */
  profileImageSrc?: string;
  /** Called when profile is clicked */
  onProfileClick?: () => void;
  /** Hide the XP slider */
  hideXpSlider?: boolean;
  className?: string;
};

export function StudentNavbar({
  xp = 0,
  xpMax = 100,
  profileImageSrc,
  onProfileClick,
  hideXpSlider = false,
  className,
}: StudentNavbarProps) {
  return (
    <div
      className={className ?? ""}
      style={{
        display: "flex",
        width: "1360px",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
      data-node-id="2133:240"
    >
      {/* Left side - EduPortal logo and text */}
      <div
        className="flex items-center gap-[16px] shrink-0"
        data-node-id="2133:241"
      >
        <EduPortal text="EduPortal" />
      </div>

      {/* Right side - XP Slider and Profile */}
      <div className="flex  gap-[33px] shrink-0 justify-center items-center" data-node-id="2133:245">
        {/* XP Slider with battery icon - container includes both battery and slider */}
        {!hideXpSlider && (
          <XpProgressBar
            value={xp}
            max={xpMax}
            label=""
            hideNumbers={true}
            width={217}
            height={43}
          />
        )}
        
        {/* Profile */}
        <Profile
          imageSrc={profileImageSrc}
          size={46}
          onClick={onProfileClick}
        />
      </div>
    </div>
  );
}

