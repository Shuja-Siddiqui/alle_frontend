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

      return new Promise((resolve, reject) => {
        setState((prev) => ({ ...prev, isGenerating: true, error: null }));

        const voice = options.voice || getVoice();
        const lang = options.lang || "en-US";
        const isSSML = options.useSSML ?? text.trim().startsWith("<speak");

        // Call TTS API (use fetch directly for blob response)
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
        const token = localStorage.getItem("auth_token");

        fetch(`${API_BASE_URL}/speech/tts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ text, voice, lang }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const error = await response.json().catch(() => ({
                message: "Failed to generate speech",
              }));
              throw new Error(error.message || "Failed to generate speech");
            }
            return response.blob();
          })
          .then((blob) => {
            setState((prev) => ({
              ...prev,
              isGenerating: false,
              isPlaying: true,
            }));

            // Create audio element and play
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Clean up URL when done
            audio.addEventListener("ended", () => {
              URL.revokeObjectURL(audioUrl);
              setState((prev) => ({ ...prev, isPlaying: false }));
              resolve();
            });

            audio.addEventListener("error", (error) => {
              URL.revokeObjectURL(audioUrl);
              setState((prev) => ({
                ...prev,
                isPlaying: false,
                error: "Failed to play audio",
              }));
              reject(error);
            });

            // Play audio
            audio.play().catch((error) => {
              URL.revokeObjectURL(audioUrl);
              setState((prev) => ({
                ...prev,
                isPlaying: false,
                error: "Failed to play audio",
              }));
              reject(error);
            });
          })
          .catch((error) => {
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

