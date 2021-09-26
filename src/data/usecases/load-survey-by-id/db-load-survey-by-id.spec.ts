import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { SurveyModel, LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'

type SystemUnderTestTypes = {
  systemUnderTest: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_images',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const systemUnderTest = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    systemUnderTest,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyByIdRepository', async () => {
    const { systemUnderTest, loadSurveyByIdRepositoryStub } = makeSystemUnderTest()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await systemUnderTest.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return Survey on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const survey = await systemUnderTest.loadById('any_id')
    expect(survey).toEqual(makeFakeSurvey())
  })

  it('Should throw if LoadSurveyByIdRepository', async () => {
    const { systemUnderTest, loadSurveyByIdRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
