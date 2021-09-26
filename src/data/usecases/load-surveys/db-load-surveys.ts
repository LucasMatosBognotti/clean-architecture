import { LoadSurveys, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  private readonly loadSurveysRepository: LoadSurveysRepository

  constructor (loadSurveysRepository: LoadSurveysRepository) {
    this.loadSurveysRepository = loadSurveysRepository
  }

  async load (accountId: string): Promise<LoadSurveys.Result> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }
}
