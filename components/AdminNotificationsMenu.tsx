"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../lib/api-client";

type AdminNotification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
};

type AdminNotificationsMenuProps = {
  onOpen?: () => void;
};

export function AdminNotificationsMenu({ onOpen }: AdminNotificationsMenuProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get<any>("/users/me/notifications?limit=10");
      const payload = response?.data ?? response ?? {};
      setNotifications(Array.isArray(payload.notifications) ? payload.notifications : []);
      setUnreadCount(Number(payload.unreadCount ?? 0));
    } catch (error) {
      console.error("Failed to load admin notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const markNotificationRead = async (notificationId: string) => {
    try {
      await api.patch(`/users/me/notifications/${notificationId}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          onOpen?.();
        }}
        className="relative shrink-0 cursor-pointer bg-transparent border-none p-0"
        style={{
          width: "52px",
          height: "52px",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <div
          className="absolute"
          style={{
            inset: "-1.65%",
          }}
        >
          <Image
            src="/assets/icons/admin/notification.svg"
            alt="Notifications"
            width={54}
            height={54}
            className="block max-w-none size-full"
          />
        </div>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              right: "-3px",
              top: "-2px",
              minWidth: "20px",
              height: "20px",
              borderRadius: "999px",
              background: "#FF00CA",
              color: "#FFFFFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: "20px",
              textAlign: "center",
              padding: "0 5px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2"
          style={{
            width: "360px",
            maxHeight: "380px",
            overflowY: "auto",
            padding: "14px",
            borderRadius: "20px",
            border: "2px solid #E451FE",
            background:
              "linear-gradient(168.78deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            boxShadow: "0 0 0 2px rgba(228, 81, 254, 0.45)",
            zIndex: 40,
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
            <p
              style={{
                color: "#FFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Notifications
            </p>
            <div className="flex items-center gap-[12px]">
              <Link
                href="/admin/notifications"
                onClick={() => setIsOpen(false)}
                style={{
                  color: "#FF00CA",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "24px",
                  letterSpacing: "-0.198px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                View all
              </Link>
            </div>
          </div>

          {notifications.length === 0 ? (
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
            <div className="flex flex-col gap-[8px]">
              {notifications.slice(0, 8).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    if (!n.isRead) void markNotificationRead(n.id);
                  }}
                  style={{
                    textAlign: "left",
                    width: "100%",
                    borderRadius: "12px",
                    border: n.isRead
                      ? "1px solid rgba(67,75,147,0.45)"
                      : "1px solid rgba(228,81,254,0.45)",
                    background: n.isRead
                      ? "rgba(67,75,147,0.2)"
                      : "rgba(228,81,254,0.12)",
                    padding: "10px",
                    cursor: n.isRead ? "default" : "pointer",
                  }}
                >
                  <p
                    style={{
                      color: "#FFF",
                      fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "2px",
                    }}
                  >
                    {n.title}
                  </p>
                  <p
                    style={{
                      color: "#B0B3FF",
                      fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                      fontSize: "11px",
                      fontWeight: 500,
                      lineHeight: "15px",
                    }}
                  >
                    {n.message}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

