import { Question, Option, Participant } from '@/models'

export interface Response {
  id: string
  question: Question
  participant: Participant
  option?: Option
  value?: string
}
