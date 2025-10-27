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

    const { reported_user_id, room_id, reason, description } = await req.json();

    if (!reported_user_id || !reason) {
      throw new Error("Missing required fields");
    }

    console.log("Creating report from", user.id, "against", reported_user_id);

    // Create report
    const { data: report, error: reportError } = await supabaseClient
      .from("reports")
      .insert({
        reporter_id: user.id,
        reported_user_id,
        room_id: room_id || null,
        reason,
        description: description || null,
        status: "pending",
      })
      .select()
      .single();

    if (reportError) {
      throw reportError;
    }

    // Update stats for reported user
    const { data: stats } = await supabaseClient
      .from("user_stats")
      .select("reports_received")
      .eq("user_id", reported_user_id)
      .single();

    await supabaseClient
      .from("user_stats")
      .update({
        reports_received: (stats?.reports_received || 0) + 1,
      })
      .eq("user_id", reported_user_id);

    // Auto-moderate if user has multiple reports
    const { data: userStats } = await supabaseClient
      .from("user_stats")
      .select("reports_received")
      .eq("user_id", reported_user_id)
      .single();

    if (userStats && userStats.reports_received >= 3) {
      // Temporary ban for 24 hours
      const banUntil = new Date();
      banUntil.setHours(banUntil.getHours() + 24);

      await supabaseClient
        .from("profiles")
        .update({
          is_banned: true,
          ban_until: banUntil.toISOString(),
        })
        .eq("id", reported_user_id);

      await supabaseClient
        .from("moderation_logs")
        .insert({
          user_id: reported_user_id,
          action: "temporary_ban",
          reason: "Multiple reports received - auto-moderation",
          expires_at: banUntil.toISOString(),
        });

      console.log("User", reported_user_id, "auto-banned until", banUntil);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        report_id: report.id,
        message: "Report submitted successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in report-user:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
