import { useState, useEffect } from "react";
import auth from "../services/auth";
import { PopularVoice } from "./usePopularVoices";

export const useRecommendedVoices = (limit: number = 5) => {
  const [voices, setVoices] = useState<PopularVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedVoices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const {
          data: { user },
        } = await auth.supabase.auth.getUser();

        if (!user) {
          // If no user is logged in, return random voices
          const { data, error } = await auth.supabase
            .from("voice_messages")
            .select(
              `
              id,
              audio_url,
              duration,
              mood,
              mood_color,
              language,
              likes_count,
              comments_count,
              created_at,
              profiles:user_id(username, avatar_url, country)
            `,
            )
            .order("created_at", { ascending: false })
            .limit(limit);

          if (error) throw error;

          if (data) {
            const formattedVoices = formatVoices(data);
            setVoices(formattedVoices);
          }
        } else {
          // If user is logged in, call the recommendation function
          const { data, error } = await auth.supabase
            .rpc("get_recommended_voices", {
              user_id_param: user.id,
              limit_param: limit,
            })
            .select();

          if (error) throw error;

          if (data) {
            const formattedVoices = formatVoices(data);
            setVoices(formattedVoices);
          }
        }
      } catch (err: any) {
        console.error("Error fetching recommended voices:", err);
        setError(err.message || "Failed to fetch recommended voices");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedVoices();
  }, [limit]);

  // Helper function to format voice data
  const formatVoices = (data: any[]) => {
    return data.map((voice: any) => {
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

      // Handle different data structures (from RPC function or direct query)
      const username =
        voice.username || voice.profiles?.username || "Unknown User";
      const avatarUrl =
        voice.avatar_url ||
        voice.profiles?.avatar_url ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown";
      const country =
        voice.country || voice.profiles?.country || "United States";

      return {
        id: voice.id,
        username,
        userAvatar: avatarUrl,
        timeAgo,
        language: voice.language || "English",
        country,
        mood: voice.mood || "Neutral",
        moodColor: voice.mood_color || "#8b5cf6",
        duration: voice.duration || "0:00",
        likes: voice.likes_count || 0,
        comments: voice.comments_count || 0,
        audio_url: voice.audio_url,
      };
    });
  };

  return { voices, loading, error };
};
