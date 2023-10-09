import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Survey } from '@/models'

interface SurveyInput {
  id: string
  title: string
  description: string
  status: string
  business: string
}

export const useSurveyStore = defineStore('survey_store', {
  state: () => ({
    surveys: [] as Survey[],
    survey: null as Survey | null,
  }),

  actions: {
    async getSurveysByBusinessId(businessId: string) {
      const { data, error } = await supabase.from('surveys').select('*, business(*)').eq('business', businessId)
      if (error) throw error
      this.surveys = data
    },

    async getSurveysByBusinessIdWithLimit(businessId: string, limit: number) {
      const { data, error } = await supabase.from('surveys').select('*, business(*)').eq('business', businessId).limit(limit)
      if (error) throw error
      this.surveys = data
    },

    async getSurveyById(id: string) {
      const { data, error } = await supabase.from('surveys').select('*, business(*)').eq('id', id).single()
      if (error) throw error
      this.survey = data
    },

    async createSurvey(survey: Omit<SurveyInput, 'id'>) {
      const { data, error } = await supabase.from('surveys').insert(survey).select('*, business(*)').single()
      if (error) throw error
      this.survey = data
      return data
    },

    async updateSurvey(survey: SurveyInput) {
      const { data, error } = await supabase.from('surveys').update(survey).eq('id', survey.id).single()
      if (error) throw error
      this.survey = data
      return data
    }
  },

  persist: true
})
