"use client";

import type { ChangeEvent, MouseEventHandler } from "react";
import { useState } from "react";
import Image from "next/image";
import { InputField } from "./InputField";

type SetNewPasswordDialogProps = {
  open: boolean;
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  /** Called when the user clicks the RESET PASSWORD button */
  onSave?: () => void;
  /** Called when the dialog should be closed (backdrop, or ESC) */
  onClose?: () => void;
};

export function SetNewPasswordDialog({
  open,
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSave,
  onClose,
}: SetNewPasswordDialogProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!open) return null;

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onNewPasswordChange(event.target.value);
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onConfirmPasswordChange(event.target.value);
  };

  const handleReset = () => {
    if (onSave) {
      onSave();
    } else {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 32, 0.80)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="inline-flex flex-col items-center rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.8)]"
        style={{
          background: "linear-gradient(156.45deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          width: "fit-content",
          minWidth: "560px",
        }}
      >
        {/* Content container with 44px gap */}
        <div className="flex flex-col gap-[44px] items-start w-full">
          {/* Header and fields container */}
          <div className="flex flex-col gap-[32px] items-start w-full">
            {/* Title */}
            <div className="flex items-center w-full">
              <h2
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
                Reset password
              </h2>
            </div>

            {/* Password fields container - stacked vertically with 24px gap */}
            <div className="flex flex-col gap-[24px] items-start w-full">
              {/* Enter new password field */}
              <div className="w-[472px]">
                <InputField
                  label="Enter new password"
                  placeholder="Enter new password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  endIconSrc="/assets/icons/others/eye.svg"
                  endIconAlt="Toggle password visibility"
                  endIconWidth={20}
                  endIconHeight={20}
                  onEndIconClick={() => setShowNewPassword(!showNewPassword)}
                />
              </div>

              {/* Confirm new password field */}
              <div className="w-[472px]">
                <InputField
                  label="Confirm new password"
                  placeholder="Confirm new password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  endIconSrc="/assets/icons/others/eye.svg"
                  endIconAlt="Toggle password visibility"
                  endIconWidth={20}
                  endIconHeight={20}
                  onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>
          </div>

          {/* Button container - full width */}
          <div className="flex items-center w-full">
            <button
              type="button"
              className="relative flex flex-1 gap-[12px] h-[70px] items-center justify-center px-[23.902px] py-[9.612px] rounded-[76.829px] overflow-hidden"
              style={{
                border: "2px solid rgba(255, 255, 255, 0.24)",
                backgroundImage:
                  "linear-gradient(79.8deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%)",
                boxShadow: "0px 0px 0px 1.602px #E451FE",
              }}
              onClick={handleReset}
            >
              {/* Decorative stars */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "342.88px",
                  top: "-25.05px",
                  width: "54.376px",
                  height: "54.376px",
                }}
              >
                <div style={{ transform: "rotate(-30deg)" }}>
                  <Image
                    src="/assets/icons/others/star2.png"
                    alt=""
                    width={40}
                    height={40}
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </div>
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "260.93px",
                  top: "29.59px",
                  width: "64.049px",
                  height: "64.049px",
                }}
              >
                <div style={{ transform: "rotate(-30deg)" }}>
                  <Image
                    src="/assets/icons/others/star2.png"
                    alt=""
                    width={47}
                    height={47}
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </div>
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "78.61px",
                  top: "36.63px",
                  width: "51.294px",
                  height: "51.294px",
                }}
              >
                <div style={{ transform: "rotate(-23deg)" }}>
                  <Image
                    src="/assets/icons/others/star2.png"
                    alt=""
                    width={39}
                    height={39}
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </div>

              {/* Button text */}
              <span
                className="relative z-10"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "22.927px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "150%",
                  letterSpacing: "-0.252px",
                  textTransform: "uppercase",
                }}
              >
                Reset password
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

