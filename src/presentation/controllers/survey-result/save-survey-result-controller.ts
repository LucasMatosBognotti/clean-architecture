import { Controller, LoadSurveyById, HttpResponse } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  private readonly loadSurveyById: LoadSurveyById

  constructor (loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(request.surveyId)
    return {
      body: '',
      statusCode: 200
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
