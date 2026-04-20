"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "../../components/AdminSidebar";
import { RolePageLayout } from "../../components/RolePageLayout";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageKey = (): "dashboard" | "reports" => {
    if (pathname?.includes("/reports")) return "reports";
    return "dashboard";
  };

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <RolePageLayout role="admin" page={getPageKey()}>
        <div className="flex justify-center items-start w-full h-screen font-sans">
          <div className="flex w-full h-full" style={{ maxWidth: "1440px" }}>
            <AdminSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
          </div>
        </div>
      </RolePageLayout>
    </ProtectedRoute>
  );
}

