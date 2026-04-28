"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LessonStatsCard } from "../../../../../../components/LessonStatsCard";
import { LessonObjective } from "../../../../../../components/LessonObjective";
import { PerformanceMarkers } from "../../../../../../components/PerformanceMarkers";
import { StudentsTable, StudentRowData } from "../../../../../../components/StudentsTable";
import { LessonDetailsSkeleton } from "../../../../../../components/Skeletons/LessonDetailsSkeleton";
import { StudentsTableSkeleton } from "../../../../../../components/Skeletons/StudentsTableSkeleton";
import { AddStudentDialog, AddStudentFormData } from "../../../../../../components/AddStudentDialog";
import { AdminNotificationsMenu } from "../../../../../../components/AdminNotificationsMenu";
import { api, ApiError } from "../../../../../../lib/api-client";
import { useAuth } from "../../../../../../contexts/AuthContext";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  hi: "Hindi",
  ar: "Arabic",
};

type LessonApiData = {
  id: string;
  title: string;
  lessonType?: string;
  skillFocus?: string[];
  preview?: string;
  estimatedTime?: string;
};

type StudentApiData = {
  id: string;
  name: string;
  grade?: string;
  languagePreference?: string;
  avatarUrl?: string;
  successRate?: number;
  status: string;
  progress: number;
};

type PerformanceMarkersApiData = {
  averageAccuracy: number;
  totalErrors: number;
  topError: string;
  correctAnswers: number;
  incorrectAnswers: number;
  partialMastery: number;
  criticalErrors: number;
};

const DEFAULT_PERFORMANCE_MARKERS: PerformanceMarkersApiData = {
  averageAccuracy: 0,
  totalErrors: 0,
  topError: "—",
  correctAnswers: 0,
  incorrectAnswers: 0,
  partialMastery: 0,
  criticalErrors: 0,
};

