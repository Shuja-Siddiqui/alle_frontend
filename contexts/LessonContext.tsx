/**
 * Lesson Context
 * Manages current lesson state and student progress across the application
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Lesson } from "../app/student/types/lesson.types";
import { api } from "../lib/api-client";

// Backend lesson format (what comes from API)
interface BackendLesson {
  id: string;
  title: string;
  content?: {
    missions?: Array<{
      missionSequence: number;
      missionName: string;
      tasks: Record<string, any>;
    }>;
    lesson1?: {
      missions?: Array<{
        missionSequence: number;
        missionName: string;
        tasks: Record<string, any>;
      }>;
    };
  };
  [key: string]: any; // Allow other backend fields
}

// ============================================
// Types
// ============================================

export interface LessonContextType {
  // Lesson state
  currentLesson: Lesson | null;
  currentLessonPosition: number;
  isLessonLoading: boolean;

  // Lesson actions
  setLesson: (lesson: Lesson) => void;
  clearLesson: () => void;
  fetchAndSetLesson: (lessonId: string) => Promise<void>;

  setCurrentLessonPosition: (position: number) => void;
  nextPosition: () => void;
  previousPosition: () => void;
  resetPosition: () => void;

  updateLesson: (data: Partial<Lesson>) => void;
}

interface LessonProviderProps {
  children: ReactNode;
}

// ============================================
// Context Creation
// ============================================

const LessonContext = createContext<LessonContextType | undefined>(
  undefined
);

// ============================================
// Provider Component
// ============================================

export function LessonProvider({ children }: LessonProviderProps) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentLessonPosition, setCurrentLessonPositionState] =
    useState<number>(0);
  const [isLessonLoading, setIsLessonLoading] = useState<boolean>(true);

  // ============================================
  // Load from localStorage on mount
  // ============================================

  useEffect(() => {
    try {
      const storedLesson = localStorage.getItem("current_lesson");
      const storedPosition = localStorage.getItem("current_lesson_position");

      if (storedLesson) {
        setCurrentLesson(JSON.parse(storedLesson));
      }

      if (storedPosition) {
        setCurrentLessonPositionState(Number(storedPosition));
      }
    } catch (error) {
      console.error("Error loading lesson data:", error);
      localStorage.removeItem("current_lesson");
      localStorage.removeItem("current_lesson_position");
    } finally {
      setIsLessonLoading(false);
    }
  }, []);

  // ============================================
  // Actions
  // ============================================

  const setLesson = (lesson: Lesson) => {
    localStorage.setItem("current_lesson", JSON.stringify(lesson));
    localStorage.setItem("current_lesson_position", "0");

    setCurrentLesson(lesson);
    setCurrentLessonPositionState(0);
  };

  const clearLesson = () => {
    localStorage.removeItem("current_lesson");
    localStorage.removeItem("current_lesson_position");

    setCurrentLesson(null);
    setCurrentLessonPositionState(0);
  };

  const setCurrentLessonPosition = (position: number) => {
    if (position < 0) return;

    localStorage.setItem("current_lesson_position", position.toString());
    setCurrentLessonPositionState(position);
  };

  const nextPosition = () => {
    const newPosition = currentLessonPosition + 1;
    setCurrentLessonPosition(newPosition);
  };

  const previousPosition = () => {
    if (currentLessonPosition === 0) return;
    const newPosition = currentLessonPosition - 1;
    setCurrentLessonPosition(newPosition);
  };

  const resetPosition = () => {
    setCurrentLessonPosition(0);
  };

  const updateLesson = (data: Partial<Lesson>) => {
    if (!currentLesson) return;

    const updatedLesson = { ...currentLesson, ...data };
    setCurrentLesson(updatedLesson);
    localStorage.setItem("current_lesson", JSON.stringify(updatedLesson));
  };

  /**
   * Transform backend lesson format to frontend Lesson type
   */
  const transformBackendLesson = (backendLesson: BackendLesson): Lesson => {
    // Extract missions from content field
    let missions: Lesson["missions"] = [];
    
    if (backendLesson.content?.missions) {
      missions = backendLesson.content.missions;
    } else if (backendLesson.content?.lesson1?.missions) {
      missions = backendLesson.content.lesson1.missions;
    }
    
    return {
      id: backendLesson.id,
      title: backendLesson.title,
      missions: missions,
    };
  };

  /**
   * Fetch lesson from API and save it to context
   */
  const fetchAndSetLesson = async (lessonId: string) => {
    try {
      setIsLessonLoading(true);
      console.log(`📚 LessonContext: Fetching lesson ${lessonId} from API...`);
      
      // Fetch lesson from API
      // Backend returns: { success: true, data: lesson }
      const response = await api.get<{ success?: boolean; data?: BackendLesson } & BackendLesson>(`/lessons/${lessonId}`);
      
      console.log(`📚 LessonContext: API response received:`, response);
      
      // Extract lesson data from response
      // Backend wraps in { success: true, data: lesson }, so check for response.data first
      let backendLesson: BackendLesson;
      
      if (response && typeof response === 'object') {
        // Check if response has a 'data' property (backend wrapper format)
        if ('data' in response && response.data) {
          backendLesson = response.data as BackendLesson;
        } 
        // Check if response has 'success' property (also backend wrapper format)
        else if ('success' in response && response.success && 'data' in response) {
          backendLesson = (response as any).data as BackendLesson;
        }
        // Otherwise, assume response is the lesson directly
        else {
          backendLesson = response as BackendLesson;
        }
      } else {
        throw new Error(`Invalid response format for lesson ${lessonId}`);
      }
      
      if (!backendLesson || !backendLesson.id) {
        throw new Error(`Invalid lesson data received for lesson ${lessonId}. Missing id field.`);
      }
      
      console.log(`📚 LessonContext: Extracted lesson data:`, backendLesson);
      
      // Transform backend format to frontend format
      const lesson = transformBackendLesson(backendLesson);
      
      if (!lesson.missions || lesson.missions.length === 0) {
        console.warn(`⚠️ LessonContext: Lesson ${lessonId} has no missions. This might be expected if content hasn't been loaded yet.`);
      }
      
      console.log(`✅ LessonContext: Lesson fetched and transformed successfully`, lesson);
      
      // Save to context and localStorage
      setLesson(lesson);
      
      console.log(`💾 LessonContext: Lesson saved to context and localStorage`);
    } catch (error) {
      console.error(`❌ LessonContext: Error fetching lesson ${lessonId}:`, error);
      // Clear any partial state
      setIsLessonLoading(false);
      throw error;
    } finally {
      setIsLessonLoading(false);
    }
  };

  const value: LessonContextType = {
    currentLesson,
    currentLessonPosition,
    isLessonLoading,

    setLesson,
    clearLesson,
    fetchAndSetLesson,

    setCurrentLessonPosition,
    nextPosition,
    previousPosition,
    resetPosition,

    updateLesson,
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}

// ============================================
// Custom Hook
// ============================================

export function useLesson(): LessonContextType {
  const context = useContext(LessonContext);

  if (context === undefined) {
    throw new Error("useLesson must be used within a LessonProvider");
  }

  return context;
}
