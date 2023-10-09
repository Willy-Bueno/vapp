import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Response } from '@/models/response'

interface ResponseCreateInput {
  question: string
  participant: string
  option?: string
  value?: string
}

export const useResponseStore = defineStore('response_store', {
  state: () => ({
    responses: [] as Response[],
  }),

  actions: {
    async getResponsesByBusinessId(businessId: string) {
      const { data, error } = await supabase.from('responses').select('*, question(*, type(*), survey(*, business(*))), option(*)').eq('question.survey.business.id', businessId)
      if (error) throw error
      this.responses = data as unknown as Response[]
    },

    async getResponsesBySurveyId(surveyId: string) {
      const { data, error } = await supabase.from('responses').select('*, question(*, type(*), survey(*, business(*))), option(*), participant(*)').eq('question.survey.id', surveyId)
      if (error) throw error
      this.responses = data as unknown as Response[]
    },

    async createResponses(responses: ResponseCreateInput[]) {
      const { data, error } = await supabase.from('responses').insert(responses).select('*, question(*), option(*)')
      if (error) throw error
      this.responses = data as unknown as Response[]
      return data
    }
  },

  persist: true
})
