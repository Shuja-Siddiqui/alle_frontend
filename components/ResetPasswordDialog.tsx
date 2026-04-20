"use client";

import type { ChangeEvent, MouseEventHandler } from "react";
import { BackButton } from "./BackButton";
import { InputField } from "./InputField";
import { PrimaryButton } from "./PrimaryButton";

type ResetPasswordDialogProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  /** Called when the user clicks the SEND button */
  onSend?: () => void;
  /** Called when the dialog should be closed (back arrow, backdrop, or ESC) */
  onClose?: () => void;
};

export function ResetPasswordDialog({
  open,
  value,
  onChange,
  onSend,
  onClose,
}: ResetPasswordDialogProps) {
  if (!open) return null;

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleSend = () => {
    if (onSend) {
      onSend();
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
        className="inline-flex w-[560px] min-h-[382px] flex-col items-center rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.8)]"
        style={{
          background:
            "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
        }}
      >
        {/* Fixed content frame: 472 × 294 */}
        <div
          className="flex flex-col"
          style={{
            width: "472px",
            height: "294px",
          }}
        >
          {/* Header with back arrow and title, matching RESET PASSWORD style */}
          <div className="w-full">
            <BackButton
              text="Reset password"
              onClick={onClose}
              className="justify-start"
            />
          </div>

          {/* 32px gap from BackButton to label */}
          <div className="mt-[32px] w-full">
            <InputField
              label="Email or school ID"
              placeholder="Enter email or school ID"
              type="email"
              value={value}
              onChange={handleInputChange}
            />
          </div>

          {/* 44px gap from input to button */}
          <div className="mt-[44px] w-full">
            <PrimaryButton
              type="button"
              text="Send"
              className="w-full"
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