export default function LessonDetailsPage() {
  const router = useRouter();
  const params = useParams<{ moduleId: string; lessonId: string }>();
  const pathname = usePathname();
  const { user } = useAuth();
  const roleBase =
    user?.role === "teacher" ? "teacher" : pathname?.startsWith("/teacher") ? "teacher" : "admin";
  const moduleId = Array.isArray(params?.moduleId) ? params.moduleId[0] : params?.moduleId;
  const lessonId = Array.isArray(params?.lessonId) ? params.lessonId[0] : params?.lessonId;
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [lessonData, setLessonData] = useState<LessonApiData | null>(null);
  const [lessonStudents, setLessonStudents] = useState<StudentRowData[]>([]);
  const [performanceMarkers, setPerformanceMarkers] = useState<PerformanceMarkersApiData>(
    DEFAULT_PERFORMANCE_MARKERS
  );
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [accessDenied, setAccessDenied] = useState(false);
  const redirectScheduledRef = useRef(false);
  const hasRouteParams = Boolean(moduleId && lessonId);

  const navigateBackToModules = () => {
    if (moduleId) {
      router.push(`/${roleBase}/modules/${moduleId}`);
      return;
    }
    router.push(`/${roleBase}/modules`);
  };

  const handleAccessDenied = () => {
    if (redirectScheduledRef.current) return;
    redirectScheduledRef.current = true;
    setAccessDenied(true);
    window.setTimeout(() => {
      navigateBackToModules();
    }, 1200);
  };

  const is403 = (error: unknown) =>
    error instanceof ApiError
      ? error.statusCode === 403
      : (error as { statusCode?: number; response?: { statusCode?: number } })?.statusCode === 403 ||
        (error as { response?: { statusCode?: number } })?.response?.statusCode === 403;

  function handleBackClick() {
    navigateBackToModules();
  }

  function handleAddStudent() {
    setRefreshTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    if (!hasRouteParams) return;
    let isMounted = true;

    const fetchLesson = async () => {
      try {
        const response = await api.get<{ data?: LessonApiData }>(`/lessons/${lessonId}`);
        const payload = response?.data ?? response;
        const lesson = (payload as any)?.data ?? payload;
        if (isMounted && lesson) {
          setLessonData(lesson as LessonApiData);
        }
      } catch (error) {
        if (is403(error)) {
          if (isMounted) {
            setLessonData(null);
            handleAccessDenied();
          }
        } else {
          console.error("❌ Failed to load lesson:", error);
          if (isMounted) setLessonData(null);
        }
      } finally {
        if (isMounted) setLoadingLesson(false);
      }
    };

    fetchLesson();
    return () => { isMounted = false; };
  }, [lessonId, hasRouteParams]);

  useEffect(() => {
    if (!hasRouteParams) return;
    let isMounted = true;

    const fetchMarkers = async () => {
      try {
        const res = await api.get<{ success?: boolean; data?: PerformanceMarkersApiData }>(
          `/lessons/${lessonId}/performance-markers`
        );
        const payload = (res as any)?.data ?? res;
        const data = (payload as any)?.data ?? payload;
        if (isMounted && data) {
          setPerformanceMarkers({
            ...DEFAULT_PERFORMANCE_MARKERS,
            ...data,
          });
        }
      } catch (error) {
        if (is403(error)) {
          if (isMounted) {
            setPerformanceMarkers(DEFAULT_PERFORMANCE_MARKERS);
            handleAccessDenied();
          }
        } else {
          console.error("❌ Failed to load lesson performance markers:", error);
          if (isMounted) setPerformanceMarkers(DEFAULT_PERFORMANCE_MARKERS);
        }
      }
    };

    fetchMarkers();
    return () => { isMounted = false; };
  }, [lessonId, refreshTrigger, hasRouteParams]);

  useEffect(() => {
    if (!hasRouteParams) return;
    let isMounted = true;

    const fetchStudents = async () => {
      try {
        const response = await api.get<{ data?: StudentApiData[] }>(`/lessons/${lessonId}/students`);
        const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        if (isMounted) {
          const mapped: StudentRowData[] = list.map((s: StudentApiData) => {
            const lang = (s.languagePreference || "en").toLowerCase().slice(0, 2);
            const langCode = ["en", "es", "fr", "hi", "ar"].includes(lang) ? lang : "en";
            return {
              id: s.id,
              name: s.name,
              avatarSrc: s.avatarUrl || "/assets/icons/avatar_gallery/Avatar-1.png",
              avatarAlt: s.name,
              grade: s.grade || "-",
              language: langCode as "en" | "es" | "fr" | "hi" | "ar",
              languageName: LANGUAGE_NAMES[langCode] || "English",
              successRate: typeof s.successRate === "number" ? s.successRate : 0,
              progress: s.status === "completed" ? "Completed" : s.status === "in_progress" ? "In Progress" : s.status,
              progressHasWarning: (s.progress ?? 0) < 50,
              status: s.status === "completed" ? "Completed" : "Active",
            };
          });
          setLessonStudents(mapped);
        }
      } catch (error) {
        if (is403(error)) {
          if (isMounted) {
            setLessonStudents([]);
            handleAccessDenied();
          }
        } else {
          console.error("❌ Failed to load students:", error);
          if (isMounted) setLessonStudents([]);
        }
      } finally {
        if (isMounted) setLoadingStudents(false);
      }
    };

    fetchStudents();
    return () => { isMounted = false; };
  }, [lessonId, refreshTrigger, hasRouteParams]);

  const studentsCount = lessonStudents.length;
  const avgProgress =
    studentsCount > 0
      ? Math.round(
          lessonStudents.reduce((sum, s) => sum + s.successRate, 0) / studentsCount
        )
      : 0;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Navbar */}
      <div className="w-full" style={{ padding: "24px 32px" }}>
        <div className="flex items-center justify-between w-full">
          {/* Left side: Back Button */}
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center gap-[16px] shrink-0 cursor-pointer bg-transparent border-none p-0"
          >
            <Image
              src="/assets/icons/others/arrow_back.svg"
              alt="Back"
              width={36}
              height={36}
              className="block max-w-none"
            />
          </button>

          {/* Right side: Notification and Add student button */}
          <div className="flex gap-[28px] items-center">
            {/* Shared notifications menu with live unread count */}
            <AdminNotificationsMenu />

            {/* Add student button */}
            <button
              type="button"
              onClick={() => setShowAddStudentDialog(true)}
              className="relative flex gap-[4px] h-[52px] items-center justify-center px-[24px] py-[8px] rounded-[76.829px] overflow-hidden"
              style={{
                border: "2px solid rgba(255, 255, 255, 0.24)",
                backgroundImage:
                  "linear-gradient(84.2deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%)",
                boxShadow: "0px 0px 0px 1.602px #E451FE",
                cursor: "pointer",
              }}
            >
              {/* Decorative stars */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "144px",
                  top: "-13px",
                  width: "29.263px",
                  height: "29.263px",
                }}
              >
                <div style={{ transform: "rotate(-30deg)" }}>
                  <Image
                    src="/assets/icons/others/star2.png"
                    alt=""
                    width={21}
                    height={21}
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </div>
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "194px",
                  top: "37px",
                  width: "26.555px",
                  height: "26.555px",
                }}
              >
                <div style={{ transform: "rotate(-30deg)" }}>
                  <Image
                    src="/assets/icons/others/star2.png"
                    alt=""
                    width={19}
                    height={19}
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </div>
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "42px",
                  top: "36px",
                  width: "35.32px",
                  height: "35.32px",
                }}
              >
                <div style={{ transform: "rotate(-23deg)" }}>
                  <Image
                    src="/assets/icons/others/star2.png"
                    alt=""
                    width={27}
                    height={27}
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </div>

              {/* Button text */}
              <span
                className="relative z-10"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "24px",
                  letterSpacing: "-0.198px",
                  textTransform: "uppercase",
                }}
              >
                Add student
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div
        className="flex-1 overflow-auto"
        style={{
          padding: "0 32px 32px 32px",
        }}
      >
        {accessDenied ? (
          <div style={{ color: "#FFF", padding: "24px" }}>
            Access denied for this lesson. Returning to modules...
          </div>
        ) : loadingLesson ? (
          <LessonDetailsSkeleton />
        ) : lessonData ? (
          <>
            {/* Lesson Stats Card */}
            <div style={{ marginBottom: "24px" }}>
              <LessonStatsCard
                lessonTitle={`Lesson: ${lessonData.title}`}
                soundAndType={lessonData.lessonType || "—"}
                gradeLevel="—"
                completionRate={avgProgress}
                students={studentsCount}
                estimatedTime={lessonData.estimatedTime || "—"}
              />
            </div>

            {/* Lesson Objective and Performance Markers - Side by Side */}
            <div className="flex gap-[24px] items-start" style={{ marginBottom: "24px" }}>
              {/* Left: Lesson Objective */}
              <LessonObjective
                objective={lessonData.preview || "No objective provided."}
                tags={Array.isArray(lessonData.skillFocus) ? lessonData.skillFocus : []}
                className="w-[364px] shrink-0"
              />

              {/* Right: Performance markers (lesson_difficulty_daily + lesson_outcome_snapshot; see API) */}
              <PerformanceMarkers
                averageAccuracy={performanceMarkers.averageAccuracy}
                totalErrors={performanceMarkers.totalErrors}
                topError={performanceMarkers.topError}
                correctAnswers={performanceMarkers.correctAnswers}
                incorrectAnswers={performanceMarkers.incorrectAnswers}
                partialMastery={performanceMarkers.partialMastery}
                criticalErrors={performanceMarkers.criticalErrors}
                className="flex-1"
              />
            </div>

            {/* Students Table */}
            <div>
              {loadingStudents ? (
                <StudentsTableSkeleton />
              ) : (
                <StudentsTable students={lessonStudents} />
              )}
            </div>
          </>
        ) : (
          <div style={{ color: "#FFF", padding: "24px" }}>Lesson not found.</div>
        )}
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

