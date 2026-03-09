"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { MascotAvatar } from "../../../components/MascotAvatar";
import { StudentMascotAvatar } from "../../../components/StudentMascotAvatar";
import { StatusBox } from "./components/StatusBox";
import { VisualBox } from "./components/VisualBox";
import { MicButton } from "./components/MicButton";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { LevelOverlay } from "../components/LevelOverlay";
import { useLevelOverlay } from "../contexts/LevelOverlayContext";
import { useLessonPageData } from "../hooks/useLessonData";
import { useTTS } from "../../../hooks/useTTS";
import { useSpeechAssessment } from "../../../hooks/useSpeechAssessment";
import { AlphabetDisplay } from "../../../components/AlphabetDisplay";
import { useAuth } from "../../../contexts/AuthContext";
import { useLesson } from "../../../contexts/LessonContext";
import { api } from "../../../lib/api-client";
import { getNextLessonStep, resolveTaskIndex } from "../../../lib/lesson-navigation";
import Image from "next/image";

type StatusVariant = "initial" | "default" | "success" | "error";

interface TaskData {
  taskType?: string; // 'alphabet_practice', 'blending_practice', etc.
  tts: {
    text: string;
    ssml: string;
  };
  visual: Array<{ word: string; image: string; mouth?: string }>;
  feedback: any;
  retryLimit: number;
  currentRetries: number;
  remainingRetries: number;
  expectedResponse?: any;
  letter?: string; // Letter for alphabet_practice tasks (e.g., "S", "A")
}

