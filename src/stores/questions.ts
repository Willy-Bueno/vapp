import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Question } from '@/models'

interface CreateQuestionPayloadInput {
  title: string
  placeholder: string
  skip: boolean
  survey: string
  type: string
}

export const useQuestionStore = defineStore('question_store', {
  state: () => ({
    questions: [] as Question[],
    question: null as Question | null
  }),

  actions: {
    async getQuestionsBySurveyId(surveyId: string) {
      const { data, error } = await supabase
        .from('questions')
        .select('*, type(*), survey(*)')
        .eq('survey', surveyId)
      if (error) throw error
      this.questions = data as any
      return data
    },

    async createQuestion(question: CreateQuestionPayloadInput) {
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select('*, type(*), survey(*)')
        .single()
      if (error) throw error
      this.question = data as any
      return data
    },

    async removeQuestion(id: string) {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  persist: true
})
