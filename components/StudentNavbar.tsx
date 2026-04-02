"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EduPortal } from "./EduPortal";
import { Profile } from "./Profile";
import { XpProgressBar } from "./XpProgressBar";
import { useAuth } from "../contexts/AuthContext";

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
  const router = useRouter();
  const { logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileMenuOpen((open) => !open);
  };

  const handleProfileMenuNavigate = () => {
    setIsProfileMenuOpen(false);
    if (onProfileClick) {
      onProfileClick();
      return;
    }
    router.push("/student/profile");
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    router.push("/student/login");
  };

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
        
        {/* Profile + menu */}
        <div className="relative">
          <Profile
            imageSrc={profileImageSrc}
            size={46}
            onClick={handleProfileClick}
          />

          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2"
              style={{
                minWidth: "180px",
                padding: "12px 16px",
                borderRadius: "20px",
                border: "2px solid #E451FE",
                background:
                  "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
                boxShadow: "0 0 0 2px rgba(228, 81, 254, 0.6)",
                zIndex: 30,
              }}
            >
              <button
                type="button"
                onClick={handleProfileMenuNavigate}
                className="text-white transition-colors hover:text-[#FF00CA]"
                style={{
                  width: "100%",
                  padding: "4px 0",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "22px",
                  letterSpacing: "-0.176px",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
              >
                Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="text-white transition-colors hover:text-[#FF00CA]"
                style={{
                  width: "100%",
                  padding: "4px 0",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "22px",
                  letterSpacing: "-0.176px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

