import { ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository } from '@/data/protocols/db/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await (await surveyCollection).find().toArray()
    return MongoHelper.mapperCollection(surveys)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await (await surveyCollection).findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.mapper(survey)
  }
}
