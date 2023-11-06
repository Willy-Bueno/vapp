import { defineStore } from "pinia"
import supabase from "@/lib/supabase"

import { Tables } from "@/types"

export const useSurveyStatusStore = defineStore("survey_status_store", {
  state: () => ({
    surveyStatus: null as Tables<"survey_status">[] | null,
  }),

  actions: {
    async getSurveyStatus() {
      const { data, error } = await supabase.from("survey_status").select("*")
      if (error) throw error
      this.surveyStatus = data
    },
  },
})
