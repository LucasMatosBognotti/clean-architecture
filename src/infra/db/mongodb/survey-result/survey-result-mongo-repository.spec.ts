import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-architecture'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const makeSystemUnderTest = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const response = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        image: 'any_images'
      },
      {
        answer: 'any_asnwer'
      }
    ],
    date: new Date()
  })
  return response.ops[0]
}

const makeAccount = async (): Promise<AccountModel> => {
  const response = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return response.ops[0]
}

describe('Suvey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('save()', () => {
    it('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const systemUnderTest = makeSystemUnderTest()
      const surveyResult = await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    it('Should update survey result if its no new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const response = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const systemUnderTest = makeSystemUnderTest()
      const surveyResult = await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(response.ops[0]._id)
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })
})
