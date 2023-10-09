import { Participant, Survey } from '@/models'

export interface ParticipantsToSurveys {
  id: string
  survey: Survey
  participant: Participant
  status: string
  created_at: string
  updated_at: string
}