export default function LessonPage() {
  const { isOverlayOpen, setOverlayOpen } = useLevelOverlay();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { currentLesson } = useLesson();
  const { playTTSWithSSML, stopTTS } = useTTS();
  const { startRecording, stopRecording } = useSpeechAssessment();

  // Helper to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix if present
        const base64 = base64String.includes(',')
          ? base64String.split(',')[1]
          : base64String;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // State
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("initial");
  const [isMicActive, setIsMicActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [currentRetry, setCurrentRetry] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0); // Index in alphabet_practice array

  // Get data from URL params
  const lessonId = searchParams.get("lessonId");
  const missionSequence = searchParams.get("missionSequence");
  const taskId = searchParams.get("taskId");
  const taskIndexParam = searchParams.get("taskIndex");

  // Refs
  const processedRef = useRef(false);
  const batchStartCalledRef = useRef(false);
  const taskStartTimeRef = useRef<number | null>(null);

  // Helper: play TTS (instructions or feedback) and manage isPlayingTTS flag
  const playTTSManaged = useCallback(
    async (text: string, ssml?: string) => {
      if (!text && !ssml) return;
      setIsPlayingTTS(true);
      try {
        await playTTSWithSSML(text, ssml);
      } catch (error) {
        console.error('[Lesson Page] TTS playback failed:', error);
      } finally {
        setIsPlayingTTS(false);
      }
    },
    [playTTSWithSSML]
  );

  // Stop any ongoing TTS when leaving / refreshing this page
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, [stopTTS]);

  // Get current task from lesson context. Order is always ARRAY ORDER (index 0,1,2,...); task_id is for identification only.
  const getCurrentTaskFromContext = () => {
    if (!currentLesson || !missionSequence) return null;

    const missionSeqNum = parseInt(missionSequence!);
    const mission = currentLesson.missions?.find(
      (m) => {
        const seq = (m as any).mission_sequence ?? m.missionSequence;
        return seq === missionSeqNum;
      }
    );

    if (!mission || !mission.tasks?.alphabet_practice) return null;

    const alphabetTasks = mission.tasks.alphabet_practice as Record<string, unknown>[];
    if (!Array.isArray(alphabetTasks) || alphabetTasks.length === 0) return null;

    const index = resolveTaskIndex(alphabetTasks, taskId, taskIndexParam);
    return alphabetTasks[index] || alphabetTasks[0];
  };

  const currentTask = getCurrentTaskFromContext();
  const letterFromContext = currentTask ? (currentTask as any).letter || null : null;

  const alphabetTasksForIndex = currentLesson?.missions?.find(
    (m: any) => (m.mission_sequence ?? m.missionSequence) === parseInt(missionSequence || "0")
  )?.tasks?.alphabet_practice as Record<string, unknown>[] | undefined;
  const effectiveTaskIndex =
    Array.isArray(alphabetTasksForIndex) && alphabetTasksForIndex.length > 0
      ? resolveTaskIndex(alphabetTasksForIndex, taskId, taskIndexParam)
      : (taskIndexParam ? parseInt(taskIndexParam) : 0) || 0;

  // Keep currentTaskIndex in sync with resolved index (array order)
  useEffect(() => {
    setCurrentTaskIndex(effectiveTaskIndex);
  }, [effectiveTaskIndex]);

  // Register batch start when user lands on first task (creates activity in backend)
  useEffect(() => {
    if (
      !lessonId ||
      !missionSequence ||
      !currentLesson ||
      !currentTask ||
      effectiveTaskIndex !== 0 ||
      batchStartCalledRef.current
    )
      return;
    batchStartCalledRef.current = true;
    const task = currentTask as any;
    const firstTaskId = task?.task_id ?? taskId;
    if (!firstTaskId) return;
    api
      .post(`/lessons/${lessonId}/progress/batch/start`, {
        missionSequence: parseInt(missionSequence),
        taskId: String(firstTaskId),
        taskType: "alphabet_practice",
      })
      .catch(() => { });
  }, [lessonId, missionSequence, currentLesson, currentTask, effectiveTaskIndex, taskId]);

  // Initialize task from context or backend
  useEffect(() => {
    if (!lessonId || !missionSequence) return;

    // If we have lesson context, use it to get current task
    if (currentLesson && currentTask) {
      const task = currentTask as any; // Cast to any to access JSON properties
      const letter = task.letter || "S";

      // Extract TTS (try different field names)
      const ttsText = task.tts_ss1 || task.tts_coach || task.tts_instruction || "";
      const ttsSSML = task.tts_ss1_ssml || task.tts_coach_ssml || task.tts_instruction_ssml || ttsText;

      // Set task data from context
      setTaskData({
        taskType: "alphabet_practice",
        letter: letter,
        tts: {
          text: ttsText,
          ssml: ttsSSML,
        },
        visual: task.visual || [],
        feedback: task.feedback || null,
        retryLimit: task.retryLimit || 3,
        currentRetries: 0,
        remainingRetries: task.retryLimit || 3,
        expectedResponse: { type: 'letter', value: letter },
      });

      // Auto-play instruction TTS (disable mic while playing)
      if (ttsText || ttsSSML) {
        setTimeout(async () => {
          await playTTSManaged(ttsText, ttsSSML);
        }, 300);
      }

      // Reset state for new task
      setStatusVariant("initial");
      setCurrentRetry(0);
      setShowingFeedback(false);
      setFeedbackData(null);
      setIsMicActive(false);
      setIsProcessing(false);
      taskStartTimeRef.current = Date.now();

      return;
    }

    // Fallback: Fetch from backend if context not available
    if (!taskId || processedRef.current) return;
    processedRef.current = true;

    const fetchTaskData = async () => {
      try {
        const queryParams = new URLSearchParams({
          missionSequence: String(missionSequence),
          taskId: String(taskId),
        }).toString();

        const requestUrl = `/lessons/${lessonId}/progress/task?${queryParams}`;
        const response = await api.get<any>(requestUrl);

        const data = response.data;
        setTaskData(data);
        setCurrentRetry(data.currentRetries || 0);
        taskStartTimeRef.current = Date.now();

        // Auto-play instruction TTS after a brief delay (disable mic while playing)
        if (data.tts && (data.tts.text || data.tts.ssml)) {
          setTimeout(async () => {
            await playTTSManaged(data.tts.text, data.tts.ssml || data.tts.text);
          }, 300);
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, [lessonId, missionSequence, taskId, taskIndexParam, currentLesson, currentTask, effectiveTaskIndex, playTTSManaged]);

  // Handle mic button click
  const handleMicClick = async () => {
    if (isProcessing) return;

    const newMicState = !isMicActive;
    setIsMicActive(newMicState);

    // When mic is clicked (start recording), change variant to default
    if (newMicState) {
      setStatusVariant("default");
    }

    // MOCK MODE: Skip recording and API calls, simulate success
    const mockMode = localStorage.getItem('MOCK_MODE') === 'true';
    if (mockMode && !newMicState) {
      // Mic was stopped
      console.log('[MOCK MODE] Skipping recording and assessment, simulating success');
      setIsProcessing(true);

      // Simulate exactMatch result (90%+ accuracy)
      const mockResult = {
        feedbackType: "exactMatch",
        qualityScore: 90,
        success: true,
      };
      setFeedbackData(mockResult);

      // Set success variant
      setStatusVariant("success");

      // Don't save checkpoint here - wait for continue button click
      // Don't auto-advance - wait for continue button
      setIsProcessing(false);
      return;
    }

    if (newMicState) {
      // Start recording
      try {
        await startRecording();
      } catch (error) {
        console.error("Failed to start recording:", error);
        setIsMicActive(false);
        setStatusVariant("initial");
      }
    } else {
      // Stop recording and assess (real mode)
      setIsProcessing(true);
      try {
        const audioBlob = await stopRecording();

        // Determine which API to use based on task type
        // alphabet_practice uses SpeechSuper (phoneme API)
        // Other tasks use Azure (word-level assessment)
        const isAlphabetPractice = taskData?.taskType === 'alphabet_practice';

        let result: any;

        if (isAlphabetPractice) {
          // Use backend lesson response endpoint wired to SuperSpeech phoneme API
          const audioBase64 = await blobToBase64(audioBlob);
          const response = await api.post<any>(
            `/lessons/${lessonId}/progress/phoneme`,
            {
              missionSequence: parseInt(missionSequence!),
              taskId,
              audioData: audioBase64,
              mimeType: "audio/webm",
            }
          );
          result = response.data;
        } else {
          // Use Azure for word/sentence-level assessment via backend
          const audioBase64 = await blobToBase64(audioBlob);
          const response = await api.post<any>(
            `/lessons/${lessonId}/progress/response`,
            {
              missionSequence: parseInt(missionSequence!),
              taskId,
              audioData: audioBase64,
              mimeType: "audio/webm",
            }
          );
          result = response.data;
        }

        if (result) {
          console.log("result", result);
          setFeedbackData(result);

          // Play feedback TTS using ONLY lesson SSML
          if (result.feedbackType === "exactMatch") {
            setStatusVariant("success");
            console.log(taskData?.feedback);
            const successSSML = (taskData?.feedback as any)?.tts_exactMatch_ssml;

            await playTTSManaged(successSSML || "", successSSML);

            // Don't auto-advance - wait for continue button click
            // Don't save checkpoint here - wait for continue button
          } else if (result.feedbackType === "closeMatch") {
            // Close match: mark as error, play feedback, but don't show the "Try again" box
            setStatusVariant("error");
            setShowingFeedback(false);

            const improvementSSML =
              (taskData?.feedback as any)?.tts_closeMatch_ssml;

            console.log("[LessonTTS] closeMatch feedback (lesson SSML only)", {
              feedbackType: result.feedbackType,
              taskFeedback: taskData?.feedback,
              chosenSSMLPreview: improvementSSML
                ? String(improvementSSML).substring(0, 120)
                : null,
            });

            await playTTSManaged(
              improvementSSML || "",
              improvementSSML
            );
          } else {
            // wrongSound: mark as error, play feedback, and let user retry via refresh/mic
            setStatusVariant("error");
            setShowingFeedback(false);

            const incorrectSSML =
              (taskData?.feedback as any)?.tts_wrongSound_ssml;

            console.log("[LessonTTS] wrongSound feedback (lesson SSML only)", {
              feedbackType: result.feedbackType,
              taskFeedback: taskData?.feedback,
              chosenSSMLPreview: incorrectSSML
                ? String(incorrectSSML).substring(0, 120)
                : null,
            });

            await playTTSManaged(incorrectSSML || "", incorrectSSML);

            // Check retry logic
            if (taskData && currentRetry + 1 >= (taskData.retryLimit || 3)) {
              // Max retries reached - auto-advance
              setTimeout(() => {
                handleContinue();
              }, 2000);
            } else {
              // Increment retry counter; user can tap refresh/mic for a new try
              setCurrentRetry(currentRetry + 1);
            }
          }
        }
      } catch (error) {
        console.error("Error processing recording:", error);
        setStatusVariant("error");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Save checkpoint to backend and context (sends outcome for analytics when available)
  const saveCheckpoint = async () => {
    if (!lessonId || !missionSequence || !currentTask) return;

    const taskXp = (currentTask as { xp?: number }).xp ?? 0;
    const payload: Record<string, unknown> = {
      missionSequence: parseInt(missionSequence!),
      taskId: (currentTask as any)?.task_id ?? (currentTask as any)?.id ?? String(effectiveTaskIndex + 1),
      taskType: "alphabet_practice",
      xpEarned: feedbackData?.feedbackType === "exactMatch" ? taskXp : 0,
    };

    // Send outcome for analytics (avg accuracy, top errors, etc.)
    if (feedbackData) {
      payload.accuracyScore = feedbackData.qualityScore ?? feedbackData.accuracyScore;
      payload.feedbackType = feedbackData.feedbackType;
      payload.retryCount = currentRetry + 1;
      payload.letter = (currentTask as any)?.letter ?? letterFromContext;
      if (taskStartTimeRef.current) {
        payload.duration = Math.max(0, Math.floor((Date.now() - taskStartTimeRef.current) / 1000));
        payload.taskStartTime = new Date(taskStartTimeRef.current).toISOString();
      }
    }

    try {
      await api.post(`/lessons/${lessonId}/progress/task/complete`, payload);
    } catch (error) {
      console.error('[Lesson Page] Error saving checkpoint:', error);
    }
  };

  // Handle refresh (reset same letter)
  const handleRefresh = () => {
    setStatusVariant("initial");
    setShowingFeedback(false);
    setFeedbackData(null);
    setCurrentRetry(0);
    setIsMicActive(false);
    setIsProcessing(false);

    // Replay instruction TTS (disable mic while playing)
    if (taskData?.tts) {
      setTimeout(async () => {
        await playTTSManaged(taskData.tts.text, taskData.tts.ssml || taskData.tts.text);
      }, 300);
    }
  };

  // Handle continue (move to next letter)
  const handleContinue = async () => {
    if (!lessonId || !missionSequence || !currentLesson || isProcessing) return;
    setIsProcessing(true);

    try {
      // Save checkpoint
      await saveCheckpoint();

      // Get next task index
      const missionSeqNum = parseInt(missionSequence!);
      const mission = currentLesson.missions?.find(
        (m) => {
          // Handle both mission_sequence (from JSON) and missionSequence (from types)
          const seq = (m as any).mission_sequence ?? m.missionSequence;
          return seq === missionSeqNum;
        }
      );

      if (!mission) {
        setIsProcessing(false);
        console.error('Mission not found', {
          missionSequence: missionSeqNum,
          availableMissions: currentLesson.missions?.map(m => ({
            missionSequence: m.missionSequence,
            mission_sequence: (m as any).mission_sequence,
          }))
        });
        return;
      }

      if (!mission.tasks) {
        setIsProcessing(false);
        console.error('Mission tasks not found', {
          mission: mission,
          missionSequence: missionSeqNum,
        });
        return;
      }

      // Get alphabet_practice tasks - check if it's an array
      const alphabetTasks = mission.tasks.alphabet_practice;
      if (!Array.isArray(alphabetTasks) || alphabetTasks.length === 0) {
        setIsProcessing(false);
        console.error('alphabet_practice tasks not found or not an array');
        return;
      }

      const nextIndex = effectiveTaskIndex + 1;

      // Check if there are more tasks (order = array order; task_id is for identification only)
      if (nextIndex >= alphabetTasks.length) {
        // All alphabet_practice tasks completed - next task type or next mission (skip empty arrays)
        const nextStep = getNextLessonStep(
          currentLesson.missions,
          missionSeqNum,
          "alphabet_practice",
          effectiveTaskIndex,
          alphabetTasks.length
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
        setIsProcessing(false);
        return;
      }

      // Update to next task
      setCurrentTaskIndex(nextIndex);

      // Reset state for next task
      setStatusVariant("initial");
      setShowingFeedback(false);
      setFeedbackData(null);
      setCurrentRetry(0);
      setIsMicActive(false);
      setIsProcessing(false);
      processedRef.current = false; // Allow fetching next task

      // Update URL to reflect new task (array order; task_id when present for API)
      const nextTask = alphabetTasks[nextIndex];
      const nextTaskId = (nextTask as any)?.task_id ?? (nextTask as any)?.id ?? String(nextIndex + 1);
      router.push(
        `/student/lesson?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${nextTaskId}&taskIndex=${nextIndex}`
      );
    } catch (error) {
      console.error("Error continuing to next task:", error);
      setIsProcessing(false);
    }
  };


  if (!taskData) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p style={{ color: "#FFF" }}>Loading lesson...</p>
      </div>
    );
  }

  // Extract letter from taskData or context for alphabet_practice
  // Priority: letterFromContext > taskData.letter > expectedResponse.value > visual[0].word
  const letter = letterFromContext ||
    taskData?.letter ||
    taskData?.expectedResponse?.value ||
    taskData?.visual?.[0]?.word ||
    "S";
  const visualImage = taskData?.visual?.[0]?.image;
  const isSuccess = statusVariant === "success";

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
        {/* Play Button for Testing TTS */}
        {taskData?.tts && (
          <button
            onClick={async () => {
              await playTTSManaged(taskData.tts.text, taskData.tts.ssml || taskData.tts.text);
              console.log('Manual TTS playback completed');
            }}
            disabled={isPlayingTTS}
            style={{
              padding: "8px 16px",
              backgroundColor: isPlayingTTS ? "#666" : "#4A90E2",
              color: "#FFF",
              border: "none",
              borderRadius: "6px",
              cursor: isPlayingTTS ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: 600,
              opacity: isPlayingTTS ? 0.6 : 1,
            }}
          >
            {isPlayingTTS ? "🔊 Playing..." : "▶ Play TTS"}
          </button>
        )}

        {/* StatusBox - Show letter for alphabet_practice */}
        {letter && (
          <StatusBox
            text={letter}
            variant={statusVariant}
            letterWidth={107}
            letterHeight={134}
            letterGap={6}
          />
        )}

        {/* VisualBox - Show image on error */}
        {visualImage && (
          <div
            style={{
              height: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {(statusVariant === "error" || showingFeedback) && !isSuccess && (
              <VisualBox
                imageSrc={visualImage}
                imageWidth={107}
                imageHeight={107}
              />
            )}
          </div>
        )}

        {/* Feedback text bubble removed – feedback is delivered via lesson TTS only */}

        {/* Mic / Refresh / Continue */}
        <div style={{ marginTop: "69px" }}>
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
            <div className="flex items-center gap-8 justify-center">
              {/* Refresh button for new try on error */}
              {statusVariant === "error" && (
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
              )}

              <MicButton
                icon={isMicActive ? "pause" : "mic"}
                size={100}
                onClick={handleMicClick}
                disabled={isProcessing || isPlayingTTS}
              />
            </div>
          )}
        </div>

        {/* Retry counter */}
        {currentRetry > 0 && statusVariant !== "success" && (
          <p style={{ marginTop: "16px", color: "#FFF", opacity: 0.7, fontSize: "14px" }}>
            Attempt {currentRetry + 1} of {taskData.retryLimit || 3}
          </p>
        )}
      </div>

      {/* Mascot Avatar */}
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

