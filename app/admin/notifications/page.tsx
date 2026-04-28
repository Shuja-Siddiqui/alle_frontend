"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "../../../components/BackButton";
import { AdminNotificationsSkeleton } from "../../../components/Skeletons/AdminNotificationsSkeleton";
import { api } from "../../../lib/api-client";

type AdminNotification = {
  id: string;
  type?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  payload?: Record<string, unknown> | string | null;
};

function parsePayload(payload: AdminNotification["payload"]): Record<string, unknown> {
  if (!payload) return {};
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return payload && typeof payload === "object" ? payload : {};
}

function resolveDetailUrl(notification: AdminNotification): string {
  const payload = parsePayload(notification.payload);
  const explicit = payload.detailUrl;
  if (typeof explicit === "string" && explicit.trim().length > 0) {
    return explicit;
  }
  if (notification.type === "weeklySummary" || notification.type === "inactive") {
    return "/admin/analytics";
  }
  return "/admin/notifications";
}

function formatNotificationTime(createdAt?: string) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        if (a.isRead === b.isRead) return 0;
        return a.isRead ? 1 : -1;
      }),
    [notifications]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await api.get<any>("/users/me/notifications?limit=100");
        const payload = response?.data ?? response ?? {};
        if (!isMounted) return;
        setNotifications(Array.isArray(payload.notifications) ? payload.notifications : []);
      } catch (error) {
        console.error("Failed to load notifications page:", error);
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const markNotificationRead = async (notificationId: string) => {
    try {
      await api.patch(`/users/me/notifications/${notificationId}/read`, {});
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full" style={{ padding: "24px 32px 20px 32px" }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-[16px]">
            <BackButton text="" onClick={() => router.back()} />
            <h1
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "36px",
                fontWeight: 700,
                lineHeight: "42px",
                letterSpacing: "-0.396px",
                textTransform: "uppercase",
              }}
            >
              Notifications
            </h1>
          </div>
          <div />
        </div>
      </div>

      <div className="flex-1 overflow-auto" style={{ padding: "0 32px 32px 32px" }}>
        <div className="w-full">
          {loading ? (
            <AdminNotificationsSkeleton />
          ) : notifications.length === 0 ? (
            <p
              style={{
                color: "#B0B3FF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "14px",
              }}
            >
              No notifications yet.
            </p>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {sortedNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={async () => {
                    if (!notification.isRead) {
                      await markNotificationRead(notification.id);
                    }
                    const detailUrl = resolveDetailUrl(notification);
                    router.push(detailUrl);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignSelf: "stretch",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "32px",
                    border: notification.isRead
                      ? "1px solid rgba(75, 91, 170, 0.38)"
                      : "1px solid rgba(228, 81, 254, 0.62)",
                    background: notification.isRead
                      ? "linear-gradient(83deg, #1C1142 -4.82%, #12113A 54.46%, #0E1738 95.43%)"
                      : "linear-gradient(83deg, #29065E -4.82%, #190A51 54.46%, #151A4C 95.43%)",
                    boxShadow: notification.isRead
                      ? "none"
                      : "0 0 0 1px rgba(228, 81, 254, 0.18), 0 10px 24px rgba(124, 72, 255, 0.18)",
                    padding: "20px 24px",
                    cursor: notification.isRead ? "default" : "pointer",
                  }}
                >
                  <div className="flex flex-col items-start gap-[6px] pr-3">
                    <p
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        lineHeight: "24px",
                        letterSpacing: "-0.198px",
                        textTransform: "uppercase",
                      }}
                    >
                      {notification.title}
                    </p>
                    <p
                      style={{
                        color: "#A3A7E4",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "20px",
                        letterSpacing: "-0.28px",
                      }}
                    >
                      {notification.message}
                    </p>
                    <span
                      style={{
                        color: "#FF00CA",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "24px",
                        letterSpacing: "-0.198px",
                        textTransform: "uppercase",
                      }}
                    >
                      View details
                    </span>
                  </div>
                  <div
                    className="flex items-center"
                    style={{ gap: "8px", marginLeft: "12px" }}
                  >
                    {notification.createdAt && (
                      <span
                        style={{
                          color: "#A3A7E4",
                          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                          fontSize: "11px",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    )}
                    {!notification.isRead && (
                      <span
                        aria-label="Unread notification"
                        title="Unread"
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "999px",
                          background: "#FF00CA",
                          display: "inline-block",
                        }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

