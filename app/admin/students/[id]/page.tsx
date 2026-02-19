"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BackButton } from "../../../../components/BackButton";
import { StudentInfoCard } from "../../../../components/StudentInfoCard";
import { StudentEngagementCard } from "../../../../components/StudentEngagementCard";
import { StudentStatsBar } from "../../../../components/StudentStatsBar";
import { LearningTimeChart } from "../../../../components/LearningTimeChart";
import { StudentBadgesGrid } from "../../../../components/StudentBadgesGrid";

export default function StudentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  function handleBackClick() {
    router.push("/admin/students");
  }

  // TODO: Fetch student data from API using params.id
  // Mock data for now
  const studentData = {
    id: params.id,
    name: "Maxwell Thompson",
    email: "thompson@gmail.com",
    avatarSrc: "/assets/icons/avatar_gallery/Avatar-2.png",
    avatarAlt: "Maxwell Thompson",
    progress: 75,
    engagementRate: 66,
    engagementChange: 4,
    currentModule: 3,
    lessonsCompleted: 23,
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
  };

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
  );
}

