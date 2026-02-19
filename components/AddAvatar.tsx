"use client";

import Image from "next/image";
import type { MouseEventHandler } from "react";
import { PrimaryButton } from "./PrimaryButton";

type AddAvatarProps = {
  /** Called when the user clicks the Continue button */
  onContinue?: () => void;
  /** Called when the user clicks the avatar selection area */
  onSelectAvatar?: () => void;
  /** Optional selected avatar image URL */
  avatarUrl?: string;
};

export function AddAvatar({
  onContinue,
  onSelectAvatar,
  avatarUrl,
}: AddAvatarProps) {
  const handleAvatarClick: MouseEventHandler<HTMLButtonElement> = () => {
    onSelectAvatar?.();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h1
        className="text-center"
        style={{
          color: "#FFFFFF",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "36px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "42px",
          letterSpacing: "-0.396px",
          textTransform: "uppercase",
        }}
      >
        Avatar
      </h1>

      {/* Avatar selection area - 44px gap from title */}
      <button
        type="button"
        onClick={handleAvatarClick}
        className="mt-[44px] flex w-full items-center gap-[16px]"
      >
        {avatarUrl ? (
          /* Selected avatar - no circle, just the image */
          <Image
            src={avatarUrl}
            alt="Selected avatar"
            width={70}
            height={70}
            className="shrink-0 rounded-full"
            style={{
              width: "70px",
              height: "70px",
              flexShrink: 0,
            }}
          />
        ) : (
          /* Plus icon container - circular with border */
          <div
            className="flex shrink-0 items-center justify-center rounded-[51.22px] border-2 border-[#434B93]"
            style={{
              display: "flex",
              width: "70px",
              height: "70px",
              padding: "16px 24px",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              borderRadius: "51.22px",
              border: "2px solid #434B93",
              background: "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            }}
          >
            <span
              className="shrink-0"
              style={{
                color: "#E451FE",
                fontSize: "36px",
                fontWeight: 300,
                lineHeight: "1",
                width: "36px",
                height: "36px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              +
            </span>
          </div>
        )}

        {/* Select avatar text */}
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "150%",
            letterSpacing: "-0.176px",
          }}
        >
          Select avatar
        </span>
      </button>

      {/* Continue button with 44px gap from avatar selection */}
      <div className="mt-[44px] w-full">
        <PrimaryButton
          type="button"
          text="Continue"
          className="w-full"
          onClick={onContinue}
        />
      </div>
    </div>
  );
}

