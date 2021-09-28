import { AddSurvey, Controller, HttpResponse, Validation } from './add-survey-controller-protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

export class AddSurveyController implements Controller {
  private readonly validation: Validation
  private readonly addSurvey: AddSurvey

  constructor (validation: Validation, addSurvey: AddSurvey) {
    this.validation = validation
    this.addSurvey = addSurvey
  }

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = request
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })
      return noContent()
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

export namespace AddSurveyController {
  export type Request = {
    question: string
    answers: Answer[]
    date: Date
  }

  type Answer = {
    image?: string
    answer: string
  }
}
