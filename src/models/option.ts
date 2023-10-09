import { Question } from './question'

export interface Option {
  id: string
  title: string
  question: Question
}
