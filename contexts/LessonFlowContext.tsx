/**
 * Lesson Flow Context
 * Manages lesson progression, task navigation, TTS state, and checkpoint updates
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useLesson } from "./LessonContext";
import { useAuth } from "./AuthContext";
import { api } from "../lib/api-client";
import type { Lesson } from "../app/student/types/lesson.types";

// ============================================
// Types
// ============================================

export type TaskType =
  | "alphabet_practice"
  | "blending_practice"
  | "word_practice"
  | "sentence_practice"
  | "mastery_check"
  | null;

export interface BatchProgress {
  missionSequence: number;
  taskType: TaskType;
  completedTasks: number[]; // Indices of completed tasks
  xpEarned: number; // XP earned in current batch
  retryCounts: Record<number, number>; // taskIndex -> retry count
}

/** Canonical checkpoint shape (matches backend). Use these keys when reading/writing. */
export interface Checkpoint {
  missionSequence: number;
  nextTaskId: string;
  lastCompletedTaskId: string | null;
  activeTaskType: TaskType;
  taskIndexInBatch: number;
  completedMissionSequences: number[];
  completedTasksByMissionAndType: Record<number, Record<string, number[]>>; // missionSeq -> taskType -> task indices
  taskRetryCounts: Record<number, Record<string, Record<number, number>>>; // missionSeq -> taskType -> taskIndex -> retry count
  inProgressBatch: BatchProgress | null;
  alphabetSoundProgress: Record<string, { attempted: boolean; mastered?: boolean; xpEarned?: number }>;
  wordProgress: Record<string, { attempted: boolean; correct?: boolean; retries?: number; xpEarned?: number }>;
  lastActivity: { type: string; missionSequence?: number; taskType?: TaskType; taskId?: string; timestamp: string } | null;
  totalXpEarnedInLesson: number;
  lessonMasteryScore: number | null;
}

export interface LessonFlowState {
  // Current position
  currentMissionSequence: number;
  currentTaskType: TaskType;
  currentTaskIndex: number;

  // Checkpoint data
  checkpoint: Checkpoint | null;

  // Task state
  taskState: "idle" | "listening" | "recording" | "assessing" | "feedback" | "complete";

  // Batch progress (temporary, not saved until batch completes)
  currentBatchProgress: BatchProgress | null;

  // Loading state
  isLoading: boolean;
}

export interface LessonFlowContextType extends LessonFlowState {
  // Navigation
  initializeLesson: (lesson: Lesson) => void;
  startMission: (missionSequence: number) => void;
  startTaskType: (taskType: TaskType) => void;
  moveToNextTask: () => void;
  moveToNextTaskType: () => void;
  moveToNextMission: () => void;

  // Task progress
  completeTask: (taskIndex: number, xpEarned: number, retryCount: number) => void;
  failTask: (taskIndex: number, retryCount: number) => void;
  resetTaskType: () => void; // Reset to first task of current task type

  // Batch management
  completeBatch: () => Promise<void>; // Save checkpoint when batch completes

  // Checkpoint
  updateCheckpoint: (updates: Partial<Checkpoint>) => Promise<void>;
  loadCheckpoint: () => Promise<void>;
}

interface LessonFlowProviderProps {
  children: ReactNode;
}

// ============================================
// Context Creation
// ============================================

const LessonFlowContext = createContext<LessonFlowContextType | undefined>(
  undefined
);

// ============================================
// Provider Component
// ============================================

