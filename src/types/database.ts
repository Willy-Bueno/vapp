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
      answer_options: {
        Row: {
          answer_id: string
          created_at: string
          id: string
          question_option_id: string
        }
        Insert: {
          answer_id: string
          created_at?: string
          id?: string
          question_option_id: string
        }
        Update: {
          answer_id?: string
          created_at?: string
          id?: string
          question_option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_options_answer_id_fkey"
            columns: ["answer_id"]
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_options_question_option_id_fkey"
            columns: ["question_option_id"]
            referencedRelation: "options"
            referencedColumns: ["id"]
          }
        ]
      }
      answers: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          question_id: string
          response_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          question_id: string
          response_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          question_id?: string
          response_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_response_id_fkey"
            columns: ["response_id"]
            referencedRelation: "responses"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invite_tokens: {
        Row: {
          company_id: string
          created_at: string
          id: number
          token: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: number
          token: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: number
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invite_tokens_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      options: {
        Row: {
          created_at: string
          id: string
          option_text: string
          order: number
          question_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          option_text: string
          order: number
          question_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          option_text?: string
          order?: number
          question_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "options_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      question_types: {
        Row: {
          created_at: string
          description: string
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: string
          order: number
          placeholder: string | null
          question_text: string
          question_type_id: string
          required: boolean
          survey_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order: number
          placeholder?: string | null
          question_text: string
          question_type_id: string
          required?: boolean
          survey_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order?: number
          placeholder?: string | null
          question_text?: string
          question_type_id?: string
          required?: boolean
          survey_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_question_type_id_fkey"
            columns: ["question_type_id"]
            referencedRelation: "question_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_survey_id_fkey"
            columns: ["survey_id"]
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          }
        ]
      }
      respondents: {
        Row: {
          address: string
          complement: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          lat: number
          lng: number
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
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string
          id: string
          respondent_id: string
          status: string | null
          survey_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          respondent_id: string
          status?: string | null
          survey_id: string
        }
        Update: {
          created_at?: string
          id?: string
          respondent_id?: string
          status?: string | null
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_respondent_id_fkey"
            columns: ["respondent_id"]
            referencedRelation: "respondents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_survey_id_fkey"
            columns: ["survey_id"]
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          }
        ]
      }
      survey_status: {
        Row: {
          created_at: string
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      surveys: {
        Row: {
          company_id: string
          created_at: string
          description: string
          has_published: boolean
          id: string
          survey_status_id: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          has_published?: boolean
          id?: string
          survey_status_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          has_published?: boolean
          id?: string
          survey_status_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_survey_status_id_fkey"
            columns: ["survey_status_id"]
            referencedRelation: "survey_status"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar: string
          company_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar: string
          company_id?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string
          company_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
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
