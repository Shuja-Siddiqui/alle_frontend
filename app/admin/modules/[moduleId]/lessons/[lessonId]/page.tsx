"use client";

import { useState, useEffect, use } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LessonStatsCard } from "../../../../../../components/LessonStatsCard";
import { LessonObjective } from "../../../../../../components/LessonObjective";
import { PerformanceMarkers } from "../../../../../../components/PerformanceMarkers";
import { StudentsTable, StudentRowData } from "../../../../../../components/StudentsTable";
import { LessonDetailsSkeleton } from "../../../../../../components/Skeletons/LessonDetailsSkeleton";
import { StudentsTableSkeleton } from "../../../../../../components/Skeletons/StudentsTableSkeleton";
import { AddStudentDialog, AddStudentFormData } from "../../../../../../components/AddStudentDialog";
import { api } from "../../../../../../lib/api-client";

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
  status: string;
  progress: number;
};

export default function LessonDetailsPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const roleBase = pathname?.startsWith("/teacher") ? "teacher" : "admin";
  const { moduleId, lessonId } = use(params);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [lessonData, setLessonData] = useState<LessonApiData | null>(null);
  const [lessonStudents, setLessonStudents] = useState<StudentRowData[]>([]);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleBackClick() {
    router.push(`/${roleBase}/modules/${moduleId}`);
  }

  function handleAddStudent() {
    setRefreshTrigger((prev) => prev + 1);
  }

  useEffect(() => {
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
        console.error("❌ Failed to load lesson:", error);
        if (isMounted) setLessonData(null);
      } finally {
        if (isMounted) setLoadingLesson(false);
      }
    };

    fetchLesson();
    return () => { isMounted = false; };
  }, [lessonId]);

  useEffect(() => {
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
              successRate: s.progress ?? 0,
              progress: s.status === "completed" ? "Completed" : s.status === "in_progress" ? "In Progress" : s.status,
              progressHasWarning: (s.progress ?? 0) < 50,
              status: s.status === "completed" ? "Completed" : "Active",
            };
          });
          setLessonStudents(mapped);
        }
      } catch (error) {
        console.error("❌ Failed to load students:", error);
        if (isMounted) setLessonStudents([]);
      } finally {
        if (isMounted) setLoadingStudents(false);
      }
    };

    fetchStudents();
    return () => { isMounted = false; };
  }, [lessonId, refreshTrigger]);

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
            {/* Notification icon */}
            <button
              type="button"
              onClick={() => {
                // TODO: Handle notification click
                console.log("Notification clicked");
              }}
              className="relative shrink-0 cursor-pointer bg-transparent border-none p-0"
              style={{
                width: "52px",
                height: "52px",
              }}
            >
              <div
                className="absolute"
                style={{
                  inset: "-1.65%",
                }}
              >
                <Image
                  src="/assets/icons/admin/notification.svg"
                  alt="Notifications"
                  width={54}
                  height={54}
                  className="block max-w-none size-full"
                />
              </div>
            </button>

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
        {loadingLesson ? (
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

              {/* Right: Performance Markers (derived from student progress) */}
              <PerformanceMarkers
                averageAccuracy={avgProgress}
                totalErrors={0}
                topError="—"
                correctAnswers={0}
                incorrectAnswers={0}
                partialMastery={0}
                criticalErrors={0}
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

