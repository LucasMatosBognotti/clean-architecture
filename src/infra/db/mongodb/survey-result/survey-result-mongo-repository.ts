import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultRepository.Params): Promise<SaveSurveyResultRepository.Result> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const response = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return response.value && MongoHelper.mapper(response.value)
  }
}
