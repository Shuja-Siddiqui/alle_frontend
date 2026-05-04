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
import { useUI } from "../../../contexts/UIContext";
import { api } from "../../../lib/api-client";
import { getNextLessonStep, PAGE_BY_TASK_TYPE, resolveTaskIndex } from "../../../lib/lesson-navigation";
import { getTaskStartTimeIso, markAttemptStart } from "../../../lib/attempt-timing";
import {
  clearTaskOutcomeState,
  loadTaskOutcomeState,
  saveTaskOutcomeState,
} from "../../../lib/taskOutcomeState";
import { devMockSyncWordCorrect } from "../../../lib/dev-mock-checkpoint-sync";
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

function missionSequenceMatches(m: any, seq: number): boolean {
  const v = Number(m?.mission_sequence ?? m?.missionSequence);
  return Number.isFinite(v) && v === seq;
}

/** Backend may send `mastery_check`, `Mastery_Check`, etc. */
function isMasteryCheckMissionType(m: any): boolean {
  const raw = m?.mission_type ?? m?.missionType;
  if (raw == null) return false;
  const t = String(raw).trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t === "mastery_check" || t === "masterycheck";
}

function resolveMasteryMission(missions: any[] | undefined, missionSeqNum: number): any | undefined {
  if (!missions?.length) return undefined;
  const typed = missions.find(
    (m) => missionSequenceMatches(m, missionSeqNum) && isMasteryCheckMissionType(m)
  );
  if (typed) return typed;
  return missions.find((m) => missionSequenceMatches(m, missionSeqNum));
}

function wordProgressEntryCorrect(wordProgress: Record<string, unknown>, word: string): boolean {
  const w = String(word || "").trim();
  if (!w.length) return false;
  const lower = w.toLowerCase();
  const hit = (wordProgress[w] ?? wordProgress[lower]) as { correct?: boolean } | undefined;
  return hit?.correct === true;
}

