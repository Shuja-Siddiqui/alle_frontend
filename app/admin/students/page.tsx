"use client";

import { useState } from "react";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { StudentsTable, StudentRowData } from "../../../components/StudentsTable";
import { TablePagination } from "../../../components/TablePagination";
import { SearchAndFilter } from "../../../components/SearchAndFilter";
import {
  FilterDialog,
  FilterState,
  SuccessRateFilter,
  StatusFilter,
} from "../../../components/FilterDialog";
import { AddStudentDialog, AddStudentFormData } from "../../../components/AddStudentDialog";

export default function AdminStudentsPage() {
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

  function handleAddStudent(data: AddStudentFormData) {
    // TODO: Implement API call to add student
    console.log("Adding student:", data);
  }

  // Mock student data - replace with actual API call
  const allStudents: StudentRowData[] = [
    {
      id: "1",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-2.png",
      avatarAlt: "Maxwell Thompson",
      name: "Maxwell Thompson",
      grade: "9",
      language: "en",
      languageName: "English",
      successRate: 95,
      progress: "Module 2, Lesson 3",
      status: "Active",
    },
    {
      id: "2",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-3.png",
      avatarAlt: "Sophia Nguyen",
      name: "Sophia Nguyen",
      grade: "5",
      language: "en",
      languageName: "English",
      successRate: 86,
      progress: "Module 1, Lesson 5",
      status: "Active",
    },
    {
      id: "3",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-4.png",
      avatarAlt: "Ethan Patel",
      name: "Ethan Patel",
      grade: "6",
      language: "en",
      languageName: "English",
      successRate: 79,
      progress: "Module 2, Lesson 1",
      status: "Active",
    },
    {
      id: "4",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-5.png",
      avatarAlt: "Ava Johnson",
      name: "Ava Johnson",
      grade: "12",
      language: "es",
      languageName: "Spanish",
      successRate: 66,
      progress: "Module 3, Lesson 4",
      status: "Active",
    },
    {
      id: "5",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-6.png",
      avatarAlt: "Liam Brown",
      name: "Liam Brown",
      grade: "4",
      language: "es",
      languageName: "Spanish",
      successRate: 51,
      progress: "Module 2, Lesson 2",
      status: "Active",
    },
    {
      id: "6",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-7.png",
      avatarAlt: "Olivia Davis",
      name: "Olivia Davis",
      grade: "2",
      language: "fr",
      languageName: "French",
      successRate: 49,
      progress: "Module 1, Lesson 6",
      progressHasWarning: true,
      status: "Active",
    },
    {
      id: "7",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-8.png",
      avatarAlt: "Noah Wilson",
      name: "Noah Wilson",
      grade: "7",
      language: "fr",
      languageName: "French",
      successRate: 28,
      progress: "Module 2, Lesson 4",
      progressHasWarning: true,
      status: "Active",
    },
    {
      id: "8",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-9.png",
      avatarAlt: "Isabella Martinez",
      name: "Isabella Martinez",
      grade: "8",
      language: "hi",
      languageName: "Hindi",
      successRate: 24,
      progress: "Module 3, Lesson 1",
      status: "Active",
    },
    {
      id: "9",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-10.png",
      avatarAlt: "James Garcia",
      name: "James Garcia",
      grade: "2",
      language: "ar",
      languageName: "Arabic",
      successRate: 3,
      progress: "Module 1, Lesson 7",
      progressHasWarning: true,
      status: "Inactive",
    },
    {
      id: "10",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-11.png",
      avatarAlt: "Aaliyah Ramirez",
      name: "Aaliyah Ramirez",
      grade: "8",
      language: "ar",
      languageName: "Arabic",
      successRate: 1,
      progress: "Module 1, Lesson 7",
      status: "Inactive",
    },
  ];

  // Filter and search students
  const filteredStudents = allStudents.filter((student) => {
    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(searchLower) ||
        student.name.toLowerCase().includes(searchLower); // Add email field when available
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

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
          {filteredStudents.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredStudents.length}
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
        onFiltersChange={setFilters}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        onClose={() => setShowFilterDialog(false)}
        modules={[
          { value: "1", label: "Module 1" },
          { value: "2", label: "Module 2" },
          { value: "3", label: "Module 3" },
          { value: "4", label: "Module 4" },
        ]}
        lessons={[
          { value: "1", label: "Lesson 1" },
          { value: "2", label: "Lesson 2" },
          { value: "3", label: "Lesson 3" },
          { value: "4", label: "Lesson 4" },
          { value: "5", label: "Lesson 5" },
        ]}
      />

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddStudentDialog}
        onClose={() => setShowAddStudentDialog(false)}
        onAddStudent={handleAddStudent}
        modules={[
          { value: "1", label: "Module 1" },
          { value: "2", label: "Module 2" },
          { value: "3", label: "Module 3" },
          { value: "4", label: "Module 4" },
        ]}
        lessons={[
          { value: "1", label: "Lesson 1" },
          { value: "2", label: "Lesson 2" },
          { value: "3", label: "Lesson 3" },
          { value: "4", label: "Lesson 4" },
          { value: "5", label: "Lesson 5" },
        ]}
      />
    </div>
  );
}

