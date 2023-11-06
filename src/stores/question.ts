import { defineStore } from "pinia"
import supabase from "@/lib/supabase"

import { Tables, Insert, Update } from "@/types"

interface QuestionInsertParams {
  question: Insert<"questions">
  options?: { option_text: string; order: number }[]
  surveyId: string
}

export const useQuestionStore = defineStore("question_store", {
  state: () => ({
    questions: null as Tables<"questions">[] | null,
    question: null as Tables<"questions"> | null,
  }),

  actions: {
    async getQuestions(surveyId: string) {
      const { data, error } = await supabase.from("questions").select("*").eq("survey_id", surveyId)
      if (error) throw error
      this.questions = data
    },

    async createQuestion(params: QuestionInsertParams) {
      await this.getQuestions(params.surveyId)

      if (this.questions && !!this.questions.length) {
        const questionsLength = this.questions.length
        const lastQuestion = this.questions[questionsLength - 1]
        params.question.order = lastQuestion.order + 1
      }

      const { data, error } = await supabase.from("questions").insert(params.question).select("*").single()
      if (error) throw error

      if (params.options) {
        const optionsFormatted = params.options.map((option) => ({ ...option, question_id: data.id }))

        const { error } = await supabase.from("options").insert(optionsFormatted).select("*")
        if (error) throw error
      }
    },

    async updateOrderQuestion(question: Update<"questions">) {
      const { data, error } = await supabase
        .from("questions")
        .update(question)
        .eq("id", question.id as string)
        .select("*")
        .single()
      if (error) throw error
      this.question = data
    },

    async deleteQuestion(id: string) {
      const { error } = await supabase.from("questions").delete().eq("id", id)
      if (error) throw error
      this.questions = this.questions?.filter((question) => question.id !== id) ?? null
    },
  },
})