export default function WordPage() {
  const { isOverlayOpen, setOverlayOpen } = useLevelOverlay();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { currentLesson } = useLesson();
  const { setBackgroundMode } = useUI();
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
  const [isTaskLoading, setIsTaskLoading] = useState(true);
  const [pendingReset, setPendingReset] = useState<{
    missionSequence: number;
    taskId: string;
    taskType: string;
  } | null>(null);
  const taskStartTimeRef = useRef<number | null>(null);
  const taskStateKeyPage = "word";

  // Get data from URL params
  const lessonId = searchParams.get("lessonId");
  const missionSequence = searchParams.get("missionSequence");

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

  // Stop any ongoing TTS when leaving / refreshing this page
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, [stopTTS]);

  // Fetch task data from backend on mount
  useEffect(() => {
    if (!lessonId || !missionSequence || !taskId) return;

    // Reset visual/interaction state when moving to a new task.
    // Without this, the previous task's success state can carry over (green box).
    setIsTaskLoading(true);
    setStatusVariant("initial");
    setShowingFeedback(false);
    setFeedbackData(null);
    setIsMicActive(false);
    setIsProcessing(false);

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
      } finally {
        setIsTaskLoading(false);
      }
    };

    fetchTaskData();
  }, [lessonId, missionSequence, taskId, playTTSWithSSML]);

  useEffect(() => {
    const stored = loadTaskOutcomeState<any>(
      taskStateKeyPage,
      lessonId,
      missionSequence,
      taskId
    );
    if (!stored) return;
    setStatusVariant(stored.statusVariant);
    setFeedbackData(stored.feedbackData ?? null);
    setCurrentRetry(stored.currentRetry ?? 0);
    setPendingReset(stored.pendingReset ?? null);
    setIsMicActive(false);
    setIsProcessing(false);
    setShowingFeedback(false);
  }, [lessonId, missionSequence, taskId]);

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
        taskStartTimeRef.current = markAttemptStart();
      } catch (error) {
        console.error("Failed to start recording:", error);
        setIsMicActive(false);
        setStatusVariant("initial");
      }
    } else {
      // MOCK MODE: Skip recording and API calls, simulate success
      const mockMode = localStorage.getItem("MOCK_MODE") === "true";
      if (mockMode) {
        console.log("[MOCK MODE] Skipping mic/API assessment; syncing success to checkpoint like real flow");
        setIsProcessing(true);
        setStatusVariant("success");
        setFeedbackData({
          feedbackType: "exactMatch",
          qualityScore: 90,
          success: true,
        });
        const missionWord =
          Array.isArray(wordTasksArray) && wordTasksArray[effectiveTaskIndex]
            ? String((wordTasksArray[effectiveTaskIndex] as any)?.word ?? "").trim()
            : "";
        const w =
          missionWord ||
          String(taskData?.visual?.[0]?.word ?? "").trim() ||
          String((taskData as any)?.expectedResponse?.value ?? "").trim() ||
          "";
        if (lessonId && w) {
          await devMockSyncWordCorrect(lessonId, w);
        }
        setIsProcessing(false);
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
              word: wordToAssess || undefined,
              assessmentMode: "phoneme_word_only",
              taskStartTime: getTaskStartTimeIso(taskStartTimeRef.current),
            }
          );

          const result = response.data;
          setFeedbackData(result);

          if (result.lessonResetToStart) {
            const restartMission = Number(result?.restartAt?.missionSequence ?? 1);
            const restartTaskId = String(result?.restartAt?.taskId ?? "1");
            const restartTaskType = String(result?.restartAt?.taskType ?? "alphabet_practice");
            const currentMission = currentLesson?.missions?.find(
              (m: any) => (m.mission_sequence ?? m.missionSequence) === parseInt(missionSequence || "0", 10)
            );
            const isMasteryMission = isMasteryCheckMissionType(currentMission);
            const resetMessage = isMasteryMission
              ? "Great effort! Mastery check is not complete yet. Let us practice the lesson again and come back even stronger. Tap Try again!"
              : "Great effort! Let us restart this quest from the beginning so you can get even stronger. Tap Try again!";
            const resetMessageSsml = `<speak version="1.0" xml:lang="en-US" xmlns="http://www.w3.org/2001/10/synthesis"><voice name="en-US-JennyNeural">${resetMessage}</voice></speak>`;
            setPendingReset({
              missionSequence: restartMission,
              taskId: restartTaskId,
              taskType: restartTaskType,
            });
            setStatusVariant("error");
            setShowingFeedback(false);
            setCurrentRetry(0);
            setIsMicActive(false);
            saveTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId, {
              statusVariant: "error",
              feedbackData: result,
              currentRetry: 0,
              pendingReset: {
                missionSequence: restartMission,
                taskId: restartTaskId,
                taskType: restartTaskType,
              },
            });

            if (result?.feedback?.text || result?.feedback?.ssml) {
              await playTTSWithSSML(result.feedback.text || "", result.feedback.ssml);
            }
            await playTTSWithSSML(
              resetMessage,
              resetMessageSsml
            );
            return;
          }

          // Play feedback TTS – use ONLY lesson-config SSML (no hard-coded defaults)
          if (result.feedbackType === "exactMatch") {
            setStatusVariant("success");
            saveTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId, {
              statusVariant: "success",
              feedbackData: result,
              currentRetry,
              pendingReset: null,
            });
            const successSSML =
              taskData.feedback?.tts_exactMatch_ssml ||
              taskData.feedback?.tts_correctFeedback_ssml;
            await playTTSWithSSML(successSSML || "", successSSML);
            // Always wait for explicit Continue click (mock and real).
          } else if (result.feedbackType === "closeMatch") {
            setStatusVariant("error");
            setShowingFeedback(false);
            saveTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId, {
              statusVariant: "error",
              feedbackData: result,
              currentRetry,
              pendingReset: null,
            });
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
              saveTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId, {
                statusVariant: "error",
                feedbackData: result,
                currentRetry: currentRetry + 1,
                pendingReset: null,
              });
            } else {
              setCurrentRetry(currentRetry + 1);
              saveTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId, {
                statusVariant: "error",
                feedbackData: result,
                currentRetry: currentRetry + 1,
                pendingReset: null,
              });
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

      const masteryMission = resolveMasteryMission(currentLesson.missions, missionSeqNum) as any;

      if (!masteryMission) {
        console.warn("[Mastery] No mission found in currentLesson for sequence", missionSeqNum);
        router.push(
          `/student/mission?lessonId=${lessonId}&missionSequence=${missionSeqNum + 1}`
        );
        return;
      }

      const results = masteryMission.tasks?.results || {};
      const targetStr: string = masteryMission.target || "";

      let targetMin = 0;
      if (targetStr) {
        const parts = targetStr.split("-").map((p: string) => parseInt(p, 10));
        if (!Number.isNaN(parts[0])) targetMin = parts[0];
      }

      const masteryWords: string[] = Array.isArray(masteryMission.tasks?.word_practice)
        ? masteryMission.tasks.word_practice.map((t: any) => t.word).filter(Boolean)
        : [];

      const total = Math.max(1, masteryWords.length);

      const progressResponse = await api.get<any>(`/lessons/${lessonId}/progress`);
      const checkpoint =
        progressResponse.data?.checkpoint ?? progressResponse.checkpoint ?? null;

      let correctCount = 0;
      if (checkpoint?.wordProgress && masteryWords.length > 0) {
        const wp = checkpoint.wordProgress as Record<string, unknown>;
        for (const w of masteryWords) {
          if (wordProgressEntryCorrect(wp, String(w))) correctCount += 1;
        }
      }

      console.log("[Mastery] Aggregated mastery stats", {
        masteryWords,
        wordProgress: checkpoint?.wordProgress,
        correctCount,
        targetStr,
      });

      let bandKey: string | null = null;

      const resultKeys = Object.keys(results).filter((k) => k.startsWith("tts_") && k.endsWith("_correct"));
      for (const key of resultKeys) {
        const rangePart = key.slice(4, -"_correct".length);
        const [minStr, maxStr] = rangePart.split("-");
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);
        if (!Number.isNaN(min) && !Number.isNaN(max) && correctCount >= min && correctCount <= max) {
          bandKey = key;
          break;
        }
      }

      if (!bandKey && targetStr) {
        const candidate = `tts_${targetStr}_correct`;
        if (results[candidate]) {
          bandKey = candidate;
        }
      }

      if (!bandKey && resultKeys.length > 0) {
        bandKey = resultKeys[0];
      }

      const textTemplate: string = (bandKey && results[bandKey]) || "";
      const ssml: string | undefined = bandKey ? results[`${bandKey}_ssml`] : undefined;
      let text = textTemplate.replace("{obtained_correct}", String(correctCount));

      if (!text && !ssml) {
        text = `You got ${correctCount} out of ${total} correct.`;
      }

      console.log("[Mastery] Playing results TTS", {
        bandKey,
        text,
        hasSSML: !!ssml,
      });
      try {
        await playTTSWithSSML(text, ssml);
      } catch (ttsErr) {
        console.warn("[Mastery] Results TTS failed; still navigating to mastery summary", ttsErr);
      }

      const passed = correctCount >= targetMin;
      const masteryScore =
        total > 0 ? Math.round((correctCount / total) * 100) : 0;
      console.log("[Mastery] Pass/fail decision", {
        correctCount,
        targetMin,
        passed,
        masteryScore,
      });

      if (passed) {
        try {
          await api.post(`/lessons/${lessonId}/progress/mission/complete`, {
            missionSequence: missionSeqNum,
            masteryScore,
          });
        } catch (e) {
          console.error("Error completing mastery mission:", e);
        }
      } else {
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
          // ignore
        }
      }

      const continuePath = passed
        ? `/student/mission?lessonId=${lessonId}&missionSequence=${missionSeqNum + 1}`
        : `/student/mission?lessonId=${lessonId}&missionSequence=1`;
      const retryPath = `/student/mission?lessonId=${lessonId}&missionSequence=1`;
      const masteryCheckUrl =
        `/student/mastery-check?lessonId=${lessonId}` +
        `&missionSequence=${missionSeqNum}` +
        `&correct=${correctCount}` +
        `&total=${total}` +
        `&continueTo=${encodeURIComponent(continuePath)}` +
        `&retryTo=${encodeURIComponent(retryPath)}`;

      router.push(masteryCheckUrl);
    } catch (error) {
      console.error("[Mastery] Error handling mastery results:", error);
      const seq = parseInt(missionSequence || "1", 10);
      router.push(
        `/student/mission?lessonId=${lessonId}&missionSequence=${seq + 1}`
      );
    }
  };

  const handleContinue = async () => {
    if (!lessonId || !missionSequence || !taskId || isProcessing) return;
    setIsProcessing(true);

    try {
      clearTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId);
      console.log("[Word] handleContinue", {
        lessonId,
        missionSequence,
        taskId,
        effectiveTaskIndex,
      });
      const missionSeqNum = parseInt(missionSequence);
      const wordTasks = mission?.tasks?.word_practice as Record<string, unknown>[] | undefined;
      const wordTasksLength = Array.isArray(wordTasks) ? wordTasks.length : 0;
      const nextIndex = effectiveTaskIndex + 1;

      const isMasteryMission = isMasteryCheckMissionType(mission);

      await api.post<any>(`/lessons/${lessonId}/progress/task/complete`, {
        missionSequence: parseInt(missionSequence),
        taskId,
      });

      // Last word in this mission
      if (wordTasksLength > 0 && nextIndex >= wordTasksLength) {
        if (isMasteryMission) {
          // For mastery_check, do NOT auto-advance to wrap.
          // Instead, evaluate mastery results using mission.target + tasks.results.
          await handleMasteryResults(missionSeqNum);
          return;
        }

        // End of word_practice batch (non-mastery): mastery-check summary, then Continue follows real next step.
        let correctCount = wordTasksLength;
        try {
          const progressResponse = await api.get<any>(`/lessons/${lessonId}/progress`);
          const checkpoint =
            progressResponse.data?.checkpoint ?? progressResponse.checkpoint ?? null;
          const wp = checkpoint?.wordProgress ?? {};
          const keys = (wordTasks as any[])
            .map((t) => String(t?.word ?? "").trim())
            .filter((w) => w.length > 0);
          if (keys.length > 0) {
            correctCount = keys.reduce((acc, w) => {
              const lower = w.toLowerCase();
              const hit =
                wp[w]?.correct === true ||
                wp[lower]?.correct === true;
              return acc + (hit ? 1 : 0);
            }, 0);
          }
        } catch (e) {
          console.warn("[Word] Could not load progress for mastery-check summary:", e);
        }

        const nextStep = getNextLessonStep(
          currentLesson?.missions,
          missionSeqNum,
          "word_practice",
          effectiveTaskIndex,
          wordTasksLength
        );
        const continuePath =
          nextStep?.type === "task_page"
            ? `/student/${nextStep.page}?lessonId=${lessonId}&missionSequence=${nextStep.missionSequence}&taskId=${nextStep.taskId}&taskIndex=${nextStep.taskIndex}`
            : nextStep?.type === "mission_page"
            ? `/student/mission?lessonId=${lessonId}&missionSequence=${nextStep.missionSequence}`
            : "/student/dashboard";
        const firstTask = Array.isArray(wordTasks) ? (wordTasks[0] as any) : null;
        const firstTaskId = firstTask?.task_id ?? firstTask?.id ?? "1";
        const retryPath = `/student/word?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${firstTaskId}&taskIndex=0`;
        router.push(
          `/student/mastery-check?lessonId=${lessonId}&missionSequence=${missionSeqNum}&correct=${correctCount}&total=${wordTasksLength}&continueTo=${encodeURIComponent(
            continuePath
          )}&retryTo=${encodeURIComponent(retryPath)}`
        );
        return;
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = () => {
    clearTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId);
    setStatusVariant("initial");
    setIsMicActive(false);
    setShowingFeedback(false);
    setFeedbackData(null);
    setPendingReset(null);
  };

  const handleTryAgain = () => {
    if (!pendingReset) return;
    clearTaskOutcomeState(taskStateKeyPage, lessonId, missionSequence, taskId);
    const { missionSequence: ms, taskId: tid, taskType: ttype } = pendingReset;
    const page = PAGE_BY_TASK_TYPE[ttype] ?? "lesson";
    setPendingReset(null);
    router.push(
      `/student/${page}?lessonId=${lessonId}&missionSequence=${ms}&taskId=${tid}&taskIndex=0`
    );
  };

  const word =
    taskData?.visual?.[0]?.word ||
    (taskData as any)?.expectedResponse?.value ||
    "";
  const wordImage = taskData?.visual?.[0]?.image;
  const isSuccess = statusVariant === "success";
  const canContinue = !isTaskLoading && (isSuccess || feedbackData?.taskComplete === true);

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
              width: "48px",
              height: "48px",
              backgroundColor: isPlayingTTS ? "#666" : "#4A90E2",
              color: "#FFF",
              border: "none",
              borderRadius: "999px",
              cursor: isPlayingTTS ? "not-allowed" : "pointer",
              fontSize: "22px",
              fontWeight: 600,
              opacity: isPlayingTTS ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={isPlayingTTS ? "Playing TTS" : "Play TTS"}
          >
            {isPlayingTTS ? "🔊" : "▶"}
          </button>
        )}

        {/* StatusBox — renders as WordStatusBox */}
        {isTaskLoading ? (
          <StatusBox
            text="..."
            variant="default"
            letterHeight={100}
            letterGap={16}
          />
        ) : word ? (
          <StatusBox
            text={word}
            variant={statusVariant}
            imageSrc={wordImage}
            letterHeight={100}
            letterGap={16}
          />
        ) : null}

        {/* Feedback bubble removed – feedback is delivered via lesson-config TTS only */}

        {/* MicButton or Continue Button based on variant */}
        <div style={{ marginTop: "32px" }}>
          {pendingReset ? (
            <div className="flex items-center gap-8 justify-center">
              <PrimaryButton
                text="Try again"
                size="medium"
                variant="filled"
                onClick={handleTryAgain}
                disabled={isProcessing || isPlaying || isTaskLoading}
                className="flow-btn-attention"
              />
            </div>
          ) : canContinue ? (
            <div className="flex items-center gap-8">
              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                className="flow-icon-btn-attention"
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
                disabled={isProcessing || isTaskLoading}
                className="flow-btn-attention"
              />
            </div>
          ) : (
            <MicButton
              icon={isMicActive ? "pause" : "mic"}
              size={100}
              onClick={handleMicClick}
              disabled={isProcessing || isPlaying || isTaskLoading}
              className="flow-mic-btn-attention"
            />
          )}
        </div>

        {/* Retry counter */}
        {currentRetry > 0 && statusVariant !== "success" && (
          <p style={{ marginTop: "16px", color: "#FFF", opacity: 0.7, fontSize: "14px" }}>
            Attempt {currentRetry + 1} of {taskData?.retryLimit ?? 3}
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
