"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { StudentInfoCard } from "../../../../components/StudentInfoCard";
import { StudentEngagementCard } from "../../../../components/StudentEngagementCard";
import { StudentStatsBar } from "../../../../components/StudentStatsBar";
import { LearningTimeChart } from "../../../../components/LearningTimeChart";
import { StudentBadgesGrid } from "../../../../components/StudentBadgesGrid";
import { api } from "../../../../lib/api-client";
import { StudentDetailsSkeleton } from "../../../../components/Skeletons/StudentDetailsSkeleton";

type StudentData = {
  id: string;
  name: string;
  email: string;
  avatarSrc: string;
  avatarAlt: string;
  progress: number; // overall progress percentage (from totalXp or custom)
  engagementRate: number;
  engagementChange: number;
  currentModule: number;
  lessonsCompleted: number;
  grade: number;
  learningTime: {
    total: string;
    daily: { day: string; minutes: number }[];
  };
  badges: Array<{
    imageSrc: string;
    earned: boolean;
    title?: string;
    description?: string;
  }>;
};

const createDefaultStudentData = (id: string): StudentData => ({
  id,
  name: "Student",
  email: "",
  avatarSrc: "/assets/icons/avatar_gallery/Avatar-2.png",
  avatarAlt: "Student avatar",
  progress: 0,
  engagementRate: 66,
  engagementChange: 4,
  currentModule: 0,
  lessonsCompleted: 0,
  grade: 9,
  learningTime: {
    total: "2h 23m",
    daily: [
      { day: "Mon", minutes: 13 },
      { day: "Tue", minutes: 25 },
      { day: "Wed", minutes: 39 },
      { day: "Thu", minutes: 42 },
      { day: "Fri", minutes: 26 },
      { day: "Sat", minutes: 17 },
      { day: "Sun", minutes: 33 },
    ],
  },
  badges: [
    {
      imageSrc: "/assets/icons/badges/badge1.svg",
      earned: true,
      title: "First Landing",
      description: "Completed first lesson",
    },
    {
      imageSrc: "/assets/icons/badges/badge2.svg",
      earned: true,
      title: "Module Master",
      description: "Completed first module",
    },
    {
      imageSrc: "/assets/icons/badges/badge3.svg",
      earned: true,
      title: "Quick Learner",
      description: "Completed 10 lessons",
    },
    {
      imageSrc: "/assets/icons/badges/badge4.svg",
      earned: true,
      title: "Perfect Score",
      description: "Achieved 100% on a lesson",
    },
    { imageSrc: "/assets/icons/badges/badge2.svg", earned: false },
    { imageSrc: "/assets/icons/badges/badge5.svg", earned: false },
    { imageSrc: "/assets/icons/badges/badge6.svg", earned: false },
    { imageSrc: "/assets/icons/badges/badge2.svg", earned: false },
  ],
});

