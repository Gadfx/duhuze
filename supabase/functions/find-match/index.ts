import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    const { connectionMode, filters = {} } = await req.json();

    console.log("Live match requested by:", user.id, "mode:", connectionMode, "filters:", filters);

    // Ensure user's profile exists and is not banned
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*, user_preferences(*)")
      .eq("id", user.id)
      .single();
    if (!profile) throw new Error("Profile not found");
    if (profile.is_banned) {
      const now = new Date();
      const banUntil = profile.ban_until ? new Date(profile.ban_until) : null;
      if (banUntil && banUntil > now) {
        return new Response(
          JSON.stringify({ error: "You are temporarily banned", ban_until: banUntil.toISOString() }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Get list of blocked users (both directions)
    const { data: blockedUsers } = await supabaseClient
      .from("blocks")
      .select("blocked_user_id")
      .eq("user_id", user.id);
    const { data: blockedByUsers } = await supabaseClient
      .from("blocks")
      .select("user_id")
      .eq("blocked_user_id", user.id);

    const blockedIds = new Set([
      ...(blockedUsers?.map((b: any) => b.blocked_user_id) || []),
      ...(blockedByUsers?.map((b: any) => b.user_id) || []),
      user.id,
    ]);

    // 1) Try to match with a LIVE user from the waiting queue
    let matchedUserId: string | null = null;

    if (connectionMode === "random") {
      // Random matching - get first available user
      const { data: waitingCandidate } = await supabaseClient
        .from("waiting_users")
        .select("user_id, created_at")
        .neq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (waitingCandidate && !blockedIds.has(waitingCandidate.user_id)) {
        matchedUserId = waitingCandidate.user_id;
      }
    } else if (connectionMode === "interest_based") {
      // Interest-based matching
      const { data: userPrefs } = await supabaseClient
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userPrefs) {
        // Find users with matching interests, age range, and preferences
        const { data: potentialMatches } = await supabaseClient
          .from("waiting_users")
          .select(`
            user_id,
            profiles!inner(
              id,
              age,
              gender,
              province,
              interests: user_preferences(interests)
            )
          `)
          .neq("user_id", user.id)
          .order("created_at", { ascending: true });

        // Filter matches based on preferences
        const filteredMatches = potentialMatches?.filter(match => {
          if (blockedIds.has(match.user_id)) return false;

          const matchProfile = match.profiles;
          if (!matchProfile) return false;

          // Age range check
          if (matchProfile.age < (userPrefs.age_min || 18) || matchProfile.age > (userPrefs.age_max || 100)) {
            return false;
          }

          // Gender preference check
          if (userPrefs.preferred_gender && matchProfile.gender !== userPrefs.preferred_gender) {
            return false;
          }

          // Interest matching (at least one common interest)
          const userInterests = userPrefs.interests || [];
          const matchInterests = matchProfile.interests?.[0]?.interests || [];
          const hasCommonInterest = userInterests.some((interest: string) =>
            matchInterests.includes(interest)
          );

          if (userInterests.length > 0 && matchInterests.length > 0 && !hasCommonInterest) {
            return false;
          }

          return true;
        });

        if (filteredMatches && filteredMatches.length > 0) {
          matchedUserId = filteredMatches[0].user_id;
        }
      }
    }

    if (matchedUserId) {
      await supabaseClient.from("waiting_users").delete().eq("user_id", matchedUserId);
      await supabaseClient.from("waiting_users").delete().eq("user_id", user.id);
    }

    if (matchedUserId) {
      // Build match partner profile
      const { data: matchProfile } = await supabaseClient
        .from("profiles")
        .select("id, display_name, age, gender, province, is_anonymous")
        .eq("id", matchedUserId)
        .single();

      if (!matchProfile) throw new Error("Matched user's profile not found");

      // Create chat room
      const { data: room, error: roomError } = await supabaseClient
        .from("chat_rooms")
        .insert({ room_type: "one_on_one", is_active: true })
        .select()
        .single();
      if (roomError || !room) throw new Error("Failed to create chat room");

      // Add participants (caller first -> initiator)
      const { data: participants } = await supabaseClient
        .from("room_participants")
        .insert([
          { room_id: room.id, user_id: user.id, is_currently_active: true },
          { room_id: room.id, user_id: matchedUserId, is_currently_active: true },
        ])
        .select()
        .order("joined_at", { ascending: true });

      const isInitiator = participants && participants[0]?.user_id === user.id;

      // Create match record (used by clients to get realtime notification)
      await supabaseClient.from("matches").insert({
        room_id: room.id,
        user1_id: user.id,
        user2_id: matchedUserId,
        connection_mode: connectionMode,
      });

      console.log("Live match paired. Room:", room.id);

      return new Response(
        JSON.stringify({
          match: {
            id: matchProfile.id,
            display_name: matchProfile.is_anonymous ? "Anonymous" : matchProfile.display_name,
            age: matchProfile.age,
            gender: matchProfile.gender,
            province: matchProfile.province,
          },
          room_id: room.id,
          isInitiator,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2) No live user available: put caller in the waiting queue (idempotent) and return waiting
    await supabaseClient.from("waiting_users").upsert({ user_id: user.id });
    console.log("No live user available. Added to waiting queue:", user.id);

    return new Response(
      JSON.stringify({ waiting: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in find-match:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
