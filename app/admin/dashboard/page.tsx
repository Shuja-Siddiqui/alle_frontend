"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { StatCard } from "../../../components/StatCard";
import { StudentStatCard } from "../../../components/StudentStatCard";
import { RetentionMetrics } from "../../../components/RetentionMetrics";
import { ModuleStatCard } from "../../../components/ModuleStatCard";
import { AddStudentDialog, AddStudentFormData } from "../../../components/AddStudentDialog";
import { AddTeacherDialog, AddTeacherFormData } from "../../../components/AddTeacherDialog";
import { AdminDashboardSkeleton } from "../../../components/Skeletons/AdminDashboardSkeleton";
import { api } from "../../../lib/api-client";
import { motion } from "framer-motion";

type DashboardStats = {
  totalStudents: number;
  lessonCompletionPercentage: number;
  engagementActivity: {
    percentage: number;
    completedModuleRecords: number;
    totalPossibleModules: number;
  };
};

type WeeklyEngagementStats = {
  engagementRateThisWeek: number;
  engagementRateLastWeek: number;
  changeInPercentagePoints: number;
  totalStudents: number;
  engagedThisWeek: number;
  engagedLastWeek: number;
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
  const pathname = usePathname();
  const roleBase = pathname?.startsWith("/teacher") ? "teacher" : "admin";
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dashboardStudents, setDashboardStudents] = useState<DashboardStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [dashboardModules, setDashboardModules] = useState<DashboardModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [weeklyEngagement, setWeeklyEngagement] = useState<WeeklyEngagementStats | null>(null);
  const [loadingWeeklyEngagement, setLoadingWeeklyEngagement] = useState(true);
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

    const fetchWeeklyEngagement = async () => {
      try {
        const response = await api.get<any>("/reports/school-weekly-engagement");
        const payload: WeeklyEngagementStats = response?.data ?? response;
        if (isMounted) {
          setWeeklyEngagement(payload);
        }
      } catch (error) {
        console.error("❌ Failed to load weekly engagement:", error);
        if (isMounted) {
          setWeeklyEngagement(null);
        }
      } finally {
        if (isMounted) {
          setLoadingWeeklyEngagement(false);
        }
      }
    };

    fetchWeeklyEngagement();

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

  function handleAddTeacher(_: AddTeacherFormData) {
    setRefreshTrigger((prev) => prev + 1);
  }

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  } as const;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Navbar */}
      <motion.div
        className="w-full"
        style={{ padding: "24px 32px" }}
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <AdminNavbar
          title="Dashboard"
          onNotificationClick={() => {
            // TODO: Handle notification click
            console.log("Notification clicked");
          }}
          onAddStudentClick={() => setShowAddStudentDialog(true)}
          onAddTeacherClick={
            roleBase === "admin" ? () => setShowAddTeacherDialog(true) : undefined
          }
        />
      </motion.div>

      {/* Main content area */}
      <div
        className="flex-1 overflow-auto"
        style={{
          padding: "0 32px 32px 32px",
        }}
      >
        {loadingStats && loadingStudents && loadingModules ? (
          <AdminDashboardSkeleton />
        ) : (
          <>
        {/* Stats Cards Row */}
        <motion.div
          className="flex gap-[24px] items-center"
          style={{ marginBottom: "32px" }}
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          {/* Card 1: Total students */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: "easeOut" }}>
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
          </motion.div>

          {/* Card 2: Lesson completion */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: "easeOut" }}>
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
          </motion.div>

          {/* Card 3: Engagement activity */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: "easeOut" }}>
            <StatCard
              title={
                loadingStats
                  ? "..."
                  : `${stats?.engagementActivity?.percentage ?? 0}%`
              }
              supportiveText={
                loadingStats
                  ? "Loading engagement..."
                  : `${stats?.engagementActivity?.completedModuleRecords ?? 0} / ${stats?.engagementActivity?.totalPossibleModules ?? 0} completed module records`
              }
              subtitle="Engagement activity"
              iconSrc="/assets/icons/admin/analytics.svg"
              iconAlt="Analytics icon"
              className="w-[364px] shrink-0"
            />
          </motion.div>
        </motion.div>

        {/* Main Content: Metrics and Students in one container */}
        <motion.div
          className="flex gap-[24px] items-start justify-center"
          style={{
            width: "1140px",
            height: "336px",
          }}
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="shrink-0"
            style={{
              width: "364px",
              height: "100%",
            }}
          >
            <RetentionMetrics
              percentage={
                loadingWeeklyEngagement
                  ? 0
                  : Math.max(0, Math.min(100, Math.round(weeklyEngagement?.engagementRateThisWeek ?? 0)))
              }
              changePercentage={
                loadingWeeklyEngagement
                  ? 0
                  : Math.round(weeklyEngagement?.changeInPercentagePoints ?? 0)
              }
              style={{
                width: "364px",
                height: "100%",
              }}
            />
          </motion.div>

          {/* Students Section */}
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
                href={`/${roleBase}/students`}
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
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      whileHover={{ y: -3 }}
                    >
                      <StudentStatCard
                        avatarSrc={student.avatarUrl || DEFAULT_AVATAR}
                        avatarAlt={name}
                        studentName={name}
                        grade={student.grade || "—"}
                        modules={student.modulesCompleted}
                        lessons={student.lessonsCompleted}
                        className="shrink-0"
                        style={{ width: "363px" }}
                      />
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Modules Section */}
        <motion.div
          style={{ marginTop: "32px" }}
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.35 }}
        >
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
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.04 }}
                  whileHover={{ y: -3 }}
                >
                  <ModuleStatCard
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
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
        </>
        )}
      </div>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddStudentDialog}
        onClose={() => setShowAddStudentDialog(false)}
        onAddStudent={handleAddStudent}
        modules={dashboardModules.map((m) => ({ value: m.id, label: m.title }))}
      />

      {roleBase === "admin" && (
        <AddTeacherDialog
          open={showAddTeacherDialog}
          onClose={() => setShowAddTeacherDialog(false)}
          onAddTeacher={handleAddTeacher}
        />
      )}
    </div>
  );
}

