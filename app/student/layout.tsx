"use client";

import { useRouter, usePathname } from "next/navigation";
import { StudentNavbar } from "../../components/StudentNavbar";
import { LevelOverlayProvider, useLevelOverlay } from "./contexts/LevelOverlayContext";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function StudentLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOverlayOpen } = useLevelOverlay();
  const router = useRouter();
  const pathname = usePathname();
  
  // TODO: Fetch actual student data from API
  const studentXp = 150; // Example: student has 150 XP
  const totalLevels = 44;
  const xpPerLevel = 10;
  const totalXpNeeded = totalLevels * xpPerLevel; // 440 XP total
  const profileImageSrc = "/assets/icons/avatar_gallery/Avatar-1.png"; // TODO: Get from student data

  // Check if current route should be protected
  // Auth routes (login, signup) are public, all other student routes are protected
  const isAuthRoute = pathname?.includes('/login') || pathname?.includes('/signup');

  // If it's an auth route, don't wrap with ProtectedRoute
  if (isAuthRoute) {
    return (
      <div
        className="flex flex-col font-sans"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "-10% -10%",
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
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "-10% -10%",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Student Navbar - visible on all student pages */}
        <div className="w-full flex justify-center" style={{ paddingTop: "40px" }}>
          <StudentNavbar
            xp={studentXp}
            xpMax={totalXpNeeded}
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

