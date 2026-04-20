"use client";

import { useState, useEffect } from "react";
import type { Lesson, Mission, Task, MissionPageData, LessonPageData, MasteryCheckData } from "../types/lesson.types";
import { useLesson } from "../../../contexts/LessonContext";

// Mock data - Replace with actual API call
const MOCK_LESSON_DATA: Lesson = {
  id: "lesson1",
  title: "Core Sounds & Blending",
  missions: [
    {
      missionSequence: 1,
      missionName: "Mission Mode - Core Sounds & Blending",
      tasks: {
        "1": {
          tts_missionControlVoice: "Welcome, operative! First mission: crack the core code.",
          word: "SAT", // Add word for StatusBox
          visual: [
            {
              word: "S",
              image: "/assets/icons/others/lip.png",
              prompt: "Sound Station 1 - S",
            },
          ],
        },
        "2": {
          tts_ss1: "First up: S. Listen: /sss/. Like a silent signal.",
          word: "S",
          visual: [
            {
              word: "S",
              image: "/assets/icons/others/lip.png",
              prompt: "Sound Station 1 - S",
            },
          ],
        },
      },
    },
    {
      missionSequence: 2,
      missionName: "Word Practice",
      tasks: {
        "1": {
          tts_missionControlVoice: "Welcome to Word Practice! Let's learn some words.",
          word: "MAP",
          visual: [
            {
              word: "MAP",
              image: "/assets/icons/phonemes/map_src.png",
            },
          ],
        },
        "2": {
          tts_missionControlVoice: "Great! Now let's try another word.",
          word: "SAT",
          visual: [
            {
              word: "SAT",
              image: "/assets/icons/phonemes/sat_src.png",
            },
          ],
        },
      },
    },
    {
      missionSequence: 3,
      missionName: "Sentence Practice",
      tasks: {
        "1": {
          tts_missionControlVoice: "Time to read sentences! Let's try this one.",
          word: "I have a map",
        },
        "2": {
          tts_missionControlVoice: "Great job! Now try this sentence.",
          word: "The cat sat",
        },
      },
    },
  ],
};

/**
 * Hook to fetch lesson data
 * Uses LessonContext to store and retrieve lessons
 * Automatically saves lessons to context when fetched
 */
export function useLessonData(lessonId: string): Lesson | null {
  const { currentLesson, fetchAndSetLesson, isLessonLoading, setLesson } = useLesson();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Check if we already have this lesson in context
    if (currentLesson?.id === lessonId) {
      return; // Lesson already loaded
    }

    // For mock data, use the mock lesson
    if (lessonId === "lesson1") {
      setLesson(MOCK_LESSON_DATA);
      return;
    }

    // Fetch lesson from API if not already loading
    if (!isLessonLoading && !isFetching) {
      setIsFetching(true);
      fetchAndSetLesson(lessonId)
        .catch((error) => {
          console.error(`Error fetching lesson ${lessonId}:`, error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [lessonId, currentLesson?.id, isLessonLoading, isFetching, fetchAndSetLesson, setLesson]);

  // Return the lesson from context if it matches the requested ID
  if (currentLesson?.id === lessonId) {
    return currentLesson;
  }

  // Return null while loading or if lesson ID doesn't match
  return null;
}

/**
 * Get mission data for Mission Page
 */
export function useMissionData(lessonId: string, missionSequence: number): MissionPageData | null {
  const lesson = useLessonData(lessonId);

  if (!lesson) return null;

  const mission = lesson.missions.find((m) => m.missionSequence === missionSequence);
  if (!mission) return null;

  // Determine mission type from name
  const nameLower = mission.missionName.toLowerCase();
  let missionType: string;
  if (nameLower.includes("sentence practice")) {
    missionType = "Sentence Practice";
  } else if (nameLower.includes("word practice")) {
    missionType = "Word Practice";
  } else if (nameLower.includes("reading")) {
    missionType = "Reading";
  } else {
    missionType = "Mission";
  }

  return {
    lessonId,
    missionSequence,
    missionName: mission.missionName,
    missionType,
  };
}

/**
 * Get task data for Lesson Page
 */
export function useLessonPageData(
  lessonId: string,
  missionSequence: number,
  taskId: string
): LessonPageData | null {
  const lesson = useLessonData(lessonId);

  if (!lesson) return null;

  const mission = lesson.missions.find((m) => m.missionSequence === missionSequence);
  if (!mission) return null;

  const task = mission.tasks[taskId];
  if (!task) return null;

  return {
    lessonId,
    missionSequence,
    taskId,
    task,
  };
}

/**
 * Get mastery check data
 * TODO: Replace with actual API call to get student's score
 */
export function useMasteryCheckData(
  lessonId: string,
  missionSequence: number
): MasteryCheckData | null {
  // Mock data - Replace with actual API call
  return {
    lessonId,
    missionSequence,
    currentScore: 6,
    totalScore: 10,
    starsEarned: 3, // Calculate based on score
  };
}

