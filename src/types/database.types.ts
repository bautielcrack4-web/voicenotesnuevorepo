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
            meetings: {
                Row: {
                    analysis_data: Json | null
                    created_at: string | null
                    id: string
                    summary: string | null
                    title: string
                    user_id: string
                }
                Insert: {
                    analysis_data?: Json | null
                    created_at?: string | null
                    id?: string
                    summary?: string | null
                    title: string
                    user_id: string
                }
                Update: {
                    analysis_data?: Json | null
                    created_at?: string | null
                    id?: string
                    summary?: string | null
                    title?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "meetings_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    created_at: string | null
                    email: string
                    full_name: string | null
                    id: string
                    paypal_customer_id: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    paypal_customer_id?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    paypal_customer_id?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            recordings: {
                Row: {
                    audio_url: string | null
                    created_at: string
                    duration_seconds: number | null
                    id: string
                    status: string
                    title: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    audio_url?: string | null
                    created_at?: string
                    duration_seconds?: number | null
                    id?: string
                    status?: string
                    title: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    audio_url?: string | null
                    created_at?: string
                    duration_seconds?: number | null
                    id?: string
                    status?: string
                    title?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "recordings_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            subscriptions: {
                Row: {
                    created_at: string | null
                    current_period_end: string | null
                    current_period_start: string | null
                    id: string
                    paypal_subscription_id: string | null
                    status: Database["public"]["Enums"]["subscription_status"]
                    tier: Database["public"]["Enums"]["subscription_tier"]
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    current_period_end?: string | null
                    current_period_start?: string | null
                    id?: string
                    paypal_subscription_id?: string | null
                    status?: Database["public"]["Enums"]["subscription_status"]
                    tier?: Database["public"]["Enums"]["subscription_tier"]
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    current_period_end?: string | null
                    current_period_start?: string | null
                    id?: string
                    paypal_subscription_id?: string | null
                    status?: Database["public"]["Enums"]["subscription_status"]
                    tier?: Database["public"]["Enums"]["subscription_tier"]
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "subscriptions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            transcriptions: {
                Row: {
                    action_items: Json | null
                    created_at: string
                    id: string
                    key_points: Json | null
                    raw_text: string
                    recording_id: string
                    summary: string | null
                    user_id: string
                }
                Insert: {
                    action_items?: Json | null
                    created_at?: string
                    id?: string
                    key_points?: Json | null
                    raw_text: string
                    recording_id: string
                    summary?: string | null
                    user_id: string
                }
                Update: {
                    action_items?: Json | null
                    created_at?: string
                    id?: string
                    key_points?: Json | null
                    raw_text?: string
                    recording_id?: string
                    summary?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "transcriptions_recording_id_fkey"
                        columns: ["recording_id"]
                        isOneToOne: false
                        referencedRelation: "recordings"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transcriptions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            usage: {
                Row: {
                    created_at: string | null
                    id: string
                    meetings_analyzed: number
                    month: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    meetings_analyzed?: number
                    month: string
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    meetings_analyzed?: number
                    month?: string
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "usage_user_id_fkey"
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
            [_ in never]: never
        }
        Enums: {
            subscription_status: "active" | "canceled" | "suspended" | "expired"
            subscription_tier: "free" | "pro" | "enterprise"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
