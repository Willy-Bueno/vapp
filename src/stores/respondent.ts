import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Tables, Insert } from '@/types'

export const useRespondentStore = defineStore('respondent_store', {
  state: () => ({
    respondent: null as Tables<'respondents'> | null,
  }),

  actions: {
    async createRespondent(respondent: Insert<'respondents'>) {
      const { data, error } = await supabase.from('respondents').insert(respondent).select('*').single()
      if (error) throw error
      this.respondent = data
      return data
    }
  }
})
