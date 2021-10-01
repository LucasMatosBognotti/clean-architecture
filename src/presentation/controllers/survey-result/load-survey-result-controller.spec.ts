import MockDate from 'mockdate'
import { CheckSurveyById } from '@/domain/usecases/check-survey-by-id'
import { LoadSurveyResult } from '@/domain/usecases/load-survey-result'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { LoadSurveyResultController } from './load-survey-result-controller'

type SystemUnderTestTypes = {
  systemUnderTest: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeFakeRequest = (): LoadSurveyResultController.Request => {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id'
  }
}

const makeFakeLoadSurveyResult = (): LoadSurveyResult.Result => {
  return {
    id: 'any_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_ answer',
    date: new Date()
  }
}

const makeCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (accountId: string): Promise<CheckSurveyById.Result> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new CheckSurveyByIdStub()
}

const makeLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
      return new Promise(resolve => resolve(makeFakeLoadSurveyResult()))
    }
  }
  return new LoadSurveyResultStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const checkSurveyByIdStub = makeCheckSurveyById()
  const loadSurveyResultStub = makeLoadSurveyResult()
  const systemUnderTest = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)
  return {
    systemUnderTest,
    checkSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call CheckSurveyById with correct values', async () => {
    const { systemUnderTest, checkSurveyByIdStub } = makeSystemUnderTest()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    const request = makeFakeRequest()
    await systemUnderTest.handle(request)
    expect(checkByIdSpy).toHaveBeenCalledWith(request.surveyId)
  })

  it('Should return 403 if CheckSurveyById returns false', async () => {
    const { systemUnderTest, checkSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(checkSurveyByIdStub , 'checkById').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('surveyId'))
  })

  it('Should return 500 if CheckSurveyById throws', async () => {
    const { systemUnderTest, checkSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call LoadSurveyResult with correct values', async () => {
    const { systemUnderTest, loadSurveyResultStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const request = makeFakeRequest()
    await systemUnderTest.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.surveyId, request.accountId)
  })

  it('Should return 500 if LoadSurveyResult throws', async () => {
    const { systemUnderTest, loadSurveyResultStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyResultStub, 'load').mockRejectedValueOnce(new Promise((resolve, reject) => resolve(new Error())))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 200 on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeLoadSurveyResult())
  })
})
