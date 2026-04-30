"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { EduPortal } from "./EduPortal";
import { Profile } from "./Profile";
import { XpProgressBar } from "./XpProgressBar";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { DailyStreakDialog } from "./DailyStreakDialog";

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
  const STREAK_DIALOG_SEEN_KEY = "student-streak-dialog-seen-date";
  const router = useRouter();
  const { logout, streakData, isStreakLoading, streakErrorMessage, fetchStreakData } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStreakDialogOpen, setIsStreakDialogOpen] = useState(false);
  const [streakDialogOrigin, setStreakDialogOrigin] = useState<{ x: number; y: number } | null>(null);

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

  const handlePhonemeCatalogNavigate = () => {
    setIsProfileMenuOpen(false);
    router.push("/student/phoneme-catalog");
  };

  const getTodayDateKey = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  };

  const hasSeenStreakDialogToday = () => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STREAK_DIALOG_SEEN_KEY) === getTodayDateKey();
  };

  const markStreakDialogSeenToday = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STREAK_DIALOG_SEEN_KEY, getTodayDateKey());
  };

  const handleStreakOpen = useCallback(
    async (event?: MouseEvent<HTMLButtonElement>) => {
      if (event) {
        const rect = event.currentTarget.getBoundingClientRect();
        setStreakDialogOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      } else {
        setStreakDialogOrigin(null);
      }

    setIsProfileMenuOpen(false);
    setIsStreakDialogOpen(true);
      await fetchStreakData(false);
    },
    [fetchStreakData]
  );

  const handleStreakDialogClose = () => {
    markStreakDialogSeenToday();
    setIsStreakDialogOpen(false);
  };

  useEffect(() => {
    if (hasSeenStreakDialogToday()) return;
    void handleStreakOpen();
  }, [handleStreakOpen]);

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
          <div style={{ height: "46px", display: "flex", alignItems: "center" }}>
            <div style={{ position: "relative", width: "217px", flexShrink: 0 }}>
              {/* Soft glow behind the start of XP bar */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "108px",
                  height: "108px",
                  borderRadius: "50%",
                  background: "rgba(228, 81, 254, 0.3)",
                  filter: "blur(30px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-2px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(122, 148, 255, 0.4)",
                  mixBlendMode: "color-dodge",
                  filter: "blur(18px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.08 }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <XpProgressBar
                  value={xp}
                  max={xpMax}
                  label=""
                  hideNumbers={true}
                  width={217}
                />
              </div>
            </div>
          </div>
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
                onClick={handlePhonemeCatalogNavigate}
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
                Phoneme Catalog
              </button>

              <button
                type="button"
                onClick={(event) => {
                  void handleStreakOpen(event);
                }}
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
                Streak
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

      <DailyStreakDialog
        isOpen={isStreakDialogOpen}
        streakDays={streakData?.streakDayCounter ?? 0}
        maxStreak={streakData?.maxStreak ?? 0}
        motivationalLine={streakData?.motivationalLine}
        nextReward={streakData?.nextReward}
        isLoading={isStreakLoading}
        errorMessage={streakErrorMessage}
        openFrom={streakDialogOrigin}
        onClose={handleStreakDialogClose}
        onContinue={() => setIsStreakDialogOpen(false)}
        ctaLabel="Continue"
      />
    </div>
  );
}

