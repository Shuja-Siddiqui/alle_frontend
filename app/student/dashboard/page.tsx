"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LevelMap } from "../components/LevelMap";
import { StarRing } from "../components/StarRing";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useAuth } from "../../../contexts/AuthContext";
import { useUI } from "../../../contexts/UIContext";
import { useLesson } from "../../../contexts/LessonContext";
import { useApiPost } from "../../../hooks/useApi";
import { api } from "../../../lib/api-client";
import Image from "next/image";

interface ResumePoint {
  lessonId: string;
  missionSequence: number;
  taskId: string;
  lessonTitle?: string;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showError, showLoader, hideLoader } = useUI();
  const { fetchAndSetLesson, currentLesson } = useLesson();
  const { post } = useApiPost();
  
  const [resumePoint, setResumePoint] = useState<ResumePoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false);
  
  const handleLevelClick = (level: number) => {
    // TODO: Navigate to level or show level details
    console.log(`Clicked level ${level}`);
  };

  // TODO: Fetch actual student data from API
  const studentXp = user?.xp || 150; // Example: student has 150 XP
  const totalLevels = 44;
  const xpPerLevel = 10;
  const totalXpNeeded = totalLevels * xpPerLevel; // 440 XP total

  // Reset fetch flag when user changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [user?.id]);

  // Fetch student's next lesson and resume point
  useEffect(() => {
    // Only run if user is a student and we haven't fetched yet
    if (!user || user.role !== 'student' || hasFetchedRef.current) {
      return;
    }

    let isMounted = true;

    const fetchNextLesson = async () => {
      try {
        setIsLoading(true);
        console.log('🎮 Fetching next lesson for student...');

        // Get next lesson (checks in-progress first, then finds next by order)
        const response = await api.get<{ success: boolean; data: any }>('/lessons/progress/next');
        
        if (!isMounted) return; // Component unmounted, don't update state
        
        const nextLessonData = response.data || response;
        console.log('✅ Next lesson response:', nextLessonData);
        
        if (!nextLessonData || !nextLessonData.lessonId) {
          console.warn('⚠️ No next lesson found - all lessons may be completed');
          showError('All lessons completed!');
          setResumePoint(null);
          return;
        }

        const { lessonId, lessonTitle, missionSequence, taskId, isNew } = nextLessonData;
        
        // Fetch full lesson data and save to context
        try {
          console.log(`📚 Fetching lesson ${lessonId} and saving to context...`);
          await fetchAndSetLesson(lessonId);
          if (!isMounted) return;
          console.log('✅ Lesson saved to context');
        } catch (lessonError: any) {
          console.error('❌ Error fetching lesson:', lessonError);
          if (isMounted) {
            showError('Failed to load lesson data');
          }
        }

        if (!isMounted) return;

        // Set resume point
        setResumePoint({
          lessonId: lessonId,
          missionSequence: missionSequence || 1,
          taskId: taskId || '1',
          lessonTitle: lessonTitle,
        });

        if (isNew) {
          console.log('✨ New lesson initialized');
        }
        
        // Mark as fetched to prevent re-running
        hasFetchedRef.current = true;
      } catch (error: any) {
        if (!isMounted) return;
        console.error('❌ Error fetching next lesson:', error);
        showError(error.message || 'Failed to load next lesson');
        setResumePoint(null);
        hasFetchedRef.current = true; // Mark as fetched even on error to prevent infinite retries
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
  }, [user?.id]); // Only depend on user.id - ref doesn't need to be in dependencies

  const handleContinueMission = async () => {
    if (!resumePoint) {
      showError('No lesson available. Please try refreshing the page.');
      return;
    }

    try {
      console.log('🚀 Starting/continuing lesson:', resumePoint);
      
      // Ensure lesson is in context
      if (!currentLesson || currentLesson.id !== resumePoint.lessonId) {
        console.log('📚 Lesson not in context, fetching...');
        await fetchAndSetLesson(resumePoint.lessonId);
      }
      
      // Navigate to mission page
      router.push(`/student/mission?lessonId=${resumePoint.lessonId}&missionSequence=${resumePoint.missionSequence}`);
    } catch (error: any) {
      console.error('❌ Error starting lesson:', error);
      showError('Failed to start lesson. Please try again.');
    }
  };

  return (
    <div
      className="flex flex-col font-sans"
      style={{
        width: "1440px",
        height: "calc(100vh - 40px - 60.864px)",
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
          <div className="relative">
            <LevelMap
              totalLevels={totalLevels}
              xpPerLevel={xpPerLevel}
              currentXp={studentXp}
              width={846}
              height={619}
              onLevelClick={handleLevelClick}
            />
          </div>

          {/* Star Ring - Right Side */}
          <div className="relative flex flex-col items-center justify-center">
            <StarRing />

            {/* Box below Star Ring */}
            <div
              className="relative"
              style={{
                marginTop: "63.67px",
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
                  text={isLoading ? "Loading..." : resumePoint ? "Continue your mission" : "Start learning"}
                  iconSrc="/assets/icons/others/play.png"
                  iconAlt="Play"
                  size="default"
                  variant="filled"
                  onClick={handleContinueMission}
                  disabled={isLoading || !resumePoint}
                  style={{
                    width: "454px",
                    backgroundImage:
                      "linear-gradient(88.47deg, #F529F9 1.65%, #0756FF 57.2%, #FF21C8 89.22%), radial-gradient(71.43% 3119.6% at 20.08% -0.37%, rgba(255, 18, 239, 0.7) 0%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />
              </div>

              {/* Content inside the box */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  marginTop: "51px",
                  padding: "0 20px",
                }}
              >
                {resumePoint && !isLoading && (
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
                <div
                  style={{
                    display: "flex",

                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src="/assets/icons/badges/badge1.svg"
                    alt="Badge 1"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",

                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src="/assets/icons/badges/badge2.svg"
                    alt="Badge 2"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src="/assets/icons/badges/badge3.svg"
                    alt="Badge 3"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",

                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src="/assets/icons/badges/badge16.svg"
                    alt="Badge 4"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}