export function LessonFlowProvider({ children }: LessonFlowProviderProps) {
  const { currentLesson, updateLesson } = useLesson();
  const { user } = useAuth();

  const [state, setState] = useState<LessonFlowState>({
    currentMissionSequence: 1,
    currentTaskType: null,
    currentTaskIndex: 0,
    checkpoint: null,
    taskState: "idle",
    currentBatchProgress: null,
    isLoading: false,
  });

  // Initialize lesson flow
  const initializeLesson = useCallback(
    (lesson: Lesson) => {
      if (!lesson) return;

      const initialCheckpoint: Checkpoint = {
        missionSequence: 1,
        nextTaskId: "1",
        lastCompletedTaskId: null,
        activeTaskType: null,
        taskIndexInBatch: 0,
        completedMissionSequences: [],
        completedTasksByMissionAndType: {},
        taskRetryCounts: {},
        inProgressBatch: null,
        alphabetSoundProgress: {},
        wordProgress: {},
        lastActivity: null,
        totalXpEarnedInLesson: 0,
        lessonMasteryScore: null,
      };

      setState({
        currentMissionSequence: 1,
        currentTaskType: null,
        currentTaskIndex: 0,
        checkpoint: initialCheckpoint,
        taskState: "idle",
        currentBatchProgress: null,
        isLoading: false,
      });
    },
    []
  );

  // Start a mission
  const startMission = useCallback((missionSequence: number) => {
    setState((prev) => ({
      ...prev,
      currentMissionSequence: missionSequence,
      currentTaskType: null,
      currentTaskIndex: 0,
      taskState: "idle",
    }));
  }, []);

  // Start a task type (e.g., alphabet_practice)
  const startTaskType = useCallback(
    (taskType: TaskType) => {
      if (!taskType) return;

      setState((prev) => {
        const missionSeq = prev.currentMissionSequence;
        const checkpoint = prev.checkpoint;

        const retries =
          checkpoint?.taskRetryCounts[missionSeq]?.[taskType] || {};
        const needsReset = Object.values(retries).some((count) => count >= 3);

        // Initialize batch progress
        const batchProgress: BatchProgress = {
          missionSequence: missionSeq,
          taskType,
          completedTasks: [],
          xpEarned: 0,
          retryCounts: {},
        };

        return {
          ...prev,
          currentTaskType: taskType,
          currentTaskIndex: needsReset ? 0 : prev.currentTaskIndex,
          currentBatchProgress: batchProgress,
          taskState: "idle",
        };
      });
    },
    []
  );

  // Move to next task in current batch
  const moveToNextTask = useCallback(() => {
    setState((prev) => {
      if (!prev.currentTaskType || !currentLesson) return prev;

      const mission = currentLesson.missions.find(
        (m) => m.missionSequence === prev.currentMissionSequence
      );
      if (!mission) return prev;

      const tasks = mission.tasks[prev.currentTaskType];
      if (!tasks || !Array.isArray(tasks)) return prev;

      const nextIndex = prev.currentTaskIndex + 1;

      // Check if batch is complete
      if (nextIndex >= tasks.length) {
        // Batch complete - will be handled by completeBatch
        return prev;
      }

      return {
        ...prev,
        currentTaskIndex: nextIndex,
        taskState: "idle",
      };
    });
  }, [currentLesson]);

  // Complete a task (add to batch progress)
  const completeTask = useCallback(
    (taskIndex: number, xpEarned: number, retryCount: number) => {
      setState((prev) => {
        const batchProgress = prev.currentBatchProgress;
        if (!batchProgress) return prev;

        const updatedBatch: BatchProgress = {
          ...batchProgress,
          completedTasks: [...batchProgress.completedTasks, taskIndex],
          xpEarned: batchProgress.xpEarned + xpEarned,
          retryCounts: {
            ...batchProgress.retryCounts,
            [taskIndex]: retryCount,
          },
        };

        return {
          ...prev,
          currentBatchProgress: updatedBatch,
          taskState: "complete",
        };
      });
    },
    []
  );

  // Fail a task (track retry)
  const failTask = useCallback((taskIndex: number, retryCount: number) => {
    setState((prev) => {
      const batchProgress = prev.currentBatchProgress;
      if (!batchProgress) return prev;

      const updatedBatch: BatchProgress = {
        ...batchProgress,
        retryCounts: {
          ...batchProgress.retryCounts,
          [taskIndex]: retryCount,
        },
      };

      // If retry count >= 3, reset to first task
      if (retryCount >= 3) {
        return {
          ...prev,
          currentBatchProgress: {
            ...updatedBatch,
            completedTasks: [], // Clear completed tasks
            xpEarned: 0, // Reset XP (not awarded yet)
          },
          currentTaskIndex: 0,
          taskState: "idle",
        };
      }

      return {
        ...prev,
        currentBatchProgress: updatedBatch,
        taskState: "feedback",
      };
    });
  }, []);

  // Reset task type to first task
  const resetTaskType = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentTaskIndex: 0,
      currentBatchProgress: prev.currentBatchProgress
        ? {
            ...prev.currentBatchProgress,
            completedTasks: [],
            xpEarned: 0,
            retryCounts: {},
          }
        : null,
      taskState: "idle",
    }));
  }, []);

  // Complete batch and save checkpoint
  const completeBatch = useCallback(async () => {
    if (!currentLesson || !user) return;

    const prev = state;
    const batchProgress = prev.currentBatchProgress;
    if (!batchProgress || !prev.checkpoint) return;

    const missionSeq = batchProgress.missionSequence;
    const taskType = batchProgress.taskType;
    if (!taskType) return;

    setState((s) => ({ ...s, isLoading: true }));

    try {
      const updatedCheckpoint: Checkpoint = {
        ...prev.checkpoint,
        activeTaskType: null,
        taskIndexInBatch: 0,
        completedTasksByMissionAndType: {
          ...prev.checkpoint.completedTasksByMissionAndType,
          [missionSeq]: {
            ...(prev.checkpoint.completedTasksByMissionAndType[missionSeq] || {}),
            [taskType]: batchProgress.completedTasks,
          },
        },
        taskRetryCounts: {
          ...prev.checkpoint.taskRetryCounts,
          [missionSeq]: {
            ...(prev.checkpoint.taskRetryCounts[missionSeq] || {}),
            [taskType]: batchProgress.retryCounts,
          },
        },
        totalXpEarnedInLesson:
          prev.checkpoint.totalXpEarnedInLesson + batchProgress.xpEarned,
        lastActivity: {
          type: "batch_completed",
          missionSequence: missionSeq,
          taskType,
          timestamp: new Date().toISOString(),
        },
        inProgressBatch: null,
      };

      // Save checkpoint to backend
      await api.post(
        `/lessons/${currentLesson.id}/progress/checkpoint`,
        updatedCheckpoint
      );

      setState((s) => ({
        ...s,
        checkpoint: updatedCheckpoint,
        currentBatchProgress: null,
        currentTaskType: null,
        currentTaskIndex: 0,
        taskState: "idle",
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error completing batch:", error);
      setState((s) => ({ ...s, isLoading: false }));
      throw error;
    }
  }, [state, currentLesson, user]);

  // Update checkpoint
  const updateCheckpoint = useCallback(
    async (updates: Partial<Checkpoint>) => {
      if (!currentLesson) return;

      setState((prev) => {
        if (!prev.checkpoint) return prev;
        return {
          ...prev,
          checkpoint: { ...prev.checkpoint, ...updates },
          isLoading: true,
        };
      });

      try {
        // Save to backend
        await api.post(
          `/lessons/${currentLesson.id}/progress/checkpoint`,
          updates
        );
        
        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error("Error updating checkpoint:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [currentLesson]
  );

  // Load checkpoint from backend
  const loadCheckpoint = useCallback(async () => {
    if (!currentLesson || !user) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await api.get<any>(
        `/lessons/${currentLesson.id}/progress`
      );

      if (response.data?.checkpoint) {
        const cp = response.data.checkpoint as Checkpoint;
        const checkpoint: Checkpoint = {
          missionSequence: cp.missionSequence ?? 1,
          nextTaskId: cp.nextTaskId ?? "1",
          lastCompletedTaskId: cp.lastCompletedTaskId ?? null,
          activeTaskType: cp.activeTaskType ?? null,
          taskIndexInBatch: cp.taskIndexInBatch ?? 0,
          completedMissionSequences: cp.completedMissionSequences ?? [],
          completedTasksByMissionAndType: cp.completedTasksByMissionAndType ?? {},
          taskRetryCounts: cp.taskRetryCounts ?? {},
          inProgressBatch: cp.inProgressBatch ?? null,
          alphabetSoundProgress: cp.alphabetSoundProgress ?? {},
          wordProgress: cp.wordProgress ?? {},
          lastActivity: cp.lastActivity ?? null,
          totalXpEarnedInLesson: cp.totalXpEarnedInLesson ?? 0,
          lessonMasteryScore: cp.lessonMasteryScore ?? null,
        };
        setState((prev) => ({
          ...prev,
          checkpoint,
          currentMissionSequence: checkpoint.missionSequence,
          currentTaskType: checkpoint.activeTaskType,
          currentTaskIndex: checkpoint.taskIndexInBatch,
          currentBatchProgress: checkpoint.inProgressBatch,
          isLoading: false,
        }));
      } else {
        // Initialize new checkpoint
        initializeLesson(currentLesson);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading checkpoint:", error);
      // Initialize with default checkpoint on error
      initializeLesson(currentLesson);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [currentLesson, user, initializeLesson]);

  // Move to next task type
  const moveToNextTaskType = useCallback(() => {
    // Priority: alphabet_practice → blending_practice → word_practice → sentence_practice → mastery_check
    const taskTypeOrder: TaskType[] = [
      "alphabet_practice",
      "blending_practice",
      "word_practice",
      "sentence_practice",
      "mastery_check",
    ];

    setState((prev) => {
      if (!prev.currentTaskType || !currentLesson) return prev;

      const mission = currentLesson.missions.find(
        (m) => m.missionSequence === prev.currentMissionSequence
      );
      if (!mission) return prev;

      const currentIndex = taskTypeOrder.indexOf(prev.currentTaskType);
      if (currentIndex === -1) return prev;

      for (let i = currentIndex + 1; i < taskTypeOrder.length; i++) {
        const nextType = taskTypeOrder[i];
        if (!nextType) continue;
        const tasks = mission.tasks[nextType];
        if (tasks && Array.isArray(tasks) && tasks.length > 0) {
          startTaskType(nextType);
          return prev;
        }
      }

      // No more task types, move to next mission
      return prev;
    });
  }, [currentLesson, startTaskType]);

  // Move to next mission
  const moveToNextMission = useCallback(() => {
    setState((prev) => {
      if (!currentLesson) return prev;

      const nextMission = prev.currentMissionSequence + 1;
      const mission = currentLesson.missions.find(
        (m) => m.missionSequence === nextMission
      );

      if (mission) {
        return {
          ...prev,
          currentMissionSequence: nextMission,
          currentTaskType: null,
          currentTaskIndex: 0,
          taskState: "idle",
        };
      }

      // No more missions - lesson complete
      return prev;
    });
  }, [currentLesson]);

  const value: LessonFlowContextType = {
    ...state,
    initializeLesson,
    startMission,
    startTaskType,
    moveToNextTask,
    moveToNextTaskType,
    moveToNextMission,
    completeTask,
    failTask,
    resetTaskType,
    completeBatch,
    updateCheckpoint,
    loadCheckpoint,
  };

  return (
    <LessonFlowContext.Provider value={value}>
      {children}
    </LessonFlowContext.Provider>
  );
}

// ============================================
// Custom Hook
// ============================================

export function useLessonFlow(): LessonFlowContextType {
  const context = useContext(LessonFlowContext);

  if (context === undefined) {
    throw new Error("useLessonFlow must be used within a LessonFlowProvider");
  }

  return context;
}


