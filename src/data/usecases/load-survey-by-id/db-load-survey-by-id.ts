import { SurveyModel, LoadSurveyById, LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository

  constructor (loadSurveyByIdRepository: LoadSurveyByIdRepository) {
    this.loadSurveyByIdRepository = loadSurveyByIdRepository
  }

  async loadById (id: string): Promise<SurveyModel> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
