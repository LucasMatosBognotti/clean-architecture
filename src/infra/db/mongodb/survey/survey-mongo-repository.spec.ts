import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-architecture'

let surveyCollection: Collection

const makeSystemUnderTest = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await systemUnderTest.add({
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
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([
        {
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
        },
        {
          question: 'other_question',
          answers: [
            {
              answer: 'other_answer',
              image: 'other_images'
            },
            {
              answer: 'other_asnwer'
            }
          ],
          date: new Date()
        }
      ])
      const systemUnderTest = makeSystemUnderTest()
      const surveys = await systemUnderTest.loadAll('')
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
    })

    it('Should load empty list', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const surveys = await systemUnderTest.loadAll('')
      expect(surveys.length).toBe(0)
    })
  })
})
