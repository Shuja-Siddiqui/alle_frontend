"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { ModuleStatCard } from "../../../components/ModuleStatCard";
import { SearchAndFilter } from "../../../components/SearchAndFilter";
import { ModulesGridSkeleton } from "../../../components/Skeletons/ModulesGridSkeleton";
import {
  ModuleFilterDialog,
  ModuleFilterState,
  ModuleCategory,
} from "../../../components/ModuleFilterDialog";
import { AddStudentDialog, AddStudentFormData } from "../../../components/AddStudentDialog";
import { AddTeacherDialog, AddTeacherFormData } from "../../../components/AddTeacherDialog";
import { api } from "../../../lib/api-client";

type ModuleRow = {
  id: string;
  title: string;
  lessonsCount: number;
  currentStudentsCount: number;
  weeks?: number | null;
  estimatedTime?: string | null;
  grades?: string | null;
};

export default function AdminModulesPage() {
  const pathname = usePathname();
  const roleBase = pathname?.startsWith("/teacher") ? "teacher" : "admin";
  const [searchValue, setSearchValue] = useState("");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState<ModuleFilterState>({
    category: "all",
  });
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleAddStudent() {
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleAddTeacher(_: AddTeacherFormData) {
    setRefreshTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    let isMounted = true;

    const fetchModules = async () => {
      try {
        const response = await api.get<any>("/modules");
        const list: ModuleRow[] = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        if (isMounted) {
          setModules(list);
        }
      } catch (error) {
        console.error("❌ Failed to load modules:", error);
        if (isMounted) {
          setModules([]);
        }
      } finally {
        if (isMounted) {
          setLoadingModules(false);
        }
      }
    };

    fetchModules();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  // Filter modules based on search and category
  const filteredModules = modules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(searchValue.toLowerCase());
    // TODO: Add category filtering logic when category data is available
    const matchesCategory = filters.category === "all" || true; // Placeholder
    return matchesSearch && matchesCategory;
  });

  function handleFiltersChange(newFilters: ModuleFilterState) {
    setFilters(newFilters);
  }

  function handleApplyFilters(newFilters: ModuleFilterState) {
    setFilters(newFilters);
  }

  function handleResetFilters() {
    const resetFilters: ModuleFilterState = {
      category: "all",
    };
    setFilters(resetFilters);
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Navbar */}
      <div className="w-full" style={{ padding: "24px 32px" }}>
        <AdminNavbar
          title="Modules"
          onNotificationClick={() => {
            // TODO: Handle notification click
            console.log("Notification clicked");
          }}
          onAddStudentClick={() => setShowAddStudentDialog(true)}
          onAddTeacherClick={
            roleBase === "admin" ? () => setShowAddTeacherDialog(true) : undefined
          }
        />
      </div>

      {/* Main content area */}
      <div
        className="flex-1 overflow-auto"
        style={{
          padding: "0 32px 32px 32px",
        }}
      >
        {/* Search and Filter */}
        <div className="flex flex-col" style={{ marginBottom: "16px" }}>
          <SearchAndFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onFilterClick={() => setShowFilterDialog(true)}
            searchPlaceholder="Search module by name"
            className="mb-[16px]"
          />
        </div>

        {/* Modules Grid - 2 columns */}
        {loadingModules ? (
          <ModulesGridSkeleton />
        ) : (
          <div
            className="grid gap-[24px]"
            style={{
              gridTemplateColumns: "repeat(2, 558px)",
              justifyContent: "start",
            }}
          >
            {filteredModules.map((module, index) => (
              <ModuleStatCard
                key={module.id}
                moduleNumber={`Module ${index + 1}`}
                title={module.title}
                lessons={module.lessonsCount ?? 0}
                students={module.currentStudentsCount ?? 0}
                weeks={
                  module.estimatedTime
                    ? module.estimatedTime
                    : module.weeks != null
                    ? String(module.weeks)
                    : ""
                }
                grades={module.grades ?? ""}
                moduleId={module.id}
                className="w-[558px]"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div
            className="flex flex-col gap-[16px] h-[144px] items-center justify-center text-white"
            style={{ marginTop: "32px" }}
          >
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "22px",
                letterSpacing: "-0.176px",
                color: "#FFFFFF",
              }}
            >
              No modules found
            </p>
            <p
              style={{
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "1.5",
                letterSpacing: "-0.154px",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddStudentDialog}
        onClose={() => setShowAddStudentDialog(false)}
        onAddStudent={handleAddStudent}
        modules={modules.map((m) => ({ value: m.id, label: m.title }))}
      />

      {roleBase === "admin" && (
        <AddTeacherDialog
          open={showAddTeacherDialog}
          onClose={() => setShowAddTeacherDialog(false)}
          onAddTeacher={handleAddTeacher}
        />
      )}

      {/* Module Filter Dialog */}
      <ModuleFilterDialog
        open={showFilterDialog}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onClose={() => setShowFilterDialog(false)}
      />
    </div>
  );
}

