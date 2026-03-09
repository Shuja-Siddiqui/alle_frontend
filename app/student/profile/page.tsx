"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { SettingsDialog } from "./components/SettingsDialog";
import { MascotDisplay } from "@/components/MascotDisplay";
import { AllBadgesOverlay } from "@/components/AllBadgesOverlay";

const DEFAULT_AVATAR = "/assets/icons/others/profile_avatar_large.png";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Profile data from auth context (backend user: avatarUrl, firstName, lastName, name, email, etc.)
  const studentName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.email ||
    "";
  const studentEmail = user?.email ?? "";
  const studentAge = "14 years"; // TODO: from backend when available
  // avatarUrl from backend is path to public folder asset (e.g. /assets/avatar/...)
  const profileImageSrc = user?.avatarUrl || DEFAULT_AVATAR;
  const mascot = user?.mascot as
    | {
      face?: string;
      hair?: string;
      body?: string;
      hairColor?: string;
    }
    | undefined;

  const getCollarFromBody = (bodyId: string | undefined): string => {
    const match = bodyId?.match(/body(\d+)/i);
    const num = match ? match[1] : "1";
    return `collar${num}`;
  };

  // Badge data from user context (unlocked badges) - used for initial 4 badges
  const unlockedBadgesFromUser = (user?.badges ?? []).map((b) => ({
    imageSrc: b.iconActive || b.iconInactive || "/assets/icons/badges/badge1.svg",
    earned: true,
    alt: b.title,
    title: b.title,
    description: b.description ?? undefined,
  }));

  // All badges (active + inactive) for dialog
  const [allBadges, setAllBadges] = useState<
    {
      imageSrc: string;
      earned: boolean;
      alt?: string;
      title?: string;
      description?: string;
    }[]
  >([]);
  const [isBadgesOverlayOpen, setIsBadgesOverlayOpen] = useState(false);

  const handleEditMascot = () => {
    // Navigate to mascot edit page
    router.push("/student/profile/mascot-edit");
  };

  const handleBadgesClick = () => {
    // Build full badge list (9 slots) using naming convention:
    // /assets/icons/badges/active1.svg ... active9.svg
    // /assets/icons/badges/in_active1.svg ... in_active9.svg
    const activeCount = (user?.badges ?? []).length;
    const totalBadges = 9;

    const fullBadgeList = Array.from({ length: totalBadges }).map((_, index) => {
      const badgeNumber = index + 1;
      const isEarned = badgeNumber <= activeCount;

      return {
        imageSrc: isEarned
          ? `/assets/icons/badges/active${badgeNumber}.svg`
          : `/assets/icons/badges/in_active${badgeNumber}.svg`,
        earned: isEarned,
        alt: `Badge ${badgeNumber}`,
        title: `Badge ${badgeNumber}`,
      };
    });

    setAllBadges(fullBadgeList);
    setIsBadgesOverlayOpen(true);
  };

  return (
    <div
      className="relative flex flex-col items-center font-sans"
      style={{
        width: "1440px",
        height: "calc(100vh - 40px - 60.864px)",
        padding: "0 32px 32px 32px",
      }}
    >
      {/* Main Profile Card - Centered */}
      <div
        className="relative"
        style={{
          marginTop: "120px", // Position from top
          width: "1014px",
          padding: "44px",
          borderRadius: "51.22px",
          border: "2px solid #E451FE",
          background: "linear-gradient(175.32deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          boxShadow: "0 0 0 2.563px #E451FE",
        }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left side - Avatar and Info */}
          <div className="flex items-center gap-6">
            {/* Avatar (profile image) */}
            <div
              className="relative shrink-0"
              style={{
                width: "86px",
                height: "86px",
              }}
            >
              <Image
                src={profileImageSrc}
                alt="Profile"
                width={86}
                height={86}
                className="rounded-full"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Name and Details */}
            <div className="flex flex-col gap-3">
              {/* Name */}
              <h1
                style={{
                  color: "#FFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "42px",
                  letterSpacing: "-0.396px",
                  textTransform: "uppercase",
                }}
              >
                {studentName}
              </h1>

              {/* Email and Age */}
              <div className="flex items-center gap-1">
                <span
                  style={{
                    color: "#FF00C8",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "27px",
                    letterSpacing: "-0.198px",
                  }}
                >
                  {studentEmail}
                </span>
                <span style={{
                  color: "#FF00C8",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "27px",
                  letterSpacing: "-0.198px",
                }}>
                  .
                </span>
                <span
                  style={{
                    color: "#FF00C8",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "27px",
                    letterSpacing: "-0.198px",
                  }}
                >
                  {studentAge}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Settings Gear + Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              style={{
                width: "70px",
                height: "70px",
                cursor: "pointer",
                background: "transparent",
                border: "none",
                padding: 0,
              }}
            >
              <Image
                src="/assets/icons/others/pink_gear.svg"
                alt="Settings"
                width={70}
                height={70}
              />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2"
                style={{
                  minWidth: "220px",
                  padding: "12px 16px",
                  borderRadius: "24px",
                  border: "2px solid #E451FE",
                  background:
                    "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
                  boxShadow: "0 0 0 2px rgba(228, 81, 254, 0.6)",
                  zIndex: 20,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  style={{
                    width: "100%",
                    padding: "4px 0",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    color: "#FFF",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                    letterSpacing: "-0.198px",
                    marginBottom: "8px",
                    cursor: "pointer",
                  }}
                >
                  Settings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    router.push("/login");
                  }}
                  style={{
                    width: "100%",
                    padding: "4px 0",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    color: "var(--Colors-Primary, #FF00CA)",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                    letterSpacing: "-0.198px",
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

      {/* Bottom Section - Badges and Edit Mascot */}
      <div
        className="flex items-start justify-center gap-6"
        style={{
          marginTop: "40px",
          width: "100%",
        }}
      >
        {/* Badges Section - Left (original UI, 4 badges) */}
        <div
          className="relative cursor-pointer"
          onClick={handleBadgesClick}
          style={{
            width: "495px",
            height: "206px",
            padding: "32px",
            borderRadius: "36px",
            border: "2px solid #E451FE",
            background: "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            boxShadow: "0 0 0 2.563px #E451FE",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                color: "#FFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "22.927px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "34.39px",
                letterSpacing: "-0.252px",
                textTransform: "uppercase",
              }}
            >
              Badges
            </h2>
            <div
              style={{
                width: "36px",
                height: "36px",
              }}
            >
              <Image
                src="/assets/icons/others/pink_forward.svg"
                alt="View all badges"
                width={36}
                height={36}
              />
            </div>
          </div>

          {/* Badge Icons (show up to 4 unlocked badges) */}
          <div className="flex items-center justify-between" style={{ width: "431px" }}>
            {Array.from({ length: 4 }).map((_, index) => {
              const badge = unlockedBadgesFromUser[index];

              if (!badge) {
                return (
                  <div
                    key={index}
                    style={{
                      width: "96.871px",
                      height: "80px",
                    }}
                  />
                );
              }

              return (
                <div
                  key={badge.title ?? index}
                  style={{
                    width: "96.871px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    opacity: badge.earned ? 1 : 0.24,
                  }}
                >
                  <Image
                    src={badge.imageSrc}
                    alt={badge.alt || "Badge"}
                    width={80}
                    height={80}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  {!badge.earned && (
                    <div
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Image
                        src="/assets/icons/others/lock_icon.png"
                        alt="Locked"
                        width={20}
                        height={20}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Mascot Section - Right */}
        <div
          className="relative cursor-pointer"
          onClick={handleEditMascot}
          style={{
            width: "495px",
            height: "206px",
            padding: "32px 44px",
            borderRadius: "36px",
            border: "2px solid #E451FE",
            background: "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            boxShadow: "0 0 0 2.563px #E451FE",
          }}
        >
          <div className="flex items-center justify-between h-full">
            {/* Left side - Mascot and Text */}
            <div className="flex items-center gap-6">
              {/* Larger mascot inside circular frame, with head popping out from the top */}
              <div
                style={{
                  width: "128px",
                  height: "128px",
                  borderRadius: "50%",
                  border: "2px solid #E451FE",
                  boxShadow: "0 0 0 2px rgba(228, 81, 254, 0.8)",
                  background:
                    "radial-gradient(100% 100% at 50% 0%, #1B1F4E 0%, #0B0F37 100%)",
                  position: "relative",
                  overflow: "visible",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <MascotDisplay
                  headId={mascot?.face ?? "head1"}
                  hairId={mascot?.hair ?? "hair1"}
                  bodyId={mascot?.body ?? "body1"}
                  collarId={getCollarFromBody(mascot?.body)}
                  hairColor={mascot?.hairColor ?? "#E451FE"}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: "120%",
                    height: "120%",
                  }}
                />
              </div>

              {/* Edit Mascot Text */}
              <p
                style={{
                  color: "#FFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "28px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "36px",
                  letterSpacing: "-0.308px",
                  textTransform: "uppercase",
                  whiteSpace: "pre-wrap",
                  width: "178px",
                }}
              >
                Edit mascot
              </p>
            </div>

            {/* Right side - Arrow */}
            <div
              style={{
                width: "36px",
                height: "36px",
              }}
            >
              <Image
                src="/assets/icons/others/pink_forward.svg"
                alt="Edit"
                width={36}
                height={36}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsOpen}
        newPassword={newPassword}
        repeatPassword={repeatPassword}
        onNewPasswordChange={setNewPassword}
        onRepeatPasswordChange={setRepeatPassword}
        onSave={() => {
          // TODO: Implement password save logic
          console.log("Saving password:", { newPassword, repeatPassword });
          setIsSettingsOpen(false);
        }}
        onClose={() => {
          setIsSettingsOpen(false);
          setNewPassword("");
          setRepeatPassword("");
        }}
      />
      {/* Badges Overlay Dialog */}
      <AllBadgesOverlay
        badges={allBadges}
        visible={isBadgesOverlayOpen}
        onClose={() => setIsBadgesOverlayOpen(false)}
      />
    </div>
  );
}

