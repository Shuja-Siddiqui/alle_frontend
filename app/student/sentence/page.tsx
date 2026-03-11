"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MascotAvatar } from "../../../components/MascotAvatar";
import { StudentMascotAvatar } from "../../../components/StudentMascotAvatar";
import { StatusBox } from "../lesson/components/StatusBox";
import { MicButton } from "../lesson/components/MicButton";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { LevelOverlay } from "../components/LevelOverlay";
import { useLevelOverlay } from "../contexts/LevelOverlayContext";
import { useTTS } from "../../../hooks/useTTS";
import { useSpeechAssessment } from "../../../hooks/useSpeechAssessment";
import { useAuth } from "../../../contexts/AuthContext";
import { useLesson } from "../../../contexts/LessonContext";
import { useUI } from "../../../contexts/UIContext";
import { api } from "../../../lib/api-client";
import { getNextLessonStep, resolveTaskIndex } from "../../../lib/lesson-navigation";
import Image from "next/image";

type StatusVariant = "initial" | "default" | "success" | "error";

export default function SentencePage() {
  const { isOverlayOpen, setOverlayOpen } = useLevelOverlay();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { currentLesson } = useLesson();
  const { setBackgroundMode } = useUI();
  const { playTTSWithSSML, isPlaying, stopTTS } = useTTS();
  const { startRecording, stopRecording } = useSpeechAssessment();

  // URL parameters. Order is always ARRAY ORDER (index 0,1,2,...); task_id is for identification only.
  const lessonId = searchParams.get("lessonId") || "lesson1";
  const missionSequence = searchParams.get("missionSequence") || "1";
  const taskId = searchParams.get("taskId") || "1";
  const taskIndexParam = searchParams.get("taskIndex");

  // Keep platform background in sync with current mission's mission_type (mission_mode → mission_mode.png)
  useEffect(() => {
    if (!currentLesson?.missions || !missionSequence) return;
    const missionSeqNum = parseInt(missionSequence, 10);
    const mission = currentLesson.missions.find(
      (m: any) => (m.mission_sequence ?? m.missionSequence) === missionSeqNum
    );
    const missionType = (mission as any)?.mission_type ?? (mission as any)?.missionType;
    setBackgroundMode(missionType === "mission_mode" ? "mission_mode" : "default");
  }, [currentLesson?.missions, missionSequence, setBackgroundMode]);

  // State management
  const [taskData, setTaskData] = useState<any>(null);
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("initial");
  const [currentRetry, setCurrentRetry] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Stop any ongoing TTS when leaving / refreshing this page
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, [stopTTS]);

  const isSuccess = statusVariant === "success";
  const sentence = taskData?.word || taskData?.expectedResponse?.value || "";

  // Helper: Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.toString().split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Fetch task and auto-play instruction TTS
  useEffect(() => {
    const fetchTaskAndPlayTTS = async () => {
      try {
        const queryParams = new URLSearchParams({
          missionSequence: String(missionSequence),
          taskId: String(taskId),
        }).toString();
        
        const response = await api.get<any>(
          `/lessons/${lessonId}/progress/task?${queryParams}`
        );

        const payload = response.data?.data ?? response.data?.task ?? response.data;
        if (payload) {
          setTaskData(payload);

          const instruction =
            payload.tts?.text ??
            payload.instruction ??
            (payload.expectedResponse?.value ? `Pronounce: ${payload.expectedResponse.value}` : "");
          if (instruction) await playTTSWithSSML(instruction);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTaskAndPlayTTS();
  }, [lessonId, missionSequence, taskId, playTTSWithSSML]);

  // Handle mic click: record, assess, show feedback
  const handleMicClick = async () => {
    // Prevent starting a new recording while agent TTS is playing
    if (isProcessing || (!isMicActive && isPlaying)) return;

    const newMicState = !isMicActive;
    setIsMicActive(newMicState);

    if (newMicState) {
      setStatusVariant("default");
      // Start recording when mic turns on
      try {
        await startRecording();
      } catch (error) {
        console.error("Failed to start recording:", error);
        setIsMicActive(false);
        setStatusVariant("initial");
      }
      return;
    }

    // Stopping the mic: run mock/real assessment
    {
      // MOCK MODE: Skip recording and API calls, simulate success (same pattern as other pages)
      const mockMode = typeof window !== "undefined" && localStorage.getItem("MOCK_MODE") === "true";
      if (mockMode) {
        console.log("[MOCK MODE] Sentence page: skipping recording and assessment, simulating success");
        setIsProcessing(true);
        setStatusVariant("success");
        setFeedbackData({
          feedbackType: "exactMatch",
          feedbackText: "Great job!",
        });
        setShowingFeedback(true);
        setIsMicActive(false);
        setIsProcessing(false);
        // User will click Continue to complete and move to next task
        return;
      }

      setIsProcessing(true);
      try {
        // Stop recording and get audio blob
        const audioBlob = await stopRecording();

        if (audioBlob && audioBlob.size > 0) {
          // Send to backend for assessment
          const response = await api.post<any>(
            `/lessons/${lessonId}/progress/response`,
            {
              missionSequence: parseInt(missionSequence!),
              taskId,
              audioData: await blobToBase64(audioBlob),
              mimeType: "audio/webm",
            }
          );

          const assessment = response.data?.data ?? response.data;
          const isCorrect =
            assessment?.feedbackType === "exactMatch" || assessment?.correctAnswer === true;

          if (isCorrect) {
            setStatusVariant("success");
            setFeedbackData({
              feedbackType: "exactMatch",
              feedbackText: assessment?.feedback?.text,
            });
            setShowingFeedback(false);
            // Use lesson-config feedback from backend (text + ssml), no generic defaults
            await playTTSWithSSML(
              assessment?.feedback?.text || "",
              assessment?.feedback?.ssml
            );
            // User clicks Continue to complete task and go next (same as word/lesson pages)
          } else {
            // Incorrect
            const isMaxRetry = currentRetry >= (taskData?.retryLimit || 3) - 1;

            if (isMaxRetry) {
              setStatusVariant("error");
              setCurrentRetry(0);
            } else {
              setStatusVariant("error");
              setCurrentRetry(currentRetry + 1);
            }

            setFeedbackData({
              feedbackType: "mismatchedAnswer",
              feedbackText: assessment.feedback?.text,
            });
            setShowingFeedback(false);
            await playTTSWithSSML(
              assessment?.feedback?.text || "",
              assessment?.feedback?.ssml
            );
          }
        }
      } catch (error) {
        console.error("Error recording/assessing:", error);
        setStatusVariant("error");
        setFeedbackData({
          feedbackType: "mismatchedAnswer",
          feedbackText: "Error recording audio",
        });
        setShowingFeedback(false);
      } finally {
        setIsMicActive(false);
        setIsProcessing(false);
      }
    }
  };

  // Handle continue after success: next sentence or next task type or next mission
  const handleContinue = async () => {
    if (!lessonId || !missionSequence || !taskId) return;
    try {
      setIsProcessing(true);
      await api.post(`/lessons/${lessonId}/progress/task/complete`, {
        missionSequence: parseInt(missionSequence),
        taskId,
      });
      const missionSeqNum = parseInt(missionSequence);
      const mission = currentLesson?.missions?.find(
        (m: any) => (m.mission_sequence ?? m.missionSequence) === missionSeqNum
      );
      const sentenceTasks = mission?.tasks?.sentence_practice as Record<string, unknown>[] | undefined;
      const sentenceTasksLength = Array.isArray(sentenceTasks) ? sentenceTasks.length : 0;
      const effectiveTaskIndex =
        sentenceTasksLength > 0
          ? resolveTaskIndex(sentenceTasks, taskId, taskIndexParam)
          : 0;
      const nextIndex = effectiveTaskIndex + 1;

      if (sentenceTasksLength > 0 && nextIndex >= sentenceTasksLength) {
        const nextStep = getNextLessonStep(
          currentLesson?.missions,
          missionSeqNum,
          "sentence_practice",
          effectiveTaskIndex,
          sentenceTasksLength
        );
        if (nextStep?.type === "task_page") {
          router.push(
            `/student/${nextStep.page}?lessonId=${lessonId}&missionSequence=${nextStep.missionSequence}&taskId=${nextStep.taskId}&taskIndex=${nextStep.taskIndex}`
          );
          return;
        }
        if (nextStep?.type === "mission_page") {
          router.push(
            `/student/mission?lessonId=${lessonId}&missionSequence=${nextStep.missionSequence}`
          );
          return;
        }
      }

      if (sentenceTasksLength > 0 && nextIndex < sentenceTasksLength) {
        const nextTask = (sentenceTasks as any[])[nextIndex];
        const nextTaskId = nextTask?.task_id ?? nextTask?.id ?? String(nextIndex + 1);
        router.push(
          `/student/sentence?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${nextTaskId}&taskIndex=${nextIndex}`
        );
        return;
      }

      setOverlayOpen(true);
    } catch (error) {
      console.error("Error continuing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle refresh to retry
  const handleRefresh = () => {
    setStatusVariant("initial");
    setShowingFeedback(false);
    setFeedbackData(null);
    setIsMicActive(false);
    setCurrentRetry(0);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center font-sans"
      style={{
        width: "1440px",
        height: "calc(100vh - 40px - 60.864px)",
        padding: "0 32px 32px 32px",
      }}
    >
      {/* Center Content */}
      <div className="flex flex-col items-center justify-center gap-8">
        {/* StatusBox — renders as SentenceStatusBox (sentence with spaces, no image) */}
        {sentence && (
          <StatusBox
            text={sentence}
            variant={statusVariant}
            letterHeight={50}
            letterGap={1}
          />
        )}

        {/* Feedback bubble removed – feedback is delivered via lesson-config TTS only */}

        {/* MicButton or Continue Button based on variant */}
        <div style={{ marginTop: "32px" }}>
          {isSuccess ? (
            <div className="flex items-center gap-8">
              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                style={{
                  display: "flex",
                  width: "70px",
                  height: "70px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "76.829px",
                  border: "2px solid #F529F9",
                  boxShadow: "0 0 0 1.602px #E451FE",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <Image
                  src="/assets/icons/others/refresh.svg"
                  alt="Refresh"
                  width={43.82}
                  height={43.82}
                />
              </button>

              {/* Continue Button */}
              <PrimaryButton
                text="Continue"
                size="medium"
                variant="filled"
                onClick={handleContinue}
                disabled={isProcessing}
              />
            </div>
          ) : (
            <MicButton
              icon={isMicActive ? "pause" : "mic"}
              size={100}
              onClick={handleMicClick}
              disabled={isProcessing || isPlaying}
            />
          )}
        </div>

        {/* Retry counter */}
        {currentRetry > 0 && statusVariant !== "success" && (
          <p style={{ marginTop: "16px", color: "#FFF", opacity: 0.7, fontSize: "14px" }}>
            Attempt {currentRetry + 1} of {taskData?.retryLimit || 3}
          </p>
        )}
      </div>

      {/* Mascot Avatar — Left Bottom — Hidden when overlay is open */}
      {!isOverlayOpen && (
        <div
          className="absolute"
          style={{
            left: "32px",
            bottom: "32px",
          }}
        >
          <StudentMascotAvatar />
        </div>
      )}

      {/* Level Overlay */}
      <LevelOverlay
        isOpen={isOverlayOpen}
        onClose={() => setOverlayOpen(false)}
        maxXp={100}
        lessonId={lessonId || ""}
        missionSequence={parseInt(missionSequence || "1")}
      />
    </div>
  );
}

