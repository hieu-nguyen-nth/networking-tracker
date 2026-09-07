export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string | null;
          role: string | null;
          where_met: string | null;
          notes: string | null;
          priority: "high" | "medium" | "low";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          company?: string | null;
          role?: string | null;
          where_met?: string | null;
          notes?: string | null;
          priority?: "high" | "medium" | "low";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          company?: string | null;
          role?: string | null;
          where_met?: string | null;
          notes?: string | null;
          priority?: "high" | "medium" | "low";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
