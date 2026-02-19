"use client";

import { useState, FormEvent } from "react";
import { RolePageLayout } from "../../../../components/RolePageLayout";
import { EduPortal } from "../../../../components/EduPortal";
import { InputField } from "../../../../components/InputField";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { ResetPasswordDialog } from "../../../../components/ResetPasswordDialog";
import { Toast } from "../../../../components/Toast";
import { SetNewPasswordDialog } from "../../../../components/SetNewPasswordDialog";
import { ConfirmCancelDialog } from "../../../../components/ConfirmCancelDialog";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetToast, setShowResetToast] = useState(false);
  const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up to admin login API
  };

  const handleOpenResetDialog = () => {
    // Pre-fill reset field with current email if available
    setResetEmail((prev) => (prev || email ? prev || email : ""));
    setResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
  };

  const handleSendReset = () => {
    // TODO: wire up to reset password API using `resetEmail`
    setResetDialogOpen(false);
    setShowResetToast(true);
  };

  const handleToastOk = () => {
    // Close toast and show password dialog
    setShowResetToast(false);
    setShowSetPasswordDialog(true);
  };

  const handleSetPasswordSave = () => {
    // Show confirmation dialog
    setShowSetPasswordDialog(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmReset = () => {
    // TODO: wire up to reset password API using resetNewPassword and resetConfirmPassword
    console.log("Resetting password:", { newPassword: resetNewPassword, confirmPassword: resetConfirmPassword });
    setShowConfirmDialog(false);
    // Reset form
    setResetNewPassword("");
    setResetConfirmPassword("");
    setResetEmail("");
  };

  const handleCancelReset = () => {
    setShowConfirmDialog(false);
    // Reopen password dialog
    setShowSetPasswordDialog(true);
  };

  return (
    <RolePageLayout role="admin" page="login">
      <div className="flex min-h-screen w-full flex-col items-center justify-center font-sans">
        <div className="mb-[59px] flex justify-center">
          <EduPortal text="EduPortal" />
        </div>

        <main
          className="flex w-full max-w-[501px] flex-col rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
          style={{
            background:
              "linear-gradient(154.52deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          }}
        >
          <h1
            className="mb-[32px] text-center"
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
            Sign in
          </h1>

          <form onSubmit={handleSubmit}>
            {/* 32px from Login to first label */}
            <div className="mb-6">
            <InputField
              label="Email or school ID"
              type="email"
              placeholder="Enter email or school ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            {/* 24px from first input to second label via mb-6 on this block */}
            <div className="mb-11">
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              endIconSrc="/assets/icons/others/eye.svg"
                endIconAlt="Toggle password visibility"
              endIconWidth={20}
              endIconHeight={20}
            />
              {/* 12px from password input to reset password via mt-3 */}
              <button
                type="button"
                className="mt-3 block text-right text-[18px]"
                style={{
                  color: "#FF00C8",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontWeight: 500,
                  letterSpacing: "-0.198px",
                }}
                onClick={handleOpenResetDialog}
              >
                Reset password
              </button>
            </div>

            {/* 44px from reset password to Continue button via mt-11 */}
            <div className="mt-11">
              <PrimaryButton type="submit" text="Continue" />
            </div>
          </form>
        </main>

        {/* Reset password dialog, matches Figma RESET PASSWORD design */}
        <ResetPasswordDialog
          open={resetDialogOpen}
          value={resetEmail}
          onChange={setResetEmail}
          onSend={handleSendReset}
          onClose={handleCloseResetDialog}
          />

        {/* Success toast after reset password, matches Figma SUCCESS design */}
        {showResetToast && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: "rgba(0, 0, 32, 0.80)" }}
          >
            <Toast
              variant="success"
              description="Please check your email to reset your password"
              actionLabel="OK"
              onAction={handleToastOk}
            />
          </div>
        )}

        {/* Set new password dialog - shown after success toast */}
        <SetNewPasswordDialog
          open={showSetPasswordDialog}
          newPassword={resetNewPassword}
          confirmPassword={resetConfirmPassword}
          onNewPasswordChange={setResetNewPassword}
          onConfirmPasswordChange={setResetConfirmPassword}
          onSave={handleSetPasswordSave}
          onClose={() => {
            setShowSetPasswordDialog(false);
            setResetNewPassword("");
            setResetConfirmPassword("");
          }}
        />

        {/* Confirmation dialog - shown after setting password */}
        <ConfirmCancelDialog
          open={showConfirmDialog}
          title="Reset Password?"
          description="Are you sure you want to reset your password?"
          confirmLabel="Yes, reset"
          cancelLabel="Cancel"
          confirmIconSrc="/assets/icons/others/tick_white.svg"
          cancelIconSrc="/assets/icons/others/cancel_white.svg"
          onConfirm={handleConfirmReset}
          onCancel={handleCancelReset}
          onClose={handleCancelReset}
        />
      </div>
    </RolePageLayout>
  );
}
