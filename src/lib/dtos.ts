import { Insert } from "@/types"

type Answer = Insert<"answers"> & {
  answer_options?: Insert<"answer_options">[]
}

type Response = {
  [key: string]: {
    question_id: string
    required: boolean
    type: string
    answer_text: string
    answer_unique_option: string
    answer_multiple_options: {
      [key: string]: boolean
    }
  }
}

export class AnswerData {
  private data: Array<{
    question_id: string
    response_id: string
    answer_option_id?: string
    answer?: string
  }>

  result: Answer[]

  constructor(data: Response, response_id: string) {
    this.data = []

    Object.keys(data).forEach((key) => {
      if (Object.keys(data[key].answer_multiple_options).length > 0 && !data[key].answer_unique_option) {
        Object.keys(data[key].answer_multiple_options).forEach((optionId) => {
          if (data[key].answer_multiple_options[optionId]) {
            this.data.push({
              response_id,
              question_id: key,
              answer_option_id: optionId,
            })
          }
        })
      } else if (data[key].answer_unique_option) {
        this.data.push({
          response_id,
          question_id: key,
          answer_option_id: data[key].answer_unique_option,
        })
      } else if (data[key].answer_text) {
        this.data.push({
          response_id,
          question_id: key,
          answer: data[key].answer_text,
        })
      }
    })

    this.result = this.data.reduce(
      (acc, item) => {
        const index = acc.findIndex((accItem) => accItem.question_id === item.question_id)
        if (index === -1) {
          acc.push({
            question_id: item.question_id,
            response_id: item.response_id,
            answer_options: item.answer_option_id ? [{ question_option_id: item.answer_option_id }] : [],
            answer: item.answer,
          })
        } else {
          if (item.answer_option_id) {
            acc[index].answer_options.push({ question_option_id: item.answer_option_id })
          } else {
            acc[index].answer = item.answer
          }
        }
        return acc
      },
      [] as Array<{
        question_id: string
        response_id: string
        answer_options: Array<{
          question_option_id: string
        }>
        answer?: string
      }>
    ) as Answer[]
  }
}
