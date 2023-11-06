import { defineStore } from "pinia"
import supabase from "@/lib/supabase"

import { Tables } from "@/types"

export const useQuestionTypeStore = defineStore("question_type_store", {
  state: () => ({
    types: [] as Tables<"question_types">[],
  }),

  actions: {
    async getTypes() {
      const { data, error } = await supabase.from("question_types").select("*")
      if (error) throw error
      this.types = data
    },
  },
})
