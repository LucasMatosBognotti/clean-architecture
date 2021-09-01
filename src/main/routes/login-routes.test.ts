import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-architecture'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Lucas',
          email: 'lucasmatosbognotti@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /signin', () => {
    test('Should return 200 on signin', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'lucasmatosbognotti@gmail.com',
        password
      })
      await request(app)
        .post('/api/signin')
        .send({
          email: 'lucasmatosbognotti@gmail.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
