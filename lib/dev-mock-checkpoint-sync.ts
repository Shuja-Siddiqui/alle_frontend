/**
 * When MOCK_MODE skips real speech APIs, the server never sees assessment results.
 * Call these after a **mock** success so checkpoint matches what real flows would write,
 * keeping mastery summaries, mission completion, and resume state accurate.
 */

import { api } from "./api-client";

export async function devMockSyncWordCorrect(lessonId: string, word: string): Promise<void> {
  const w = String(word || "").trim();
  if (!lessonId || !w) return;
  try {
    const pr = await api.get<any>(`/lessons/${lessonId}/progress`);
    const cp = pr.data?.checkpoint ?? pr.checkpoint ?? {};
    const prev = (cp.wordProgress ?? {}) as Record<string, unknown>;
    const lower = w.toLowerCase();
    const prevEntry =
      (prev[w] as { xpEarned?: number } | undefined) ??
      (prev[lower] as { xpEarned?: number } | undefined);
    await api.post(`/lessons/${lessonId}/progress/checkpoint`, {
      wordProgress: {
        ...prev,
        [w]: {
          attempted: true,
          correct: true,
          retries: 0,
          xpEarned: prevEntry?.xpEarned ?? 0,
        },
        // Keep lowercase mirror to survive case mismatches between task payload and mission words.
        [lower]: {
          attempted: true,
          correct: true,
          retries: 0,
          xpEarned: prevEntry?.xpEarned ?? 0,
        },
      },
      lastActivity: {
        type: "word_practice",
        word: w,
        correct: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.warn("[MOCK_MODE] devMockSyncWordCorrect failed", e);
  }
}

/** Letter key should match lesson task (usually single uppercase letter). */
export async function devMockSyncAlphabetMastered(
  lessonId: string,
  letter: string
): Promise<void> {
  const raw = String(letter || "").trim();
  if (!lessonId || !raw) return;
  const key = raw.length === 1 ? raw.toUpperCase() : raw;
  try {
    const pr = await api.get<any>(`/lessons/${lessonId}/progress`);
    const cp = pr.data?.checkpoint ?? pr.checkpoint ?? {};
    const prev = (cp.alphabetSoundProgress ?? {}) as Record<string, unknown>;
    const prevEntry = prev[key] as { xpEarned?: number } | undefined;
    await api.post(`/lessons/${lessonId}/progress/checkpoint`, {
      alphabetSoundProgress: {
        ...prev,
        [key]: {
          attempted: true,
          mastered: true,
          xpEarned: prevEntry?.xpEarned ?? 0,
        },
      },
      lastActivity: {
        type: "sound_practice",
        soundLetter: key,
        mastered: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.warn("[MOCK_MODE] devMockSyncAlphabetMastered failed", e);
  }
}
