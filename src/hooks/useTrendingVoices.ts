import { useState, useEffect } from "react";
import auth from "../services/auth";
import { PopularVoice } from "./usePopularVoices";

export const useTrendingVoices = (limit: number = 5) => {
  const [voices, setVoices] = useState<PopularVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingVoices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch trending voice messages (those with recent activity in the last 24 hours)
        const { data, error } = await auth.supabase
          .rpc("get_trending_voices", { limit_param: limit })
          .select();

        if (error) throw error;

        if (data) {
          // Format the data for the VoiceCard component
          const formattedVoices = data.map((voice: any) => {
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
            };
          });

          setVoices(formattedVoices);
        }
      } catch (err: any) {
        console.error("Error fetching trending voices:", err);
        setError(err.message || "Failed to fetch trending voices");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVoices();
  }, [limit]);

  return { voices, loading, error };
};
