"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { StudentsTable, StudentRowData, LanguageCode } from "../../../components/StudentsTable";
import { TablePagination } from "../../../components/TablePagination";
import { SearchAndFilter } from "../../../components/SearchAndFilter";
import {
  FilterDialog,
  FilterState,
  SuccessRateFilter,
  StatusFilter,
} from "../../../components/FilterDialog";
import { AddStudentDialog, AddStudentFormData } from "../../../components/AddStudentDialog";
import { api } from "../../../lib/api-client";

const LANGUAGE_NAME_MAP: Record<LanguageCode, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  hi: "Hindi",
  ar: "Arabic",
};

type ModuleOption = {
  value: string;
  label: string;
  lessons: Array<{ value: string; label: string }>;
};

export default function AdminStudentsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    successRate: "all",
    module: null,
    lesson: null,
    status: "all",
  });
  const itemsPerPage = 10;
  const [students, setStudents] = useState<StudentRowData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [moduleOptions, setModuleOptions] = useState<ModuleOption[]>([]);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStudentRowClick = (studentId: string) => {
    router.push(`/admin/students/${studentId}`);
  };

  function handleAddStudent() {
    setRefreshTrigger((prev) => prev + 1);
  }

  // Load modules and their lessons for the filter dialog
  useEffect(() => {
    let isMounted = true;

    const fetchModuleFilters = async () => {
      try {
        const response = await api.get<any>("/modules");
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        if (!isMounted) return;

        const baseOptions: ModuleOption[] = list.map((mod: any) => ({
          value: mod.id,
          label: mod.title,
          lessons: [],
        }));

        setModuleOptions(baseOptions);

        // For each module, fetch its lessons
        const lessonsResults = await Promise.all(
          list.map(async (mod: any) => {
            try {
              const lessonsResponse = await api.get<any>(`/modules/${mod.id}/lessons`);
              const lessonsList = Array.isArray(lessonsResponse?.data)
                ? lessonsResponse.data
                : Array.isArray(lessonsResponse)
                ? lessonsResponse
                : [];

              return {
                moduleId: mod.id,
                lessons: lessonsList.map((lesson: any) => ({
                  value: lesson.id,
                  label: lesson.title,
                })),
              };
            } catch (error) {
              console.error("❌ Failed to load lessons for module:", mod.id, error);
              return {
                moduleId: mod.id,
                lessons: [] as Array<{ value: string; label: string }>,
              };
            }
          })
        );

        if (!isMounted) return;

        setModuleOptions((prev) =>
          prev.map((mod) => {
            const match = lessonsResults.find((r) => r.moduleId === mod.value);
            return match ? { ...mod, lessons: match.lessons } : mod;
          })
        );
      } catch (error) {
        console.error("❌ Failed to load modules for filters:", error);
        if (isMounted) {
          setModuleOptions([]);
        }
      } finally {
        if (isMounted) {
          setLoadingFilterOptions(false);
        }
      }
    };

    fetchModuleFilters();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(itemsPerPage));
        if (searchValue) {
          params.set("search", searchValue);
        }
        // Apply server-side filters when they are not at their default values
        if (filters.successRate !== "all") {
          params.set("successRate", filters.successRate);
        }
        if (filters.status !== "all") {
          params.set("status", filters.status);
        }
        if (filters.module) {
          params.set("module", filters.module);
        }
        if (filters.lesson) {
          params.set("lesson", filters.lesson);
        }

        const response = await api.get<any>(`/users/students?${params.toString()}`);
        const data = response?.data ?? response;
        const meta = response?.meta ?? {};
        const pagination = meta.pagination ?? {};

        const mapped: StudentRowData[] = Array.isArray(data)
          ? data.map((s: any) => {
              const lang = (s.languagePreference as LanguageCode) || "en";
              const name = [s.firstName, s.lastName].filter(Boolean).join(" ") || s.email || "Student";
              const successRate = typeof s.successRate === "number" ? s.successRate : 0;
              const lessonsStarted = typeof s.lessonsStarted === "number" ? s.lessonsStarted : 0;

              return {
                id: s.id,
                avatarSrc: s.avatarUrl || "/assets/icons/avatar_gallery/Avatar-1.png",
                avatarAlt: name,
                name,
                grade: s.grade || "",
                language: lang,
                languageName: LANGUAGE_NAME_MAP[lang] || "English",
                successRate,
                progress: lessonsStarted
                  ? `Lessons started: ${lessonsStarted}`
                  : "Not started yet",
                progressHasWarning: successRate > 0 && successRate < 50,
                status: "Active",
                onClick: () => handleStudentRowClick(s.id),
              };
            })
          : [];

        if (isMounted) {
          setStudents(mapped);
          setTotalItems(pagination.total ?? mapped.length);
        }
      } catch (error) {
        console.error("❌ Failed to load students:", error);
        if (isMounted) {
          setStudents([]);
          setTotalItems(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStudents();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchValue, itemsPerPage, filters, refreshTrigger]);

  // Filter and search students (client-side filters on top of API page)
  const filteredStudents = students.filter((student) => {
    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(searchLower) ||
        student.name.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Success rate filter
    if (filters.successRate !== "all") {
      if (filters.successRate === "0-20") {
        if (student.successRate < 0 || student.successRate > 20) return false;
      } else if (filters.successRate === "20-40") {
        if (student.successRate < 20 || student.successRate > 40) return false;
      } else if (filters.successRate === "40-60") {
        if (student.successRate < 40 || student.successRate > 60) return false;
      } else if (filters.successRate === "60-80") {
        if (student.successRate < 60 || student.successRate > 80) return false;
      } else if (filters.successRate === "80-100") {
        if (student.successRate < 80 || student.successRate > 100) return false;
      }
    }

    // Status filter
    if (filters.status !== "all") {
      const studentStatus = student.status.toLowerCase();
      if (filters.status === "active" && studentStatus !== "active") return false;
      if (filters.status === "inactive" && studentStatus !== "inactive") return false;
    }

    // Module filter (if module field exists in student data)
    if (filters.module) {
      // TODO: Add module field to StudentRowData and filter by it
    }

    // Lesson filter (if lesson field exists in student data)
    if (filters.lesson) {
      // TODO: Add lesson field to StudentRowData and filter by it
    }

    return true;
  });

  // Calculate pagination (server-side total, client-side filters on current page)
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentStudents = filteredStudents;

  const moduleSelectOptions = moduleOptions.map((mod) => ({
    value: mod.value,
    label: mod.label,
  }));

  const selectedModule = filters.module
    ? moduleOptions.find((mod) => mod.value === filters.module)
    : undefined;

  const lessonSelectOptions = selectedModule?.lessons ?? [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterReset = () => {
    const resetFilters: FilterState = {
      successRate: "all",
      module: null,
      lesson: null,
      status: "all",
    };
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Navbar */}
      <div className="w-full" style={{ padding: "24px 32px" }}>
        <AdminNavbar
          title="Students"
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
        <div className="flex flex-col">
          <SearchAndFilter
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            onFilterClick={() => setShowFilterDialog(true)}
            className="mb-[16px]"
          />

          {/* Students Table */}
          <StudentsTable students={currentStudents} />

          {/* Pagination - Only show if there are students */}
          {totalItems > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              itemName="students"
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Filter Dialog */}
      <FilterDialog
        open={showFilterDialog}
        filters={filters}
        // Only apply filters (and trigger refetch) when user clicks Apply/Reset,
        // not on every change inside the dialog.
        onFiltersChange={() => {}}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        onClose={() => setShowFilterDialog(false)}
        modules={moduleSelectOptions}
        lessons={lessonSelectOptions}
      />

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddStudentDialog}
        onClose={() => setShowAddStudentDialog(false)}
        onAddStudent={handleAddStudent}
        modules={moduleOptions.map((m) => ({ value: m.value, label: m.label }))}
      />
    </div>
  );
}

