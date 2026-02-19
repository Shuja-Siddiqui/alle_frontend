"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { MascotAvatar } from "../../../components/MascotAvatar";
import { useEffect, useState } from "react";
import { useLesson } from "../../../contexts/LessonContext";
import { useTTS } from "../../../hooks/useTTS";

export default function MissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLesson } = useLesson();
  const { playTTSWithSSML } = useTTS();

  // Get data from URL params
  const lessonId = searchParams.get("lessonId") || "lesson1";
  const missionSequence = parseInt(searchParams.get("missionSequence") || "1", 10);

  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Find mission data
  const mission = currentLesson?.missions?.find(
    (m) =>
      m.mission_sequence === missionSequence ||
      m.missionSequence === missionSequence
  );

  const missionType = mission?.mission_type || mission?.missionType || "Mission";
  const displayTitle =
    missionType === "Mission" ? `${missionType} ${missionSequence}` : missionType;

  // Handle introduction flow (missionSequence === 0)
  useEffect(() => {
    if (missionSequence === 0 && currentLesson && !hasPlayedIntro) {
      setHasPlayedIntro(true);
      setIsLoading(false);

      // Play introduction TTS if available
      const introTTS =
        currentLesson.introduction?.tts_missionControlVoice ||
        currentLesson.introduction?.tts_missionControlVoice_ssml;
      const introSSML =
        currentLesson.introduction?.tts_missionControlVoice_ssml ||
        introTTS;

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
  }, [missionSequence, currentLesson, hasPlayedIntro, lessonId, router, playTTSWithSSML]);

  // Detect first task type and route accordingly
  const handleContinue = () => {
    if (!mission || !currentLesson) return;

    // Check if mission has introduction task
    const hasIntroTask = mission.tasks?.introduction;
    if (hasIntroTask && !hasPlayedIntro) {
      setHasPlayedIntro(true);

      // Play mission introduction TTS
      const introTTS =
        hasIntroTask.tts_introduction ||
        hasIntroTask.tts_missionControlVoice ||
        hasIntroTask.text;
      const introSSML =
        hasIntroTask.tts_introduction_ssml ||
        hasIntroTask.tts_missionControlVoice_ssml;

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

  // Detect and route to first available task type
  const routeToNextTask = () => {
    if (!mission || !currentLesson) return;

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
      mastery_check: "mastery-check",
    };

    // Find first available task type with tasks
    for (const taskType of taskTypePriority) {
      const tasks = mission.tasks?.[taskType];
      if (tasks && Array.isArray(tasks) && tasks.length > 0) {
        const page = pageMapping[taskType];
        const firstTask = tasks[0];
        const taskId = firstTask.task_id || firstTask.id || "0";

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
      `/student/${page}?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=0&taskIndex=0`
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

