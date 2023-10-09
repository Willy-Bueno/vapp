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
      business: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invite_emails: {
        Row: {
          business_id: string
          created_at: string
          email: string
          id: string
          invited_by: string
          role: string
          status: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          id?: string
          invited_by: string
          role?: string
          status?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          invited_by?: string
          role?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_emails_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invite_emails_invited_by_fkey"
            columns: ["invited_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      invite_links: {
        Row: {
          business_id: string
          created_at: string
          id: string
          role: string
          token: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          role?: string
          token: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invite_links_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "business"
            referencedColumns: ["id"]
          }
        ]
      }
      participants: {
        Row: {
          address: string
          complement: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          lat: number
          lng: number
          tags: string | null
        }
        Insert: {
          address: string
          complement?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          lat: number
          lng: number
          tags?: string | null
        }
        Update: {
          address?: string
          complement?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          lat?: number
          lng?: number
          tags?: string | null
        }
        Relationships: []
      }
      participants_to_surveys: {
        Row: {
          created_at: string
          id: string
          participant: string
          status: string
          survey: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant: string
          status: string
          survey: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant?: string
          status?: string
          survey?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_to_surveys_participant_fkey"
            columns: ["participant"]
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_to_surveys_survey_fkey"
            columns: ["survey"]
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          business: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url: string
          business?: string | null
          created_at?: string | null
          email?: string
          full_name: string
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string
          business?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_business_fkey"
            columns: ["business"]
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      question_options: {
        Row: {
          created_at: string
          id: string
          question: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          question: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          question?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_fkey"
            columns: ["question"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      question_types: {
        Row: {
          created_at: string | null
          description: string
          id: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string | null
          id: string
          placeholder: string
          skip: boolean
          survey: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          placeholder?: string
          skip?: boolean
          survey: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          placeholder?: string
          skip?: boolean
          survey?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_survey_fkey"
            columns: ["survey"]
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_type_fkey"
            columns: ["type"]
            referencedRelation: "question_types"
            referencedColumns: ["id"]
          }
        ]
      }
      responses: {
        Row: {
          created_at: string
          id: string
          option: string | null
          participant: string
          question: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          option?: string | null
          participant: string
          question: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          option?: string | null
          participant?: string
          question?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_option_fkey"
            columns: ["option"]
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_participant_fkey"
            columns: ["participant"]
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_question_fkey"
            columns: ["question"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      surveys: {
        Row: {
          business: string
          created_at: string | null
          description: string
          id: string
          status: string
          title: string
        }
        Insert: {
          business: string
          created_at?: string | null
          description: string
          id?: string
          status?: string
          title: string
        }
        Update: {
          business?: string
          created_at?: string | null
          description?: string
          id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_business_fkey"
            columns: ["business"]
            referencedRelation: "business"
            referencedColumns: ["id"]
          }
        ]
      }
      users_to_business: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_to_business_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_to_business_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
