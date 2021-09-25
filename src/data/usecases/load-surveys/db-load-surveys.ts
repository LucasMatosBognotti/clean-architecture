import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'

export class DbLoadSurveys implements LoadSurveys {
  private readonly loadSurveysRepository: LoadSurveysRepository

  constructor (loadSurveysRepository: LoadSurveysRepository) {
    this.loadSurveysRepository = loadSurveysRepository
  }

  async load (accountId: string): Promise<LoadSurveys.Result> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }
}
