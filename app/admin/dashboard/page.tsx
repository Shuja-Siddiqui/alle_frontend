"use client";

import { useState } from "react";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { StatCard } from "../../../components/StatCard";
import { StudentStatCard } from "../../../components/StudentStatCard";
import { RetentionMetrics } from "../../../components/RetentionMetrics";
import { ModuleStatCard } from "../../../components/ModuleStatCard";
import { AddStudentDialog, AddStudentFormData } from "../../../components/AddStudentDialog";

export default function AdminDashboardPage() {
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);

  function handleAddStudent(data: AddStudentFormData) {
    // TODO: Implement API call to add student
    console.log("Adding student:", data);
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Navbar */}
      <div className="w-full" style={{ padding: "24px 32px" }}>
        <AdminNavbar
          title="Dashboard"
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
        {/* Stats Cards Row */}
        <div className="flex gap-[24px] items-center" style={{ marginBottom: "32px" }}>
          {/* Card 1: Total students */}
          <StatCard
            title="321"
            subtitle="Total students"
            iconSrc="/assets/icons/admin/students.svg"
            iconAlt="Students icon"
            className="w-[364px] shrink-0"
          />

          {/* Card 2: Lesson completion */}
          <StatCard
            title="13%"
            subtitle="Lesson completion"
            iconSrc="/assets/icons/admin/modules.svg"
            iconAlt="Modules icon"
            className="w-[364px] shrink-0"
          />

          {/* Card 3: Engagement activity */}
          <StatCard
            title="24"
            supportiveText="students completed module 'A'"
            subtitle="Engagement activity"
            iconSrc="/assets/icons/admin/analytics.svg"
            iconAlt="Analytics icon"
            className="w-[364px] shrink-0"
          />
        </div>

        {/* Main Content: Metrics and Students in one container */}
        <div
          className="flex gap-[24px] items-start justify-center"
          style={{
            width: "1140px",
            height: "336px",
          }}
        >
          {/* Left Side: Retention Metrics */}
          <RetentionMetrics
            percentage={66}
            changePercentage={4}
            className="shrink-0"
            style={{
              width: "364px",
              height: "100%",
            }}
          />

          {/* Right Side: Students Section */}
          <div
            className="flex flex-col shrink-0"
            style={{
              width: "752px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: "19px" }}>
              <h2
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "30px",
                  letterSpacing: "-0.264px",
                  textTransform: "uppercase",
                }}
              >
                Students
              </h2>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navigate to all students page
                  console.log("View all students");
                }}
                style={{
                  color: "#ff00ca",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  letterSpacing: "-0.198px",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                View all
              </a>
            </div>

            {/* Student Cards - 2x2 Grid (2 cards per row, 2 rows) */}
            <div className="flex flex-wrap gap-[24px] flex-1" style={{ alignContent: "flex-start" }}>
              {/* Student 1: Kinsley Harrell */}
              <StudentStatCard
                avatarSrc="/assets/icons/avatar_gallery/Avatar-1.png"
                avatarAlt="Kinsley Harrell"
                studentName="Kinsley Harrell"
                grade="12 Grade"
                modules={5}
                lessons={41}
                className="shrink-0"
                style={{ width: "363px" }}
              />

              {/* Student 2: Maxwell Thompson */}
              <StudentStatCard
                avatarSrc="/assets/icons/avatar_gallery/Avatar-2.png"
                avatarAlt="Maxwell Thompson"
                studentName="Maxwell Thompson"
                grade="9 Grade"
                modules={3}
                lessons={23}
                className="shrink-0"
                style={{ width: "363px" }}
              />

              {/* Student 3: Livia Rosales */}
              <StudentStatCard
                avatarSrc="/assets/icons/avatar_gallery/Avatar-3.png"
                avatarAlt="Livia Rosales"
                studentName="Livia Rosales"
                grade="8 Grade"
                modules={2}
                lessons={9}
                className="shrink-0"
                style={{ width: "363px" }}
              />

              {/* Student 4: Jaquan Kenter */}
              <StudentStatCard
                avatarSrc="/assets/icons/avatar_gallery/Avatar-4.png"
                avatarAlt="Jaquan Kenter"
                studentName="Jaquan Kenter"
                grade="5 Grade"
                modules={1}
                lessons={3}
                className="shrink-0"
                style={{ width: "363px" }}
              />
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div style={{ marginTop: "32px" }}>
          {/* Header */}
          <div className="flex items-start justify-between" style={{ marginBottom: "16px" }}>
            <h2
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "30px",
                letterSpacing: "-0.264px",
                textTransform: "uppercase",
              }}
            >
              Modules
            </h2>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Navigate to all modules page
                console.log("View all modules");
              }}
              style={{
                color: "#ff00ca",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "1.5",
                letterSpacing: "-0.198px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              View all
            </a>
          </div>

          {/* Module Cards Row - Only 4 cards with custom scrollbar */}
          <div
            className="flex gap-[24px] justify-start items-start overflow-x-auto module-scrollbar"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#ff00ca #21265d",
            }}
          >

            {/* Module 1 */}
            <ModuleStatCard
              moduleNumber="Module 1"
              title="High-frequency foundations"
              lessons={10}
              students={18}
              weeks="1-2"
              grades="1-2"
              className="w-[558px] shrink-0"
            />

            {/* Module 2 */}
            <ModuleStatCard
              moduleNumber="Module 2"
              title="Digraphs + early multisyllabic"
              lessons={8}
              students={18}
              weeks="3-4"
              grades="3-4"
              className="w-[558px] shrink-0"
            />

            {/* Module 3 */}
            <ModuleStatCard
              moduleNumber="Module 3"
              title="Long vowels"
              lessons={7}
              students={18}
              weeks="5-6"
              grades="5-6"
              className="w-[558px] shrink-0"
            />

            {/* Module 4 */}
            <ModuleStatCard
              moduleNumber="Module 4"
              title="Extended code"
              lessons={6}
              students={18}
              weeks="7-10"
              grades="7-8"
              className="w-[558px] shrink-0"
            />
          </div>
        </div>
      </div>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddStudentDialog}
        onClose={() => setShowAddStudentDialog(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}

