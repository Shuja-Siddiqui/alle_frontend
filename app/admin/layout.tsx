"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "../../components/AdminSidebar";
import { RolePageLayout } from "../../components/RolePageLayout";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Determine the page key based on the current path
  const getPageKey = (): "dashboard" | "reports" => {
    if (pathname?.includes("/reports")) return "reports";
    return "dashboard"; // default
  };

  // All admin routes are protected
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <RolePageLayout role="admin" page={getPageKey()}>
        <div className="flex justify-center items-start w-full h-screen font-sans">
          {/* Main container - max width 1440px */}
          <div className="flex w-full h-full" style={{ maxWidth: "1440px" }}>
            {/* Sidebar - Fixed 220px width */}
            <AdminSidebar />

            {/* Content area - Takes remaining space */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </RolePageLayout>
    </ProtectedRoute>
  );
}

