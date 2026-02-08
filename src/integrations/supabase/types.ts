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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      assistant_settings: {
        Row: {
          assistant_id: string
          created_at: string | null
          id: string
          max_tokens: number | null
          system_instructions: string | null
          temperature: number | null
          updated_at: string | null
          user_id: string | null
          voice_settings: Json | null
        }
        Insert: {
          assistant_id: string
          created_at?: string | null
          id?: string
          max_tokens?: number | null
          system_instructions?: string | null
          temperature?: number | null
          updated_at?: string | null
          user_id?: string | null
          voice_settings?: Json | null
        }
        Update: {
          assistant_id?: string
          created_at?: string | null
          id?: string
          max_tokens?: number | null
          system_instructions?: string | null
          temperature?: number | null
          updated_at?: string | null
          user_id?: string | null
          voice_settings?: Json | null
        }
        Relationships: []
      }
      avatar_customizations_catalog: {
        Row: {
          created_at: string | null
          customization_type: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          unlock_requirement: number
        }
        Insert: {
          created_at?: string | null
          customization_type?: string | null
          description: string
          id: string
          image_url?: string | null
          name: string
          unlock_requirement: number
        }
        Update: {
          created_at?: string | null
          customization_type?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          unlock_requirement?: number
        }
        Relationships: []
      }
      badges_catalog: {
        Row: {
          badge_type: string | null
          created_at: string | null
          description: string
          icon_url: string | null
          id: string
          name: string
          unlock_requirement: number
        }
        Insert: {
          badge_type?: string | null
          created_at?: string | null
          description: string
          icon_url?: string | null
          id: string
          name: string
          unlock_requirement: number
        }
        Update: {
          badge_type?: string | null
          created_at?: string | null
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          unlock_requirement?: number
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          is_ai: boolean | null
          message: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_ai?: boolean | null
          message: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_ai?: boolean | null
          message?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          profile_name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          profile_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          profile_name?: string | null
        }
        Relationships: []
      }
      leaderboard_profiles: {
        Row: {
          created_at: string
          is_opt_in: boolean
          leaderboard_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          is_opt_in?: boolean
          leaderboard_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          is_opt_in?: boolean
          leaderboard_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      milestones_catalog: {
        Row: {
          created_at: string | null
          fun_fact: string
          id: string
          milestone_type: string
          streak_requirement: number
          title: string
        }
        Insert: {
          created_at?: string | null
          fun_fact: string
          id: string
          milestone_type?: string
          streak_requirement: number
          title: string
        }
        Update: {
          created_at?: string | null
          fun_fact?: string
          id?: string
          milestone_type?: string
          streak_requirement?: number
          title?: string
        }
        Relationships: []
      }
      pending_subscriptions: {
        Row: {
          consumed: boolean | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          square_order_id: string
          subscription_type: string
        }
        Insert: {
          consumed?: boolean | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          square_order_id: string
          subscription_type: string
        }
        Update: {
          consumed?: boolean | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          square_order_id?: string
          subscription_type?: string
        }
        Relationships: []
      }
      plant_analyses: {
        Row: {
          confidence_level: number | null
          created_at: string | null
          detailed_analysis: Json | null
          diagnosis: string | null
          follow_up_date: string | null
          growing_method: string | null
          growth_stage: string | null
          id: string
          image_taken_at: string | null
          image_url: string
          image_urls: Json | null
          issue_resolved: boolean | null
          primary_issue: string | null
          recommended_actions: Json | null
          resolution_notes: string | null
          strain_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string | null
          detailed_analysis?: Json | null
          diagnosis?: string | null
          follow_up_date?: string | null
          growing_method?: string | null
          growth_stage?: string | null
          id?: string
          image_taken_at?: string | null
          image_url: string
          image_urls?: Json | null
          issue_resolved?: boolean | null
          primary_issue?: string | null
          recommended_actions?: Json | null
          resolution_notes?: string | null
          strain_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string | null
          detailed_analysis?: Json | null
          diagnosis?: string | null
          follow_up_date?: string | null
          growing_method?: string | null
          growth_stage?: string | null
          id?: string
          image_taken_at?: string | null
          image_url?: string
          image_urls?: Json | null
          issue_resolved?: boolean | null
          primary_issue?: string | null
          recommended_actions?: Json | null
          resolution_notes?: string | null
          strain_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          challenges: string[]
          created_at: string
          experience_level: Database["public"]["Enums"]["grow_experience"]
          goals: string[]
          growing_method: Database["public"]["Enums"]["growing_method"]
          id: string
          monitoring_method: Database["public"]["Enums"]["monitoring_method"]
          nutrient_type: Database["public"]["Enums"]["nutrient_type"]
          plant_quantity:
            | Database["public"]["Enums"]["plant_quantity_type"]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          challenges: string[]
          created_at?: string
          experience_level: Database["public"]["Enums"]["grow_experience"]
          goals: string[]
          growing_method: Database["public"]["Enums"]["growing_method"]
          id?: string
          monitoring_method: Database["public"]["Enums"]["monitoring_method"]
          nutrient_type: Database["public"]["Enums"]["nutrient_type"]
          plant_quantity?:
            | Database["public"]["Enums"]["plant_quantity_type"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          challenges?: string[]
          created_at?: string
          experience_level?: Database["public"]["Enums"]["grow_experience"]
          goals?: string[]
          growing_method?: Database["public"]["Enums"]["growing_method"]
          id?: string
          monitoring_method?: Database["public"]["Enums"]["monitoring_method"]
          nutrient_type?: Database["public"]["Enums"]["nutrient_type"]
          plant_quantity?:
            | Database["public"]["Enums"]["plant_quantity_type"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      share_metrics: {
        Row: {
          analysis_id: string | null
          created_at: string
          id: string
          share_type: string
          user_id: string | null
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          id?: string
          share_type: string
          user_id?: string | null
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          id?: string
          share_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "share_metrics_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "plant_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_analyses: {
        Row: {
          analysis_id: string
          created_at: string
          expires_at: string
          id: string
          share_token: string
        }
        Insert: {
          analysis_id: string
          created_at?: string
          expires_at: string
          id?: string
          share_token: string
        }
        Update: {
          analysis_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          share_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_analyses_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "plant_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          square_order_id: string | null
          starts_at: string
          status: string
          subscription_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          square_order_id?: string | null
          starts_at?: string
          status: string
          subscription_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          square_order_id?: string | null
          starts_at?: string
          status?: string
          subscription_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      user_avatars: {
        Row: {
          applied_at: string | null
          avatar_customization_id: string
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          avatar_customization_id: string
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          avatar_customization_id?: string
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_avatars_avatar_customization_id_fkey"
            columns: ["avatar_customization_id"]
            isOneToOne: false
            referencedRelation: "avatar_customizations_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          id: string
          is_active: boolean | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          is_active?: boolean | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          is_active?: boolean | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          beta_testing_email: string | null
          biggest_challenge: string | null
          created_at: string
          growing_effectiveness_rating: number
          id: string
          main_improvement_area: string
          other_improvement_details: string | null
          recommendation_rating: number
          user_id: string | null
          whats_working: string | null
        }
        Insert: {
          beta_testing_email?: string | null
          biggest_challenge?: string | null
          created_at?: string
          growing_effectiveness_rating: number
          id?: string
          main_improvement_area: string
          other_improvement_details?: string | null
          recommendation_rating: number
          user_id?: string | null
          whats_working?: string | null
        }
        Update: {
          beta_testing_email?: string | null
          biggest_challenge?: string | null
          created_at?: string
          growing_effectiveness_rating?: number
          id?: string
          main_improvement_area?: string
          other_improvement_details?: string | null
          recommendation_rating?: number
          user_id?: string | null
          whats_working?: string | null
        }
        Relationships: []
      }
      user_milestones: {
        Row: {
          celebrated_at: string | null
          created_at: string | null
          id: string
          is_shared: boolean | null
          milestone_id: string
          user_id: string
        }
        Insert: {
          celebrated_at?: string | null
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          milestone_id: string
          user_id: string
        }
        Update: {
          celebrated_at?: string | null
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          milestone_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          challenges: string[] | null
          created_at: string
          goals: string[] | null
          grow_experience_level: string | null
          growing_method: string | null
          has_completed_quiz: boolean | null
          id: string
          monitoring_method: string | null
          nutrient_type: string | null
          subscription_status: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          challenges?: string[] | null
          created_at?: string
          goals?: string[] | null
          grow_experience_level?: string | null
          growing_method?: string | null
          has_completed_quiz?: boolean | null
          id: string
          monitoring_method?: string | null
          nutrient_type?: string | null
          subscription_status?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          challenges?: string[] | null
          created_at?: string
          goals?: string[] | null
          grow_experience_level?: string | null
          growing_method?: string | null
          has_completed_quiz?: boolean | null
          id?: string
          monitoring_method?: string | null
          nutrient_type?: string | null
          subscription_status?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number
          grace_days: number
          last_action: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          grace_days?: number
          last_action?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          grace_days?: number
          last_action?: string
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_access_view: {
        Row: {
          expires_at: string | null
          has_active_subscription: boolean | null
          has_completed_quiz: boolean | null
          id: string | null
          subscription_status: string | null
          subscription_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      attempt_delete_users:
        | { Args: never; Returns: undefined }
        | { Args: { user_ids: string[] }; Returns: string }
      check_and_remove_pending_subscriptions: {
        Args: { email_param: string }
        Returns: undefined
      }
      check_and_unlock_streak_rewards: {
        Args: { current_user_streak: number }
        Returns: Json
      }
      check_pending_subscription: {
        Args: { check_email: string }
        Returns: {
          expires_at: string
          has_pending: boolean
          subscription_type: string
        }[]
      }
      check_personal_milestone_achievements: {
        Args: { current_user_streak: number }
        Returns: Json
      }
      consume_pending_subscription: {
        Args: { sub_email: string }
        Returns: boolean
      }
      get_bud_boost_leaderboard: {
        Args: { max_rows?: number }
        Returns: {
          last_action: string
          leaderboard_name: string
          rank: number
          run: number
        }[]
      }
      get_my_pending_subscriptions: {
        Args: never
        Returns: {
          consumed: boolean
          created_at: string
          expires_at: string
          id: string
          subscription_type: string
        }[]
      }
      get_pending_subscription: {
        Args: { email_address: string }
        Returns: {
          expires_at: string
          has_pending: boolean
          subscription_type: string
        }[]
      }
      handle_square_payment: {
        Args: {
          customer_email: string
          order_id: string
          subscription_type?: string
        }
        Returns: boolean
      }
      has_active_subscription: { Args: { user_uuid: string }; Returns: boolean }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_quiz_subscription_required: { Args: never; Returns: boolean }
      mark_milestone_shared: {
        Args: { milestone_achievement_id: string }
        Returns: boolean
      }
      mark_user_completed_quiz:
        | { Args: never; Returns: boolean }
        | { Args: { user_email: string }; Returns: boolean }
      safely_delete_user: {
        Args: { user_id_to_delete: string }
        Returns: undefined
      }
      update_streak_for_user: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      user_has_access: { Args: { user_uuid: string }; Returns: boolean }
    }
    Enums: {
      grow_experience: "new" | "intermediate" | "advanced"
      growing_method: "indoor" | "outdoor" | "greenhouse"
      monitoring_method: "manual" | "basic_sensors" | "advanced_systems"
      nutrient_type: "organic" | "synthetic" | "both" | "none"
      plant_quantity_type: "1-4" | "5-20" | "21-100" | "101-500" | "500+"
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
      grow_experience: ["new", "intermediate", "advanced"],
      growing_method: ["indoor", "outdoor", "greenhouse"],
      monitoring_method: ["manual", "basic_sensors", "advanced_systems"],
      nutrient_type: ["organic", "synthetic", "both", "none"],
      plant_quantity_type: ["1-4", "5-20", "21-100", "101-500", "500+"],
    },
  },
} as const
