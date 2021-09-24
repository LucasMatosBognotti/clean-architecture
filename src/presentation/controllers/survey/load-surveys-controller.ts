import { serverError, successRequest } from '../../helpers/http/http-helper'
import { Controller, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  private readonly loadSurveys: LoadSurveys

  constructor (loadSurveys: LoadSurveys) {
    this.loadSurveys = loadSurveys
  }

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return successRequest(surveys)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
