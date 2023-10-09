import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { QuestionType } from '@/models'

export const useQuestionTypeStore = defineStore('question_type_store', {
  state: () => ({
    questionTypes: null as QuestionType[] | null,
  }),

  actions: {
    async getQuestionTypes() {
      const { data, error } = await supabase.from('question_types').select('*')
      if (error) throw error
      this.questionTypes = data
    }
  },

  persist: true
})
