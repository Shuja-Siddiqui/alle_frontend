"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ModuleGeneralStats } from "../../../../components/ModuleGeneralStats";
import { LessonStatCard, LessonType } from "../../../../components/LessonStatCard";
import { AddStudentDialog, AddStudentFormData } from "../../../../components/AddStudentDialog";

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

export default function ModuleDetailsPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const router = useRouter();
  const { moduleId } = use(params);
  const [selectedLessonType, setSelectedLessonType] = useState<LessonType | "all">("all");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);

  function handleBackClick() {
    router.push("/admin/modules");
  }

  function handleAddStudent(data: AddStudentFormData) {
    // TODO: Implement API call to add student
    console.log("Adding student:", data);
  }

  // TODO: Fetch module data from API using moduleId
  // Mock data for now
  const moduleData = {
    id: moduleId,
    moduleNumber: "Module 3",
    title: "Long vowels",
    lessons: 7,
    students: 54,
    weeks: "5-6",
    lessonsList: [
      {
        id: "1",
        lessonNumber: 1,
        title: "AI vowel team",
        description: "Discover the AI vowel team sound",
        lessonType: "intro" as LessonType,
        sound: "S",
        students: 6,
        estimatedTime: "1 min.",
      },
      {
        id: "2",
        lessonNumber: 2,
        title: "EE vowel team",
        description: "Practice words with the long EE sound",
        lessonType: "reading" as LessonType,
        sound: "A",
        students: 12,
        estimatedTime: "2 min.",
      },
      {
        id: "3",
        lessonNumber: 3,
        title: "IGH vowel team",
        description: "Read words with the IGH pattern",
        lessonType: "practice" as LessonType,
        sound: "T",
        students: 11,
        estimatedTime: "2 min.",
      },
      {
        id: "4",
        lessonNumber: 4,
        title: "OA vowel team",
        description: "Master the OA vowel sound",
        lessonType: "blending" as LessonType,
        sound: "P",
        students: 9,
        estimatedTime: "3 min.",
      },
      {
        id: "5",
        lessonNumber: 5,
        title: "OO vowel team (two sounds!)",
        description: "Practice words using the OO sounds",
        lessonType: "practice" as LessonType,
        sound: "S",
        students: 6,
        estimatedTime: "3 min.",
      },
      {
        id: "6",
        lessonNumber: 6,
        title: "Alternative Spellings",
        description: "AY, A-E, OW, O-E, U-E spellings",
        lessonType: "mastery-check" as LessonType,
        sound: "A",
        students: 6,
        estimatedTime: "5 min.",
      },
      {
        id: "7",
        lessonNumber: 7,
        title: "Long Vowel Mastery",
        description: "+ 2–3 Syllable Words",
        lessonType: "wrap-up" as LessonType,
        sound: "S",
        students: 4,
        estimatedTime: "6 min.",
      },
    ] as LessonData[],
  };

  // Filter lessons based on selected type
  const filteredLessons = moduleData.lessonsList.filter(
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
          <ModuleGeneralStats
            moduleTitle={`${moduleData.moduleNumber}: ${moduleData.title}`}
            lessons={moduleData.lessons}
            students={moduleData.students}
            weeks={moduleData.weeks}
          />
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
      />
    </div>
  );
}

