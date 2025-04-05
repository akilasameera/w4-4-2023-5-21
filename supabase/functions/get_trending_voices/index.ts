import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get request body
    const { limit = 5 } = await req.json();

    // Get the current date and the date 24 hours ago
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twentyFourHoursAgoStr = twentyFourHoursAgo.toISOString();

    // Query for voice messages with recent activity (likes or comments in the last 24 hours)
    // First, get voice messages with recent likes
    const { data: recentLikesData, error: recentLikesError } =
      await supabaseClient
        .from("voice_message_likes")
        .select("voice_message_id")
        .gte("created_at", twentyFourHoursAgoStr)
        .order("created_at", { ascending: false });

    if (recentLikesError) throw recentLikesError;

    // Get voice messages with recent comments
    const { data: recentCommentsData, error: recentCommentsError } =
      await supabaseClient
        .from("voice_message_comments")
        .select("voice_message_id")
        .gte("created_at", twentyFourHoursAgoStr)
        .order("created_at", { ascending: false });

    if (recentCommentsError) throw recentCommentsError;

    // Combine and deduplicate the IDs
    const recentActivityIds = [
      ...recentLikesData.map((item) => item.voice_message_id),
      ...recentCommentsData.map((item) => item.voice_message_id),
    ];
    const uniqueIds = [...new Set(recentActivityIds)];

    // If there are no recent activities, return the most recent voice messages
    if (uniqueIds.length === 0) {
      const { data: recentVoices, error: recentVoicesError } =
        await supabaseClient
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
          user_id,
          profiles:user_id(username, avatar_url, country)
        `,
          )
          .order("created_at", { ascending: false })
          .limit(limit);

      if (recentVoicesError) throw recentVoicesError;

      // Format the data to match the expected structure
      const voices = recentVoices.map((voice) => ({
        id: voice.id,
        audio_url: voice.audio_url,
        duration: voice.duration,
        mood: voice.mood,
        mood_color: voice.mood_color,
        language: voice.language,
        likes_count: voice.likes_count,
        comments_count: voice.comments_count,
        created_at: voice.created_at,
        username: voice.profiles?.username,
        avatar_url: voice.profiles?.avatar_url,
        country: voice.profiles?.country,
      }));

      return new Response(JSON.stringify({ voices }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get the voice messages with recent activity
    const { data: trendingVoices, error: trendingVoicesError } =
      await supabaseClient
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
        user_id,
        profiles:user_id(username, avatar_url, country)
      `,
        )
        .in("id", uniqueIds)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (trendingVoicesError) throw trendingVoicesError;

    // Format the data to match the expected structure
    const voices = trendingVoices.map((voice) => ({
      id: voice.id,
      audio_url: voice.audio_url,
      duration: voice.duration,
      mood: voice.mood,
      mood_color: voice.mood_color,
      language: voice.language,
      likes_count: voice.likes_count,
      comments_count: voice.comments_count,
      created_at: voice.created_at,
      username: voice.profiles?.username,
      avatar_url: voice.profiles?.avatar_url,
      country: voice.profiles?.country,
    }));

    return new Response(JSON.stringify({ voices }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
