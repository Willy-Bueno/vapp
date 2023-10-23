import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { Tables, Insert, Update } from '@/types'

type Survey = Tables<'surveys'> | null & {
  questions: Tables<'questions'>[] &
    { options: Tables<'options'>[] | null } &
    { question_types: Tables<'question_types'> | null }
  } | null & { survey_status: Tables<'survey_status'> } | null

type Surveys = Tables<'surveys'>[] | null & { survey_status: Tables<'survey_status'> } | null

export const useSurveyStore = defineStore('survey_store', {
  state: () => ({
    createdSurveysCount: null as number | null,
    pulishedSurveysCount: null as number | null,
    unpublishedSurveysCount: null as number | null,
    surveys: null as Surveys,
    survey: null as Survey
  }),

  actions: {
    async getSurvey(id: string) {
      const { data, error } = await supabase.from('surveys').select('*, survey_status(*), questions(*, options(*), question_types(*))').eq('id', id).single()
      if (error) throw error
      data.questions.sort((a, b) => a.order - b.order)
      this.survey = data
    },

    async getSurveys() {
      const { data, error } = await supabase.from('surveys').select('*, survey_status(*)').order('created_at', { ascending: false })
      if (error) throw error
      this.surveys = data
    },

    async getRecentSurveys() {
      const { data, error } = await supabase.from('surveys').select('*, survey_status(*)').order('created_at', { ascending: false }).limit(3)
      if (error) throw error
      this.surveys = data
    },

    async getSurveysCount() {
      const { count, error } = await supabase.from('surveys').select('*, survey_status(*)', { count: 'exact', head: true })
      if (error) throw error
      this.createdSurveysCount = count
    },

    async getPublishedSurveysCount() {
      const { count, error } = await supabase.from('surveys').select('*, survey_status(*)', { count: 'exact', head: true }).eq('has_published', true)
      if (error) throw error
      console.log(count)
      this.pulishedSurveysCount = count
    },

    async getUnpublishedSurveysCount() {
      const { count, error } = await supabase.from('surveys').select('*, survey_status(*)', { count: 'exact', head: true }).eq('has_published', false)
      if (error) throw error
      this.unpublishedSurveysCount = count
    },

    async createSurvey(survey: Insert<'surveys'>) {
      const { data, error } = await supabase.from('surveys').insert(survey).select('*').single()
      if (error) throw error

      this.survey = data
    },

    async updateSurvey(survey: Update<'surveys'>) {
      if (survey.survey_status_id === undefined) throw new Error('Survey status is undefined')

      const { data: surveyStatusData, error: surveyStatusError } = await supabase.from('survey_status').select('*').eq('id', survey.survey_status_id as string).single()
      if (surveyStatusError) throw surveyStatusError

      if (surveyStatusData.slug === 'published') survey.has_published = true

      survey.updated_at = new Date().toISOString()

      const { data, error } = await supabase.from('surveys').update(survey).eq('id', survey.id as string).select('*').single()
      if (error) throw error
      this.survey = data
    }
  }
})
