import { Controller, LoadSurveyById, HttpResponse, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  private readonly loadSurveyById: LoadSurveyById
  private readonly saveSurveyResult: SaveSurveyResult

  constructor (loadSurveyById: LoadSurveyById, saveSurveyResult: SaveSurveyResult) {
    this.loadSurveyById = loadSurveyById
    this.saveSurveyResult = saveSurveyResult
  }

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })
      return {
        statusCode: 200,
        body: ''
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
