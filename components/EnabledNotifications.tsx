"use client";

import { useState } from "react";
import { Toggle } from "./Toggle";

type NotificationSetting = {
  id: string;
  label: string;
  enabled: boolean;
};

type EnabledNotificationsProps = {
  notifications?: NotificationSetting[];
  onNotificationChange?: (id: string, enabled: boolean) => void;
};

const defaultNotifications: NotificationSetting[] = [
  { id: "email", label: "Email notifications", enabled: false },
  { id: "sms", label: "SMS notifications", enabled: false },
  { id: "inApp", label: "In app alerts", enabled: false },
  { id: "fastProgress", label: "Student progressing faster than expected", enabled: false },
  { id: "weeklySummary", label: "Weekly summary reports", enabled: false },
  { id: "lowActivity", label: "Low students activity progress", enabled: false },
  { id: "inactive", label: "Inactive students", enabled: false },
];

export function EnabledNotifications({
  notifications = defaultNotifications,
  onNotificationChange,
}: EnabledNotificationsProps) {
  const [notificationStates, setNotificationStates] = useState<NotificationSetting[]>(notifications);

  function handleToggle(id: string, checked: boolean) {
    setNotificationStates((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, enabled: checked } : notif))
    );
    onNotificationChange?.(id, checked);
  }

  return (
    <div
      className="relative flex flex-col gap-[24px] items-start overflow-hidden px-[44px] py-[32px] rounded-[36px] w-full"
      style={{
        backgroundImage: "linear-gradient(157.96deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
      }}
    >
      {/* Title */}
      <p
        style={{
          color: "#FFFFFF",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "28px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "1.5",
          letterSpacing: "-0.308px",
          textTransform: "uppercase",
        }}
      >
        Enabled notifications
      </p>

      {/* Notification Settings */}
      <div className="flex flex-col gap-[20px] items-start relative shrink-0 w-full">
        {notificationStates.map((notification) => (
          <Toggle
            key={notification.id}
            checked={notification.enabled}
            onChange={(checked) => handleToggle(notification.id, checked)}
            label={notification.label}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}

