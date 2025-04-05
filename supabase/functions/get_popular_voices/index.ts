// Edge function to fetch popular voice messages with a complex popularity score
// The score is calculated based on likes, comments, and recency

interface VoiceMessage {
  id: string;
  audio_url: string;
  duration: string;
  mood: string;
  mood_color: string;
  language: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
    country: string;
  };
  popularity_score: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Parse request body
    const { limit = 5 } = await req.json();

    // Get Supabase client from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Fetch voice messages with join to profiles
    const { data, error } = await supabaseClient.from("voice_messages").select(
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
        user_id,
        profiles:user_id(username, avatar_url, country)
      `,
    );

    if (error) throw error;

    if (!data) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
      });
    }

    // Calculate popularity score for each voice message
    const now = new Date();
    const voicesWithScore = data.map((voice) => {
      const createdAt = new Date(voice.created_at);
      const ageInHours =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      // Popularity formula: (likes * 1.0) + (comments * 1.5) - (age in hours * 0.1)
      // This gives more weight to comments than likes, and reduces score as the post ages
      const likesScore = voice.likes_count * 1.0;
      const commentsScore = voice.comments_count * 1.5;
      const recencyPenalty = Math.min(ageInHours * 0.1, 20); // Cap the penalty at 20 points

      const popularityScore = likesScore + commentsScore - recencyPenalty;

      return {
        ...voice,
        popularity_score: Math.max(popularityScore, 0), // Ensure score is not negative
      };
    });

    // Sort by popularity score and limit results
    const sortedVoices = voicesWithScore
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, limit);

    return new Response(JSON.stringify({ data: sortedVoices }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get_popular_voices function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});

// Import the Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
