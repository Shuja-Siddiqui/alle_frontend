"use client";

import Image from "next/image";
import type { MouseEventHandler } from "react";
import { BackButton } from "./BackButton";
import { PrimaryButton } from "./PrimaryButton";

type SelectAvatarDialogProps = {
  open: boolean;
  /** Currently selected avatar URL */
  selectedAvatarUrl?: string;
  /** Called when an avatar is selected */
  onSelect?: (avatarUrl: string) => void;
  /** Called when the dialog should be closed (back arrow, backdrop, or ESC) */
  onClose?: () => void;
};

// Avatar gallery - all avatars from public/assets/icons/avatar_gallery
const AVATAR_GALLERY = [
  "/assets/icons/avatar_gallery/Avatar.png",
  "/assets/icons/avatar_gallery/Avatar-1.png",
  "/assets/icons/avatar_gallery/Avatar-2.png",
  "/assets/icons/avatar_gallery/Avatar-3.png",
  "/assets/icons/avatar_gallery/Avatar-4.png",
  "/assets/icons/avatar_gallery/Avatar-5.png",
  "/assets/icons/avatar_gallery/Avatar-6.png",
  "/assets/icons/avatar_gallery/Avatar-7.png",
  "/assets/icons/avatar_gallery/Avatar-8.png",
  "/assets/icons/avatar_gallery/Avatar-9.png",
  "/assets/icons/avatar_gallery/Avatar-10.png",
  "/assets/icons/avatar_gallery/Avatar-11.png",
  "/assets/icons/avatar_gallery/Avatar-12.png",
  "/assets/icons/avatar_gallery/Avatar-13.png",
  "/assets/icons/avatar_gallery/Avatar-14.png",
];

export function SelectAvatarDialog({
  open,
  selectedAvatarUrl,
  onSelect,
  onClose,
}: SelectAvatarDialogProps) {
  if (!open) return null;

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handleAvatarClick = (avatarUrl: string) => {
    onSelect?.(avatarUrl);
  };

  const handleSave = () => {
    if (selectedAvatarUrl) {
      onSelect?.(selectedAvatarUrl);
      onClose?.();
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 32, 0.80)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="inline-flex flex-col items-center rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.8)]"
        style={{
          width: "654px", // 562px content + 88px padding (44px × 2) + 4px border (2px × 2)
          background:
            "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content area with width 562px */}
        <div
          className="flex w-full flex-col"
          style={{
            width: "562px",
          }}
        >
          {/* Header with back arrow and title */}
          <div className="w-full">
            <BackButton
              text="Select avatar"
              onClick={onClose}
              className="justify-start"
            />
          </div>

          {/* Avatar grid - 32px gap from header */}
          <div className="mt-[32px] w-full">
            <div className="grid grid-cols-5 gap-[32px]">
            {/* Avatar gallery options */}
            {AVATAR_GALLERY.map((avatarUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAvatarClick(avatarUrl)}
                className="shrink-0 p-0 transition hover:opacity-80"
                style={{
                  display: "flex",
                  width: "70px",
                  height: "70px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  padding: 0,
                  margin: 0,
                }}
              >
                <Image
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  width={70}
                  height={70}
                  className="rounded-full"
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Save button with tick icon - 44px gap from avatar grid */}
        <div className="mt-[44px] flex w-full justify-center">
          <PrimaryButton
            type="button"
            text="Save"
            size="medium"
            iconSrc="/assets/icons/others/tick_pink.svg"
            iconAlt="Save"
            iconWidth={30}
            iconHeight={30}
            iconColor="#FFFFFF"
            onClick={handleSave}
          />
        </div>
        </div>
      </div>
    </div>
  );
}

