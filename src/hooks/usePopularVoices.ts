import { useState, useEffect } from "react";
import auth from "../services/auth";

export interface PopularVoice {
  id: string;
  username: string;
  userAvatar: string;
  timeAgo: string;
  language: string;
  country: string;
  mood: string;
  moodColor: string;
  duration: string;
  likes: number;
  comments: number;
  audio_url: string;
}

export const usePopularVoices = (limit: number = 5) => {
  const [voices, setVoices] = useState<PopularVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularVoices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the Supabase Edge Function to get popular voices with complex scoring
        const supabase = auth.supabase;
        if (!supabase) {
          throw new Error("Supabase client is not initialized");
        }

        const { data, error } = await supabase.functions.invoke(
          "get_popular_voices",
          {
            body: { limit },
          },
        );

        if (error) throw error;

        if (data && data.voices) {
          // Format the data for the VoiceCard component
          const formattedVoices = data.voices.map((voice: any) => {
            // Calculate time ago
            const createdAt = new Date(voice.created_at);
            const now = new Date();
            const diffInSeconds = Math.floor(
              (now.getTime() - createdAt.getTime()) / 1000,
            );

            let timeAgo;
            if (diffInSeconds < 60) {
              timeAgo = `${diffInSeconds} seconds ago`;
            } else if (diffInSeconds < 3600) {
              timeAgo = `${Math.floor(diffInSeconds / 60)} minutes ago`;
            } else if (diffInSeconds < 86400) {
              timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
            } else {
              timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;
            }

            return {
              id: voice.id,
              username: voice.username || "Unknown User",
              userAvatar:
                voice.avatar_url ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown",
              timeAgo,
              language: voice.language || "English",
              country: voice.country || "United States",
              mood: voice.mood || "Neutral",
              moodColor: voice.mood_color || "#8b5cf6",
              duration: voice.duration || "0:00",
              likes: voice.likes_count || 0,
              comments: voice.comments_count || 0,
              audio_url: voice.audio_url,
              // You could also include the popularity score if needed
              // popularityScore: voice.popularity_score
            };
          });

          setVoices(formattedVoices);
        }
      } catch (err: any) {
        console.error("Error fetching popular voices:", err);
        setError(err.message || "Failed to fetch popular voices");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularVoices();
  }, [limit]);

  return { voices, loading, error };
};
