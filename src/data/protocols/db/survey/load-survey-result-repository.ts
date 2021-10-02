import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId: ({ surveyId, accountId }: LoadSurveyResultRepository.Params) => Promise<LoadSurveyResultRepository.Result>
}

export namespace LoadSurveyResultRepository {
  export type Params = {surveyId: string, accountId: string}
  export type Result = SurveyResultModel
}
