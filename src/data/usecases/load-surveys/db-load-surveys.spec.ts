import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel, LoadSurveysRepository } from './db-load-surveys-protocols'

type SystemUnderTestTypes = {
  systemUnderTest: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_images',
        answer: 'any_answer'
      }],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_images',
        answer: 'other_answer'
      }],
      date: new Date()
    }
  ]
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const systemUnderTest = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    systemUnderTest,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { systemUnderTest, loadSurveysRepositoryStub } = makeSystemUnderTest()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await systemUnderTest.load('any_id')
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const surveys = await systemUnderTest.load('any_id')
    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('Should throw if LOadSurveysRepository throws', async () => {
    const { systemUnderTest,loadSurveysRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
