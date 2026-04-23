"use client";

import { Toggle } from "./Toggle";

type NotificationSetting = {
  id: string;
  label: string;
  enabled: boolean;
};

type AdminNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
};

type EnabledNotificationsProps = {
  notifications?: NotificationSetting[];
  onNotificationChange?: (id: string, enabled: boolean) => void;
  recentNotifications?: AdminNotification[];
  unreadCount?: number;
  onMarkAllRead?: () => void;
  onNotificationRead?: (notificationId: string) => void;
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
  recentNotifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onNotificationRead,
}: EnabledNotificationsProps) {
  function handleToggle(id: string, checked: boolean) {
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
        {notifications.map((notification) => (
          <Toggle
            key={notification.id}
            checked={notification.enabled}
            onChange={(checked) => handleToggle(notification.id, checked)}
            label={notification.label}
            className="w-full"
          />
        ))}
      </div>

      {/* In-app notifications preview (integrated with toggle settings) */}
      <div
        className="w-full"
        style={{
          borderTop: "1px solid #434B93",
          paddingTop: "16px",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.154px",
              textTransform: "uppercase",
            }}
          >
            In-app notifications {unreadCount > 0 ? `(${unreadCount} unread)` : ""}
          </p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              style={{
                color: "#FF00CA",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "-0.132px",
                textTransform: "uppercase",
              }}
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="flex flex-col gap-[10px] max-h-[180px] overflow-y-auto pr-[4px]">
          {recentNotifications.length === 0 ? (
            <p
              style={{
                color: "#7478A2",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              No notifications yet.
            </p>
          ) : (
            recentNotifications.slice(0, 5).map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => !notification.isRead && onNotificationRead?.(notification.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: notification.isRead ? "rgba(67, 75, 147, 0.25)" : "rgba(228, 81, 254, 0.14)",
                  border: notification.isRead ? "1px solid rgba(67,75,147,0.5)" : "1px solid rgba(228,81,254,0.4)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  cursor: notification.isRead ? "default" : "pointer",
                }}
              >
                <p
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  {notification.title}
                </p>
                <p
                  style={{
                    color: "#B0B3FF",
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    lineHeight: "16px",
                  }}
                >
                  {notification.message}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

