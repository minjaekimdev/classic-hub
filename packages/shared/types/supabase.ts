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
      daily_ranking: {
        Row: {
          area: string | null
          created_at: string
          current_rank: number | null
          last_rank: number | null
          performance_count: number | null
          performance_id: string
          performance_name: string | null
          period_from: string | null
          period_to: string | null
          poster: string | null
          seat_scale: number | null
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string
          current_rank?: number | null
          last_rank?: number | null
          performance_count?: number | null
          performance_id: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          seat_scale?: number | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string
          current_rank?: number | null
          last_rank?: number | null
          performance_count?: number | null
          performance_id?: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          seat_scale?: number | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          adress: string | null
          created_at: string
          facility_type: string | null
          hall_count: number | null
          has_cafe: boolean | null
          has_disabled_elevator: boolean | null
          has_disabled_parking: boolean | null
          has_disabled_ramp: boolean | null
          has_disabled_restroom: boolean | null
          has_nolibang: boolean | null
          has_parking: boolean | null
          has_restaurant: boolean | null
          has_store: boolean | null
          has_suyu: boolean | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string | null
          opening_year: string | null
          seat_count: number | null
          tel: string | null
          url: string | null
        }
        Insert: {
          adress?: string | null
          created_at?: string
          facility_type?: string | null
          hall_count?: number | null
          has_cafe?: boolean | null
          has_disabled_elevator?: boolean | null
          has_disabled_parking?: boolean | null
          has_disabled_ramp?: boolean | null
          has_disabled_restroom?: boolean | null
          has_nolibang?: boolean | null
          has_parking?: boolean | null
          has_restaurant?: boolean | null
          has_store?: boolean | null
          has_suyu?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          opening_year?: string | null
          seat_count?: number | null
          tel?: string | null
          url?: string | null
        }
        Update: {
          adress?: string | null
          created_at?: string
          facility_type?: string | null
          hall_count?: number | null
          has_cafe?: boolean | null
          has_disabled_elevator?: boolean | null
          has_disabled_parking?: boolean | null
          has_disabled_ramp?: boolean | null
          has_disabled_restroom?: boolean | null
          has_nolibang?: boolean | null
          has_parking?: boolean | null
          has_restaurant?: boolean | null
          has_store?: boolean | null
          has_suyu?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          opening_year?: string | null
          seat_count?: number | null
          tel?: string | null
          url?: string | null
        }
        Relationships: []
      }
      halls: {
        Row: {
          created_at: string
          disabled_seat_count: number | null
          disabled_stage_area: string | null
          facility_id: string | null
          has_dressing_room: boolean | null
          has_orchestra_pit: boolean | null
          has_outdoor_stage: boolean | null
          has_practice_room: boolean | null
          id: string
          name: string | null
          seat_count: number | null
        }
        Insert: {
          created_at?: string
          disabled_seat_count?: number | null
          disabled_stage_area?: string | null
          facility_id?: string | null
          has_dressing_room?: boolean | null
          has_orchestra_pit?: boolean | null
          has_outdoor_stage?: boolean | null
          has_practice_room?: boolean | null
          id?: string
          name?: string | null
          seat_count?: number | null
        }
        Update: {
          created_at?: string
          disabled_seat_count?: number | null
          disabled_stage_area?: string | null
          facility_id?: string | null
          has_dressing_room?: boolean | null
          has_orchestra_pit?: boolean | null
          has_outdoor_stage?: boolean | null
          has_practice_room?: boolean | null
          id?: string
          name?: string | null
          seat_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "halls_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_ranking: {
        Row: {
          area: string | null
          created_at: string
          current_rank: number | null
          last_rank: number | null
          performance_count: number | null
          performance_id: string
          performance_name: string | null
          period_from: string | null
          period_to: string | null
          poster: string | null
          seat_scale: number | null
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string
          current_rank?: number | null
          last_rank?: number | null
          performance_count?: number | null
          performance_id: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          seat_scale?: number | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string
          current_rank?: number | null
          last_rank?: number | null
          performance_count?: number | null
          performance_id?: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          seat_scale?: number | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      performances: {
        Row: {
          age: string | null
          area: string | null
          booking_links: Json | null
          cast: string | null
          created_at: string
          detail_image: Json | null
          max_price: number | null
          min_price: number | null
          performance_id: string
          performance_name: string | null
          period_from: string | null
          period_to: string | null
          poster: string | null
          price: Json | null
          raw_data: Json | null
          runtime: string | null
          state: string | null
          time: string | null
          updated_at: string | null
          venue_id: string | null
          venue_name: string | null
        }
        Insert: {
          age?: string | null
          area?: string | null
          booking_links?: Json | null
          cast?: string | null
          created_at?: string
          detail_image?: Json | null
          max_price?: number | null
          min_price?: number | null
          performance_id: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          price?: Json | null
          raw_data?: Json | null
          runtime?: string | null
          state?: string | null
          time?: string | null
          updated_at?: string | null
          venue_id?: string | null
          venue_name?: string | null
        }
        Update: {
          age?: string | null
          area?: string | null
          booking_links?: Json | null
          cast?: string | null
          created_at?: string
          detail_image?: Json | null
          max_price?: number | null
          min_price?: number | null
          performance_id?: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          price?: Json | null
          raw_data?: Json | null
          runtime?: string | null
          state?: string | null
          time?: string | null
          updated_at?: string | null
          venue_id?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      test_table: {
        Row: {
          c1: string | null
          c2: string | null
          created_at: string
          id: number
          jsondata: Json | null
          mt20id: string
        }
        Insert: {
          c1?: string | null
          c2?: string | null
          created_at?: string
          id?: number
          jsondata?: Json | null
          mt20id: string
        }
        Update: {
          c1?: string | null
          c2?: string | null
          created_at?: string
          id?: number
          jsondata?: Json | null
          mt20id?: string
        }
        Relationships: []
      }
      weekly_ranking: {
        Row: {
          area: string | null
          created_at: string
          current_rank: number | null
          last_rank: number | null
          performance_count: number | null
          performance_id: string
          performance_name: string | null
          period_from: string | null
          period_to: string | null
          poster: string | null
          seat_scale: number | null
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string
          current_rank?: number | null
          last_rank?: number | null
          performance_count?: number | null
          performance_id: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          seat_scale?: number | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string
          current_rank?: number | null
          last_rank?: number | null
          performance_count?: number | null
          performance_id?: string
          performance_name?: string | null
          period_from?: string | null
          period_to?: string | null
          poster?: string | null
          seat_scale?: number | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      daily_ranking_with_details: {
        Row: {
          booking_links: Json | null
          cast: string | null
          current_rank: number | null
          last_rank: number | null
          performance_id: string | null
          performance_name: string | null
          period_from: string | null
          period_to: string | null
          poster: string | null
          price: Json | null
          venue_name: string | null
        }
        Relationships: []
      }
      monthly_ranking_with_details: {
        Row: {
          booking_links: Json | null
          cast: string | null
          current_rank: number | null
          last_rank: number | null
          performance_id: string | null
          performance_name: string | null
          period_from: string | null
          period_to: string | null
          poster: string | null
          price: Json | null
          venue_name: string | null
        }
        Relationships: []
      }
      weekly_ranking_with_details: {
        Row: {
          booking_links: Json | null
          cast: string | null
          current_rank: number | null
          last_rank: number | null
          performance_id: string | null
          performance_name: string | null
          period_from: string | null
          period_to: string | null
          poster: string | null
          price: Json | null
          venue_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      bulk_update_concert_ranks:
        | { Args: { payload: Json }; Returns: undefined }
        | { Args: { payload: Json; period: string }; Returns: undefined }
      debug_check_payload: {
        Args: { payload: Json; period: string }
        Returns: {
          extracted_id: string
          item_index: number
          item_type: string
          raw_item: Json
        }[]
      }
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
