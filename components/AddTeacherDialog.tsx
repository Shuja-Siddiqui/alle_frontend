"use client";

import { useEffect, useState } from "react";
import { BackButton } from "./BackButton";
import { InputField } from "./InputField";
import { PrimaryButton } from "./PrimaryButton";
import { api } from "../lib/api-client";

export type AddTeacherFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};

type AddTeacherDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddTeacher: (data: AddTeacherFormData) => void | Promise<void>;
};

export function AddTeacherDialog({ open, onClose, onAddTeacher }: AddTeacherDialogProps) {
  const [formData, setFormData] = useState<AddTeacherFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit() {
    setError(null);
    const { firstName, lastName, email, password } = formData;

    if (!firstName?.trim()) return setError("First name is required");
    if (!lastName?.trim()) return setError("Last name is required");
    if (!email?.trim()) return setError("Email is required");
    if (!password || password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      await api.post("/auth/signup", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        role: "teacher",
      });
      await onAddTeacher(formData);
      onClose();
    } catch (err: unknown) {
      let msg = "";
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { message?: string; data?: { message?: string } } }).response;
        msg = res?.message || res?.data?.message || "";
      }
      const errMsg = err instanceof Error ? err.message : "Failed to add teacher";
      const combined = msg || errMsg;
      if (combined.toLowerCase().includes("already registered") || combined.toLowerCase().includes("email already")) {
        setError("A teacher with this email already exists.");
      } else {
        setError(combined || "Failed to add teacher");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex flex-col gap-[32px] items-center p-[44px] relative rounded-[51.22px]"
        style={{
          border: "2px solid #e451fe",
          backgroundImage: "linear-gradient(156.5155684126005deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
          maxWidth: "760px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-[16px] items-center w-full">
          <BackButton text="Add teacher" onClick={onClose} />
        </div>

        <div className="flex flex-col gap-[24px] items-start w-full">
          <div className="flex gap-[16px] items-start w-full">
            <div className="flex-1 min-w-0">
              <InputField
                label="First name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="flex-1 min-w-0">
              <InputField
                label="Last name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="w-full">
            <InputField
              label="Email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="w-full">
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password || ""}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: "#ff6b6b", fontFamily: "var(--font-orbitron), system-ui, sans-serif", fontSize: "14px", width: "100%" }}>
            {error}
          </p>
        )}

        <div className="flex gap-[32px] items-start justify-center w-full">
          <PrimaryButton
            text="Cancel"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            style={{ border: "2px solid #ff12ef", boxShadow: "0px 0px 0px 1.602px #e451fe" }}
          />

          <PrimaryButton
            text={loading ? "Adding..." : "Add teacher"}
            iconSrc={loading ? undefined : "/assets/icons/admin/filter_checkmark.svg"}
            iconAlt="Add teacher"
            iconWidth={30}
            iconHeight={30}
            variant="filled"
            onClick={handleSubmit}
            className="flex-1"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}

