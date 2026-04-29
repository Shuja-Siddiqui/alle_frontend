"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RolePageLayout } from "../../components/RolePageLayout";
import { EduPortal } from "../../components/EduPortal";
import { InputField } from "../../components/InputField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { api } from "../../lib/api-client";
import { useUI } from "../../contexts/UIContext";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { showError, showLoader, hideLoader, showSuccess } = useUI();

  const token = useMemo(() => params.get("token") || "", [params]);
  const initialCode = useMemo(() => params.get("code") || "", [params]);

  const [verificationCode, setVerificationCode] = useState(initialCode);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);
  const [resetCompleted, setResetCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    const validate = async () => {
      if (resetCompleted) {
        setValidating(false);
        return;
      }
      if (!token) {
        setTokenValid(false);
        setValidating(false);
        return;
      }
      try {
        await api.post("/auth/validate-reset-token", {
          token,
          verificationCode: verificationCode || undefined,
        });
        if (!active) return;
        setTokenValid(true);
      } catch (error: any) {
        if (!active) return;
        setTokenValid(false);
        const message = error?.response?.message || error?.message || "Invalid or expired reset link";
        if (!resetCompleted) {
          showError(message);
        }
      } finally {
        if (active) setValidating(false);
      }
    };

    void validate();
    return () => {
      active = false;
    };
  }, [token, verificationCode, resetCompleted, showError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      showError("Invalid reset token");
      return;
    }
    if (!verificationCode || verificationCode.length !== 6) {
      showError("Verification code must be 6 digits");
      return;
    }
    if (newPassword.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      showLoader("Resetting password...");
      await api.post("/auth/reset-password", {
        token,
        verificationCode,
        newPassword,
        confirmPassword,
      });
      setResetCompleted(true);
      hideLoader();
      showSuccess("Password reset successful. Please sign in.");
      router.push("/");
    } catch (error: any) {
      hideLoader();
      const message = error?.response?.message || error?.message || "Failed to reset password";
      showError(message);
    }
  };

  return (
    <RolePageLayout role="student" page="login">
      <div className="flex min-h-screen w-full flex-col items-center justify-center font-sans">
        <div className="mb-[40px] flex justify-center">
          <EduPortal text="EduPortal" />
        </div>
        <main
          className="flex w-full max-w-[560px] flex-col rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
          style={{
            background: "linear-gradient(154.52deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
          }}
        >
          <h1
            className="mb-[24px] text-center"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Reset Password
          </h1>

          {validating ? (
            <p style={{ color: "#B0B3FF", textAlign: "center" }}>Validating reset link...</p>
          ) : !tokenValid ? (
            <p style={{ color: "#FF8BCF", textAlign: "center" }}>
              This reset link is invalid or expired.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <InputField
                  label="Verification code"
                  type="text"
                  placeholder="6-digit code from email"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>
              <div className="mb-5">
                <InputField
                  label="New password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-8">
                <InputField
                  label="Confirm new password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <PrimaryButton type="submit" text="Reset password" />
            </form>
          )}
        </main>
      </div>
    </RolePageLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
