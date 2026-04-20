type StoredTaskOutcomeState<T = any> = {
  statusVariant: "initial" | "default" | "success" | "error";
  feedbackData: T | null;
  currentRetry?: number;
  pendingReset?: {
    missionSequence: number;
    taskId: string;
    taskType: string;
  } | null;
  showTryAgainOnly?: boolean;
};

function buildKey(
  page: string,
  lessonId: string | null,
  missionSequence: string | null,
  taskId: string | null
) {
  return `task-outcome:${page}:${lessonId || ""}:${missionSequence || ""}:${taskId || ""}`;
}

export function loadTaskOutcomeState<T = any>(
  page: string,
  lessonId: string | null,
  missionSequence: string | null,
  taskId: string | null
): StoredTaskOutcomeState<T> | null {
  if (typeof window === "undefined") return null;
  const key = buildKey(page, lessonId, missionSequence, taskId);
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredTaskOutcomeState<T>;
  } catch {
    return null;
  }
}

export function saveTaskOutcomeState<T = any>(
  page: string,
  lessonId: string | null,
  missionSequence: string | null,
  taskId: string | null,
  state: StoredTaskOutcomeState<T>
) {
  if (typeof window === "undefined") return;
  const key = buildKey(page, lessonId, missionSequence, taskId);
  sessionStorage.setItem(key, JSON.stringify(state));
}

export function clearTaskOutcomeState(
  page: string,
  lessonId: string | null,
  missionSequence: string | null,
  taskId: string | null
) {
  if (typeof window === "undefined") return;
  const key = buildKey(page, lessonId, missionSequence, taskId);
  sessionStorage.removeItem(key);
}

export function clearTaskOutcomeStateScope(
  page: string,
  lessonId: string | null,
  missionSequence?: string | null
) {
  if (typeof window === "undefined") return;
  const prefix = missionSequence != null
    ? `task-outcome:${page}:${lessonId || ""}:${missionSequence}:`
    : `task-outcome:${page}:${lessonId || ""}:`;

  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i += 1) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(prefix)) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

