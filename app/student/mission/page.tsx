"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { MascotAvatar } from "../../../components/MascotAvatar";
import { useEffect, useState } from "react";
import { useLesson } from "../../../contexts/LessonContext";
import { useLessonFlow } from "../../../contexts/LessonFlowContext";
import { useTTS } from "../../../hooks/useTTS";
import { api } from "../../../lib/api-client";

export default function MissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLesson } = useLesson();
  const { loadCheckpoint } = useLessonFlow();
  const { playTTSWithSSML } = useTTS();

  // Get data from URL params
  const lessonId = searchParams.get("lessonId") || "lesson1";
  const missionSequence = parseInt(searchParams.get("missionSequence") || "1", 10);
  const resumeTaskType = searchParams.get("taskType");
  const resumeTaskIndex = searchParams.get("taskIndex");
  const resumeTaskId = searchParams.get("taskId");

  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [isContinueDisabled, setIsContinueDisabled] = useState(false);

  // Find mission data
  const mission = currentLesson?.missions?.find(
    (m) =>
      (m as any).mission_sequence === missionSequence ||
      (m as any).missionSequence === missionSequence
  );

  const missionType =
    ((mission as any)?.mission_type || (mission as any)?.missionType || "Mission") as string;
  const displayTitle =
    missionType === "Mission" ? `${missionType} ${missionSequence}` : missionType;

  // Handle lesson-level introduction flow (missionSequence === 0)
  useEffect(() => {
    if (missionSequence === 0 && currentLesson && !hasPlayedIntro) {
      setHasPlayedIntro(true);
      setIsLoading(false);

      // Play introduction TTS if available
      const introSource = (currentLesson as any)?.introduction;
      const introTTS =
        introSource?.tts_missionControlVoice ||
        introSource?.tts_missionControlVoice_ssml;
      const introSSML =
        introSource?.tts_missionControlVoice_ssml || introTTS;

      if (introTTS) {
        // Play intro and auto-advance after completion
        playTTSWithSSML(introTTS, introSSML).then(() => {
          // Auto-advance to first mission
          setTimeout(() => {
            router.push(
              `/student/mission?lessonId=${lessonId}&missionSequence=1`
            );
          }, 500);
        });
      } else {
        // No intro TTS - auto-advance immediately
        setTimeout(() => {
          router.push(
            `/student/mission?lessonId=${lessonId}&missionSequence=1`
          );
        }, 500);
      }
    } else if (mission) {
      setIsLoading(false);
    }
  }, [missionSequence, currentLesson, hasPlayedIntro, lessonId, router, playTTSWithSSML, mission]);

  // Auto-play mission-level intro (mission.introduction) when landing on a mission page
  useEffect(() => {
    // Only for real missions (sequence > 0), non-wrap missions, and when mission intro exists
    if (!mission || missionSequence === 0 || hasPlayedIntro) return;

    const type =
      (mission as any).mission_type || (mission as any).missionType;
    if (type === "wrap") return;

    const intro = (mission as any).introduction;
    if (!intro) return;

    const introTTS =
      intro.tts_introduction ||
      intro.tts_missionControlVoice ||
      intro.tts_coach ||
      intro.text;
    const introSSML =
      intro.tts_introduction_ssml ||
      intro.tts_missionControlVoice_ssml ||
      intro.tts_coach_ssml;

    if (!introTTS && !introSSML) return;

    setHasPlayedIntro(true);
    setIsContinueDisabled(true);

    playTTSWithSSML(introTTS || "", introSSML).finally(() => {
      setIsContinueDisabled(false);
    });
  }, [mission, missionSequence, hasPlayedIntro, playTTSWithSSML]);

  // Auto-play wrap mission summary (last mission) using tasks.summary.tts_coach_ssml
  useEffect(() => {
    if (!mission || missionSequence === 0 || hasPlayedIntro) return;

    const type =
      (mission as any).mission_type || (mission as any).missionType;
    if (type !== "wrap") return;

    const summary = (mission as any).tasks?.summary as any;
    if (!summary) return;

    const summaryTTS = summary?.tts_coach || summary?.tts_coach_ssml;
    const summarySSML = summary?.tts_coach_ssml || summaryTTS;

    if (!summaryTTS && !summarySSML) return;

    setHasPlayedIntro(true);
    setIsContinueDisabled(true);

    playTTSWithSSML(summaryTTS || "", summarySSML).finally(() => {
      setIsContinueDisabled(false);
    });
  }, [mission, missionSequence, hasPlayedIntro, playTTSWithSSML]);

  // Load checkpoint when lesson is in context (for restore)
  useEffect(() => {
    if (currentLesson?.id === lessonId) {
      loadCheckpoint();
    }
  }, [currentLesson?.id, lessonId, loadCheckpoint]);

  const handleContinue = () => {
    if (!mission || !currentLesson || isContinueDisabled) return;
    setIsContinueDisabled(true);

    const missionTypeValue =
      (mission as any).mission_type || (mission as any).missionType;

    // Wrap mission: lesson is finished → mark lesson complete and go to dashboard
    if (missionTypeValue === "wrap") {
      (async () => {
        try {
          // Use authenticated API client so backend can update student_lessons, student_progress, and modules
          await api.post(`/lessons/${lessonId}/progress/complete`, {
            // masteryScore and badge are optional; backend derives XP and badges from checkpoint/lesson config
          });
        } catch (error) {
          console.error("[MissionPage] Error completing lesson on wrap:", error);
        } finally {
          router.push("/student/dashboard");
        }
      })();
      return;
    }

    // Check if mission has a mission-level introduction (directly on the mission object)
    const intro = (mission as any).introduction;
    if (intro && !hasPlayedIntro) {
      setHasPlayedIntro(true);

      // Play mission introduction TTS (mission-level intro, not inside tasks)
      const introTTS =
        intro.tts_introduction ||
        intro.tts_missionControlVoice ||
        intro.tts_coach ||
        intro.text;
      const introSSML =
        intro.tts_introduction_ssml ||
        intro.tts_missionControlVoice_ssml ||
        intro.tts_coach_ssml;

      if (introTTS) {
        playTTSWithSSML(introTTS, introSSML).then(() => {
          // After intro, detect first task type and route
          routeToNextTask();
        });
      } else {
        routeToNextTask();
      }
      return;
    }

    routeToNextTask();
  };

  // Detect and route to task (resume from checkpoint or first available)
  const routeToNextTask = () => {
    if (!mission || !currentLesson) return;

    // Handle wrap mission type (summary only, no tasks)
    if (
      (mission as any).mission_type === "wrap" ||
      (mission as any).missionType === "wrap"
    ) {
      const summary = (mission as any).tasks?.summary as any;
      if (summary) {
        // Play summary TTS and show wrap-up screen
        const summaryTTS = summary.tts_coach_ssml || summary.tts_coach;
        if (summaryTTS) {
          playTTSWithSSML(summaryTTS).then(() => {
            // After TTS, could navigate to dashboard or next lesson
            // For now, just stay on mission page showing summary
          });
        }
      }
      return; // Don't route to task page for wrap missions
    }

    const taskTypePriority = [
      "alphabet_practice",
      "blending_practice",
      "word_practice",
      "sentence_practice",
      "mastery_check",
    ];

    const pageMapping: Record<string, string> = {
      alphabet_practice: "lesson",
      blending_practice: "blending",
      word_practice: "word",
      sentence_practice: "sentence",
      mastery_check: "word", // Mastery check uses word page (testing words)
    };

    // Resume from checkpoint: route to saved taskType and taskIndex
    if (resumeTaskType && pageMapping[resumeTaskType]) {
      const tasks = mission.tasks?.[resumeTaskType];
      if (tasks && Array.isArray(tasks) && tasks.length > 0) {
        const page = pageMapping[resumeTaskType];
        // Prefer taskId to derive index (in case checkpoint has wrong taskIndex)
        let safeIndex = resumeTaskIndex ? parseInt(resumeTaskIndex, 10) : 0;
        let task = tasks[safeIndex];
        if (resumeTaskId) {
          const byId = tasks.findIndex(
            (t: any) => String(t?.task_id ?? t?.id) === String(resumeTaskId)
          );
          if (byId >= 0) {
            safeIndex = byId;
            task = tasks[safeIndex];
          }
        }
        safeIndex = Math.min(Math.max(0, safeIndex), tasks.length - 1);
        task = task || tasks[safeIndex];
        const taskId = resumeTaskId || (task as any)?.task_id || (task as any)?.id || String(safeIndex + 1);

        router.push(
          `/student/${page}?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${taskId}&taskIndex=${safeIndex}`
        );
        return;
      }
    }

    // Find first available task type with tasks
    for (const taskType of taskTypePriority) {
      const tasks = mission.tasks?.[taskType];
      if (tasks && Array.isArray(tasks) && tasks.length > 0) {
        const page = pageMapping[taskType];
        const firstTask = tasks[0];
        const taskId = firstTask.task_id || firstTask.id || "1";

        router.push(
          `/student/${page}?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${taskId}&taskIndex=0`
        );
        return;
      }
    }

    // Fallback to first task type found
    const type = Object.keys(pageMapping)[0];
    const page = pageMapping[type];
    router.push(
      `/student/${page}?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=1&taskIndex=0`
    );
  };

  if (isLoading || missionSequence === 0) {
    return (
      <div
        className="relative flex flex-col items-center justify-start font-sans"
        style={{
          width: "1440px",
          height: "calc(100vh - 40px - 60.864px)",
          padding: "0 32px 32px 32px",
          paddingTop: "249px",
        }}
      >
        {/* Loading or playing intro */}
        <h1
          className="text-center"
          style={{
            color: "#FFF",
            textAlign: "center",
            textShadow: "0 0 0 #E451FE",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "84px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "64px",
            letterSpacing: "-0.924px",
            textTransform: "uppercase",
            marginBottom: "40px",
        }}
        >
          {missionSequence === 0 ? "WELCOME" : "LOADING"}
        </h1>

        <div
          className="absolute"
          style={{
            left: "44px",
            bottom: "32px",
          }}
        >
          <MascotAvatar
            imageSrc="/assets/icons/mascots/mascot.png"
            alt="Mascot"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center justify-start font-sans"
      style={{
        width: "1440px",
        height: "calc(100vh - 40px - 60.864px)",
        padding: "0 32px 32px 32px",
        paddingTop: "249px",
      }}
    >
      {/* Mission Title */}
      <h1
        className="text-center"
        style={{
          color: "#FFF",
          textAlign: "center",
          textShadow: "0 0 0 #E451FE",
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "84px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "64px",
          letterSpacing: "-0.924px",
          textTransform: "uppercase",
          marginBottom: "40px",
        }}
      >
        {displayTitle}
      </h1>

      {/* Continue Button */}
      <PrimaryButton
        text="Continue"
        iconSrc="/assets/icons/others/play.png"
        iconAlt="Play"
        size="medium"
        variant="filled"
        onClick={handleContinue}
        disabled={isContinueDisabled}
      />

      {/* Mascot Avatar - Left Bottom */}
      <div
        className="absolute"
        style={{
          left: "44px",
          bottom: "32px",
        }}
      >
        <MascotAvatar
          imageSrc="/assets/icons/mascots/mascot.png"
          alt="Mascot"
        />
      </div>
    </div>
  );
}

