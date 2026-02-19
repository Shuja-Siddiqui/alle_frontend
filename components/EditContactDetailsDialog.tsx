"use client";

import { useState, useEffect } from "react";
import { BackButton } from "./BackButton";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { PrimaryButton } from "./PrimaryButton";

export type ContactDetailsFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  language: string | null;
  timezone: string | null;
};

type EditContactDetailsDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Initial contact details data */
  initialData?: ContactDetailsFormData;
  /** Called when back button is clicked or backdrop is clicked */
  onClose: () => void;
  /** Called when Save changes button is clicked */
  onSave: (data: ContactDetailsFormData) => void;
  /** Available languages for dropdown */
  languages?: Array<{ value: string; label: string }>;
  /** Available timezones for dropdown */
  timezones?: Array<{ value: string; label: string }>;
};

const defaultLanguages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
];

const defaultTimezones = [
  { value: "gmt-5", label: "GMT-5 (Eastern Time)" },
  { value: "gmt-8", label: "GMT-8 (Pacific Time)" },
  { value: "gmt+0", label: "GMT+0 (UTC)" },
  { value: "gmt+1", label: "GMT+1 (Central European Time)" },
];

export function EditContactDetailsDialog({
  open,
  initialData,
  onClose,
  onSave,
  languages = defaultLanguages,
  timezones = defaultTimezones,
}: EditContactDetailsDialogProps) {
  const [formData, setFormData] = useState<ContactDetailsFormData>({
    firstName: initialData?.firstName || "James",
    lastName: initialData?.lastName || "Dembele",
    dateOfBirth: initialData?.dateOfBirth || "12.21.1984",
    phoneNumber: initialData?.phoneNumber || "4 222 321 321 23",
    email: initialData?.email || "j.dembele@edu.com",
    language: initialData?.language || "english",
    timezone: initialData?.timezone || "gmt-5",
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && initialData) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  if (!open) return null;

  function handleSave() {
    onSave(formData);
    onClose();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 32, 0.80)",
      }}
      onClick={handleBackdropClick}
    >
      {/* Dialog */}
      <div
        className="relative flex flex-col gap-[44px] items-center p-[44px] rounded-[51.22px]"
        style={{
          backgroundImage: "linear-gradient(156.52deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
          border: "2px solid #e451fe",
          minWidth: "772px",
          maxHeight: "90vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#ff00ca #21265d",
        }}
        onClick={(e) => e.stopPropagation()}
        data-dialog-scrollable
      >
        <style jsx global>{`
          [data-dialog-scrollable]::-webkit-scrollbar {
            width: 8px;
          }
          [data-dialog-scrollable]::-webkit-scrollbar-track {
            background: #21265d;
            border-radius: 4px;
          }
          [data-dialog-scrollable]::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #ff00ca 0%, #e451fe 100%);
            border-radius: 4px;
            border: 1px solid rgba(255, 0, 202, 0.3);
          }
          [data-dialog-scrollable]::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #e451fe 0%, #ff00ca 100%);
          }
        `}</style>
        {/* Header */}
        <div className="flex gap-[16px] items-center relative w-full">
          <BackButton onClick={onClose} text="" iconSrc="/assets/icons/others/arrow_back.svg" />
          <p
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
            Edit Contact details
          </p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-[24px] items-start relative w-full">
          {/* First name and Last name */}
          <div className="flex gap-[16px] items-start relative w-full">
            <div className="flex-1">
              <InputField
                label="First name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex-1 w-full">
            <InputField
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              endIconSrc="/assets/icons/others/calendar.svg"
              endIconAlt="Calendar"
              endIconWidth={24}
              endIconHeight={24}
              className="w-full"
            />
          </div>

          {/* Phone number and Email */}
          <div className="flex gap-[16px] items-start relative w-full">
            <div className="flex-1">
              <InputField
                label="Phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Language and Timezone */}
          <div className="flex gap-[16px] items-start relative w-full">
            <div className="flex-1">
              <SelectField
                label="Language"
                placeholder="Select language"
                options={languages}
                value={formData.language || undefined}
                onChange={(value) =>
                  setFormData({ ...formData, language: value })
                }
                className="w-full!"
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Timezone"
                placeholder="Select timezone"
                options={timezones}
                value={formData.timezone || undefined}
                onChange={(value) =>
                  setFormData({ ...formData, timezone: value })
                }
                className="w-full!"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-[32px] items-start justify-center relative w-full">
          {/* Cancel Button */}
          <div className="flex-1">
            <PrimaryButton
              text="Cancel"
              variant="outline"
              onClick={onClose}
              className="w-full"
              style={{
                height: "70px",
                borderColor: "#ff12ef",
                boxShadow: "0px 0px 0px 1.602px #e451fe",
              }}
            />
          </div>

          {/* Save Changes Button */}
          <div className="flex-1">
            <PrimaryButton
              text="Save changes"
              variant="filled"
              onClick={handleSave}
              iconSrc="/assets/icons/others/checkmark_white.svg"
              iconAlt="Save"
              className="w-full"
              style={{
                height: "70px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

