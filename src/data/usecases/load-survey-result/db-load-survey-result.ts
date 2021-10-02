import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { LoadSurveyResult } from '@/domain/usecases/load-survey-result'

export class DbLoadSurveyResult implements LoadSurveyResult {
  private readonly loadSurveyResultRepository: LoadSurveyResultRepository

  constructor (loadSurveyResultRepository: LoadSurveyResultRepository) {
    this.loadSurveyResultRepository = loadSurveyResultRepository
  }

  async load ({ surveyId, accountId }: LoadSurveyResult.Params): Promise<LoadSurveyResult.Result> {
    await this.loadSurveyResultRepository.loadBySurveyId({ surveyId, accountId })
    return new Promise(resolve => resolve({
      id: 'any_id',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_ answer',
      date: new Date()
    }))
  }
}
