/**
 * TTS Hook
 * Handles Azure TTS integration with voice selection support
 */

import { useState, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api-client";

interface TTSOptions {
  voice?: string;
  lang?: string;
  useSSML?: boolean;
}

interface TTSState {
  isPlaying: boolean;
  isGenerating: boolean;
  error: string | null;
}

const DEFAULT_VOICE = "en-US-JennyNeural";

/**
 * Hook for Text-to-Speech functionality
 */
export function useTTS() {
  const { user } = useAuth();
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isGenerating: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastKeyRef = useRef<string | null>(null);
  const queueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);

  // Get user's preferred voice or default
  const getVoice = useCallback((): string => {
    return user?.metadata?.voiceAgent || DEFAULT_VOICE;
  }, [user]);

  /**
   * Play TTS audio
   * @param text - Text or SSML to speak
   * @param options - TTS options (voice, lang, useSSML)
   * @returns Promise that resolves when audio finishes playing
   */
  const playTTS = useCallback(
    async (
      text: string,
      options: TTSOptions = {}
    ): Promise<void> => {
      if (!text || !text.trim()) {
        return Promise.resolve();
      }

      // MOCK MODE: Skip actual TTS API call
      const mockMode = localStorage.getItem('MOCK_MODE') === 'true';
      if (mockMode) {
        console.log('[MOCK MODE] Skipping TTS API call:', text.substring(0, 50) + '...');
        setState((prev) => ({ ...prev, isGenerating: false, isPlaying: false }));
        // Simulate audio playback duration (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        setState((prev) => ({ ...prev, isGenerating: true, error: null }));

        const voice = options.voice || getVoice();
        const lang = options.lang || "en-US";
        const isSSML = options.useSSML ?? text.trim().startsWith("<speak");

        // Call TTS API (use fetch directly for blob response)
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
        const token = localStorage.getItem("auth_token");

        console.log("[LessonTTS] Starting TTS request", {
          text,
          voice,
          lang,
        });
        
        fetch(`${API_BASE_URL}/speech/tts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ text, voice, lang }),
        })
          .then(async (response) => {
            console.log("[LessonTTS] Response status", response.status, response.statusText);
            console.log("[LessonTTS] Response headers", {
              contentType: response.headers.get("content-type"),
              contentLength: response.headers.get("content-length"),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error("[useTTS] Error response:", errorText);
              let error;
              try {
                error = JSON.parse(errorText);
              } catch {
                error = { message: errorText || "Failed to generate speech" };
              }
              throw new Error(error.message || error.error || "Failed to generate speech");
            }

            const contentType = response.headers.get("content-type");
            console.log("[LessonTTS] Content-Type", contentType);
            
            return response.blob();
          })
          .then((blob) => {
            console.log("[LessonTTS] Audio blob received", {
              size: blob.size,
              type: blob.type,
            });

            if (blob.size === 0) {
              throw new Error("Received empty audio blob");
            }

            setState((prev) => ({
              ...prev,
              isGenerating: false,
              isPlaying: true,
            }));

            // Create audio element and play
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Add more event listeners for debugging
            audio.addEventListener("loadstart", () => {
              console.log("[LessonTTS] Audio load started");
            });

            audio.addEventListener("loadeddata", () => {
              console.log("[LessonTTS] Audio data loaded");
            });

            audio.addEventListener("canplay", () => {
              console.log("[LessonTTS] Audio can play");
            });

            audio.addEventListener("canplaythrough", () => {
              console.log("[LessonTTS] Audio can play through");
            });

            // Clean up URL when done
            audio.addEventListener("ended", () => {
              console.log("[LessonTTS] Audio playback ended");
              URL.revokeObjectURL(audioUrl);
              setState((prev) => ({ ...prev, isPlaying: false }));
              resolve();
            });

            audio.addEventListener("error", (error) => {
              console.error("[useTTS] Audio error:", {
                error,
                code: audio.error?.code,
                message: audio.error?.message,
              });
              URL.revokeObjectURL(audioUrl);
              setState((prev) => ({
                ...prev,
                isPlaying: false,
                error: `Failed to play audio: ${audio.error?.message || "Unknown error"}`,
              }));
              reject(new Error(audio.error?.message || "Failed to play audio"));
            });

            // Play audio
            console.log("[LessonTTS] Calling audio.play()...");
            audio.play()
              .then(() => {
                console.log("[LessonTTS] audio.play() succeeded, playback started");
              })
              .catch((error) => {
                console.error("[LessonTTS] audio.play() failed", error);
                URL.revokeObjectURL(audioUrl);
                setState((prev) => ({
                  ...prev,
                  isPlaying: false,
                  error: `Failed to start playback: ${error.message}`,
                }));
                reject(error);
              });
          })
          .catch((error) => {
            console.error("[LessonTTS] Fetch/blob error", error);
            setState((prev) => ({
              ...prev,
              isGenerating: false,
              error: error.message || "Failed to generate speech",
            }));
            reject(error);
          });
      });
    },
    [getVoice]
  );

  /**
   * Play TTS with automatic SSML detection
   * Prefers SSML version if available
   */
  const playTTSWithSSML = useCallback(
    async (
      text: string,
      ssmlText?: string,
      options: TTSOptions = {}
    ): Promise<void> => {
      // Prefer SSML if available
      const textToUse = ssmlText && ssmlText.trim() ? ssmlText : text;
      const useSSML = !!ssmlText && ssmlText.trim().startsWith("<speak");
      const key = textToUse.trim();

      // If we already have audio for this exact text/SSML, just replay it
      if (lastKeyRef.current === key && audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          return;
        } catch (error) {
          console.error("[useTTS] Replay audio.play() failed:", error);
          // Fall through to refetch if replay fails
        }
      }

      // Remember this text so subsequent calls can replay without refetching
      lastKeyRef.current = key;
      return playTTS(textToUse, { ...options, useSSML });
    },
    [playTTS]
  );

  /**
   * Queue multiple TTS requests
   * Plays them sequentially
   */
  const queueTTS = useCallback(
    async (texts: string[], options: TTSOptions = {}): Promise<void> => {
      for (const text of texts) {
        await playTTS(text, options);
      }
    },
    [playTTS]
  );

  /**
   * Stop current TTS playback
   */
  const stopTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  return {
    playTTS,
    playTTSWithSSML,
    queueTTS,
    stopTTS,
    isPlaying: state.isPlaying,
    isGenerating: state.isGenerating,
    error: state.error,
  };
}

