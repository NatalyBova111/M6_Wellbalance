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
      daily_logs: {
        Row: {
          carbs_g: number | null
          fat_g: number | null
          id: string
          log_date: string
          protein_g: number | null
          total_calories: number | null
          user_id: string
        }
        Insert: {
          carbs_g?: number | null
          fat_g?: number | null
          id?: string
          log_date: string
          protein_g?: number | null
          total_calories?: number | null
          user_id: string
        }
        Update: {
          carbs_g?: number | null
          fat_g?: number | null
          id?: string
          log_date?: string
          protein_g?: number | null
          total_calories?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          brand: string | null
          calories_per_serving: number | null
          carbs_per_serving: number | null
          created_at: string
          fat_per_serving: number | null
          id: string
          is_public: boolean
          macro_category: string | null
          name: string
          owner_id: string | null
          protein_per_serving: number | null
          serving_qty: number
          serving_unit: string
        }
        Insert: {
          brand?: string | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string
          fat_per_serving?: number | null
          id?: string
          is_public?: boolean
          macro_category?: string | null
          name: string
          owner_id?: string | null
          protein_per_serving?: number | null
          serving_qty?: number
          serving_unit?: string
        }
        Update: {
          brand?: string | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string
          fat_per_serving?: number | null
          id?: string
          is_public?: boolean
          macro_category?: string | null
          name?: string
          owner_id?: string | null
          protein_per_serving?: number | null
          serving_qty?: number
          serving_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "foods_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_items: {
        Row: {
          calories_total: number | null
          food_id: string
          id: string
          meal_id: string
          qty: number
        }
        Insert: {
          calories_total?: number | null
          food_id: string
          id?: string
          meal_id: string
          qty: number
        }
        Update: {
          calories_total?: number | null
          food_id?: string
          id?: string
          meal_id?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string
          id: string
          log_id: string
          meal_type: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          log_id: string
          meal_type: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          log_id?: string
          meal_type?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      sleep_logs: {
        Row: {
          bedtime: string | null
          date_on: string
          id: string
          note: string | null
          quality_score: number | null
          total_sleep_hours: number | null
          user_id: string
          wake_time: string | null
        }
        Insert: {
          bedtime?: string | null
          date_on: string
          id?: string
          note?: string | null
          quality_score?: number | null
          total_sleep_hours?: number | null
          user_id: string
          wake_time?: string | null
        }
        Update: {
          bedtime?: string | null
          date_on?: string
          id?: string
          note?: string | null
          quality_score?: number | null
          total_sleep_hours?: number | null
          user_id?: string
          wake_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sleep_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      water_intake: {
        Row: {
          id: string
          log_date: string
          ml: number
          user_id: string
        }
        Insert: {
          id?: string
          log_date: string
          ml: number
          user_id: string
        }
        Update: {
          id?: string
          log_date?: string
          ml?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_intake_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
