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
      guide_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          guide_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          guide_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          guide_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guide_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      openai_chats: {
        Row: {
          assistant_id: string | null
          created_at: string | null
          id: number
          prompt: string | null
          response: string | null
          user_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string | null
          id?: number
          prompt?: string | null
          response?: string | null
          user_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          created_at?: string | null
          id?: number
          prompt?: string | null
          response?: string | null
          user_id?: string | null
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
      site_visitors: {
        Row: {
          created_at: string
          id: number
          ip_address: string | null
          page_visited: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          ip_address?: string | null
          page_visited: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          ip_address?: string | null
          page_visited?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          after_image_url: string | null
          before_image_url: string | null
          created_at: string
          description: string
          guide_id: string
          id: string
          share_count: number | null
          title: string
          user_id: string
        }
        Insert: {
          after_image_url?: string | null
          before_image_url?: string | null
          created_at?: string
          description: string
          guide_id: string
          id?: string
          share_count?: number | null
          title: string
          user_id: string
        }
        Update: {
          after_image_url?: string | null
          before_image_url?: string | null
          created_at?: string
          description?: string
          guide_id?: string
          id?: string
          share_count?: number | null
          title?: string
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
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_type: string
          id: string
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_type: string
          id?: string
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_type?: string
          id?: string
          user_id?: string
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
          created_at: string
          grow_experience_level: string | null
          id: string
          subscription_status: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          grow_experience_level?: string | null
          id: string
          subscription_status?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          grow_experience_level?: string | null
          id?: string
          subscription_status?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
