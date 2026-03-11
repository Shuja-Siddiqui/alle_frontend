"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { StudentNavbar } from "../../components/StudentNavbar";
import { LevelOverlayProvider, useLevelOverlay } from "./contexts/LevelOverlayContext";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import { TOTAL_XP_FOR_BAR } from "./constants";

const DEFAULT_BG = "url('/assets/bg.png')";
const MISSION_MODE_BG = "url('/assets/mission_mode.png')";

function StudentLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOverlayOpen } = useLevelOverlay();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { backgroundMode, setBackgroundMode } = useUI();

  // Reset background to default when on dashboard or profile
  useEffect(() => {
    if (pathname === "/student/dashboard" || pathname?.startsWith("/student/profile")) {
      setBackgroundMode("default");
    }
  }, [pathname, setBackgroundMode]);

  const studentXp = user?.xp ?? 0;
  const totalXpForBar = TOTAL_XP_FOR_BAR;
  const profileImageSrc = user?.avatarUrl ?? "/assets/icons/avatar_gallery/Avatar-1.png";

  // Check if current route should be protected
  // Auth routes (login, signup) are public, all other student routes are protected
  const isAuthRoute = pathname?.includes('/login') || pathname?.includes('/signup');

  // If it's an auth route, don't wrap with ProtectedRoute
  const bgImage = backgroundMode === "mission_mode" ? MISSION_MODE_BG : DEFAULT_BG;

  if (isAuthRoute) {
    return (
      <div
        className="flex flex-col font-sans"
        style={{
          backgroundImage: DEFAULT_BG,
          backgroundSize: "cover",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {children}
      </div>
    );
  }

  // Protected routes - wrap with ProtectedRoute
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div
        className="flex flex-col font-sans"
        style={{
          backgroundImage: bgImage,
          backgroundSize: "cover",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Student Navbar - visible on all student pages */}
        <div className="w-full flex justify-center" style={{ paddingTop: "40px" }}>
          <StudentNavbar
            xp={studentXp}
            xpMax={totalXpForBar}
            profileImageSrc={profileImageSrc}
            hideXpSlider={isOverlayOpen}
            onProfileClick={() => {
              router.push("/student/profile");
            }}
          />
        </div>

        {/* Page content - Centered on larger screens */}
        <div className="flex justify-center items-start w-full" style={{ flex: 1, minHeight: 0 }}>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LevelOverlayProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </LevelOverlayProvider>
  );
}

