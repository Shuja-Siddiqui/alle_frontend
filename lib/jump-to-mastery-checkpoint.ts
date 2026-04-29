/**
 * Jump the student’s saved checkpoint to the **first word** of a `mastery_check` mission
 * (same resume shape the mission page + `/student/word` expect).
 *
 * Use when you’re stuck on the wrap mission and don’t want to replay the whole lesson.
 *
 * **Apply (browser, logged in):** open `/student/dev/jump-mastery` (non-production builds
 * or set `NEXT_PUBLIC_SHOW_LESSON_DEV_TOOLS=true`).
 *
 * **Apply (curl):** `GET /api/lessons/:lessonId/progress` then `POST` merged body to
 * `POST /api/lessons/:lessonId/progress/checkpoint` (see `applyCheckpointAtMasteryStart`).
 */

import { api } from "./api-client";

function missionSeq(m: any): number {
  return Number(m?.mission_sequence ?? m?.missionSequence);
}

function isMasteryCheckMission(m: any): boolean {
  const raw = m?.mission_type ?? m?.missionType;
  if (raw == null) return false;
  const t = String(raw).trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t === "mastery_check" || t === "masterycheck";
}

/**
 * Patch fields only (merge with existing checkpoint before POST).
 * Clears `wordProgress` entries for mastery words in `applyCheckpointAtMasteryStart`, not here.
 */
export function buildCheckpointPatchAtMasteryStart(
  missions: any[] | undefined,
  masteryMissionSequence: number
): Record<string, unknown> {
  if (!missions?.length) {
    throw new Error("jump-to-mastery: missions array is empty");
  }
  const mission = missions.find((m) => missionSeq(m) === masteryMissionSequence);
  if (!mission) {
    throw new Error(`jump-to-mastery: no mission with sequence ${masteryMissionSequence}`);
  }
  if (!isMasteryCheckMission(mission)) {
    throw new Error(
      `jump-to-mastery: mission ${masteryMissionSequence} is not mastery_check (type=${
        mission?.mission_type ?? mission?.missionType
      })`
    );
  }
  const wpTasks = mission.tasks?.word_practice;
  if (!Array.isArray(wpTasks) || wpTasks.length === 0) {
    throw new Error("jump-to-mastery: mission has no word_practice[] tasks");
  }
  const first = wpTasks[0] as { task_id?: string; id?: string };
  const firstTaskId = String(first?.task_id ?? first?.id ?? "1");

  const completedMissionSequences = missions
    .map((m) => missionSeq(m))
    .filter((n) => Number.isFinite(n) && n < masteryMissionSequence)
    .sort((a, b) => a - b);

  return {
    missionSequence: masteryMissionSequence,
    nextTaskId: firstTaskId,
    lastCompletedTaskId: null,
    activeTaskType: "word_practice",
    taskIndexInBatch: 0,
    completedMissionSequences,
  };
}

export async function applyCheckpointAtMasteryStart(
  lessonId: string,
  missions: any[] | undefined,
  masteryMissionSequence: number
): Promise<void> {
  const patch = buildCheckpointPatchAtMasteryStart(missions, masteryMissionSequence);
  const pr = await api.get<any>(`/lessons/${lessonId}/progress`);
  const existing = pr.data?.checkpoint ?? pr.checkpoint ?? {};

  const masteryMission = missions?.find((m) => missionSeq(m) === masteryMissionSequence);
  const masteryWords: string[] = Array.isArray(masteryMission?.tasks?.word_practice)
    ? masteryMission.tasks.word_practice
        .map((t: any) => String(t?.word ?? "").trim())
        .filter((w: string) => w.length > 0)
    : [];

  const wp = { ...(existing.wordProgress ?? {}) } as Record<string, unknown>;
  for (const w of masteryWords) {
    delete wp[w];
    delete wp[w.toLowerCase()];
  }

  // Only send deltas; backend merges onto the stored checkpoint (avoid posting a stale full snapshot).
  await api.post(`/lessons/${lessonId}/progress/checkpoint`, {
    ...patch,
    wordProgress: wp,
  });
}
