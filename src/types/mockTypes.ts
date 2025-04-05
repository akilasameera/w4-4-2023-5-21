// This file replaces the Supabase types with simplified mock types

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VoiceMessage {
  id: string;
  user_id: string;
  audio_url: string;
  duration: string;
  mood?: string;
  mood_color?: string;
  likes_count?: number;
  comments_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  voice_message_id: string;
  text?: string;
  voice_url?: string;
  voice_duration?: string;
  is_voice_comment?: boolean;
  likes_count?: number;
  created_at?: string;
}

export interface PrivateMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  text?: string;
  voice_url?: string;
  voice_duration?: string;
  is_voice_message?: boolean;
  is_read?: boolean;
  created_at?: string;
}
