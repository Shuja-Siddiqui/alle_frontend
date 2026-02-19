"use client";

import { useState, useEffect } from "react";
import { BackButton } from "./BackButton";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { PrimaryButton } from "./PrimaryButton";

export type AddStudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  grade: string | null;
  startingModule: string | null;
  lesson: string | null;
};

type AddStudentDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when back button is clicked or backdrop is clicked */
  onClose: () => void;
  /** Called when Add student button is clicked */
  onAddStudent: (data: AddStudentFormData) => void;
  /** Available grades for dropdown */
  grades?: Array<{ value: string; label: string }>;
  /** Available modules for dropdown */
  modules?: Array<{ value: string; label: string }>;
  /** Available lessons for dropdown */
  lessons?: Array<{ value: string; label: string }>;
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

const defaultModules = [
  { value: "1", label: "Module 1" },
  { value: "2", label: "Module 2" },
  { value: "3", label: "Module 3" },
  { value: "4", label: "Module 4" },
];

const defaultLessons = [
  { value: "1", label: "Lesson 1" },
  { value: "2", label: "Lesson 2" },
  { value: "3", label: "Lesson 3" },
  { value: "4", label: "Lesson 4" },
  { value: "5", label: "Lesson 5" },
  { value: "6", label: "Lesson 6" },
];

export function AddStudentDialog({
  open,
  onClose,
  onAddStudent,
  grades = defaultGrades,
  modules = defaultModules,
  lessons = defaultLessons,
}: AddStudentDialogProps) {
  const [formData, setFormData] = useState<AddStudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    grade: null,
    startingModule: null,
    lesson: null,
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        grade: null,
        startingModule: null,
        lesson: null,
      });
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit() {
    onAddStudent(formData);
    onClose();
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
                  setFormData({ ...formData, startingModule: value })
                }
                className="w-full!"
              />
            </div>
            <div className="flex-1 min-w-0">
              <SelectField
                label="Lesson"
                placeholder="Select lesson"
                options={lessons.map((l) => ({
                  label: l.label,
                  value: l.value,
                }))}
                value={formData.lesson || undefined}
                onChange={(value) =>
                  setFormData({ ...formData, lesson: value })
                }
                className="w-full!"
              />
            </div>
          </div>
        </div>

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
            text="Add student"
            iconSrc="/assets/icons/admin/filter_checkmark.svg"
            iconAlt="Add student"
            iconWidth={30}
            iconHeight={30}
            variant="filled"
            onClick={handleSubmit}
            className="flex-1"
      
          />
        </div>
      </div>
    </div>
  );
}

