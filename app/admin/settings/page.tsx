"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ContactDetails } from "../../../components/ContactDetails";
import { EnabledNotifications } from "../../../components/EnabledNotifications";
import { CustomerSupport } from "../../../components/CustomerSupport";
import { EditContactDetailsDialog, ContactDetailsFormData } from "../../../components/EditContactDetailsDialog";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../lib/api-client";

type NotificationSetting = {
  id: string;
  label: string;
  enabled: boolean;
};

const defaultNotificationSettings: NotificationSetting[] = [
  { id: "email", label: "Email notifications", enabled: false },
  { id: "sms", label: "SMS notifications", enabled: false },
  { id: "inApp", label: "In app alerts", enabled: false },
  { id: "fastProgress", label: "Student progressing faster than expected", enabled: false },
  { id: "weeklySummary", label: "Weekly summary reports", enabled: false },
  { id: "lowActivity", label: "Low students activity progress", enabled: false },
  { id: "inactive", label: "Inactive students", enabled: false },
];

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

export default function AdminSettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(
    defaultNotificationSettings
  );
  const [contactData, setContactData] = useState<ContactDetailsFormData>({
    firstName: "James",
    lastName: "Dembele",
    dateOfBirth: "12.21.1984",
    phoneNumber: "4 222 321 321 23",
    email: "j.dembele@edu.com",
    language: "english",
    timezone: "gmt-5",
  });

  function handleEditContact() {
    setShowEditDialog(true);
  }

  function handleSaveContact(data: ContactDetailsFormData) {
    // TODO: Implement API call to save contact details
    setContactData(data);
    console.log("Saving contact details:", data);
  }

  async function handleNotificationChange(id: string, enabled: boolean) {
    // Optimistic update
    setNotificationSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item))
    );

    try {
      const response = await api.patch<any>("/users/me/notification-settings", {
        id,
        enabled,
      });
      const payload = response?.data ?? response ?? {};
      const map = payload.notifications ?? {};
      setNotificationSettings((prev) =>
        prev.map((item) => ({ ...item, enabled: Boolean(map[item.id]) }))
      );
    } catch (error) {
      console.error("Failed to save notification setting:", error);
      // Revert on failure
      setNotificationSettings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, enabled: !enabled } : item))
      );
    }
  }

  useEffect(() => {
    let isMounted = true;

    const fetchNotificationSettings = async () => {
      try {
        const response = await api.get<any>("/users/me/notification-settings");
        const payload = response?.data ?? response ?? {};
        const map = payload.notifications ?? {};
        if (!isMounted) return;
        setNotificationSettings((prev) =>
          prev.map((item) => ({ ...item, enabled: Boolean(map[item.id]) }))
        );
      } catch (error) {
        console.error("Failed to load notification settings:", error);
      }
    };

    fetchNotificationSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleContactSupport() {
    setShowEditDialog(true);
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Settings Title + Logout */}
      <div className="w-full" style={{ padding: "40px 40px 24px 40px" }}>
        <div className="flex items-center justify-between w-full gap-4">
          <h1
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
            Settings
          </h1>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Logout"
          >
            <Image
              src="/assets/icons/others/logout.svg"
              alt="Logout"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div
        className="flex-1 overflow-auto"
        style={{
          padding: "0 40px 40px 40px",
        }}
      >
        <div className="flex flex-col gap-[24px] items-start w-full">
          {/* Top Row: Contact Details and Enabled Notifications side by side */}
          <div className="flex gap-[24px] items-start w-full">
            {/* Contact Details */}
            <div className="flex-1" style={{ maxWidth: "558px" }}>
              <ContactDetails
                firstName={contactData.firstName}
                lastName={contactData.lastName}
                dateOfBirth={contactData.dateOfBirth}
                phoneNumber={contactData.phoneNumber}
                email={contactData.email}
                language={
                  contactData.language
                    ? defaultLanguages.find((l) => l.value === contactData.language)?.label || "English"
                    : "English"
                }
                timezone={
                  contactData.timezone
                    ? defaultTimezones.find((t) => t.value === contactData.timezone)?.label || "GMT-5 (Eastern Time)"
                    : "GMT-5 (Eastern Time)"
                }
                onEditClick={handleEditContact}
              />
            </div>

            {/* Enabled Notifications */}
            <div className="flex-1" style={{ maxWidth: "558px" }}>
              <EnabledNotifications
                notifications={notificationSettings}
                onNotificationChange={handleNotificationChange}
              />
            </div>
          </div>

          {/* Customer Support - Full Width */}
          <div className="w-full">
            <CustomerSupport onContactClick={handleContactSupport} />
          </div>
        </div>
      </div>

      {/* Edit Contact Details Dialog */}
      <EditContactDetailsDialog
        open={showEditDialog}
        initialData={contactData}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveContact}
      />
    </div>
  );
}

