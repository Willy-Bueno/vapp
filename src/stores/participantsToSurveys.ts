import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

import { ParticipantsToSurveys } from '@/models'

interface ParticipantToSurveyCreate {
  survey: string
  participant: string
  status: string
}

interface ParticipantToSurveyUpdate {
  participantId: string
  status: string
}

export const useParticipantToSurveyStore = defineStore('participant_to_survey_store', {
  state: () => ({
    participantsToSurveys: [] as ParticipantsToSurveys[],
    participantToSurvey: null as ParticipantsToSurveys | null,
  }),

  actions: {
    async getParticipantsToSurveysBySurveyId(surveyId: string) {
      const { data, error } = await supabase.from('participants_to_surveys').select('*, survey(*, business(*)), participant(*)').eq('survey.id', surveyId)
      if (error) throw error
      this.participantsToSurveys = data as unknown as ParticipantsToSurveys[]
    },

    async getParticipantsToSurveysByBusinessId(businessId: string) {
      const { data, error } = await supabase.from('participants_to_surveys').select('*, survey(*, business(*)), participant(*)').eq('survey.business.id', businessId)
      if (error) throw error
      this.participantsToSurveys = data as unknown as ParticipantsToSurveys[]
    },

    async getParticipantsToSurveysByBusinessIdWithLimitAndStatusStatus(businessId: string, limit: number, status: string) {
      const { data, error } = await supabase.from('participants_to_surveys').select('*, survey(*, business(*)), participant(*)').eq('survey.business.id', businessId).eq('status', status).limit(limit)
      if (error) throw error
      console.log(data)
      this.participantsToSurveys = data as unknown as ParticipantsToSurveys[]
    },

    async createParticipantToSurvey(participantToSurvey: ParticipantToSurveyCreate) {
      const { data, error } = await supabase.from('participants_to_surveys').insert(participantToSurvey).select('*, survey(*), participant(*)').single()
      if (error) throw error
      this.participantToSurvey = data as unknown as ParticipantsToSurveys
      return data
    },

    async updateParticipantToSurvey(participantToSurvey: ParticipantToSurveyUpdate) {
      console.log(participantToSurvey)
      const { error } = await supabase.from('participants_to_surveys').update({status: participantToSurvey.status}).eq('participant', participantToSurvey.participantId)
      if (error) throw error
    }
  },

  persist: true
})
