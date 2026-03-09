export interface User {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
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
    badges?: {
      id: string;
      title: string;
      description?: string | null;
      iconActive?: string | null;
      iconInactive?: string | null;
      rarity?: string | null;
    }[];
  }