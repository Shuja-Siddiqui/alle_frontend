"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { StatCard } from "../../../components/StatCard";
import { StudentStatCard } from "../../../components/StudentStatCard";
import { RetentionMetrics } from "../../../components/RetentionMetrics";
import { ModuleStatCard } from "../../../components/ModuleStatCard";
import { AddStudentDialog, AddStudentFormData } from "../../../components/AddStudentDialog";
import { api } from "../../../lib/api-client";

type DashboardStats = {
  totalStudents: number;
  lessonCompletionPercentage: number;
  engagementActivity: {
    count: number;
    moduleName: string | null;
  };
};

type DashboardModule = {
  id: string;
  title: string;
  lessonsCount: number;
  currentStudentsCount: number;
  weeks?: number | null;
  estimatedTime?: string | null;
  grades?: string | null;
};

type DashboardStudent = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  grade: string;
  modulesCompleted: number;
  lessonsCompleted: number;
};

const DEFAULT_AVATAR = "/assets/icons/others/profile_avatar_large.png";

export default function AdminDashboardPage() {
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dashboardStudents, setDashboardStudents] = useState<DashboardStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [dashboardModules, setDashboardModules] = useState<DashboardModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const response = await api.get<any>("/dashboard/stats");
        const payload: DashboardStats = response?.data ?? response;
        if (isMounted) {
          setStats(payload);
        }
      } catch (error) {
        console.error("❌ Failed to load dashboard stats:", error);
        if (isMounted) {
          setStats(null);
        }
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  useEffect(() => {
    let isMounted = true;

    const fetchModules = async () => {
      try {
        const response = await api.get<any>("/modules");
        const list: DashboardModule[] = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        if (isMounted) {
          setDashboardModules(list);
        }
      } catch (error) {
        console.error("❌ Failed to load dashboard modules:", error);
        if (isMounted) {
          setDashboardModules([]);
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

  useEffect(() => {
    let isMounted = true;

    const fetchStudents = async () => {
      try {
        const response = await api.get<any>("/dashboard/students?limit=4");
        const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        if (isMounted) {
          setDashboardStudents(list);
        }
      } catch (error) {
        console.error("❌ Failed to load dashboard students:", error);
        if (isMounted) {
          setDashboardStudents([]);
        }
      } finally {
        if (isMounted) {
          setLoadingStudents(false);
        }
      }
    };

    fetchStudents();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  function handleAddStudent() {
    setRefreshTrigger((prev) => prev + 1);
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
            title={
              loadingStats
                ? "..."
                : String(stats?.totalStudents ?? 0)
            }
            subtitle="Total students"
            iconSrc="/assets/icons/admin/students.svg"
            iconAlt="Students icon"
            className="w-[364px] shrink-0"
          />

          {/* Card 2: Lesson completion */}
          <StatCard
            title={
              loadingStats
                ? "..."
                : `${stats?.lessonCompletionPercentage ?? 0}%`
            }
            subtitle="Lesson completion"
            iconSrc="/assets/icons/admin/modules.svg"
            iconAlt="Modules icon"
            className="w-[364px] shrink-0"
          />

          {/* Card 3: Engagement activity */}
          <StatCard
            title={
              loadingStats
                ? "..."
                : String(stats?.engagementActivity?.count ?? 0)
            }
            supportiveText={
              loadingStats
                ? "Loading engagement..."
                : stats?.engagementActivity?.moduleName
                ? `students completed module '${stats.engagementActivity.moduleName}'`
                : "students completed modules"
            }
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
              <Link
                href="/admin/students"
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
              </Link>
            </div>

            {/* Student Cards - 2x2 Grid (from API) */}
            <div className="flex flex-wrap gap-[24px] flex-1" style={{ alignContent: "flex-start" }}>
              {loadingStudents ? (
                <div style={{ color: "#FFF", padding: "24px" }}>Loading students...</div>
              ) : dashboardStudents.length === 0 ? (
                <div style={{ color: "#FFF", padding: "24px" }}>No students yet.</div>
              ) : (
                dashboardStudents.map((student) => {
                  const name = [student.firstName, student.lastName].filter(Boolean).join(" ") || "Student";
                  return (
                    <StudentStatCard
                      key={student.id}
                      avatarSrc={student.avatarUrl || DEFAULT_AVATAR}
                      avatarAlt={name}
                      studentName={name}
                      grade={student.grade || "—"}
                      modules={student.modulesCompleted}
                      lessons={student.lessonsCompleted}
                      className="shrink-0"
                      style={{ width: "363px" }}
                    />
                  );
                })
              )}
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

          {/* Module Cards Row - scrollable, data from API */}
          <div
            className="flex gap-[24px] justify-start items-start overflow-x-auto module-scrollbar"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#ff00ca #21265d",
            }}
          >
            {loadingModules ? (
              <div style={{ color: "#FFF", padding: "24px" }}>Loading modules...</div>
            ) : dashboardModules.length === 0 ? (
              <div style={{ color: "#FFF", padding: "24px" }}>No modules yet.</div>
            ) : (
              dashboardModules.map((mod, index) => (
                <ModuleStatCard
                  key={mod.id}
                  moduleId={mod.id}
                  moduleNumber={`Module ${index + 1}`}
                  title={mod.title}
                  lessons={mod.lessonsCount ?? 0}
                  students={mod.currentStudentsCount ?? 0}
                  weeks={
                    mod.estimatedTime
                      ? mod.estimatedTime
                      : mod.weeks != null
                      ? String(mod.weeks)
                      : ""
                  }
                  grades={mod.grades ?? ""}
                  className="w-[558px] shrink-0"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddStudentDialog}
        onClose={() => setShowAddStudentDialog(false)}
        onAddStudent={handleAddStudent}
        modules={dashboardModules.map((m) => ({ value: m.id, label: m.title }))}
      />
    </div>
  );
}

