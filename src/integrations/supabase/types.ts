export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      user_profiles: {
        Row: {
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
      attempt_delete_users: {
        Args: { user_ids: string[] }
        Returns: string
      }
      check_and_remove_pending_subscriptions: {
        Args: { email_param: string }
        Returns: undefined
      }
      check_pending_subscription: {
        Args: { check_email: string }
        Returns: {
          has_pending: boolean
          subscription_type: string
          expires_at: string
        }[]
      }
      consume_pending_subscription: {
        Args: { sub_email: string }
        Returns: boolean
      }
      get_pending_subscription: {
        Args: { email_address: string }
        Returns: {
          has_pending: boolean
          subscription_type: string
          expires_at: string
        }[]
      }
      handle_square_payment: {
        Args: {
          order_id: string
          customer_email: string
          subscription_type?: string
        }
        Returns: boolean
      }
      has_active_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_quiz_subscription_required: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_user_completed_quiz: {
        Args: { user_email: string }
        Returns: boolean
      }
      safely_delete_user: {
        Args: { user_id_to_delete: string }
        Returns: undefined
      }
      user_has_access: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      grow_experience: "new" | "intermediate" | "advanced"
      growing_method: "indoor" | "outdoor" | "greenhouse"
      monitoring_method: "manual" | "basic_sensors" | "advanced_systems"
      nutrient_type: "organic" | "synthetic" | "both" | "none"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
    },
  },
} as const
