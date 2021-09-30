import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult } from '@/domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultRepository.Params) => Promise<SaveSurveyResultRepository.Result>
}

export namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResult.Params
  export type Result = SurveyResultModel
}
