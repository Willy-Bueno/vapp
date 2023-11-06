import { defineStore } from "pinia"
import supabase from "@/lib/supabase"
import { useCompanyStore } from "@/stores/company"

import { Tables, Insert, Update } from "@/types"

type Survey =
  | Tables<"surveys">
  | (null & {
      questions: Tables<"questions">[] & { options: Tables<"options">[] | null } & { question_types: Tables<"question_types"> | null }
    })
  | (null & { survey_status: Tables<"survey_status"> })
  | null

type Surveys = Tables<"surveys">[] | (null & { survey_status: Tables<"survey_status"> }) | null

export const useSurveyStore = defineStore("survey_store", {
  state: () => ({
    createdSurveysCount: null as number | null,
    pulishedSurveysCount: null as number | null,
    unpublishedSurveysCount: null as number | null,
    surveys: null as Surveys,
    survey: null as Survey,
  }),

  actions: {
    async getSurvey(id: string) {
      const { data, error } = await supabase.from("surveys").select("*, survey_status(*), questions(*, options(*), question_types(*))").eq("id", id).single()
      if (error) throw error
      data.questions.sort((a, b) => a.order - b.order)
      this.survey = data
    },

    async getSurveys() {
      const companyStore = useCompanyStore()
      if (companyStore.company === null) throw new Error("Company not found")

      const { data, error } = await supabase.from("surveys").select("*, survey_status(*)").order("created_at", { ascending: false }).eq("company_id", companyStore.company.id)
      if (error) throw error
      this.surveys = data
    },

    async getRecentSurveys() {
      const companyStore = useCompanyStore()
      if (companyStore.company === null) throw new Error("Company not found")

      const { data, error } = await supabase.from("surveys").select("*, survey_status(*)").order("created_at", { ascending: false }).limit(3).eq("company_id", companyStore.company.id)
      if (error) throw error
      this.surveys = data
    },

    async getSurveysCount() {
      const companyStore = useCompanyStore()
      if (companyStore.company === null) throw new Error("Company not found")

      const { count, error } = await supabase.from("surveys").select("*, survey_status(*)", { count: "exact", head: true }).eq("company_id", companyStore.company.id)
      if (error) throw error
      this.createdSurveysCount = count
    },

    async getPublishedSurveysCount() {
      const companyStore = useCompanyStore()
      if (companyStore.company === null) throw new Error("Company not found")

      const { count, error } = await supabase.from("surveys").select("*, survey_status(*)", { count: "exact", head: true }).eq("has_published", true).eq("company_id", companyStore.company.id)
      if (error) throw error
      this.pulishedSurveysCount = count
    },

    async getUnpublishedSurveysCount() {
      const companyStore = useCompanyStore()
      if (companyStore.company === null) throw new Error("Company not found")

      const { count, error } = await supabase.from("surveys").select("*, survey_status(*)", { count: "exact", head: true }).eq("has_published", false).eq("company_id", companyStore.company.id)
      if (error) throw error
      this.unpublishedSurveysCount = count
    },

    async createSurvey(survey: Insert<"surveys">) {
      const { data, error } = await supabase.from("surveys").insert(survey).select("*").single()
      if (error) throw error

      this.survey = data
    },

    async updateSurvey(survey: Update<"surveys">) {
      if (survey.survey_status_id === undefined) throw new Error("Survey status is undefined")

      const { data: surveyStatusData, error: surveyStatusError } = await supabase
        .from("survey_status")
        .select("*")
        .eq("id", survey.survey_status_id as string)
        .single()
      if (surveyStatusError) throw surveyStatusError

      if (surveyStatusData.slug === "published") survey.has_published = true

      survey.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from("surveys")
        .update(survey)
        .eq("id", survey.id as string)
        .select("*")
        .single()
      if (error) throw error
      this.survey = data
    },
  },
})
