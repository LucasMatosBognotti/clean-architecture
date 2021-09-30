import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SaveSurveyResult } from './db-save-survey-result-protocols'

type SystemUnderTestTypes = {
  systemUnderTest: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeFakeSurveyResult = (): SaveSurveyResult.Result => {
  return {
    id: 'any_id',
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeFakeSurveyResultData = (): SaveSurveyResult.Params => {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const systemUnderTest = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    systemUnderTest,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { systemUnderTest, saveSurveyResultRepositoryStub } = makeSystemUnderTest()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResulData = makeFakeSurveyResultData()
    await systemUnderTest.save(surveyResulData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResulData)
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { systemUnderTest, saveSurveyResultRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return SurveyResult on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const surveyResult = await systemUnderTest.save(makeFakeSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})
