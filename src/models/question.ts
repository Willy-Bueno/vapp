import { Survey } from './survey'
import { QuestionType } from './question-type'

export interface Question {
  id: string
  title: string
  type: QuestionType
  skip: boolean
  survey: Survey
  placeholder: string
}
