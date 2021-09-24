import { Controller, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  private readonly loadSurveys: LoadSurveys

  constructor (loadSurveys: LoadSurveys) {
    this.loadSurveys = loadSurveys
  }

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    await this.loadSurveys.load(request.accountId)
    return {
      body: {},
      statusCode: 200
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