export default function StudentDetailsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const roleBase = pathname?.startsWith("/teacher") ? "teacher" : "admin";
  const params = useParams<{ id: string }>();
  const studentId = params?.id ?? "";
  const [studentData, setStudentData] = useState<StudentData>(
    createDefaultStudentData(studentId)
  );
  const [loading, setLoading] = useState(true);

  function handleBackClick() {
    router.push(`/${roleBase}/students`);
  }

  useEffect(() => {
    if (!studentId) return;

    let isMounted = true;

    const fetchStudent = async () => {
      try {
        const response = await api.get<any>(`/users/${studentId}/student-details`);
        const payload = response?.data ?? response;

        if (!isMounted || !payload) return;

        const user = payload.user ?? payload;
        const progress = payload.progress ?? {};
        const lessonsCompletedFromStudentLessons =
          typeof payload.lessonsCompletedFromStudentLessons === "number"
            ? payload.lessonsCompletedFromStudentLessons
            : undefined;
        const modules = Array.isArray(payload.modules) ? payload.modules : [];
        const badges = Array.isArray(payload.badges) ? payload.badges : [];
        const timeSpent = Array.isArray(payload.timeSpentLast7Days)
          ? payload.timeSpentLast7Days
          : [];

        const name =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.email ||
          "Student";
        const gradeNumber =
          user.grade != null && user.grade !== ""
            ? Number(user.grade)
            : 0;

        // Derive a simple "current module" as the count of started modules (or first active)
        const startedModules = modules.filter(
          (m: any) => m.status === "unlocked" || m.status === "completed"
        );
        const currentModule =
          startedModules.length > 0 ? startedModules.length : 0;

        // Map badges from API to UI shape
        const mappedBadges =
          badges.map((b: any) => ({
            imageSrc:
              (b.earned ? b.iconActive : b.iconInactive) ||
              b.iconActive ||
              b.icon ||
              "/assets/icons/badges/badge1.svg",
            earned: Boolean(b.earned),
            title: b.title,
            description: b.description,
          })) ?? [];

        // Map time spent (last 7 days) into chart data
        const learningDailyData =
          timeSpent.length > 0
            ? timeSpent.map((t: any) => {
                const date = new Date(t.period);
                const dayLabel = date.toLocaleDateString(undefined, {
                  weekday: "short",
                });
                const minutes = Math.round(t.totalMinutes ?? 0);
                return { day: dayLabel, minutes };
              })
            : studentData.learningTime.daily;

        const totalMinutesWeek = learningDailyData.reduce(
          (sum: number, d: { day: string; minutes: number }) => sum + d.minutes,
          0
        );
        const totalHours = Math.floor(totalMinutesWeek / 60);
        const remainingMinutes = totalMinutesWeek % 60;
        const totalTimeLabel =
          totalHours > 0
            ? `${totalHours}h ${remainingMinutes}m`
            : `${remainingMinutes}m`;

        setStudentData((prev) => ({
          ...prev,
          id: user.id ?? prev.id,
          name,
          email: user.email ?? prev.email,
          avatarSrc:
            user.avatarUrl ||
            prev.avatarSrc ||
            "/assets/icons/avatar_gallery/Avatar-2.png",
          avatarAlt: name,
          grade: Number.isNaN(gradeNumber) ? prev.grade : gradeNumber,
          lessonsCompleted:
            typeof lessonsCompletedFromStudentLessons === "number"
              ? lessonsCompletedFromStudentLessons
              : typeof progress.lessonsCompleted === "number"
              ? progress.lessonsCompleted
              : prev.lessonsCompleted,
          // Simple proxy for "progress" using totalXp if present
          progress:
            typeof progress.totalXp === "number"
              ? Math.min(100, Math.round((progress.totalXp / 1000) * 100)) // scale XP to 0-100
              : prev.progress,
          currentModule,
          badges: mappedBadges.length > 0 ? mappedBadges : prev.badges,
          learningTime: {
            total: totalTimeLabel,
            daily: learningDailyData,
          },
        }));
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to load student details:", error);
        setLoading(false);
      }
    };

    fetchStudent();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  return (
    <>
    {loading ? (
      <StudentDetailsSkeleton />
    ) : (
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
              onClick={() => {
                // TODO: Handle add student click
                console.log("Add student clicked");
              }}
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
        <div className="flex flex-col gap-[24px] items-start">
          {/* Top Row: Student Info and Engagement */}
          <div className="flex gap-[24px] items-start">
            <StudentInfoCard
              avatarSrc={studentData.avatarSrc}
              avatarAlt={studentData.avatarAlt}
              name={studentData.name}
              email={studentData.email}
              progress={studentData.progress}
            />
            <StudentEngagementCard
              percentage={studentData.engagementRate}
              changePercentage={studentData.engagementChange}
            />
          </div>

          {/* Middle Row: Stats Bar */}
          <StudentStatsBar
            currentModule={studentData.currentModule}
            lessonsCompleted={studentData.lessonsCompleted}
            grade={studentData.grade}
          />

          {/* Bottom Row: Learning Time and Badges */}
          <div className="flex gap-[24px] items-start">
            <LearningTimeChart
              dailyData={studentData.learningTime.daily}
              totalTime={studentData.learningTime.total}
            />
            <StudentBadgesGrid badges={studentData.badges} />
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  );
}

