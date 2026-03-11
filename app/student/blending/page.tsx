"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MascotAvatar } from "../../../components/MascotAvatar";
import { StudentMascotAvatar } from "../../../components/StudentMascotAvatar";
import { BlendingBoxes } from "../lesson/components/BlendingBoxes";
import { VisualBox } from "../lesson/components/VisualBox";
import { MicButton } from "../lesson/components/MicButton";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { LevelOverlay } from "../components/LevelOverlay";
import { useLevelOverlay } from "../contexts/LevelOverlayContext";
import { useLessonPageData } from "../hooks/useLessonData";
import { useTTS } from "../../../hooks/useTTS";
import { useSpeechAssessment } from "../../../hooks/useSpeechAssessment";
import { useAuth } from "../../../contexts/AuthContext";
import { useLesson } from "../../../contexts/LessonContext";
import { useUI } from "../../../contexts/UIContext";
import { api } from "../../../lib/api-client";
import { getNextLessonStep, resolveTaskIndex } from "../../../lib/lesson-navigation";
import Image from "next/image";

type StatusVariant = "initial" | "default" | "success" | "error";

interface TaskData {
  tts: {
    text: string;
    ssml: string;
  };
  visual: Array<{ word: string; image: string; mouth?: string }>;
  feedback: any;
  retryLimit: number;
  currentRetries: number;
  remainingRetries: number;
}

