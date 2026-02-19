"use client";

import { useState } from "react";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { ModuleStatCard } from "../../../components/ModuleStatCard";
import { SearchAndFilter } from "../../../components/SearchAndFilter";
import {
  ModuleFilterDialog,
  ModuleFilterState,
  ModuleCategory,
} from "../../../components/ModuleFilterDialog";
import { AddStudentDialog, AddStudentFormData } from "../../../components/AddStudentDialog";

type ModuleData = {
  id: string;
  moduleNumber: string;
  title: string;
  lessons: number;
  students: number;
  weeks: string;
  grades: string;
};

export default function AdminModulesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState<ModuleFilterState>({
    category: "all",
  });

  function handleAddStudent(data: AddStudentFormData) {
    // TODO: Implement API call to add student
    console.log("Adding student:", data);
  }

  // Mock module data - replace with actual API call
  const allModules: ModuleData[] = [
    {
      id: "1",
      moduleNumber: "Module 1",
      title: "High-frequency foundations",
      lessons: 10,
      students: 18,
      weeks: "1-2",
      grades: "1-2",
    },
    {
      id: "2",
      moduleNumber: "Module 2",
      title: "Digraphs + early multisyllabic",
      lessons: 8,
      students: 18,
      weeks: "3-4",
      grades: "3-4",
    },
    {
      id: "3",
      moduleNumber: "Module 3",
      title: "Long vowels",
      lessons: 7,
      students: 54,
      weeks: "5-6",
      grades: "5-6",
    },
    {
      id: "4",
      moduleNumber: "Module 4",
      title: "Extended code",
      lessons: 6,
      students: 18,
      weeks: "7-10",
      grades: "7-8",
    },
    {
      id: "5",
      moduleNumber: "Module 5",
      title: "Multisyllabic mastery + morphology",
      lessons: 4,
      students: 18,
      weeks: "11-18",
      grades: "9-12",
    },
  ];

  // Filter modules based on search and category
  const filteredModules = allModules.filter((module) => {
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
        <div
          className="grid gap-[24px]"
          style={{
            gridTemplateColumns: "repeat(2, 558px)",
            justifyContent: "start",
          }}
        >
          {filteredModules.map((module) => (
            <ModuleStatCard
              key={module.id}
              moduleNumber={module.moduleNumber}
              title={module.title}
              lessons={module.lessons}
              students={module.students}
              weeks={module.weeks}
              grades={module.grades}
              moduleId={module.id}
              className="w-[558px]"
            />
          ))}
        </div>

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
      />

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

