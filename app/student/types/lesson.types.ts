// Type definitions for lesson, mission, and task data structures

export type VisualItem = {
  word?: string;
  image?: string;
  scene?: string;
  sfx?: string;
  prompt?: string;
  mouthCue?: string;
  association?: string;
  tts_anyOther?: string;
};

export type TaskFeedback = {
  tts_exactMatch?: string;
  tts_exactMatch_ssml?: string;
  tts_closeMatch?: string;
  tts_closeMatch_ssml?: string;
  tts_wrongSound?: string;
  tts_wrongSound_ssml?: string;
  tts_positiveFeedback?: string;
  tts_negativeFeedback?: string;
  retryLimit?: number;
  tts_retryMessage?: string[];
};

export type Task = {
  // Mission intro
  tts_missionControlVoice?: string;
  tts_missionControlVoice_ssml?: string;
  
  // Sound instructions
  tts_ss1?: string;
  tts_ss1_ssml?: string;
  tts_ss2?: string;
  tts_ss2_ssml?: string;
  tts_ss3?: string;
  tts_ss3_ssml?: string;
  tts_ss4?: string;
  tts_ss4_ssml?: string;
  
  // Word/phoneme
  word?: string;
  
  // Visual content
  visual?: VisualItem[];
  
  // Feedback
  feedback?: TaskFeedback;
  
  // Blending drill
  tts_blendingDrill?: string;
  tts_blendingDrill_ssml?: string;
  
  // Mission complete
  tts_missionComplete?: string;
  tts_missionComplete_ssml?: string;
};

export type Mission = {
  missionSequence: number;
  missionName: string;
  tasks: Record<string, Task>;
};

export type Lesson = {
  id: string;
  title: string;
  missions: Mission[];
};

export type MissionPageData = {
  lessonId: string;
  missionSequence: number;
  missionName: string;
  missionType?: string; // "Mission", "Word Practice", "Sentence Practice", "Reading", etc.
};

export type LessonPageData = {
  lessonId: string;
  missionSequence: number;
  taskId: string;
  task: Task;
};

export type MasteryCheckData = {
  lessonId: string;
  missionSequence: number;
  currentScore: number;
  totalScore: number;
  starsEarned: number; // 0-5
};




