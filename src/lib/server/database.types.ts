
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "inventory": {
                  Row: {
                    "low_stock_threshold": number,"on_hand": number,"product_slug": string,"reserved": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "low_stock_threshold"?: number,"on_hand"?: number,"product_slug": string,"reserved"?: number,"updated_at"?: string
                  }
                  Update: {
                    "low_stock_threshold"?: number,"on_hand"?: number,"product_slug"?: string,"reserved"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"inventory_movements": {
                  Row: {
                    "actor_id": string | null,"created_at": string,"delta": number,"id": number,"note": string | null,"order_id": string | null,"product_slug": string,"reason": Database["public"]['Enums']["stock_reason"]
                  }
                  ComputedFields: never
                  Insert: {
                    "actor_id"?: string | null,"created_at"?: string,"delta": number,"id"?: never,"note"?: string | null,"order_id"?: string | null,"product_slug": string,"reason": Database["public"]['Enums']["stock_reason"]
                  }
                  Update: {
                    "actor_id"?: string | null,"created_at"?: string,"delta"?: number,"id"?: never,"note"?: string | null,"order_id"?: string | null,"product_slug"?: string,"reason"?: Database["public"]['Enums']["stock_reason"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "inventory_movements_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "inventory_movements_product_slug_fkey"
      columns: ["product_slug"]
isOneToOne: false
      referencedRelation: "inventory"
      referencedColumns: ["product_slug"]
    }
                  ]
                },"order_events": {
                  Row: {
                    "actor_id": string | null,"created_at": string,"data": NonNullable<Json>,"id": number,"order_id": string,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "actor_id"?: string | null,"created_at"?: string,"data"?: NonNullable<Json>,"id"?: never,"order_id": string,"type": string
                  }
                  Update: {
                    "actor_id"?: string | null,"created_at"?: string,"data"?: NonNullable<Json>,"id"?: never,"order_id"?: string,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "order_events_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    }
                  ]
                },"order_items": {
                  Row: {
                    "id": number,"name": string,"order_id": string,"product_slug": string,"quantity": number,"unit_price_cents": number
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: never,"name": string,"order_id": string,"product_slug": string,"quantity": number,"unit_price_cents": number
                  }
                  Update: {
                    "id"?: never,"name"?: string,"order_id"?: string,"product_slug"?: string,"quantity"?: number,"unit_price_cents"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "order_items_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    }
                  ]
                },"orders": {
                  Row: {
                    "amount_refunded_cents": number,"cancelled_at": string | null,"carrier": string | null,"created_at": string,"currency": string,"email": string | null,"fulfilled_at": string | null,"id": string,"needs_attention": boolean,"number": string,"paid_at": string | null,"reservation_expires_at": string | null,"restocked_at": string | null,"shipping_address": Json | null,"shipping_cents": number,"shipping_name": string | null,"status": Database["public"]['Enums']["order_status"],"stripe_checkout_session_id": string | null,"stripe_customer_id": string | null,"stripe_payment_intent_id": string | null,"subtotal_cents": number,"tax_cents": number,"total_cents": number,"tracking_number": string | null,"updated_at": string,"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_refunded_cents"?: number,"cancelled_at"?: string | null,"carrier"?: string | null,"created_at"?: string,"currency"?: string,"email"?: string | null,"fulfilled_at"?: string | null,"id"?: string,"needs_attention"?: boolean,"number"?: string,"paid_at"?: string | null,"reservation_expires_at"?: string | null,"restocked_at"?: string | null,"shipping_address"?: Json | null,"shipping_cents"?: number,"shipping_name"?: string | null,"status"?: Database["public"]['Enums']["order_status"],"stripe_checkout_session_id"?: string | null,"stripe_customer_id"?: string | null,"stripe_payment_intent_id"?: string | null,"subtotal_cents": number,"tax_cents"?: number,"total_cents": number,"tracking_number"?: string | null,"updated_at"?: string,"user_id"?: string | null
                  }
                  Update: {
                    "amount_refunded_cents"?: number,"cancelled_at"?: string | null,"carrier"?: string | null,"created_at"?: string,"currency"?: string,"email"?: string | null,"fulfilled_at"?: string | null,"id"?: string,"needs_attention"?: boolean,"number"?: string,"paid_at"?: string | null,"reservation_expires_at"?: string | null,"restocked_at"?: string | null,"shipping_address"?: Json | null,"shipping_cents"?: number,"shipping_name"?: string | null,"status"?: Database["public"]['Enums']["order_status"],"stripe_checkout_session_id"?: string | null,"stripe_customer_id"?: string | null,"stripe_payment_intent_id"?: string | null,"subtotal_cents"?: number,"tax_cents"?: number,"total_cents"?: number,"tracking_number"?: string | null,"updated_at"?: string,"user_id"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"deletion_requested_at": string | null,"full_name": string | null,"id": string,"stripe_customer_id": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"deletion_requested_at"?: string | null,"full_name"?: string | null,"id": string,"stripe_customer_id"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"deletion_requested_at"?: string | null,"full_name"?: string | null,"id"?: string,"stripe_customer_id"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"rate_limits": {
                  Row: {
                    "count": number,"key": string,"window_start": string
                  }
                  ComputedFields: never
                  Insert: {
                    "count"?: number,"key": string,"window_start"?: string
                  }
                  Update: {
                    "count"?: number,"key"?: string,"window_start"?: string
                  }
                  Relationships: [
                    
                  ]
                },"stripe_events": {
                  Row: {
                    "id": string,"processed_at": string,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id": string,"processed_at"?: string,"type": string
                  }
                  Update: {
                    "id"?: string,"processed_at"?: string,"type"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "abandon_pending_order":
{ Args: { "p_order_id": string }; Returns: undefined
                           },
"admin_add_note":
{ Args: { "p_note": string,"p_order_id": string }; Returns: undefined
                           },
"admin_cancel_order":
{ Args: { "p_order_id": string,"p_refund_id": string }; Returns: undefined
                           },
"admin_fulfil_order":
{ Args: { "p_carrier": string,"p_order_id": string,"p_tracking_number": string }; Returns: undefined
                           },
"admin_log_refund":
{ Args: { "p_amount_cents": number,"p_order_id": string,"p_refund_id": string,"p_restock": boolean }; Returns: undefined
                           },
"admin_resolve_attention":
{ Args: { "p_order_id": string }; Returns: undefined
                           },
"admin_restock_order":
{ Args: { "p_order_id": string }; Returns: undefined
                           },
"admin_set_stock":
{ Args: { "p_low_stock_threshold": number,"p_note"?: string,"p_on_hand": number,"p_reason": Database["public"]['Enums']["stock_reason"],"p_slug": string }; Returns: undefined
                           },
"assert_admin":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"claim_guest_orders":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"create_pending_order":
{ Args: { "p_currency": string,"p_email": string,"p_expires_at": string,"p_items": Json,"p_shipping_cents": number,"p_tax_cents": number,"p_user_id": string }; Returns: {
              "amount_refunded_cents": number,
"cancelled_at": string | null,
"carrier": string | null,
"created_at": string,
"currency": string,
"email": string | null,
"fulfilled_at": string | null,
"id": string,
"needs_attention": boolean,
"number": string,
"paid_at": string | null,
"reservation_expires_at": string | null,
"restocked_at": string | null,
"shipping_address": Json | null,
"shipping_cents": number,
"shipping_name": string | null,
"status": Database["public"]['Enums']["order_status"],
"stripe_checkout_session_id": string | null,
"stripe_customer_id": string | null,
"stripe_payment_intent_id": string | null,
"subtotal_cents": number,
"tax_cents": number,
"total_cents": number,
"tracking_number": string | null,
"updated_at": string,
"user_id": string | null
            }
                          SetofOptions: {
        from: "*"
        to: "orders"
        isOneToOne: true
        isSetofReturn: false
      } },
"expire_order":
{ Args: { "p_event"?: string,"p_session_id": string }; Returns: Database["public"]['Enums']["order_status"]
                           },
"flag_order":
{ Args: { "p_data"?: Json,"p_payment_intent": string,"p_type": string }; Returns: undefined
                           },
"get_availability":
{ Args: Record<PropertyKey, never>; Returns: {
              "product_slug": string,"status": string
            }[]
                           },
"hit_rate_limit":
{ Args: { "p_key": string,"p_limit": number,"p_window_seconds": number }; Returns: boolean
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"mark_order_paid":
{ Args: { "p_customer": string,"p_email": string,"p_payment_intent": string,"p_session_id": string,"p_shipping_address": Json,"p_shipping_cents": number,"p_shipping_name": string,"p_subtotal_cents": number,"p_tax_cents": number,"p_total_cents": number }; Returns: Database["public"]['Enums']["order_status"]
                           },
"record_refund":
{ Args: { "p_amount_refunded": number,"p_payment_intent": string }; Returns: Database["public"]['Enums']["order_status"]
                           },
"release_order_stock":
{ Args: { "p_event": string,"p_order_id": string,"p_status": Database["public"]['Enums']["order_status"] }; Returns: undefined
                           },
"release_stale_reservations":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"request_account_deletion":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           }
          }
          Enums: {
            "order_status": "pending_payment"|"paid"|"fulfilled"|"expired"|"cancelled"|"refunded"|"partially_refunded","stock_reason": "restock"|"sale"|"cancel"|"adjustment"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "order_status": ["pending_payment", "paid", "fulfilled", "expired", "cancelled", "refunded", "partially_refunded"],"stock_reason": ["restock", "sale", "cancel", "adjustment"]
          }
        }
} as const
