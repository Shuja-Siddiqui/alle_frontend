"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LessonStatsCard } from "../../../../../../components/LessonStatsCard";
import { LessonObjective } from "../../../../../../components/LessonObjective";
import { PerformanceMarkers } from "../../../../../../components/PerformanceMarkers";
import { StudentsTable, StudentRowData } from "../../../../../../components/StudentsTable";
import { AddStudentDialog, AddStudentFormData } from "../../../../../../components/AddStudentDialog";

export default function LessonDetailsPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const router = useRouter();
  const { moduleId, lessonId } = use(params);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);

  function handleBackClick() {
    router.push(`/admin/modules/${moduleId}`);
  }

  function handleAddStudent(data: AddStudentFormData) {
    // TODO: Implement API call to add student
    console.log("Adding student:", data);
  }

  // TODO: Fetch lesson data from API using moduleId and lessonId
  // Mock data for now
  const lessonData = {
    id: lessonId,
    moduleId: moduleId,
    lessonNumber: 1,
    title: "AI vowel team",
    sound: "S",
    lessonType: "Intro",
    gradeLevel: "8-9",
    completionRate: 75,
    students: 6,
    estimatedTime: "1 min.",
    objective:
      "Students will learn to recognize and blend the AI vowel team, improve pronunciation, and distinguish similar vowel sounds iun words",
    tags: ["Blending", "Sound recognition", "Pronunciation", "Word sctructure"],
    performance: {
      averageAccuracy: 81,
      totalErrors: 42,
      topError: "/s/",
      correctAnswers: 174,
      incorrectAnswers: 42,
      partialMastery: 27,
      criticalErrors: 12,
    },
  };

  // Mock student data for this lesson
  const lessonStudents: StudentRowData[] = [
    {
      id: "1",
      name: "Maxwell Thompson",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-2.png",
      avatarAlt: "Maxwell Thompson",
      grade: "9",
      language: "en",
      languageName: "English",
      successRate: 95,
      progress: "Module 3, Lesson 1",
      progressHasWarning: false,
      status: "Active",
    },
    {
      id: "2",
      name: "Sophia Nguyen",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-3.png",
      avatarAlt: "Sophia Nguyen",
      grade: "5",
      language: "en",
      languageName: "English",
      successRate: 86,
      progress: "Module 3, Lesson 1",
      progressHasWarning: false,
      status: "Active",
    },
    {
      id: "3",
      name: "Ethan Patel",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-4.png",
      avatarAlt: "Ethan Patel",
      grade: "6",
      language: "en",
      languageName: "English",
      successRate: 79,
      progress: "Module 3, Lesson 1",
      progressHasWarning: false,
      status: "Active",
    },
    {
      id: "4",
      name: "Ava Johnson",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-1.png",
      avatarAlt: "Ava Johnson",
      grade: "12",
      language: "es",
      languageName: "Spanish",
      successRate: 66,
      progress: "Module 3, Lesson 1",
      progressHasWarning: false,
      status: "Active",
    },
    {
      id: "5",
      name: "Liam Brown",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-2.png",
      avatarAlt: "Liam Brown",
      grade: "4",
      language: "es",
      languageName: "Spanish",
      successRate: 51,
      progress: "Module 3, Lesson 1",
      progressHasWarning: true,
      status: "Active",
    },
    {
      id: "6",
      name: "Olivia Davis",
      avatarSrc: "/assets/icons/avatar_gallery/Avatar-3.png",
      avatarAlt: "Olivia Davis",
      grade: "2",
      language: "fr",
      languageName: "French",
      successRate: 49,
      progress: "Module 3, Lesson 1",
      progressHasWarning: true,
      status: "Active",
    },
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
        {/* Lesson Stats Card */}
        <div style={{ marginBottom: "24px" }}>
          <LessonStatsCard
            lessonTitle={`Lesson ${lessonData.lessonNumber}: ${lessonData.title}`}
            soundAndType={`Sound ${lessonData.sound} / ${lessonData.lessonType}`}
            gradeLevel={lessonData.gradeLevel}
            completionRate={lessonData.completionRate}
            students={lessonData.students}
            estimatedTime={lessonData.estimatedTime}
          />
        </div>

        {/* Lesson Objective and Performance Markers - Side by Side */}
        <div className="flex gap-[24px] items-start" style={{ marginBottom: "24px" }}>
          {/* Left: Lesson Objective */}
          <LessonObjective
            objective={lessonData.objective}
            tags={lessonData.tags}
            className="w-[364px] shrink-0"
          />

          {/* Right: Performance Markers */}
          <PerformanceMarkers
            averageAccuracy={lessonData.performance.averageAccuracy}
            totalErrors={lessonData.performance.totalErrors}
            topError={lessonData.performance.topError}
            correctAnswers={lessonData.performance.correctAnswers}
            incorrectAnswers={lessonData.performance.incorrectAnswers}
            partialMastery={lessonData.performance.partialMastery}
            criticalErrors={lessonData.performance.criticalErrors}
            className="flex-1"
          />
        </div>

        {/* Students Table */}
        <div>
          <StudentsTable students={lessonStudents} />
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

