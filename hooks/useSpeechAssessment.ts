/**
 * Speech Assessment Hook
 * Handles audio recording and speech assessment (SpeechSuper for phonemes, Azure for words)
 */

import { useState, useCallback, useRef } from "react";
import { api } from "../lib/api-client";

interface AssessmentResult {
  success: boolean;
  qualityScore: number;
  recognizedText?: string;
  feedbackType: "exactMatch" | "closeMatch" | "wrongSound";
  feedbackText?: string;
  error?: string;
}

interface RecordingState {
  isRecording: boolean;
  isAssessing: boolean;
  error: string | null;
}

/**
 * Hook for speech assessment functionality
 */
export function useSpeechAssessment() {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isAssessing: false,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setRecordingState((prev) => ({ ...prev, isRecording: true, error: null }));
    } catch (error: any) {
      setRecordingState((prev) => ({
        ...prev,
        isRecording: false,
        error: error.message || "Failed to start recording",
      }));
      throw error;
    }
  }, []);

  /**
   * Stop recording and return audio blob
   */
  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !recordingState.isRecording) {
        reject(new Error("Not currently recording"));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        // Stop media stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // Create blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setRecordingState((prev) => ({ ...prev, isRecording: false }));
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [recordingState.isRecording]);

  /**
   * Assess phoneme pronunciation using SpeechSuper API
   * Used for alphabet_practice tasks
   */
  const assessPhoneme = useCallback(
    async (
      audioBlob: Blob,
      phoneme: string,
      options: {
        dictType?: string;
        ageGroup?: number;
        slack?: number;
      } = {}
    ): Promise<AssessmentResult> => {
      setRecordingState((prev) => ({ ...prev, isAssessing: true, error: null }));

      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "phoneme.webm");
        formData.append("phoneme", phoneme);
        formData.append("dictType", options.dictType || "CMU");
        formData.append("ageGroup", String(options.ageGroup || 1));
        formData.append("slack", String(options.slack || 0.5));

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
        const token = localStorage.getItem("auth_token");

        const response = await fetch(
          `${API_BASE_URL}/speech/superspeech/phoneme`,
          {
            method: "POST",
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Assessment failed");
        }

        const qualityScore = data.qualityScore || 0;
        let feedbackType: "exactMatch" | "closeMatch" | "wrongSound";

        // Determine feedback type based on score
        if (qualityScore >= 90) {
          feedbackType = "exactMatch";
        } else if (qualityScore >= 60) {
          feedbackType = "closeMatch";
        } else {
          feedbackType = "wrongSound";
        }

        setRecordingState((prev) => ({ ...prev, isAssessing: false }));

        return {
          success: true,
          qualityScore,
          recognizedText: data.soundLike,
          feedbackType,
          feedbackText: data.feedbackText,
        };
      } catch (error: any) {
        setRecordingState((prev) => ({
          ...prev,
          isAssessing: false,
          error: error.message || "Assessment failed",
        }));
        return {
          success: false,
          qualityScore: 0,
          feedbackType: "wrongSound",
          error: error.message || "Assessment failed",
        };
      }
    },
    []
  );

  /**
   * Assess word/sentence pronunciation using Azure API
   * Used for blending_practice, word_practice, sentence_practice
   */
  const assessWord = useCallback(
    async (
      audioBlob: Blob,
      lessonId: string,
      missionSequence: number,
      taskId: string,
      expectedText: string
    ): Promise<AssessmentResult> => {
      setRecordingState((prev) => ({ ...prev, isAssessing: true, error: null }));

      try {
        // Convert blob to base64
        const base64Audio = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });

        const response = await api.post<{
          success: boolean;
          data: {
            accuracyScore: number;
            recognizedText: string;
            feedbackType: string;
            feedbackText: string;
            xpEarned: number;
          };
        }>(`/lessons/${lessonId}/progress/response`, {
          missionSequence,
          taskId,
          audioData: base64Audio,
          mimeType: "audio/webm",
          taskStartTime: new Date().toISOString(),
        });

        const result = response.data || response;
        const accuracyScore = result.accuracyScore || 0;

        let feedbackType: "exactMatch" | "closeMatch" | "wrongSound";
        if (accuracyScore >= 90) {
          feedbackType = "exactMatch";
        } else if (accuracyScore >= 60) {
          feedbackType = "closeMatch";
        } else {
          feedbackType = "wrongSound";
        }

        setRecordingState((prev) => ({ ...prev, isAssessing: false }));

        return {
          success: true,
          qualityScore: accuracyScore,
          recognizedText: result.recognizedText,
          feedbackType,
          feedbackText: result.feedbackText,
        };
      } catch (error: any) {
        setRecordingState((prev) => ({
          ...prev,
          isAssessing: false,
          error: error.message || "Assessment failed",
        }));
        return {
          success: false,
          qualityScore: 0,
          feedbackType: "wrongSound",
          error: error.message || "Assessment failed",
        };
      }
    },
    []
  );

  /**
   * Cancel current recording
   */
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setRecordingState((prev) => ({
      ...prev,
      isRecording: false,
      isAssessing: false,
    }));
  }, [recordingState.isRecording]);

  return {
    startRecording,
    stopRecording,
    assessPhoneme,
    assessWord,
    cancelRecording,
    isRecording: recordingState.isRecording,
    isAssessing: recordingState.isAssessing,
    error: recordingState.error,
  };
}

