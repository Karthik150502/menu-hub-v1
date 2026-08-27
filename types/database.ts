// ═══════════════════════════════════════════════════════════════════════════
// AUTO-GENERATED — do not hand-edit.
// Source of truth is fastapi-supabase-starter (Alembic). Regenerate after
// any backend migration with:
//   supabase gen types typescript --linked --schema public > types/database.ts
// See supabase/README.md for the full ownership story.
// ═══════════════════════════════════════════════════════════════════════════

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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      alembic_version: {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
        Relationships: []
      }
      currencies: {
        Row: {
          code: string
          created_at: string
          symbol: string
        }
        Insert: {
          code?: string
          created_at?: string
          symbol?: string
        }
        Update: {
          code?: string
          created_at?: string
          symbol?: string
        }
        Relationships: []
      }
      dishes: {
        Row: {
          available: boolean
          base_price: number
          category: string
          created_at: string
          currency_code: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          restaurant_id: string
          show_in_menu: boolean
          tag: string | null
          updated_at: string
          veg: boolean
        }
        Insert: {
          available?: boolean
          base_price: number
          category: string
          created_at?: string
          currency_code?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          restaurant_id: string
          show_in_menu?: boolean
          tag?: string | null
          updated_at?: string
          veg?: boolean
        }
        Update: {
          available?: boolean
          base_price?: number
          category?: string
          created_at?: string
          currency_code?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          restaurant_id?: string
          show_in_menu?: boolean
          tag?: string | null
          updated_at?: string
          veg?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "dishes_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "dishes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      item_prices: {
        Row: {
          base_price: number
          created_at: string
          currency_code: string
          discount_label: string | null
          discount_on: string | null
          discount_type: string | null
          discount_valid_from: string | null
          discount_valid_until: string | null
          discount_value: number | null
          dish_id: string
          final_price: number
          id: string
          mrp: number | null
          total_tax_amount: number
          updated_at: string
        }
        Insert: {
          base_price: number
          created_at?: string
          currency_code: string
          discount_label?: string | null
          discount_on?: string | null
          discount_type?: string | null
          discount_valid_from?: string | null
          discount_valid_until?: string | null
          discount_value?: number | null
          dish_id: string
          final_price: number
          id?: string
          mrp?: number | null
          total_tax_amount?: number
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          currency_code?: string
          discount_label?: string | null
          discount_on?: string | null
          discount_type?: string | null
          discount_valid_from?: string | null
          discount_valid_until?: string | null
          discount_value?: number | null
          dish_id?: string
          final_price?: number
          id?: string
          mrp?: number | null
          total_tax_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_prices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "item_prices_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: true
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      item_taxes: {
        Row: {
          created_at: string
          description: string | null
          id: number
          inclusive: boolean | null
          name: string
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          inclusive?: boolean | null
          name?: string
          rate: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          inclusive?: boolean | null
          name?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address_line: string | null
          city: string | null
          country: string
          created_at: string
          currency: string
          description: string | null
          id: string
          image_url: string | null
          is_open: boolean
          logo_url: string | null
          name: string
          owner_id: string
          pincode: string | null
          shop_timings: Json | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          country?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean
          logo_url?: string | null
          name: string
          owner_id: string
          pincode?: string | null
          shop_timings?: Json | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          city?: string | null
          country?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean
          logo_url?: string | null
          name?: string
          owner_id?: string
          pincode?: string | null
          shop_timings?: Json | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tax_group_members: {
        Row: {
          item_tax_id: number
          tax_group_id: number
        }
        Insert: {
          item_tax_id: number
          tax_group_id: number
        }
        Update: {
          item_tax_id?: number
          tax_group_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_group_members_item_tax_id_fkey"
            columns: ["item_tax_id"]
            isOneToOne: false
            referencedRelation: "item_taxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_group_members_tax_group_id_fkey"
            columns: ["tax_group_id"]
            isOneToOne: false
            referencedRelation: "tax_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_groups: {
        Row: {
          combined_rate: number
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          combined_rate?: number
          created_at?: string
          description?: string | null
          id?: never
          name: string
          updated_at?: string
        }
        Update: {
          combined_rate?: number
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tax_line_item_groups: {
        Row: {
          computed_amount: number
          tax_group_id: number
          tax_line_item_id: string
        }
        Insert: {
          computed_amount?: number
          tax_group_id: number
          tax_line_item_id: string
        }
        Update: {
          computed_amount?: number
          tax_group_id?: number
          tax_line_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_line_item_groups_tax_group_id_fkey"
            columns: ["tax_group_id"]
            isOneToOne: false
            referencedRelation: "tax_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_line_item_groups_tax_line_item_id_fkey"
            columns: ["tax_line_item_id"]
            isOneToOne: false
            referencedRelation: "tax_line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_line_item_taxes: {
        Row: {
          computed_amount: number
          item_tax_id: number
          tax_line_item_id: string
        }
        Insert: {
          computed_amount?: number
          item_tax_id: number
          tax_line_item_id: string
        }
        Update: {
          computed_amount?: number
          item_tax_id?: number
          tax_line_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_line_item_taxes_item_tax_id_fkey"
            columns: ["item_tax_id"]
            isOneToOne: false
            referencedRelation: "item_taxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_line_item_taxes_tax_line_item_id_fkey"
            columns: ["tax_line_item_id"]
            isOneToOne: false
            referencedRelation: "tax_line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_line_items: {
        Row: {
          created_at: string
          id: string
          item_price_id: string
          total_tax_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_price_id: string
          total_tax_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_price_id?: string
          total_tax_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_line_items_item_price_id_fkey"
            columns: ["item_price_id"]
            isOneToOne: true
            referencedRelation: "item_prices"
            referencedColumns: ["id"]
          },
        ]
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
