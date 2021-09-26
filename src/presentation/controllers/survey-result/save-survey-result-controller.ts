import { Controller, LoadSurveyById, HttpResponse } from './save-survey-result-controller-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  private readonly loadSurveyById: LoadSurveyById

  constructor (loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, answer } = request
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const ansewers = survey.answers.map(a => a.answer)
        if (!ansewers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return {
        body: '',
        statusCode: 200
      }
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
