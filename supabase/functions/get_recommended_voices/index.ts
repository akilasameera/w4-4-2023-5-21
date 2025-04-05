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
    const { userId, limit = 5 } = await req.json();

    // If no userId is provided, return random recommendations
    if (!userId) {
      const { data: randomVoices, error: randomError } = await supabaseClient
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

      if (randomError) throw randomError;

      // Format the data to match the expected structure
      const voices = randomVoices.map((voice) => ({
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

    // Get user's profile to determine preferences
    const { data: userProfile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    // Get user's liked voice messages to understand preferences
    const { data: userLikes, error: likesError } = await supabaseClient
      .from("voice_message_likes")
      .select("voice_message_id")
      .eq("user_id", userId);

    if (likesError) throw likesError;

    // Get the voice messages that the user has liked
    const likedMessageIds = userLikes.map((like) => like.voice_message_id);

    // If user has no likes, return voices based on their country or language
    if (likedMessageIds.length === 0) {
      let query = supabaseClient
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
        .neq("user_id", userId) // Don't recommend user's own voices
        .order("created_at", { ascending: false });

      // If we have user profile info, filter by country or language
      if (userProfile) {
        if (userProfile.country) {
          query = query.eq("profiles.country", userProfile.country);
        } else if (userProfile.preferred_language) {
          query = query.eq("language", userProfile.preferred_language);
        }
      }

      const { data: countryVoices, error: countryError } =
        await query.limit(limit);

      if (countryError) throw countryError;

      // If no country/language matches or no profile, just return recent voices
      if (!countryVoices || countryVoices.length === 0) {
        const { data: recentVoices, error: recentError } = await supabaseClient
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
          .neq("user_id", userId) // Don't recommend user's own voices
          .order("created_at", { ascending: false })
          .limit(limit);

        if (recentError) throw recentError;

        // Format the data
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

      // Format the country/language filtered data
      const voices = countryVoices.map((voice) => ({
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

    // Get the moods and languages of the liked messages to understand preferences
    const { data: likedMessages, error: messagesError } = await supabaseClient
      .from("voice_messages")
      .select("mood, language")
      .in("id", likedMessageIds);

    if (messagesError) throw messagesError;

    // Count occurrences of each mood and language
    const moodCounts: Record<string, number> = {};
    const languageCounts: Record<string, number> = {};

    likedMessages.forEach((message) => {
      if (message.mood) {
        moodCounts[message.mood] = (moodCounts[message.mood] || 0) + 1;
      }
      if (message.language) {
        languageCounts[message.language] =
          (languageCounts[message.language] || 0) + 1;
      }
    });

    // Find the most common mood and language
    let topMood = "";
    let topMoodCount = 0;
    let topLanguage = "";
    let topLanguageCount = 0;

    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > topMoodCount) {
        topMood = mood;
        topMoodCount = count;
      }
    }

    for (const [language, count] of Object.entries(languageCounts)) {
      if (count > topLanguageCount) {
        topLanguage = language;
        topLanguageCount = count;
      }
    }

    // Query for recommended voices based on mood and language preferences
    let recommendationQuery = supabaseClient
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
      .not("id", "in", likedMessageIds) // Don't recommend already liked messages
      .neq("user_id", userId); // Don't recommend user's own voices

    // Apply mood filter if we have a top mood
    if (topMood) {
      recommendationQuery = recommendationQuery.eq("mood", topMood);
    }

    // Apply language filter if we have a top language
    if (topLanguage) {
      recommendationQuery = recommendationQuery.eq("language", topLanguage);
    }

    // Get recommendations
    const { data: recommendations, error: recommendationsError } =
      await recommendationQuery
        .order("likes_count", { ascending: false })
        .limit(limit);

    if (recommendationsError) throw recommendationsError;

    // If no recommendations based on preferences, get popular voices the user hasn't liked
    if (!recommendations || recommendations.length === 0) {
      const { data: popularVoices, error: popularError } = await supabaseClient
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
        .not("id", "in", likedMessageIds) // Don't recommend already liked messages
        .neq("user_id", userId) // Don't recommend user's own voices
        .order("likes_count", { ascending: false })
        .limit(limit);

      if (popularError) throw popularError;

      // Format the data
      const voices = popularVoices.map((voice) => ({
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

    // Format the recommendations data
    const voices = recommendations.map((voice) => ({
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
