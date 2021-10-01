import { CheckSurveyById } from '@/domain/usecases/check-survey-by-id'
import { LoadSurveyResult } from '@/domain/usecases/load-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  private readonly checkSurveyById: CheckSurveyById
  private readonly loadSurveyResult: LoadSurveyResult

  constructor (checkSurveyById: CheckSurveyById, loadSurveyResult: LoadSurveyResult) {
    this.checkSurveyById = checkSurveyById
    this.loadSurveyResult = loadSurveyResult
  }

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    const { surveyId, accountId } = request
    const exist = await this.checkSurveyById.checkById(surveyId)
    if (!exist) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    await this.loadSurveyResult.load(surveyId, accountId)
    return {
      body: '',
      statusCode: 200
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
