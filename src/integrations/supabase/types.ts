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
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          created_at: string | null
          id: string
          market: string | null
          name: string | null
          symbol: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          market?: string | null
          name?: string | null
          symbol?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          market?: string | null
          name?: string | null
          symbol?: string | null
          type?: string | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          document_type: string | null
          document_url: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          document_type?: string | null
          document_url?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          document_type?: string | null
          document_url?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      market_access: {
        Row: {
          asset_id: string | null
          country: string | null
          id: string
          is_allowed: boolean | null
        }
        Insert: {
          asset_id?: string | null
          country?: string | null
          id?: string
          is_allowed?: boolean | null
        }
        Update: {
          asset_id?: string | null
          country?: string | null
          id?: string
          is_allowed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "market_access_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data: {
        Row: {
          asset_id: string
          asset_symbol: string
          asset_type: string
          close: number
          high: number
          id: string
          low: number
          open: number
          timestamp: string
          volume: number
        }
        Insert: {
          asset_id: string
          asset_symbol: string
          asset_type: string
          close: number
          high: number
          id?: string
          low: number
          open: number
          timestamp: string
          volume: number
        }
        Update: {
          asset_id?: string
          asset_symbol?: string
          asset_type?: string
          close?: number
          high?: number
          id?: string
          low?: number
          open?: number
          timestamp?: string
          volume?: number
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          asset_id: string | null
          average_price: number | null
          id: string
          quantity: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          asset_id?: string | null
          average_price?: number | null
          id?: string
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          asset_id?: string | null
          average_price?: number | null
          id?: string
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number
          created_at: string
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          amount: number
          asset_id: string
          asset_name: string
          asset_symbol: string
          asset_type: string
          created_at: string | null
          id: string
          price: number
          quantity: number
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          asset_id: string
          asset_name: string
          asset_symbol: string
          asset_type: string
          created_at?: string | null
          id?: string
          price: number
          quantity: number
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          asset_id?: string
          asset_name?: string
          asset_symbol?: string
          asset_type?: string
          created_at?: string | null
          id?: string
          price?: number
          quantity?: number
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      trading_bots: {
        Row: {
          asset_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          strategy: string | null
          user_id: string | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          strategy?: string | null
          user_id?: string | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          strategy?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_bots_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trading_bots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          kyc_status: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: string | null
          role?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          currency: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          asset_name: string | null
          asset_type: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          asset_name?: string | null
          asset_type?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          asset_name?: string | null
          asset_type?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_transaction: {
        Args: { p_user_id: string; p_amount: number; p_type: string }
        Returns: number
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
    Enums: {},
  },
} as const
