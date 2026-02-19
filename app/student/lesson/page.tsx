"use client";

import { useSearchParams,  useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MascotAvatar } from "../../../components/MascotAvatar";
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
import { api } from "../../../lib/api-client";
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

export default function LessonPage() {
  const { isOverlayOpen, setOverlayOpen } = useLevelOverlay();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { playTTSWithSSML } = useTTS();
  const { startRecording, stopRecording, assessPhoneme } = useSpeechAssessment();

  // State
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("initial");
  const [isMicActive, setIsMicActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [currentRetry, setCurrentRetry] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);

  // Get data from URL params
  const lessonId = searchParams.get("lessonId");
  const missionSequence = searchParams.get("missionSequence");
  const taskId = searchParams.get("taskId");
  const taskIndexParam = searchParams.get("taskIndex");

  const taskIndex = taskIndexParam ? parseInt(taskIndexParam) : 0;

  // Refs
  const processedRef = useRef(false);

  // Fetch task data from backend on mount
  useEffect(() => {
    if (!lessonId || !missionSequence || !taskId || processedRef.current) return;
    processedRef.current = true;

    const fetchTaskData = async () => {
      try {
        const response = await api.get<any>(
          `/lessons/${lessonId}/progress/task`,
          {
            missionSequence,
            taskId,
          }
        );

        const data = response.data;
        setTaskData(data);
        setCurrentRetry(data.currentRetries || 0);

        // Auto-play instruction TTS after a brief delay
        setTimeout(() => {
          playTTSWithSSML(data.tts.text, data.tts.ssml || data.tts.text);
        }, 300);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, [lessonId, missionSequence, taskId, playTTSWithSSML]);

  // Handle mic button click
  const handleMicClick = async () => {
    if (isProcessing) return;

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
      // Stop recording and assess
      setIsProcessing(true);
      try {
        const audioBlob = await stopRecording();
        setStatusVariant("default"); // Show recording state

        // Assess the phoneme
        if (taskData && taskData.visual && taskData.visual.length > 0) {
          const phoneme = taskData.visual[0].word || "S";
          const result = await assessPhoneme(audioBlob, phoneme.toLowerCase());

          setFeedbackData(result);

          // Play feedback TTS
          if (result.feedbackType === "exactMatch") {
            setStatusVariant("success");
            // Play success feedback
            const successFeedback = taskData.feedback?.tts_correctFeedback || "Great job!";
            await playTTSWithSSML(successFeedback);

            // Move to next task after success
            setTimeout(() => {
              handleContinue();
            }, 1500);
          } else if (result.feedbackType === "closeMatch") {
            setStatusVariant("error");
            setShowingFeedback(true);
            // Play improvement feedback
            const improvementFeedback = taskData.feedback?.tts_incorrectFeedback || "Try again";
            await playTTSWithSSML(improvementFeedback);
          } else {
            // wrongSound
            setStatusVariant("error");
            setShowingFeedback(true);
            const incorrectFeedback = taskData.feedback?.tts_incorrectFeedback || "That's not quite right";
            await playTTSWithSSML(incorrectFeedback);

            // Check retry logic
            if (currentRetry + 1 >= (taskData.retryLimit || 3)) {
              // Max retries reached - auto-advance
              setTimeout(() => {
                handleContinue();
              }, 2000);
            } else {
              // Auto-reset for retry after feedback
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

  const handleContinue = async () => {
    if (!lessonId || !missionSequence || !taskId) return;

    try {
      // Send completion to backend
      const response = await api.post<any>(
        `/lessons/${lessonId}/progress/task/complete`,
        {
          missionSequence: parseInt(missionSequence),
          taskId,
        }
      );

      // Navigate to next task or mission
      const nextTaskIndex = taskIndex + 1;
      // TODO: Get task count and determine if move to next task type or mission
      // For now, just reload to get next task
      router.push(
        `/student/lesson?lessonId=${lessonId}&missionSequence=${missionSequence}&taskId=${nextTaskIndex}`
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

  const phoneme = taskData.visual?.[0]?.word || "S";
  const visualImage = taskData.visual?.[0]?.image;
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
        {/* StatusBox */}
        {phoneme && (
          <StatusBox 
            text={phoneme} 
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

        {/* Feedback text */}
        {showingFeedback && feedbackData && (
          <div
            style={{
              padding: "16px 24px",
              borderRadius: "12px",
              background: feedbackData.feedbackType === "exactMatch" ? "rgba(117, 255, 26, 0.2)" : "rgba(255, 0, 0, 0.2)",
              border: `2px solid ${feedbackData.feedbackType === "exactMatch" ? "#75FF1A" : "#FF0000"}`,
              color: feedbackData.feedbackType === "exactMatch" ? "#75FF1A" : "#FF6B6B",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
              {feedbackData.feedbackText || (feedbackData.feedbackType === "exactMatch" ? "Great job!" : "Try again")}
            </p>
          </div>
        )}

        {/* Mic or Continue Button */}
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
            <MicButton 
              icon={isMicActive ? "pause" : "mic"} 
              size={100}
              onClick={handleMicClick}
              disabled={isProcessing}
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

      {/* Mascot Avatar */}
      {!isOverlayOpen && (
        <div
          className="absolute"
          style={{
            left: "32px",
            bottom: "32px",
          }}
        >
          <MascotAvatar
            imageSrc="/assets/icons/mascots/mascot.png"
            alt="Mascot"
          />
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
        >
          <MascotAvatar
            imageSrc="/assets/icons/mascots/mascot.png"
            alt="Mascot"
          />
        </div>
      )}

      {/* Level Overlay */}
      <LevelOverlay
        isOpen={isOverlayOpen}
        onClose={() => setOverlayOpen(false)}
        maxXp={100}
        lessonId={lessonId}
        missionSequence={missionSequence}
      />
    </div>
  );
}

