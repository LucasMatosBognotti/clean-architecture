import { Collection } from 'mongodb'
import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-architecture'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const response = await accountCollection.insertOne({
    name: 'Lucas',
    email: 'lucasmatosbognotti@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = response.ops[0]._id
  const accessToken = sign({ id }, env.JWT_SECRET)
  await accountCollection.updateOne({
    _id: id
  }, { $set: { accessToken } })
  return accessToken
}

describe('Survey Routes', () => {
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
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 o load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
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
        }
      ])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
