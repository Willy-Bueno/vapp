import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Tables, Insert } from '@/types'

type Response = Tables<'responses'> | null & {
  respondents: Tables<'respondents'>
  surveys: Tables<'surveys'> & {
    questions: Tables<'questions'> & {
      question_types: Tables<'question_types'>
      options: Tables<'options'>[]
      answers: Tables<'answers'> & {
        answer_options: Tables<'answer_options'>[] | null
      }
    }[]
  }
}

export const useResponseStore = defineStore('response_store', {
  state: () => ({
    responsesCount: null as number | null,
    response: null as Response | null,
    responses: null as Response[] | null
  }),

  actions: {
    async getResponses() {
      const { data, error } = await supabase.from('responses').select('*, respondents(*), surveys(*, questions(*, question_types(*), options(*), answers(*, answer_options(*))))').eq('status', 'completed')
      if (error) throw error
      this.responses = data
    },

    async getRecentResponses() {
      const { data, error } = await supabase.from('responses').select('*, respondents(*), surveys(*, questions(*, question_types(*), options(*), answers(*, answer_options(*))))').eq('status', 'completed').order('created_at', { ascending: false }).limit(3)
      if (error) throw error
      this.responses = data
    },

    async getPendingResponsesBySurveyId(id: string) {
      const { data, error } = await supabase.from('responses').select('*, respondents(*), surveys(*, questions(*, question_types(*), options(*), answers(*, answer_options(*))))').eq('status', 'pending').eq('survey_id', id).order('created_at', { ascending: false })
      if (error) throw error
      this.responses = data
    },

    async getResponsesBySurveyId(id: string) {
      const { data, error } = await supabase.from('responses').select('*, respondents(*), surveys(*, questions(*, question_types(*), options(*), answers(*, answer_options(*))))').eq('status', 'completed').eq('survey_id', id)
      if (error) throw error
      this.responses = data
    },

    async getResponsesCount() {
      const { count, error } = await supabase.from('responses').select('*, respondents(*), surveys(*, questions(*, question_types(*), options(*), answers(*, answer_options(*))))', { count: 'exact', head: true }).eq('status', 'completed')
      if (error) throw error
      this.responsesCount = count
    },

    async createResponse(respondent: Insert<'responses'>) {
      const { data, error } = await supabase.from('responses').insert(respondent).select('*').single()
      if (error) throw error
      this.response = data
      return data
    }
  }
})
