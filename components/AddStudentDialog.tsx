"use client";

import { useState, useEffect } from "react";
import { BackButton } from "./BackButton";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { PrimaryButton } from "./PrimaryButton";
import { api } from "../lib/api-client";

export type AddStudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  grade: string | null;
  startingModule: string | null;
  lesson: string | null;
};

type AddStudentDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when back button is clicked or backdrop is clicked */
  onClose: () => void;
  /** Called when student is added successfully */
  onAddStudent: (data: AddStudentFormData) => void | Promise<void>;
  /** Available grades for dropdown */
  grades?: Array<{ value: string; label: string }>;
  /** Available modules for dropdown. If not provided, modules are fetched from API. */
  modules?: Array<{ value: string; label: string }>;
};

const defaultGrades = [
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
  { value: "3", label: "Grade 3" },
  { value: "4", label: "Grade 4" },
  { value: "5", label: "Grade 5" },
  { value: "6", label: "Grade 6" },
  { value: "7", label: "Grade 7" },
  { value: "8", label: "Grade 8" },
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

const defaultModules: Array<{ value: string; label: string }> = [];

export function AddStudentDialog({
  open,
  onClose,
  onAddStudent,
  grades = defaultGrades,
  modules: modulesProp = defaultModules,
}: AddStudentDialogProps) {
  const [modules, setModules] = useState<Array<{ value: string; label: string }>>(modulesProp);
  const [moduleLessons, setModuleLessons] = useState<Array<{ value: string; label: string }>>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [formData, setFormData] = useState<AddStudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    grade: null,
    startingModule: null,
    lesson: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form and sync/load modules when dialog opens
  useEffect(() => {
    if (!open) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        grade: null,
        startingModule: null,
        lesson: null,
      });
      setError(null);
      setModuleLessons([]);
    } else {
      if (modulesProp.length > 0) {
        setModules(modulesProp);
      } else {
        let isMounted = true;
        api.get<{ data?: Array<{ id: string; title: string }> }>("/modules")
          .then((res) => {
            const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            if (isMounted) {
              setModules(list.map((m: { id: string; title: string }) => ({ value: m.id, label: m.title })));
            }
          })
          .catch(() => { if (isMounted) setModules([]); });
        return () => { isMounted = false; };
      }
    }
  }, [open, modulesProp]);

  // Fetch lessons when starting module changes
  useEffect(() => {
    if (!open || !formData.startingModule) {
      setModuleLessons([]);
      setLoadingLessons(false);
      return;
    }
    let isMounted = true;
    setModuleLessons([]); // Clear previous lessons immediately
    setLoadingLessons(true);
    setFormData((prev) => ({ ...prev, lesson: null }));
    api.get<{ data?: Array<{ id: string; title: string }> }>(`/modules/${formData.startingModule}/lessons`)
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (isMounted) {
          setModuleLessons(list.map((l: { id: string; title: string }, i: number) => ({
            value: l.id,
            label: `Lesson ${i + 1}: ${l.title}`,
          })));
        }
      })
      .catch(() => { if (isMounted) setModuleLessons([]); })
      .finally(() => { if (isMounted) setLoadingLessons(false); });
    return () => { isMounted = false; };
  }, [open, formData.startingModule]);

  if (!open) return null;

  async function handleSubmit() {
    setError(null);
    const { firstName, lastName, email, password, grade } = formData;

    if (!firstName?.trim()) {
      setError("First name is required");
      return;
    }
    if (!lastName?.trim()) {
      setError("Last name is required");
      return;
    }
    if (!email?.trim()) {
      setError("Email is required");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/signup", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        role: "student",
        grade: grade || undefined,
      });
      await onAddStudent(formData);
      onClose();
    } catch (err: unknown) {
      let msg = "";
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { message?: string; data?: { message?: string } } }).response;
        msg = res?.message || res?.data?.message || "";
      }
      const errMsg = err instanceof Error ? err.message : "Failed to add student";
      const combined = msg || errMsg;
      if (
        combined.toLowerCase().includes("already registered") ||
        combined.toLowerCase().includes("email already")
      ) {
        setError("A student with this email already exists.");
      } else {
        setError(combined || "Failed to add student");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="flex flex-col gap-[44px] items-center p-[44px] relative rounded-[51.22px]"
        style={{
          border: "2px solid #e451fe",
          backgroundImage:
            "linear-gradient(156.5155684126005deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
          maxWidth: "900px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex gap-[16px] items-center w-full">
          <BackButton text="Add student" onClick={onClose} />
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-[24px] items-start w-full">
          {/* First name and Last name row */}
          <div className="flex gap-[16px] items-start w-full">
            <div className="flex-1 min-w-0">
              <InputField
                label="First name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <InputField
                label="Last name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="w-full">
            <InputField
              label="Email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Grade */}
          <div className="w-full">
            <SelectField
              label="Grade"
              placeholder="Select grade"
              options={grades.map((g) => ({ label: g.label, value: g.value }))}
              value={formData.grade || undefined}
              onChange={(value) =>
                setFormData({ ...formData, grade: value })
              }
              className="w-full!"
            />
          </div>

          {/* Starting module and Lesson row */}
          <div className="flex gap-[16px] items-start w-full">
            <div className="flex-1 min-w-0">
              <SelectField
                label="Starting module"
                placeholder="Select module"
                options={modules.map((m) => ({
                  label: m.label,
                  value: m.value,
                }))}
                value={formData.startingModule || undefined}
                onChange={(value) =>
                  setFormData({ ...formData, startingModule: value, lesson: null })
                }
                className="w-full!"
              />
            </div>
            <div className="flex-1 min-w-0">
              <SelectField
                key={formData.startingModule || "no-module"}
                label="Lesson"
                placeholder={formData.startingModule ? (loadingLessons ? "Loading lessons..." : "Select lesson") : "Select module first"}
                options={moduleLessons.map((l) => ({ label: l.label, value: l.value }))}
                value={formData.lesson || undefined}
                onChange={(value) =>
                  setFormData({ ...formData, lesson: value })
                }
                className="w-full!"
              />
            </div>
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              width: "100%",
            }}
          >
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-[32px] items-start justify-center w-full">
          {/* Cancel Button */}
          <PrimaryButton
            text="Cancel"
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            style={{
              border: "2px solid #ff12ef",
              boxShadow: "0px 0px 0px 1.602px #e451fe",
            }}
          />

          {/* Add Student Button */}
          <PrimaryButton
            text={loading ? "Adding..." : "Add student"}
            iconSrc={loading ? undefined : "/assets/icons/admin/filter_checkmark.svg"}
            iconAlt="Add student"
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

