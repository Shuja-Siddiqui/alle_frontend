"use client";

import type { ChangeEvent, MouseEventHandler } from "react";
import { useState } from "react";
import { BackButton } from "../../../../components/BackButton";
import { InputField } from "../../../../components/InputField";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { ConfirmCancelDialog } from "../../../../components/ConfirmCancelDialog";

type SettingsDialogProps = {
  open: boolean;
  newPassword: string;
  repeatPassword: string;
  onNewPasswordChange: (value: string) => void;
  onRepeatPasswordChange: (value: string) => void;
  /** Called when the user clicks the SAVE button */
  onSave?: () => void;
  /** Called when the dialog should be closed (back arrow, backdrop, or ESC) */
  onClose?: () => void;
};

export function SettingsDialog({
  open,
  newPassword,
  repeatPassword,
  onNewPasswordChange,
  onRepeatPasswordChange,
  onSave,
  onClose,
}: SettingsDialogProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!open) return null;

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onNewPasswordChange(event.target.value);
  };

  const handleRepeatPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onRepeatPasswordChange(event.target.value);
  };

  const handleSave = () => {
    // Show confirmation dialog instead of immediately saving
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmDialog(false);
    if (onSave) {
      onSave();
    } else {
      onClose?.();
    }
  };

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      {/* Settings Dialog - Hide when confirmation dialog is open */}
      {!showConfirmDialog && (
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
              background: "linear-gradient(170.58deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
              width: "fit-content",
              minWidth: "560px",
            }}
          >
        {/* Header */}
        <div className="flex items-center justify-between w-full" style={{ marginBottom: "32px" }}>
          {/* Left side - Back button with Settings text */}
          <BackButton text="Settings" onClick={onClose} className="justify-start" />

          {/* Right side - Save button */}
          <PrimaryButton
            type="button"
            text="Save"
            iconSrc="/assets/icons/others/tick_white.svg"
            iconWidth={30}
            iconHeight={30}
            size="medium"
            variant="filled"
            onClick={handleSave}
            className="w-auto"
          />
        </div>

        {/* Password fields container */}
        <div className="flex flex-col w-full">
          <div className="flex gap-8 w-full">
            {/* New password field */}
            <div className="flex-1">
              <InputField
                label="New password"
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

            {/* Repeat password field */}
            <div className="flex-1">
              <InputField
                label="Repeat new password"
                placeholder="Repeat new password"
                type={showRepeatPassword ? "text" : "password"}
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
                endIconSrc="/assets/icons/others/eye.svg"
                endIconAlt="Toggle password visibility"
                endIconWidth={20}
                endIconHeight={20}
                onEndIconClick={() => setShowRepeatPassword(!showRepeatPassword)}
              />
            </div>
          </div>
        </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmCancelDialog
        open={showConfirmDialog}
        title="Save Password?"
        description="Are you sure you want to save the new password?"
        confirmLabel="Save"
        cancelLabel="Cancel"
        confirmIconSrc="/assets/icons/others/tick_white.svg"
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
        onClose={handleCancelSave}
      />
    </>
  );
}



