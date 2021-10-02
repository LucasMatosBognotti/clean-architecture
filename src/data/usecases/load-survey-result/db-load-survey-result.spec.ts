import MockDate from 'mockdate'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'

type SystemUnderTestTypes = {
  systemUnderTest: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeFakeLoadSurveyData = (): LoadSurveyResultRepository.Params => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id'
})

const makeFakeLoadSurveyResult = (): LoadSurveyResultRepository.Result => {
  return {
    id: 'any_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_ answer',
    date: new Date()
  }
}

const makeLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId ({ surveyId, accountId }: LoadSurveyResultRepository.Params): Promise<LoadSurveyResultRepository.Result> {
      return new Promise(resolve => resolve(makeFakeLoadSurveyResult()))
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
  const systemUnderTest = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    systemUnderTest,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const { accountId, surveyId } = makeFakeLoadSurveyData()
    await systemUnderTest.load({ surveyId, accountId })
    expect(loadSpy).toHaveBeenCalledWith({ surveyId, accountId })
  })

  it('Should throw if LoadSurveyResultRepositorym throws', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const { accountId, surveyId } = makeFakeLoadSurveyData()
    const promise = systemUnderTest.load({ accountId, surveyId })
    await expect(promise).rejects.toThrow()
  })
})
