import { CheckSurveyById } from '@/domain/usecases/check-survey-by-id'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  private readonly checkSurveyById: CheckSurveyById

  constructor (checkSurveyById: CheckSurveyById) {
    this.checkSurveyById = checkSurveyById
  }

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    await this.checkSurveyById.checkById(request.surveyId)
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
