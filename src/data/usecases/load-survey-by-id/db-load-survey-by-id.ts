import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

export class DbLoadSurveyById implements LoadSurveyById {
  private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository

  constructor (loadSurveyByIdRepository: LoadSurveyByIdRepository) {
    this.loadSurveyByIdRepository = loadSurveyByIdRepository
  }

  async loadById (id: string): Promise<SurveyModel> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
