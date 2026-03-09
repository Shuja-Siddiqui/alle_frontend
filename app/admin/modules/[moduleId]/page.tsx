"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ModuleGeneralStats } from "../../../../components/ModuleGeneralStats";
import { LessonStatCard, LessonType } from "../../../../components/LessonStatCard";
import { AddStudentDialog, AddStudentFormData } from "../../../../components/AddStudentDialog";
import { api } from "../../../../lib/api-client";

type LessonData = {
  id: string;
  lessonNumber: number;
  title: string;
  description: string;
  lessonType: LessonType;
  sound: string;
  students: number;
  estimatedTime: string;
};

type ModuleDetails = {
  id: string;
  title: string;
  lessonsCount: number;
  currentStudentsCount: number;
  weeks?: number | null;
  estimatedTime?: string | null;
};

export default function ModuleDetailsPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const router = useRouter();
  const { moduleId } = use(params);
  const [selectedLessonType, setSelectedLessonType] = useState<LessonType | "all">("all");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [moduleData, setModuleData] = useState<ModuleDetails | null>(null);
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loadingModule, setLoadingModule] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleBackClick() {
    router.push("/admin/modules");
  }

  function handleAddStudent() {
    setRefreshTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    let isMounted = true;

    const fetchModule = async () => {
      try {
        const response = await api.get<any>(`/modules/${moduleId}`);
        const payload = response?.data ?? response;
        if (isMounted) {
          setModuleData({
            id: payload.id,
            title: payload.title,
            lessonsCount: payload.lessonsCount ?? 0,
            currentStudentsCount: payload.currentStudentsCount ?? 0,
            weeks: payload.weeks ?? null,
            estimatedTime: payload.estimatedTime ?? null,
          });
        }
      } catch (error) {
        console.error("❌ Failed to load module details:", error);
        if (isMounted) {
          setModuleData(null);
        }
      } finally {
        if (isMounted) {
          setLoadingModule(false);
        }
      }
    };

    const fetchLessons = async () => {
      try {
        const response = await api.get<any>(`/modules/${moduleId}/lessons`);
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        if (isMounted) {
          const mapped: LessonData[] = list.map((lesson: any, index: number) => ({
            id: lesson.id,
            lessonNumber: index + 1,
            title: lesson.title,
            description: lesson.preview || "",
            lessonType: (lesson.lessonType || "intro") as LessonType,
            sound: "",
            students: lesson.studentsCount ?? 0,
            estimatedTime: lesson.estimatedTime || "",
          }));
          setLessons(mapped);
        }
      } catch (error) {
        console.error("❌ Failed to load module lessons:", error);
        if (isMounted) {
          setLessons([]);
        }
      } finally {
        if (isMounted) {
          setLoadingLessons(false);
        }
      }
    };

    fetchModule();
    fetchLessons();

    return () => {
      isMounted = false;
    };
  }, [moduleId, refreshTrigger]);

  // Filter lessons based on selected type
  const filteredLessons = lessons.filter(
    (lesson) => selectedLessonType === "all" || lesson.lessonType === selectedLessonType
  );

  const lessonTypeFilters: Array<{ value: LessonType | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "intro", label: "Intro" },
    { value: "practice", label: "Practice" },
    { value: "blending", label: "Blending" },
    { value: "reading", label: "Reading" },
    { value: "mastery-check", label: "Mastery Check" },
    { value: "wrap-up", label: "Wrap-up" },
  ];

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
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
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
        {/* Module General Stats */}
        <div style={{ marginBottom: "24px" }}>
          {moduleData && !loadingModule && (
            <ModuleGeneralStats
              moduleTitle={moduleData.title}
              lessons={moduleData.lessonsCount}
              students={moduleData.currentStudentsCount}
              weeks={
                moduleData.estimatedTime
                  ? moduleData.estimatedTime
                  : moduleData.weeks != null
                  ? String(moduleData.weeks)
                  : ""
              }
            />
          )}
        </div>

        {/* Lessons Section */}
        <div className="flex flex-col gap-[16px]">
          {/* Header with Filters */}
          <div className="flex items-center justify-between w-full">
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "1.5",
                letterSpacing: "-0.308px",
                textTransform: "uppercase",
              }}
            >
              Lessons
            </p>
            <div className="flex gap-[12px] items-start flex-wrap">
              {lessonTypeFilters.map((filter) => {
                const isSelected = selectedLessonType === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedLessonType(filter.value)}
                    className="flex h-[44px] items-center justify-center px-[16px] py-[10px] rounded-[60px] shrink-0 cursor-pointer border-none"
                    style={{
                      backgroundColor: isSelected
                        ? "rgba(255, 0, 202, 0.1)"
                        : "transparent",
                      border: isSelected ? "none" : "1px solid #434b93",
                    }}
                  >
                    <p
                      style={{
                        color: isSelected ? "#ff00ca" : "#FFFFFF",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "20px",
                        letterSpacing: "-0.28px",
                        textAlign: "center",
                      }}
                    >
                      {filter.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson Cards */}
          <div className="flex flex-col gap-[16px]">
            {filteredLessons.map((lesson) => (
              <LessonStatCard
                key={lesson.id}
                lessonTitle={`Lesson ${lesson.lessonNumber}: ${lesson.title}`}
                description={lesson.description}
                lessonType={lesson.lessonType}
                sound={lesson.sound}
                students={lesson.students}
                estimatedTime={lesson.estimatedTime}
                moduleId={moduleId}
                lessonId={lesson.id}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredLessons.length === 0 && (
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
                No lessons found
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
                Try selecting a different filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddStudentDialog}
        onClose={() => setShowAddStudentDialog(false)}
        onAddStudent={handleAddStudent}
        modules={moduleData ? [{ value: moduleData.id, label: moduleData.title }] : []}
      />
    </div>
  );
}

