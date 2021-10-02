import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResult {
  load: ({ surveyId, accountId }: LoadSurveyResult.Params) => Promise<LoadSurveyResult.Result>
}

export namespace LoadSurveyResult {
  export type Params = { surveyId: string, accountId: string }
  export type Result = SurveyResultModel
}
