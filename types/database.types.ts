export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          phone: string | null
          address: string | null
          currency: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          phone?: string | null
          address?: string | null
          currency?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          phone?: string | null
          address?: string | null
          currency?: string
          is_active?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          slug: string
          image_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string
          name: string
          slug: string
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          slug?: string
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          price: number
          promotion_price: number | null
          image_url: string | null
          is_available: boolean
          is_promotion: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          price: number
          promotion_price?: number | null
          image_url?: string | null
          is_available?: boolean
          is_promotion?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          promotion_price?: number | null
          image_url?: string | null
          is_available?: boolean
          is_promotion?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      variation_groups: {
        Row: {
          id: string
          restaurant_id: string
          title: string
          type: "single" | "multiple_with_quantity"
          is_required: boolean
          category_ids: string[]
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string
          title: string
          type?: "single" | "multiple_with_quantity"
          is_required?: boolean
          category_ids?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          title?: string
          type?: "single" | "multiple_with_quantity"
          is_required?: boolean
          category_ids?: string[]
          created_at?: string
        }
      }
      variation_options: {
        Row: {
          id: string
          group_id: string
          name: string
          price: number
          base_price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          name: string
          price?: number
          base_price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          name?: string
          price?: number
          base_price?: number | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          customer_name: string
          customer_phone: string
          mode: "sur_place" | "livraison" | "en_route"
          table_number: string | null
          delivery_zone: string | null
          delivery_address: string | null
          delivery_fee: number
          subtotal: number
          total: number
          payment_method: string | null
          instructions: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string
          customer_name: string
          customer_phone: string
          mode: "sur_place" | "livraison" | "en_route"
          table_number?: string | null
          delivery_zone?: string | null
          delivery_address?: string | null
          delivery_fee?: number
          subtotal: number
          total: number
          payment_method?: string | null
          instructions?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          customer_name?: string
          customer_phone?: string
          mode?: "sur_place" | "livraison" | "en_route"
          table_number?: string | null
          delivery_zone?: string | null
          delivery_address?: string | null
          delivery_fee?: number
          subtotal?: number
          total?: number
          payment_method?: string | null
          instructions?: string | null
          status?: string
          created_at?: string
        }
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
