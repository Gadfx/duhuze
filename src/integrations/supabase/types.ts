export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blocks: {
        Row: {
          blocked_user_id: string
          created_at: string | null
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          blocked_user_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          blocked_user_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          room_type: Database["public"]["Enums"]["room_type"]
          theme: string | null
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          room_type?: Database["public"]["Enums"]["room_type"]
          theme?: string | null
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          room_type?: Database["public"]["Enums"]["room_type"]
          theme?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          favorited_user_id: string
          id: string
          is_mutual: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          favorited_user_id: string
          id?: string
          is_mutual?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          favorited_user_id?: string
          id?: string
          is_mutual?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_favorited_user_id_fkey"
            columns: ["favorited_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          connection_mode: Database["public"]["Enums"]["connection_mode"]
          created_at: string | null
          duration_seconds: number | null
          id: string
          room_id: string
          user1_id: string
          user1_rating: number | null
          user2_id: string
          user2_rating: number | null
        }
        Insert: {
          connection_mode: Database["public"]["Enums"]["connection_mode"]
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          room_id: string
          user1_id: string
          user1_rating?: number | null
          user2_id: string
          user2_rating?: number | null
        }
        Update: {
          connection_mode?: Database["public"]["Enums"]["connection_mode"]
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          room_id?: string
          user1_id?: string
          user1_rating?: number | null
          user2_id?: string
          user2_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_deleted: boolean | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          room_id: string
          self_destruct_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          room_id: string
          self_destruct_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          room_id?: string
          self_destruct_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_logs: {
        Row: {
          action: Database["public"]["Enums"]["moderation_action"]
          created_at: string | null
          expires_at: string | null
          id: string
          moderator_id: string | null
          reason: string
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["moderation_action"]
          created_at?: string | null
          expires_at?: string | null
          id?: string
          moderator_id?: string | null
          reason: string
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["moderation_action"]
          created_at?: string | null
          expires_at?: string | null
          id?: string
          moderator_id?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_logs_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          ban_until: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          display_name: string | null
          gender: Database["public"]["Enums"]["user_gender"] | null
          id: string
          is_anonymous: boolean | null
          is_banned: boolean | null
          is_premium: boolean | null
          preferred_language: string | null
          province: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          ban_until?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          gender?: Database["public"]["Enums"]["user_gender"] | null
          id: string
          is_anonymous?: boolean | null
          is_banned?: boolean | null
          is_premium?: boolean | null
          preferred_language?: string | null
          province?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          ban_until?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          gender?: Database["public"]["Enums"]["user_gender"] | null
          id?: string
          is_anonymous?: boolean | null
          is_banned?: boolean | null
          is_premium?: boolean | null
          preferred_language?: string | null
          province?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          room_id: string | null
          status: Database["public"]["Enums"]["report_status"] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          room_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          room_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_participants: {
        Row: {
          id: string
          is_currently_active: boolean | null
          joined_at: string | null
          left_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_currently_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_currently_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          age_max: number | null
          age_min: number | null
          created_at: string | null
          enable_video_blur: boolean | null
          id: string
          interests: string[] | null
          preferred_gender: Database["public"]["Enums"]["user_gender"] | null
          preferred_provinces: string[] | null
          self_destructing_messages: boolean | null
          updated_at: string | null
          user_id: string
          voice_only_mode: boolean | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          created_at?: string | null
          enable_video_blur?: boolean | null
          id?: string
          interests?: string[] | null
          preferred_gender?: Database["public"]["Enums"]["user_gender"] | null
          preferred_provinces?: string[] | null
          self_destructing_messages?: boolean | null
          updated_at?: string | null
          user_id: string
          voice_only_mode?: boolean | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          created_at?: string | null
          enable_video_blur?: boolean | null
          id?: string
          interests?: string[] | null
          preferred_gender?: Database["public"]["Enums"]["user_gender"] | null
          preferred_provinces?: string[] | null
          self_destructing_messages?: boolean | null
          updated_at?: string | null
          user_id?: string
          voice_only_mode?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          average_rating: number | null
          created_at: string | null
          id: string
          last_active_at: string | null
          reports_received: number | null
          skips_used: number | null
          total_chat_time_seconds: number | null
          total_matches: number | null
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string | null
          id?: string
          last_active_at?: string | null
          reports_received?: number | null
          skips_used?: number | null
          total_chat_time_seconds?: number | null
          total_matches?: number | null
          user_id: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string | null
          id?: string
          last_active_at?: string | null
          reports_received?: number | null
          skips_used?: number | null
          total_chat_time_seconds?: number | null
          total_matches?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waiting_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_expired_messages: { Args: never; Returns: undefined }
    }
    Enums: {
      connection_mode: "random" | "interest_based" | "group_room"
      message_type: "text" | "emoji" | "gif" | "sticker" | "system"
      moderation_action:
        | "warning"
        | "temporary_ban"
        | "permanent_ban"
        | "cleared"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      room_type: "one_on_one" | "group"
      user_gender: "male" | "female" | "non_binary" | "prefer_not_to_say"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      connection_mode: ["random", "interest_based", "group_room"],
      message_type: ["text", "emoji", "gif", "sticker", "system"],
      moderation_action: [
        "warning",
        "temporary_ban",
        "permanent_ban",
        "cleared",
      ],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
      room_type: ["one_on_one", "group"],
      user_gender: ["male", "female", "non_binary", "prefer_not_to_say"],
    },
  },
} as const
