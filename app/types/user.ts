export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    avatarUrl?: string;
    mascot?: {
      face: string;
      hair: string;
      body: string;
      hairColor: string;
    };
    level?: number;
    xp?: number;
    languagePreference?: string;
    metadata?: {
      volume?: number;
      theme?: string;
      voiceAgent?: string; // Azure TTS voice agent name (e.g., "en-US-JennyNeural")
      [key: string]: any; // Allow any additional metadata
    };
  }