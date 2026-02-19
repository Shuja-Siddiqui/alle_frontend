"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SettingsDialog } from "./components/SettingsDialog";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // TODO: Fetch actual student data from API
  const studentName = "MAXWELL THOMPSON";
  const studentEmail = "maxwell@gmail.com";
  const studentAge = "14 years";
  const profileImageSrc = "/assets/icons/others/profile_avatar_large.png";
  const mascotImageSrc = "/assets/icons/others/mascot_profile.png";

  // Badge data - TODO: Fetch from API
  const badges = [
    { id: 1, image: "/assets/icons/others/badge_1.png", earned: true },
    { id: 2, image: "/assets/icons/others/badge_2.png", earned: true },
    { id: 3, image: "/assets/icons/others/badge_3.png", earned: true },
    { id: 4, image: "/assets/icons/others/badge_4_locked.png", earned: false },
  ];

  const handleEditMascot = () => {
    // Navigate to mascot edit page
    router.push("/student/profile/mascot-edit");
  };

  const handleBadgesClick = () => {
    // TODO: Navigate to badges page or show more badges
    console.log("Badges clicked");
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
            {/* Avatar */}
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
                <Image
                  src="/assets/icons/others/dot_separator.png"
                  alt=""
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
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

          {/* Right side - Settings Gear */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
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
        {/* Badges Section - Left */}
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

          {/* Badge Icons */}
          <div className="flex items-center justify-between" style={{ width: "431px" }}>
            {badges.map((badge) => (
              <div
                key={badge.id}
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
                  src={badge.image}
                  alt={`Badge ${badge.id}`}
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
            ))}
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
              {/* Mascot Avatar */}
              <div
                style={{
                  width: "128.462px",
                  height: "160.666px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={mascotImageSrc}
                  alt="Mascot"
                  width={128}
                  height={160}
                  style={{
                    objectFit: "contain",
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
    </div>
  );
}

