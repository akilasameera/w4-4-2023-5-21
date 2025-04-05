import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
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

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // Get query parameters
    const { mood, limit = 20, offset = 0 } = await req.json();

    // Build the query
    let query = supabaseClient
      .from("voice_messages")
      .select(
        `
        *,
        profiles:user_id (*)
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply mood filter if provided
    if (mood) {
      query = query.eq("mood", mood);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // If user is logged in, check if they liked each post
    if (user) {
      const { data: likesData } = await supabaseClient
        .from("voice_message_likes")
        .select("voice_message_id")
        .eq("user_id", user.id);

      const likedMessageIds = new Set(
        likesData?.map((like) => like.voice_message_id) || [],
      );

      // Add user_has_liked field to each voice message
      data.forEach((message) => {
        message.user_has_liked = likedMessageIds.has(message.id);
      });
    }

    return new Response(JSON.stringify({ voice_messages: data }), {
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
