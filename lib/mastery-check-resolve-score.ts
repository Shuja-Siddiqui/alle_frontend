/**
 * When `/student/mastery-check` opens without `correct` & `total` query params (e.g. LevelOverlay),
 * derive the score from saved checkpoint + lesson mission content (same rules as batch summaries).
 */

function missionsFromLessonPayload(lessonPayload: unknown): any[] {
  const p = lessonPayload as Record<string, unknown> | null;
  if (!p) return [];
  const data = (p.data ?? p) as Record<string, unknown>;
  const content = (data.content ?? {}) as Record<string, unknown>;
  if (Array.isArray(content.missions)) return content.missions as any[];
  const lesson1 = content.lesson1 as Record<string, unknown> | undefined;
  if (lesson1 && Array.isArray(lesson1.missions)) return lesson1.missions as any[];
  return [];
}

export function findMissionBySequence(missions: any[], missionSequence: number): any | undefined {
  return missions.find(
    (m) => Number(m?.mission_sequence ?? m?.missionSequence) === missionSequence
  );
}

export function computeScoreForMissionFromCheckpoint(
  mission: any | undefined,
  checkpoint: any | null | undefined
): { correct: number; total: number } {
  if (!mission?.tasks) throw new Error("mastery-check: mission tasks are missing");
  if (!checkpoint) throw new Error("mastery-check: checkpoint is missing");
  const tasks = mission.tasks;
  const wp = checkpoint.wordProgress ?? {};
  const sound = checkpoint.alphabetSoundProgress ?? {};

  if (Array.isArray(tasks.word_practice) && tasks.word_practice.length > 0) {
    const keys = tasks.word_practice
      .map((t: any) => String(t?.word ?? "").trim())
      .filter((w: string) => w.length > 0);
    let correct = 0;
    for (const w of keys) {
      const lo = w.toLowerCase();
      if (wp[w]?.correct === true || wp[lo]?.correct === true) correct += 1;
    }
    if (keys.length === 0) throw new Error("mastery-check: word_practice has no valid words");
    return { correct, total: keys.length };
  }

  if (Array.isArray(tasks.alphabet_practice) && tasks.alphabet_practice.length > 0) {
    const letters = tasks.alphabet_practice
      .map((t: any) =>
        String(t?.letter ?? t?.visual?.[0]?.word ?? "").trim()
      )
      .filter((L: string) => L.length > 0);
    let correct = 0;
    for (const L of letters) {
      const upper = L.toUpperCase();
      const lower = L.toLowerCase();
      if (
        sound[L]?.mastered === true ||
        sound[upper]?.mastered === true ||
        sound[lower]?.mastered === true
      ) {
        correct += 1;
      }
    }
    if (letters.length === 0) throw new Error("mastery-check: alphabet_practice has no valid letters");
    return { correct, total: letters.length };
  }

  if (Array.isArray(tasks.blending_practice) && tasks.blending_practice.length > 0) {
    const keys = tasks.blending_practice
      .map((t: any) => String(t?.word ?? "").trim())
      .filter((w: string) => w.length > 0);
    let correct = 0;
    for (const w of keys) {
      const lo = w.toLowerCase();
      if (wp[w]?.correct === true || wp[lo]?.correct === true) correct += 1;
    }
    if (keys.length === 0) throw new Error("mastery-check: blending_practice has no valid words");
    return { correct, total: keys.length };
  }

  if (Array.isArray(tasks.sentence_practice) && tasks.sentence_practice.length > 0) {
    const keys = tasks.sentence_practice
      .map((t: any) => String(t?.sentence ?? t?.word ?? "").trim())
      .filter((k: string) => k.length > 0);
    let correct = 0;
    for (const k of keys) {
      const lo = k.toLowerCase();
      if (wp[k]?.correct === true || wp[lo]?.correct === true) correct += 1;
    }
    if (keys.length === 0) throw new Error("mastery-check: sentence_practice has no valid items");
    return { correct, total: keys.length };
  }

  throw new Error("mastery-check: no supported task array found on mission");
}

export function resolveMasteryCheckScoreFromApis(args: {
  lessonPayload: unknown;
  missionSequence: number;
  checkpoint: any | null | undefined;
}): { correct: number; total: number } {
  const missions = missionsFromLessonPayload(args.lessonPayload);
  if (!missions.length) throw new Error("mastery-check: lesson missions are missing");
  const mission = findMissionBySequence(missions, args.missionSequence);
  if (!mission) {
    throw new Error(`mastery-check: mission sequence ${args.missionSequence} not found`);
  }
  return computeScoreForMissionFromCheckpoint(mission, args.checkpoint);
}
