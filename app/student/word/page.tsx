"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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

export default function WordPage() {
  const { isOverlayOpen, setOverlayOpen } = useLevelOverlay();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { currentLesson } = useLesson();
  const { playTTSWithSSML, isPlaying, stopTTS } = useTTS();
  const { startRecording, stopRecording, assessWord } = useSpeechAssessment();

  // State
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("initial");
  const [isMicActive, setIsMicActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [currentRetry, setCurrentRetry] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Get data from URL params
  const lessonId = searchParams.get("lessonId");
  const missionSequence = searchParams.get("missionSequence");
  const taskId = searchParams.get("taskId");
  const taskIndexParam = searchParams.get("taskIndex");

  // Order is always ARRAY ORDER (index 0,1,2,...); task_id is for identification only.
  const mission = currentLesson?.missions?.find(
    (m: any) => (m.mission_sequence ?? m.missionSequence) === parseInt(missionSequence || "0")
  );
  const wordTasksArray = mission?.tasks?.word_practice as Record<string, unknown>[] | undefined;
  const effectiveTaskIndex =
    Array.isArray(wordTasksArray) && wordTasksArray.length > 0
      ? resolveTaskIndex(wordTasksArray, taskId, taskIndexParam)
      : (taskIndexParam ? parseInt(taskIndexParam, 10) : 0) || 0;

  // Refs
  const processedRef = useRef(false);

  // Stop any ongoing TTS when leaving / refreshing this page
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, [stopTTS]);

  // Fetch task data from backend on mount
  useEffect(() => {
    if (!lessonId || !missionSequence || !taskId || processedRef.current) return;
    processedRef.current = true;

    const fetchTaskData = async () => {
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
              console.log('[Word Page] TTS playback completed');
            } catch (error) {
              console.error('[Word Page] TTS playback failed:', error);
            }
          }, 300);
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, [lessonId, missionSequence, taskId, playTTSWithSSML]);

  // Handle mic button click
  const handleMicClick = async () => {
    // Prevent starting a new recording while agent TTS is playing
    if (isProcessing || (!isMicActive && isPlaying)) return;

    const newMicState = !isMicActive;
    setIsMicActive(newMicState);

    if (newMicState) {
      // Start recording
      setStatusVariant("default");
      try {
        await startRecording();
      } catch (error) {
        console.error("Failed to start recording:", error);
        setIsMicActive(false);
        setStatusVariant("initial");
      }
    } else {
      // MOCK MODE: Skip recording and API calls, simulate success
      const mockMode = localStorage.getItem('MOCK_MODE') === 'true';
      if (mockMode) {
        console.log('[MOCK MODE] Skipping recording and assessment, simulating success');
        setIsProcessing(true);
        setStatusVariant("success");
        
        // Simulate exactMatch result
        const mockResult = {
          feedbackType: "exactMatch",
          qualityScore: 90,
          success: true,
        };
        setFeedbackData(mockResult);
        
        // Skip feedback TTS, auto-advance after short delay
        setTimeout(() => {
          setIsProcessing(false);
          handleContinue();
        }, 500);
        return;
      }

      // Stop recording and assess
      setIsProcessing(true);
      try {
        const audioBlob = await stopRecording();
        setStatusVariant("default");

        // For word page, assess the full word (from visual[0].word or expectedResponse.value)
        const wordToAssess =
          taskData?.visual?.[0]?.word ||
          (taskData as any)?.expectedResponse?.value ||
          "";
        if (taskData && wordToAssess) {
          // Use the backend processStudentResponse endpoint for word assessment
          const formData = new FormData();
          formData.append("audio", audioBlob, "audio.webm");
          
          const response = await api.post<any>(
            `/lessons/${lessonId}/progress/response`,
            {
              missionSequence: parseInt(missionSequence!),
              taskId,
              audioData: await blobToBase64(audioBlob),
              mimeType: "audio/webm",
            }
          );

          const result = response.data;
          setFeedbackData(result);

          // Play feedback TTS – use ONLY lesson-config SSML (no hard-coded defaults)
          if (result.feedbackType === "exactMatch") {
            setStatusVariant("success");
            const successSSML =
              taskData.feedback?.tts_exactMatch_ssml ||
              taskData.feedback?.tts_correctFeedback_ssml;
            await playTTSWithSSML(successSSML || "", successSSML);

            // For mastery_check, do not auto-advance; wait for user to click Continue.
            const missionType = (mission as any)?.mission_type ?? (mission as any)?.missionType;
            const isMasteryMission = missionType === "mastery_check";
            if (!isMasteryMission) {
              // Move to next task after success (normal missions)
              setTimeout(() => {
                handleContinue();
              }, 1500);
            }
          } else if (result.feedbackType === "closeMatch") {
            setStatusVariant("error");
            setShowingFeedback(false);
            const improvementSSML =
              taskData.feedback?.tts_closeMatch_ssml ||
              taskData.feedback?.tts_incorrectFeedback_ssml;
            await playTTSWithSSML(improvementSSML || "", improvementSSML);
          } else {
            setStatusVariant("error");
            setShowingFeedback(false);
            const incorrectSSML =
              taskData.feedback?.tts_wrongSound_ssml ||
              taskData.feedback?.tts_incorrectFeedback_ssml;
            await playTTSWithSSML(incorrectSSML || "", incorrectSSML);

            // Check retry logic
            if (currentRetry + 1 >= (taskData.retryLimit || 3)) {
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

  // Mastery-check helper: evaluate results at end of mastery mission
  const handleMasteryResults = async (missionSeqNum: number) => {
    if (!currentLesson || !lessonId) return;

    try {
      console.log("[Mastery] handleMasteryResults: start", {
        lessonId,
        missionSeqNum,
      });

      // Get latest progress (includes checkpoint.wordProgress)
      const progressResponse = await api.get<any>(`/lessons/${lessonId}/progress`);
      const checkpoint = progressResponse.data?.checkpoint ?? progressResponse.checkpoint ?? null;

      // Find mastery mission (current mission)
      const masteryMission = currentLesson.missions?.find(
        (m: any) =>
          (m.mission_sequence ?? m.missionSequence) === missionSeqNum &&
          (m.mission_type ?? m.missionType) === "mastery_check"
      ) as any;

      if (!masteryMission) {
        console.warn("[Mastery] No mastery mission found in currentLesson for sequence", missionSeqNum);
        // Fallback: just go to next mission page
        router.push(
          `/student/mission?lessonId=${lessonId}&missionSequence=${missionSeqNum + 1}`
        );
        return;
      }

      const results = masteryMission.tasks?.results || {};
      const targetStr: string = masteryMission.target || "";

      // Parse target like "0-1" or "6-8" into [min,max]
      let targetMin = 0;
      let targetMax = Number.POSITIVE_INFINITY;
      if (targetStr) {
        const parts = targetStr.split("-").map((p: string) => parseInt(p, 10));
        if (!Number.isNaN(parts[0])) targetMin = parts[0];
        if (!Number.isNaN(parts[1])) targetMax = parts[1];
      }

      // Collect mastery words for this mission
      const masteryWords: string[] = Array.isArray(masteryMission.tasks?.word_practice)
        ? masteryMission.tasks.word_practice.map((t: any) => t.word).filter(Boolean)
        : [];

      let correctCount = 0;
      if (checkpoint?.wordProgress && masteryWords.length > 0) {
        for (const w of masteryWords) {
          const wp = checkpoint.wordProgress[w];
          if (wp && wp.correct) correctCount += 1;
        }
      }

      console.log("[Mastery] Aggregated mastery stats", {
        masteryWords,
        wordProgress: checkpoint?.wordProgress,
        correctCount,
        targetStr,
      });

      // Decide band from results keys, e.g. tts_0-1_correct, tts_5-7_correct, tts_1-5_correct
      const total = masteryWords.length || 10; // fallback denominator for messaging only
      let bandKey: string | null = null;

      const resultKeys = Object.keys(results).filter((k) => k.startsWith("tts_") && k.endsWith("_correct"));
      for (const key of resultKeys) {
        const rangePart = key.slice(4, -"_correct".length); // e.g. "0-1"
        const [minStr, maxStr] = rangePart.split("-");
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);
        if (!Number.isNaN(min) && !Number.isNaN(max) && correctCount >= min && correctCount <= max) {
          bandKey = key;
          break;
        }
      }

      // Fallback: if nothing matched, try using target range directly
      if (!bandKey && targetStr) {
        const candidate = `tts_${targetStr}_correct`;
        if (results[candidate]) {
          bandKey = candidate;
        }
      }

      // Final fallback band key
      if (!bandKey && resultKeys.length > 0) {
        bandKey = resultKeys[0];
      }

      const textTemplate: string = (bandKey && results[bandKey]) || "";
      const ssml: string | undefined = bandKey ? results[`${bandKey}_ssml`] : undefined;
      let text = textTemplate.replace("{obtained_correct}", String(correctCount));

      // Fallback: if lesson JSON has no results text/ssml for this band, speak a generic summary
      if (!text && !ssml) {
        text = `You got ${correctCount} out of ${total} correct.`;
      }

      // Play mastery results TTS
      console.log("[Mastery] Playing results TTS", {
        bandKey,
        text,
        hasSSML: !!ssml,
      });
      await playTTSWithSSML(text, ssml);

      const passed = correctCount >= targetMin && correctCount <= targetMax;
      console.log("[Mastery] Pass/fail decision", {
        correctCount,
        targetMin,
        targetMax,
        passed,
      });

      if (passed) {
        // Student passed mastery → mark mastery mission complete and move to wrap mission
        try {
          await api.post(`/lessons/${lessonId}/progress/mission/complete`, {
            missionSequence: missionSeqNum,
          });
        } catch (e) {
          console.error("Error completing mastery mission:", e);
        }

        router.push(
          `/student/mission?lessonId=${lessonId}&missionSequence=${missionSeqNum + 1}`
        );
      } else {
        // Student failed mastery → reset lesson to first mission / first task
        try {
          await api.post(`/lessons/${lessonId}/progress/checkpoint`, {
            missionSequence: 1,
            nextTaskId: "1",
            lastCompletedTaskId: null,
            activeTaskType: null,
            taskIndexInBatch: 0,
            completedMissionSequences: [],
            completedTasksByMissionAndType: {},
            taskRetryCounts: {},
            totalXpEarnedInLesson: 0,
            lessonMasteryScore: null,
          });
        } catch {
          // Ignore reset errors; still send learner back to mission 1
        }

        router.push(
          `/student/mission?lessonId=${lessonId}&missionSequence=1`
        );
      }
    } catch (error) {
      console.error("[Mastery] Error handling mastery results:", error);
      // Fallback: go to next mission page
      const missionSeqNum = parseInt(missionSequence || "3", 10);
      router.push(
        `/student/mission?lessonId=${lessonId}&missionSequence=${missionSeqNum + 1}`
      );
    }
  };

  const handleContinue = async () => {
    if (!lessonId || !missionSequence || !taskId) return;

    try {
      console.log("[Word] handleContinue", {
        lessonId,
        missionSequence,
        taskId,
        effectiveTaskIndex,
      });
      await api.post<any>(
        `/lessons/${lessonId}/progress/task/complete`,
        {
          missionSequence: parseInt(missionSequence),
          taskId,
        }
      );

      const missionSeqNum = parseInt(missionSequence);
      const wordTasks = mission?.tasks?.word_practice as Record<string, unknown>[] | undefined;
      const wordTasksLength = Array.isArray(wordTasks) ? wordTasks.length : 0;
      const nextIndex = effectiveTaskIndex + 1;

      const missionType = (mission as any)?.mission_type ?? (mission as any)?.missionType;
      const isMasteryMission = missionType === "mastery_check";

      // Last word in this mission
      if (wordTasksLength > 0 && nextIndex >= wordTasksLength) {
        if (isMasteryMission) {
          // For mastery_check, do NOT auto-advance to wrap.
          // Instead, evaluate mastery results using mission.target + tasks.results.
          await handleMasteryResults(missionSeqNum);
          return;
        }

        // Normal flow: next task type or next mission (order = array order)
        const nextStep = getNextLessonStep(
          currentLesson?.missions,
          missionSeqNum,
          "word_practice",
          effectiveTaskIndex,
          wordTasksLength
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

      // Next word: use task at next index (array order); task_id when present for API
      const nextTask =
        Array.isArray(wordTasks) && wordTasks[nextIndex]
          ? (wordTasks[nextIndex] as any)
          : null;
      const nextTaskId = nextTask?.task_id ?? nextTask?.id ?? String(nextIndex + 1);
      router.push(
        `/student/word?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${nextTaskId}&taskIndex=${nextIndex}`
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleRefresh = () => {
    setStatusVariant("initial");
    setIsMicActive(false);
    setShowingFeedback(false);
    setFeedbackData(null);
  };

  if (!taskData) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p style={{ color: "#FFF" }}>Loading lesson...</p>
      </div>
    );
  }

  const word =
    taskData.visual?.[0]?.word ||
    (taskData as any).expectedResponse?.value ||
    "";
  const wordImage = taskData.visual?.[0]?.image;
  const isSuccess = statusVariant === "success";

  // Helper to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.toString().split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

        {/* StatusBox — renders as WordStatusBox */}
        {word && (
          <StatusBox
            text={word}
            variant={statusVariant}
            imageSrc={wordImage}
            letterHeight={100}
            letterGap={16}
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
            Attempt {currentRetry + 1} of {taskData.retryLimit || 3}
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
