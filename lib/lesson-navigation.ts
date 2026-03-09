/**
 * Lesson flow: mission 1 → mission 2 → mission 3 (mastery_check) → mission 4 (wrap).
 * Within each mission: alphabet_practice → blending_practice → word_practice → sentence_practice
 * (mastery_check missions only have word_practice). Empty arrays are skipped.
 *
 * Task order: Display order is always the ARRAY ORDER (index 0, 1, 2, ...). task_id is for
 * identification only (API/backend). If task_id is missing, array index is the order of appearance.
 */

/**
 * Resolve the effective array index for the current task. Order is always array order.
 * - If taskIndex is provided and valid, use it.
 * - Else if taskId is provided, find index in tasks where task_id or id matches.
 * - Else use 0.
 */
export function resolveTaskIndex(
  tasks: unknown[] | undefined,
  taskId: string | null,
  taskIndexParam: string | null
): number {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;
  const fromUrl = taskIndexParam !== null && taskIndexParam !== "" ? parseInt(taskIndexParam, 10) : NaN;
  if (!Number.isNaN(fromUrl) && fromUrl >= 0 && fromUrl < tasks.length) return fromUrl;
  if (taskId !== null && taskId !== "") {
    const i = (tasks as Record<string, unknown>[]).findIndex(
      (t) => String((t as any)?.task_id ?? (t as any)?.id ?? "") === String(taskId)
    );
    if (i >= 0) return i;
  }
  return 0;
}

const TASK_TYPE_ORDER = [
  "alphabet_practice",
  "blending_practice",
  "word_practice",
  "sentence_practice",
  "mastery_check",
] as const;

const PAGE_BY_TASK_TYPE: Record<string, string> = {
  alphabet_practice: "lesson",
  blending_practice: "blending",
  word_practice: "word",
  sentence_practice: "sentence",
  mastery_check: "word",
};

type MissionLike = {
  mission_sequence?: number;
  missionSequence?: number;
  mission_type?: string;
  missionType?: string;
  tasks?: Record<string, unknown>;
};

export type NextStep =
  | { type: "same_page"; nextIndex: number }
  | {
      type: "task_page";
      missionSequence: number;
      taskType: string;
      page: string;
      taskId: string;
      taskIndex: number;
    }
  | { type: "mission_page"; missionSequence: number };

function getMissionSeq(m: MissionLike): number {
  return (m.mission_sequence ?? m.missionSequence) ?? 0;
}

function hasTasks(tasks: unknown): tasks is unknown[] {
  return Array.isArray(tasks) && tasks.length > 0;
}

/**
 * Get the next step in the lesson flow.
 * - If there is a next task in the same type → same_page with nextIndex.
 * - Else find next task type in order with a non-empty array → task_page.
 * - Else next mission; if that mission is wrap → mission_page (wrap); else task_page for first task of that mission.
 */
export function getNextLessonStep(
  missions: MissionLike[] | undefined,
  currentMissionSequence: number,
  currentTaskType: string,
  currentTaskIndex: number,
  currentTaskTypeLength: number
): NextStep | null {
  if (!missions || missions.length === 0) return null;

  const mission = missions.find((m) => getMissionSeq(m) === currentMissionSequence);
  if (!mission?.tasks) return null;

  const nextIndex = currentTaskIndex + 1;

  // More tasks in same type → stay on same page, next index
  if (nextIndex < currentTaskTypeLength) {
    return { type: "same_page", nextIndex };
  }

  // Find next task type in order with non-empty array
  const currentOrderIndex = TASK_TYPE_ORDER.indexOf(currentTaskType as (typeof TASK_TYPE_ORDER)[number]);
  if (currentOrderIndex === -1) {
    // Unknown type (e.g. "introduction" or "results"); treat as end of types for this mission
  } else {
    for (let i = currentOrderIndex + 1; i < TASK_TYPE_ORDER.length; i++) {
      const taskType = TASK_TYPE_ORDER[i];
      const tasks = mission.tasks[taskType];
      if (hasTasks(tasks)) {
        const first = (tasks as Record<string, unknown>[])[0];
        const taskId = String((first as any)?.task_id ?? (first as any)?.id ?? "1");
        const page = PAGE_BY_TASK_TYPE[taskType] ?? "word";
        return {
          type: "task_page",
          missionSequence: currentMissionSequence,
          taskType,
          page,
          taskId,
          taskIndex: 0,
        };
      }
    }
  }

  // No more task types in this mission → go to next mission's PAGE first (show mission type / intro), not straight to first task
  const nextMissionSeq = currentMissionSequence + 1;
  const nextMission = missions.find((m) => getMissionSeq(m) === nextMissionSeq);
  if (!nextMission) return null;

  // Always land on the mission page for the next mission (e.g. direct_instruction, mastery_check, wrap).
  // User sees mission type and intro, then clicks Continue → mission page routes to first task.
  return { type: "mission_page", missionSequence: nextMissionSeq };
}

export { TASK_TYPE_ORDER, PAGE_BY_TASK_TYPE };
