import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Option } from '@/models'

interface OptionCreateInput {
  title: string
  question: string
}

export const useQuestionOptionsStore = defineStore('question_options_store', {
  state: () => ({
    options: [] as Option[]
  }),

  actions: {
    async getQuestionOptionsByQuestionId(questionId: string) {
      const { data, error } = await supabase
        .from('question_options')
        .select('*, question(*, survey(*))')
        .eq('question', questionId)
      if (error) throw error
      this.options = data as unknown as Option[]
    },

    async getQuestionOptionsByQuestionIds(questionIds: string[]) {
      const { data, error } = await supabase
        .from('question_options')
        .select('*, question(*, survey(*))')
        .in('question', questionIds)
      if (error) throw error
      this.options = data as unknown as Option[]
    },

    async createQuestionOptions(options: OptionCreateInput[]) {
      const { data, error } = await supabase
        .from('question_options')
        .insert(options)
        .select('*')
      if (error) throw error
      this.options = data as unknown as Option[]
      return data
    }
  },

  persist: true
})
