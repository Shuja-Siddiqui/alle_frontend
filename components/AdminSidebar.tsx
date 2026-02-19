"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ActiveSidebarPageButton } from "./ActiveSidebarPageButton";

type MenuItem = {
  id: string;
  label: string;
  iconSrc: string;
  path: string;
};

type AdminSidebarProps = {
  /** Optional custom onClick handler for logo. If not provided, navigates to admin dashboard */
  onLogoClick?: () => void;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    iconSrc: "/assets/icons/admin/dashboard.svg",
    path: "/admin/dashboard",
  },
  {
    id: "students",
    label: "Students",
    iconSrc: "/assets/icons/admin/students.svg",
    path: "/admin/students",
  },
  {
    id: "modules",
    label: "Modules",
    iconSrc: "/assets/icons/admin/modules.svg",
    path: "/admin/modules",
  },
  {
    id: "analytics",
    label: "Analytics",
    iconSrc: "/assets/icons/admin/analytics.svg",
    path: "/admin/analytics",
  },
  {
    id: "settings",
    label: "Settings",
    iconSrc: "/assets/icons/admin/settings.svg",
    path: "/admin/settings",
  },
];

export function AdminSidebar({ onLogoClick }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      router.push("/admin/dashboard");
    }
  };

  const handleMenuItemClick = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className="relative w-[220px] h-full"
      style={{
        backgroundColor: "#0c031a",
      }}
    >
      {/* Logo container - centered at top */}
      <button
        type="button"
        onClick={handleLogoClick}
        className="absolute flex items-center cursor-pointer bg-transparent border-none p-0"
        style={{
          left: "50%",
          top: "24px",
          transform: "translateX(-50%)",
          width: "188px",
          height: "41px",
          gap: "14px",
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      >
        {/* Logo icon - 40.098px */}
        <div
          className="relative shrink-0"
          style={{
            width: "40.098px",
            height: "40.098px",
          }}
        >
          <Image
            src="/assets/icons/admin/logo.svg"
            alt="EduPortal logo"
            width={40.098}
            height={40.098}
            className="block max-w-none size-full"
          />
        </div>
        {/* Text - 24.95px, letter-spacing -0.499px */}
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "24.95px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            letterSpacing: "-0.499px",
          }}
        >
          <span style={{ color: "#e851ff" }}>Edu</span>
          <span>Portal</span>
        </p>
      </button>

      {/* Sidebar menu container - positioned below logo */}
      <div
        className="absolute flex flex-col gap-[12px] items-start"
        style={{
          left: "16px",
          top: "89px",
          width: "188px",
        }}
      >
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
          
          if (isActive) {
            // Active item uses ActiveSidebarPageButton component
            return (
              <ActiveSidebarPageButton
                key={item.id}
                text={item.label}
                iconSrc={item.iconSrc}
                iconAlt={item.label}
                onClick={() => handleMenuItemClick(item.path)}
              />
            );
          }
          
          // Inactive item uses regular button with icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleMenuItemClick(item.path)}
              className="flex gap-[12px] items-center px-[16px] py-[12px] w-full"
              style={{
                backgroundColor: "transparent",
                cursor: "pointer",
                border: "none",
              }}
            >
              {/* Icon */}
              <div
                className="relative shrink-0"
                style={{
                  width: "16px",
                  height: "16px",
                }}
              >
                <Image
                  src={item.iconSrc}
                  alt={item.label}
                  width={16}
                  height={16}
                  className="block max-w-none size-full"
                />
              </div>
              {/* Label */}
              <p
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                  letterSpacing: "-0.28px",
                }}
              >
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

