import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Tables, Insert } from '@/types'

type Answer = Tables<'answers'> & {
  answer_options?: Tables<'answer_options'>[]
}

export const useAnswerStore = defineStore('answer_store', {
  state: () => ({
    answers: null as Answer[] | null,
  }),

  actions: {
    async createAnswer(answers: Array<Insert<'answers'> & { answer_options?: Insert<'answer_options'>[] }>) {
      answers.forEach(async answer => {
        const { data, error } = await supabase.from('answers').insert({
          question_id: answer.question_id,
          response_id: answer.response_id,
          answer: answer.answer,
        }).select('*').single()
        if (error) throw error

        if (answer.answer_options) {
          const answerOptionsFormatted = answer.answer_options.map(answerOption => ({ ...answerOption, answer_id: data.id }))

          const { error } = await supabase.from('answer_options').insert(answerOptionsFormatted).select('*')
          if (error) throw error
        }
      })

      const { error } = await supabase.from('responses').update({ status: 'completed' }).eq('id', answers[0].response_id)
      if (error) throw error
    }
  }
})
