"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LevelMap } from "../components/LevelMap";
import { StarRing } from "../components/StarRing";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useAuth } from "../../../contexts/AuthContext";
import { useUI } from "../../../contexts/UIContext";
import { useLesson } from "../../../contexts/LessonContext";
import { useLessonFlow } from "../../../contexts/LessonFlowContext";
import { useApiPost } from "../../../hooks/useApi";
import { api } from "../../../lib/api-client";
import { BadgeSkeleton } from "../../../components/Skeletons/BadgeSkeleton";
import Image from "next/image";

interface ResumePoint {
  lessonId: string;
  missionSequence: number;
  taskId: string;
  taskType?: string | null;
  taskIndex?: number;
  lessonTitle?: string;
  isNew?: boolean;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, allBadges: badgeCatalog } = useAuth();
  const { showError, showLoader, hideLoader } = useUI();
  const { fetchAndSetLesson, currentLesson } = useLesson();
  const { checkpoint } = useLessonFlow();
  const { post } = useApiPost();
  
  const [resumePoint, setResumePoint] = useState<ResumePoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false);
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  
  const handleLevelClick = (level: number) => {
    // TODO: Navigate to level or show level details
    console.log(`Clicked level ${level}`);
  };

  // TODO: Fetch actual student data from API
  const studentXp = user?.xp || 150; // Example: student has 150 XP
  const totalLevels = 44;
  const xpPerLevel = 10;
  const totalXpNeeded = totalLevels * xpPerLevel; // 440 XP total

  // Reset per user (e.g. after logout/login as a different student)
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [user?.id]);

  // Fetch student's next lesson and resume point
  useEffect(() => {
    // Only run if user is a student
    if (!user || user.role !== "student") {
      return;
    }

    // If we already have a lesson and checkpoint in context, derive resume point from there
    if (currentLesson && checkpoint) {
      const missionSequence = checkpoint.missionSequence ?? 1;
      const taskType = checkpoint.activeTaskType ?? undefined;
      const taskIndex = checkpoint.taskIndexInBatch ?? 0;
      const taskId =
        checkpoint.nextTaskId ||
        checkpoint.lastCompletedTaskId ||
        "1";

      const resume: ResumePoint = {
        lessonId: currentLesson.id,
        missionSequence,
        taskId,
        taskType: taskType ?? undefined,
        taskIndex,
        lessonTitle: currentLesson.title,
        isNew: false,
      };

      console.log("[Dashboard] Using lesson/checkpoint from context", {
        hasLesson: !!currentLesson,
        hasCheckpoint: !!checkpoint,
        lessonId: resume.lessonId,
        missionSequence: resume.missionSequence,
        taskId: resume.taskId,
        taskType: resume.taskType,
        taskIndex: resume.taskIndex,
      });

      setResumePoint(resume);
      setIsLoading(false);
      return;
    }

    // Otherwise fall back to backend to compute resume point
    let isMounted = true;

    const fetchNextLesson = async () => {
      try {
        // Only call /next once per user/session
        if (hasFetchedRef.current) {
          console.log("[Dashboard] /next already called earlier in this session; skipping");
          return;
        }

        hasFetchedRef.current = true;

        setIsLoading(true);
        console.log("[Dashboard] No lesson/checkpoint in context, calling /lessons/progress/next", {
          hasLesson: !!currentLesson,
          hasCheckpoint: !!checkpoint,
        });

        // Get next lesson (checks in-progress first, then finds next by order)
        const response = await api.get<{ success: boolean; data: any }>(
          "/lessons/progress/next"
        );

        if (!isMounted) return; // Component unmounted, don't update state

        const nextLessonData = response.data || response;

        // Backend can explicitly signal completion with { allCompleted: true }
        if (nextLessonData?.allCompleted) {
          console.warn("[Dashboard] /next reports all lessons completed (200)");
          setAllLessonsCompleted(true);
          setResumePoint(null);
          setIsLoading(false);
          hasFetchedRef.current = true;
          return;
        }

        if (!nextLessonData || !nextLessonData.lessonId) {
          console.warn("[Dashboard] No next lesson found - all lessons may be completed");
          setAllLessonsCompleted(true);
          setResumePoint(null);
          setIsLoading(false);
          hasFetchedRef.current = true;
          return;
        }

        const {
          lessonId,
          lessonTitle,
          missionSequence,
          taskId,
          taskType,
          taskIndex,
          isNew,
        } = nextLessonData;

        // Fetch full lesson data and save to context
        try {
          await fetchAndSetLesson(lessonId);
          if (!isMounted) return;
        } catch (lessonError: any) {
          console.error("[Dashboard] Error fetching lesson", lessonError);
          if (isMounted) {
            showError("Failed to load lesson data");
          }
        }

        if (!isMounted) return;

        // Set resume point
        const resume: ResumePoint = {
          lessonId: lessonId,
          missionSequence: missionSequence || 1,
          taskId: taskId || "1",
          taskType: taskType ?? undefined,
          taskIndex: taskIndex ?? 0,
          lessonTitle: lessonTitle,
          isNew: isNew ?? true,
        };

        setResumePoint(resume);
        hasFetchedRef.current = true;
      } catch (error: any) {
        if (!isMounted) return;
        console.error("[Dashboard] Error fetching next lesson", error);
        const message =
          (error as any)?.errorMessage ||
          (error as any)?.message ||
          String(error);
        showError(message || "Failed to load next lesson");
        setResumePoint(null);
        hasFetchedRef.current = true;
      } finally {
        if (isMounted) {
          setIsLoading(false);
          hideLoader();
        }
      }
    };

    fetchNextLesson();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user?.id, currentLesson, checkpoint]); // depend on context so we can prefer it when available

  const handleContinueMission = async () => {
    if (!resumePoint) {
      showError('No lesson available. Please try refreshing the page.');
      return;
    }

    try {
      console.log("[Dashboard] Continue button clicked.", {
        resumePoint,
        checkpoint,
      });
      
      // Ensure lesson is in context
      if (!currentLesson || currentLesson.id !== resumePoint.lessonId) {
        console.log(
          "[Dashboard] Lesson not in context, fetching before navigation. lessonId:",
          resumePoint.lessonId
        );
        await fetchAndSetLesson(resumePoint.lessonId);
      }
      
      // Navigate to mission page with checkpoint params for restore
      const effectiveTaskType =
        checkpoint?.activeTaskType ?? resumePoint.taskType ?? undefined;
      const effectiveTaskIndex =
        checkpoint?.taskIndexInBatch ?? resumePoint.taskIndex;
      const effectiveTaskId =
        checkpoint?.nextTaskId ||
        checkpoint?.lastCompletedTaskId ||
        resumePoint.taskId;

      const params = new URLSearchParams({
        lessonId: resumePoint.lessonId,
        missionSequence: String(resumePoint.missionSequence),
      });

      if (effectiveTaskType) params.set("taskType", effectiveTaskType);
      if (effectiveTaskIndex !== undefined)
        params.set("taskIndex", String(effectiveTaskIndex));
      if (effectiveTaskId) params.set("taskId", effectiveTaskId);
      router.push(`/student/mission?${params.toString()}`);
    } catch (error: any) {
      console.error("[Dashboard] Error starting lesson:", error);
      showError('Failed to start lesson. Please try again.');
    }
  };

  return (
    <div
      className="flex flex-col font-sans"
      style={{
        width: "1440px",
        padding: "0 32px 32px 32px", // No top padding, 32px on other sides
      }}
    >
        {/* Heading */}
        <h1
          className="w-full"
          style={{
            color: "#FFF",
            textShadow: "0 0 0 #E451FE",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "60px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "64px",
            letterSpacing: "-0.66px",
            textTransform: "uppercase",
            margin: "62px 0px 0px 0px",
          }}
        >
          Your galaxy progress
        </h1>

        {/* Main Content */}
        <main className="flex flex-1 flex-row items-start justify-between" style={{ marginTop: "51px", width: "100%" }}>
          {/* Level Map Container - Left Side */}
          <div className="relative w-full h-full">
            <LevelMap
              totalLevels={totalLevels}
              xpPerLevel={xpPerLevel}
              currentXp={studentXp}
              onLevelClick={handleLevelClick}
              activeLessonId={
                resumePoint
                  ? (() => {
                      const raw = String(resumePoint.lessonId);
                      const num = raw.replace(/\D/g, "") || raw;
                      return `lesson${num.padStart(2, "0")}`;
                    })()
                  : undefined
              }
              completedLessonIds={["lesson01", "lesson02", "lesson03", "lesson04", "lesson05"]}
            />
          </div>

          {/* Star Ring - Right Side */}
          <div className="relative flex flex-col items-center justify-center">
            <StarRing />

            {/* Box below Star Ring - full unit (button + box) gets drop shadow on hover */}
            <div className="group/continue relative w-[454px]" style={{ marginTop: "63.67px" }}>
              <div
                className={`relative transition-shadow ${
                  !(isLoading || !resumePoint)
                    ? "shadow-none group-hover/continue:shadow-[0px_0px_18.7px_1.6px_#ff00c8]"
                    : ""
                }`}
                style={{
                  width: "454px",
                  height: "136px",
                  borderRadius: "10.244px 10.244px 51.22px 51.22px",
                  border: "2px solid #E451FE",
                  background: "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
                }}
              >
              {/* PrimaryButton - half inside, half outside */}
              <div
                className="absolute"
                style={{
                  top: "-35px", // Half of button height (70px / 2) to position it half outside
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <PrimaryButton
                  text={
                    isLoading
                      ? "Loading..."
                      : allLessonsCompleted
                      ? "All completed"
                      : resumePoint
                      ? "Continue your mission"
                      : "Start learning"
                  }
                  iconSrc="/assets/icons/others/play.png"
                  iconAlt="Play"
                  size="default"
                  variant="filled"
                  onClick={handleContinueMission}
                  disabled={isLoading || (!resumePoint && !allLessonsCompleted)}
                  disabledBorderColor="#7076AD"
                  style={{
                    width: "454px",
                    backgroundImage:
                      "linear-gradient(88.47deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%), radial-gradient(71.43% 3119.6% at 20.08% -0.37%, rgba(255, 18, 239, 0.7) 0%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />
              </div>

              {/* Content inside the box - only show lesson/mission text for new lessons, not when resuming */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  marginTop: "51px",
                  padding: "0 20px",
                }}
              >
                {resumePoint && !isLoading && resumePoint.isNew && (
                  <>
                    <p
                      className="text-center"
                      style={{
                        color: "#75FF1A",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      {resumePoint.lessonTitle || `Lesson ${resumePoint.lessonId}`}
                    </p>
                    <p
                      className="text-center"
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                        fontSize: "14px",
                        opacity: 0.7,
                      }}
                    >
                      Mission {resumePoint.missionSequence}
                    </p>
                  </>
                )}
              </div>

              {/* Badges - at the bottom of the box */}
              <div className="absolute flex justify-center" style={{ bottom: "13px", left: 0, right: 0, gap: "20px" }}>
                {(() => {
                  const userBadges = user?.badges ?? [];
                  const isBadgesLoading = isLoading;

                  if (isBadgesLoading) {
                    return Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        <BadgeSkeleton />
                      </div>
                    ));
                  }

                  const unlockedIds = new Set((userBadges ?? []).map((b: any) => b.id));
                  const baseBadgeDefs = (badgeCatalog.length > 0 ? badgeCatalog : userBadges) as any[];
                  const sortedBadgeDefs = [...baseBadgeDefs].sort((a, b) => {
                    const aUnlocked = unlockedIds.has(a.id);
                    const bUnlocked = unlockedIds.has(b.id);
                    if (aUnlocked === bUnlocked) return 0;
                    return aUnlocked ? -1 : 1; // unlocked first
                  });

                  // Only keep badges that actually have an icon from the API
                  const filteredBadgeDefs = sortedBadgeDefs.filter(
                    (def: any) => def && (def.iconActive || def.iconInactive)
                  );

                  return Array.from({ length: 4 }).map((_, index) => {
                    const def = filteredBadgeDefs[index];
                    if (!def) {
                      // Empty slot (no fallback image)
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxSizing: "border-box",
                            width: "80px",
                            height: "80px",
                          }}
                        />
                      );
                    }

                    const isUnlocked = unlockedIds.has(def.id);
                    const iconSrc = isUnlocked
                      ? def.iconActive || def.iconInactive
                      : def.iconInactive || def.iconActive;
                    const altText = def.title || (isUnlocked ? "Unlocked badge" : "Locked badge");

                    return (
                      <div
                        key={def.id ?? index}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        {iconSrc && (
                          <img
                            src={iconSrc}
                            alt={altText}
                            style={{ width: "auto", height: "auto" }}
                          />
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}