export default function BlendingPage() {
  const { isOverlayOpen, setOverlayOpen } = useLevelOverlay();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { currentLesson } = useLesson();
  const { showLoader, hideLoader, setBackgroundMode } = useUI();
  const { playTTSWithSSML, isPlaying, stopTTS } = useTTS();
  const { startRecording, stopRecording, assessPhoneme } = useSpeechAssessment();

  // State
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("initial");
  const [isMicActive, setIsMicActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [currentRetry, setCurrentRetry] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0); // Index in blending_practice array

  // Get data from URL params
  const lessonId = searchParams.get("lessonId");
  const missionSequence = searchParams.get("missionSequence");
  const taskId = searchParams.get("taskId");
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

  // Refs
  const processedRef = useRef(false);
  const batchStartCalledRef = useRef(false);

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

    if (!mission || !mission.tasks?.blending_practice) return null;

    const blendingTasks = mission.tasks.blending_practice as Record<string, unknown>[];
    if (!Array.isArray(blendingTasks) || blendingTasks.length === 0) return null;

    const index = resolveTaskIndex(blendingTasks, taskId, taskIndexParam);
    return blendingTasks[index] || blendingTasks[0];
  };

  const currentTask = getCurrentTaskFromContext();
  const blendingTasksForIndex = currentLesson?.missions?.find(
    (m: any) => (m.mission_sequence ?? m.missionSequence) === parseInt(missionSequence || "0")
  )?.tasks?.blending_practice as Record<string, unknown>[] | undefined;
  const effectiveTaskIndex = Array.isArray(blendingTasksForIndex) && blendingTasksForIndex.length > 0
    ? resolveTaskIndex(blendingTasksForIndex, taskId, taskIndexParam)
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
        taskType: "blending_practice",
      })
      .catch(() => { });
  }, [lessonId, missionSequence, currentLesson, currentTask, effectiveTaskIndex, taskId]);

  // Initialize task from context or backend
  useEffect(() => {
    if (!lessonId || !missionSequence) return;

    // If we have lesson context, use it to get current task
    if (currentLesson && currentTask) {
      const task = currentTask as any;
      const word = task.word || "";
      
      // Extract TTS
      const ttsText = task.tts_instruction || "";
      const ttsSSML = task.tts_instruction_ssml || ttsText;
      
      // Set task data from context, including full feedback object
      setTaskData({
        tts: {
          text: ttsText,
          ssml: ttsSSML,
        },
        visual: [{ word: word, image: task.image || "" }],
        feedback: task.feedback || null,
        retryLimit: task.retryLimit || 3,
        currentRetries: 0,
        remainingRetries: task.retryLimit || 3,
      });

      // Auto-play instruction TTS
      if (ttsText || ttsSSML) {
        setTimeout(async () => {
          try {
            await playTTSWithSSML(ttsText, ttsSSML);
          } catch (error) {
            console.error('[Blending Page] TTS playback failed:', error);
          }
        }, 300);
      }

      // Reset state for new task
      setStatusVariant("initial");
      setCurrentRetry(0);
      setShowingFeedback(false);
      setFeedbackData(null);
      setIsMicActive(false);
      setIsProcessing(false);

      return;
    }

    // Fallback: Fetch from backend if context not available
    if (!taskId || processedRef.current) return;
    processedRef.current = true;

    const fetchTaskData = async () => {
      showLoader("Loading lesson...");
      try {
        const queryParams = new URLSearchParams({
          missionSequence: String(missionSequence),
          taskId: String(taskId),
        }).toString();

        const response = await api.get<any>(
          `/lessons/${lessonId}/progress/task?${queryParams}`
        );

        const data = response.data;
        setTaskData(data);
        setCurrentRetry(data.currentRetries || 0);

        // Auto-play instruction TTS after a brief delay
        if (data.tts && (data.tts.text || data.tts.ssml)) {
          setTimeout(async () => {
            try {
              await playTTSWithSSML(data.tts.text, data.tts.ssml || data.tts.text);
            } catch (error) {
              console.error('[Blending Page] TTS playback failed:', error);
            }
          }, 300);
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        hideLoader();
      }
    };

    fetchTaskData();
  }, [lessonId, missionSequence, taskId, taskIndexParam, currentLesson, currentTask, effectiveTaskIndex, playTTSWithSSML]);
  useEffect(() => {
    console.log("taskData", taskData);
  }, [taskData]);
  // Save checkpoint to backend
  const saveCheckpoint = async () => {
    if (!lessonId || !missionSequence || !currentTask) return;

    try {
      await api.post(`/lessons/${lessonId}/progress/task/complete`, {
        missionSequence: parseInt(missionSequence!),
        taskId: (currentTask as any)?.task_id ?? (currentTask as any)?.id ?? String(effectiveTaskIndex + 1),
        taskType: "blending_practice",
        xpEarned: (currentTask as { xp?: number }).xp ?? 0,
      });
    } catch (error) {
      console.error('[Blending Page] Error saving checkpoint:', error);
    }
  };

  // Handle mic button click
  const handleMicClick = async () => {
    // Prevent starting a new recording while agent TTS is playing
    if (isProcessing || (!isMicActive && isPlaying)) return;

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

        // For blending, assess the whole word using Azure (word-level assessment)
        if (taskData && taskData.visual && taskData.visual.length > 0) {
          const word = taskData.visual[0].word || "";
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
          const result = response.data;

          setFeedbackData(result);

          // Play feedback TTS using ONLY lesson SSML
          if (result.feedbackType === "exactMatch") {
            setStatusVariant("success");
            setShowingFeedback(false);

            const successSSML =
              (taskData.feedback as any)?.tts_exactMatch_ssml;
            console.log(taskData.feedback);

            await playTTSWithSSML(successSSML || "", successSSML);

            // Don't save checkpoint here - wait for continue button click
            // Don't auto-advance - wait for continue button
          } else if (result.feedbackType === "closeMatch") {
            setStatusVariant("error");
            setShowingFeedback(true);

            const improvementSSML =
              (taskData.feedback as any)?.tts_closeMatch_ssml;

            console.log("[LessonTTS] blending closeMatch feedback", {
              feedbackType: result.feedbackType,
              taskFeedback: taskData.feedback,
              chosenSSMLPreview: improvementSSML
                ? String(improvementSSML).substring(0, 120)
                : null,
            });

            await playTTSWithSSML(
              improvementSSML || "",
              improvementSSML
            );
          } else {
            setStatusVariant("error");
            setShowingFeedback(true);

            const incorrectSSML =
              (taskData.feedback as any)?.tts_wrongSound_ssml;

            console.log("[LessonTTS] blending wrongSound feedback", {
              feedbackType: result.feedbackType,
              taskFeedback: taskData.feedback,
              chosenSSMLPreview: incorrectSSML
                ? String(incorrectSSML).substring(0, 120)
                : null,
            });

            await playTTSWithSSML(incorrectSSML || "", incorrectSSML);

            // Check retry logic
            if (taskData && currentRetry + 1 >= (taskData.retryLimit || 3)) {
              setTimeout(() => {
                handleContinue();
              }, 2000);
            } else {
              setCurrentRetry(currentRetry + 1);
              setTimeout(() => {
                setShowingFeedback(false);
                setStatusVariant("initial");
              }, 2000);
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

  // Helper to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.includes(',')
          ? base64String.split(',')[1]
          : base64String;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Handle refresh (reset same word)
  const handleRefresh = () => {
    if (isProcessing || isPlayingTTS) return;
    setStatusVariant("initial");
    setShowingFeedback(false);
    setFeedbackData(null);
    setCurrentRetry(0);
    setIsMicActive(false);
    setIsProcessing(false);

    // Replay instruction TTS
    if (taskData?.tts) {
      setTimeout(async () => {
        try {
          await playTTSWithSSML(taskData.tts.text, taskData.tts.ssml || taskData.tts.text);
        } catch (error) {
          console.error('[Blending Page] TTS playback failed:', error);
        }
      }, 300);
    }
  };

  // Handle continue (move to next word)
  const handleContinue = async () => {
    if (!lessonId || !missionSequence || !currentLesson || isProcessing || isPlayingTTS) return;

    try {
      // Save checkpoint
      await saveCheckpoint();

      // Get next task index
      const missionSeqNum = parseInt(missionSequence!);
      const mission = currentLesson.missions?.find(
        (m) => {
          const seq = (m as any).mission_sequence ?? m.missionSequence;
          return seq === missionSeqNum;
        }
      );

      if (!mission) {
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
        console.error('Mission tasks not found');
        return;
      }

      // Get blending_practice tasks - check if it's an array
      const blendingTasks = mission.tasks.blending_practice;
      if (!Array.isArray(blendingTasks) || blendingTasks.length === 0) {
        console.error('blending_practice tasks not found or not an array');
        return;
      }

      const nextIndex = effectiveTaskIndex + 1;

      // Check if there are more tasks (order = array order; task_id is for identification only)
      if (nextIndex >= blendingTasks.length) {
        // All blending_practice tasks completed - next task type or next mission (skip empty arrays)
        const nextStep = getNextLessonStep(
          currentLesson.missions,
          missionSeqNum,
          "blending_practice",
          effectiveTaskIndex,
          blendingTasks.length
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

      // Update URL to reflect new task
      const nextTask = blendingTasks[nextIndex];
      const nextTaskId = (nextTask as any).task_id || String(nextIndex + 1);
      router.push(
        `/student/blending?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${nextTaskId}&taskIndex=${nextIndex}`
      );
    } catch (error) {
      console.error("Error continuing to next task:", error);
    }
  };

  if (!taskData) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p style={{ color: "#FFF" }}>Loading lesson...</p>
      </div>
    );
  }

  // Get word from taskData or context
  // Priority: taskData.visual[0].word > currentTask.word > ""
  const word = taskData?.visual?.[0]?.word ||
    (currentTask as any)?.word ||
    "";
  const visualImage = taskData?.visual?.[0]?.image ||
    (currentTask as any)?.image ||
    "";
  const letters = word
    ? word.split("").filter((char: string) => /[a-zA-Z]/.test(char))
    : [];
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
              setIsPlayingTTS(true);
              try {
                await playTTSWithSSML(taskData.tts.text, taskData.tts.ssml || taskData.tts.text);
                console.log('Manual TTS playback completed');
              } catch (error) {
                console.error('Manual TTS playback failed:', error);
              } finally {
                setIsPlayingTTS(false);
              }
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

        {/* BlendingBoxes - Show letters with connectors */}
        {letters.length > 0 && (
          <BlendingBoxes
            letters={letters}
            variant={statusVariant}
            letterWidth={107.063}
            letterHeight={134.92}
            letterGap={6}
          />
        )}

        {/* VisualBox - Show image on error */}
        {visualImage && (
          <div
            style={{
              height: "140px",
              width: "281px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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

        {/* Feedback bubble removed – feedback is delivered via lesson-config TTS only */}

        {/* MicButton or Continue Button based on variant - fixed 101px total gap */}
        <div style={{ marginTop: "69px" }}>
          {isSuccess ? (
            <div className="flex items-center gap-8">
              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isProcessing || isPlayingTTS}
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
                  cursor: isProcessing || isPlayingTTS ? "not-allowed" : "pointer",
                  opacity: isProcessing || isPlayingTTS ? 0.6 : 1,
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
                disabled={isProcessing || isPlayingTTS}
              />
            </div>
          ) : (
            <MicButton
              icon={isMicActive ? "pause" : "mic"}
              size={100}
              onClick={handleMicClick}
              disabled={isProcessing || isPlayingTTS || isPlaying}
            />
          )}
        </div>

        {/* Retry counter */}
        {currentRetry > 0 && statusVariant !== "success" && (
          <p style={{ marginTop: "16px", color: "#FFF", opacity: 0.7, fontSize: "14px" }}>
            Attempt {currentRetry + 1} of {taskData.retryLimit || 3}
          </p>
        )}
      </div>

      {/* Mascot Avatar - Left Bottom - Hidden when overlay is open */}
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

