"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RolePageLayout } from "../../../../components/RolePageLayout";
import { EduPortal } from "../../../../components/EduPortal";
import { InputField } from "../../../../components/InputField";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { ResetPasswordDialog } from "../../../../components/ResetPasswordDialog";
import { Toast } from "../../../../components/Toast";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUI } from "../../../../contexts/UIContext";
import { useApiPost } from "../../../../hooks/useApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const { showSuccess, showError, showLoader, hideLoader } = useUI();
  const { post } = useApiPost();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetToast, setShowResetToast] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      showLoader("Signing in...");
      const user = await login(email, password);

      // Admin login page should only allow admin/teacher accounts.
      if (user?.role === "admin") {
        hideLoader();
        showSuccess("Login successful! Redirecting...");
        router.push("/admin/dashboard");
      } else if (user?.role === "teacher") {
        hideLoader();
        showSuccess("Login successful! Redirecting...");
        router.push("/teacher/dashboard");
      } else {
        hideLoader();
        logout();
        showError("Student accounts must sign in from the student login page.");
        router.push("/student/login");
      }
    } catch (error: unknown) {
      hideLoader();
      const err = error as { message?: string; response?: { message?: string } };
      const message = err?.response?.message || err?.message || "Invalid email or password";
      showError(message);
    }
  };

  const handleOpenResetDialog = () => {
    // Pre-fill reset field with current email if available
    setResetEmail((prev) => (prev || email ? prev || email : ""));
    setResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
  };

  const handleSendReset = async () => {
    try {
      showLoader("Sending reset email...");
      await post("/auth/forgot-password", { email: resetEmail });
      hideLoader();
      setResetDialogOpen(false);
      setShowResetToast(true);
    } catch (error: any) {
      hideLoader();
      const message = error?.response?.message || error?.message || "Failed to send reset email";
      showError(message);
    }
  };

  const handleToastOk = () => {
    // Link and code are sent to email; reset continues from email flow.
    setShowResetToast(false);
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

      </div>
    </RolePageLayout>
  );
}
