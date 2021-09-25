import { AddSurvey } from '@/domain/usecases/add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  private readonly addSurveyRepository: AddSurveyRepository

  constructor (addSurveyRepository: AddSurveyRepository) {
    this.addSurveyRepository = addSurveyRepository
  }

  async add (data: AddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
