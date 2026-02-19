# Student Flow Data Architecture

## Overview
This document explains how data flows through the student pages: Home → Mission → Lesson → Level Overlay → Mastery Check.

## Data Flow

### 1. **Home Page** (`/student/home`)
- Displays level map and star ring
- "Continue your mission" button navigates to:
  ```
  /student/mission?lessonId=lesson1&missionSequence=1
  ```

### 2. **Mission Page** (`/student/mission`)
- **URL Params:**
  - `lessonId`: Lesson identifier (e.g., "lesson1")
  - `missionSequence`: Mission number (e.g., 1, 2, 3)
  
- **Data Source:** `useMissionData(lessonId, missionSequence)`
- **Displays:**
  - Mission type and number: "Mission 1" or "Reading 1" (based on mission name)
  - Mission name from data
  
- **Navigation:** Continue button → `/student/lesson?lessonId={lessonId}&missionSequence={missionSequence}&taskId=1`

### 3. **Lesson Page** (`/student/lesson`)
- **URL Params:**
  - `lessonId`: Lesson identifier
  - `missionSequence`: Mission number
  - `taskId`: Task number within the mission (e.g., "1", "2", "3")
  
- **Data Source:** `useLessonPageData(lessonId, missionSequence, taskId)`
- **Displays:**
  - **Phoneme:** Shows in `StatusBox` (e.g., "S", "A", "T")
  - **Visual Image:** Shows in `VisualBox` (e.g., lip position image)
  - **Words with Images:** If task has multiple visual items, displays them as cards with word + image
  - **Sentences:** Can be displayed if visual items contain sentence data
  
- **Navigation:** Continue button → Opens `LevelOverlay` (passes lessonId and missionSequence)

### 4. **Level Overlay** (Overlay on Lesson Page)
- **Props:**
  - `lessonId`: Passed from lesson page
  - `missionSequence`: Passed from lesson page
  - `maxXp`: XP to award (default: 100)
  
- **Displays:**
  - Animated XP slider
  - Mascot avatar
  
- **Navigation:** Click anywhere → `/student/mastery-check?lessonId={lessonId}&missionSequence={missionSequence}`

### 5. **Mastery Check Page** (`/student/mastery-check`)
- **URL Params:**
  - `lessonId`: Lesson identifier
  - `missionSequence`: Mission number
  
- **Data Source:** `useMasteryCheckData(lessonId, missionSequence)`
- **Displays:**
  - 5 stars (earned stars are visible, unearned are dimmed)
  - Score: `{currentScore}/{totalScore}` (e.g., "6/10")
  - Stars earned based on score
  
- **Navigation:** Continue button → `/student/home`

## Data Structure

### Type Definitions (`app/student/types/lesson.types.ts`)

```typescript
// Visual item (word with image, scene, etc.)
VisualItem = {
  word?: string;
  image?: string;
  scene?: string;
  // ... other visual properties
}

// Task (lesson step)
Task = {
  word?: string;              // Phoneme (e.g., "S")
  visual?: VisualItem[];       // Words with images, scenes
  tts_ss1?: string;            // Sound instruction
  // ... other task properties
}

// Mission
Mission = {
  missionSequence: number;
  missionName: string;
  tasks: Record<string, Task>;
}

// Lesson
Lesson = {
  id: string;
  title: string;
  missions: Mission[];
}
```

## Hooks (`app/student/hooks/useLessonData.ts`)

### `useLessonData(lessonId)`
- Fetches full lesson data
- Returns: `Lesson | null`

### `useMissionData(lessonId, missionSequence)`
- Gets mission data for Mission Page
- Returns: `MissionPageData | null`
- Includes: mission name, type (Mission/Reading), sequence

### `useLessonPageData(lessonId, missionSequence, taskId)`
- Gets task data for Lesson Page
- Returns: `LessonPageData | null`
- Includes: task with phoneme, visual items, words, images

### `useMasteryCheckData(lessonId, missionSequence)`
- Gets mastery check results
- Returns: `MasteryCheckData | null`
- Includes: current score, total score, stars earned

## Example Data Flow

1. **User clicks "Continue your mission" on Home**
   - Navigates: `/student/mission?lessonId=lesson1&missionSequence=1`

2. **Mission Page loads**
   - Fetches: Mission 1 data
   - Displays: "Mission 1" or "Reading 1"
   - User clicks "Continue"

3. **Lesson Page loads (Task 1)**
   - Navigates: `/student/lesson?lessonId=lesson1&missionSequence=1&taskId=1`
   - Fetches: Task 1 data
   - Displays: Phoneme "S", visual image, words with images
   - User clicks "Continue"

4. **Level Overlay appears**
   - Shows XP animation
   - User clicks overlay

5. **Mastery Check Page loads**
   - Navigates: `/student/mastery-check?lessonId=lesson1&missionSequence=1`
   - Fetches: Score data (6/10, 3 stars)
   - Displays: Stars and score
   - User clicks "Continue"

6. **Returns to Home**
   - Navigates: `/student/home`

## Current Implementation

- ✅ Type definitions created
- ✅ Hooks for data fetching (with mock data)
- ✅ Mission page accepts and displays dynamic data
- ✅ Lesson page accepts and displays phoneme, words, images
- ✅ Mastery check page accepts and displays dynamic scores
- ✅ Navigation flow passes data through URL params
- ⚠️ **TODO:** Replace mock data with actual API calls

## Next Steps

1. **Connect to Backend API:**
   - Update `useLessonData` to fetch from `/api/lessons/{lessonId}`
   - Update `useMasteryCheckData` to fetch from `/api/student-lessons/{lessonId}/mastery`

2. **Add Task Navigation:**
   - Add "Next Task" button on lesson page
   - Navigate to next task: `taskId={parseInt(taskId) + 1}`

3. **Add Progress Tracking:**
   - Save checkpoint when user completes a task
   - Resume from last checkpoint when returning to lesson

4. **Add Sentence Display:**
   - If task has sentence data in visual items, display it
   - Create a `SentenceBox` component if needed




