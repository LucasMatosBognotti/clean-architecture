import { MongoHelper as systemUnderTest } from './mongo-helper'

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-architecture'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await systemUnderTest.connect(MONGO_URL)
  })

  afterAll(async () => {
    await systemUnderTest.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await systemUnderTest.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await systemUnderTest.disconnect()
    accountCollection = await systemUnderTest.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
