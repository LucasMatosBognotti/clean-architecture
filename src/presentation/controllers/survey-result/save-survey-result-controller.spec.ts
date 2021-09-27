import MockDate from 'mockdate'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SurveyModel, LoadSurveyById, SaveSurveyResult, SaveSurveyResultModel, SurveyResultModel } from './save-survey-result-controller-protocols'

type SystemUnderTestTypes = {
  systemUnderTest: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeFakeRequest = (): SaveSurveyResultController.Request => {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer'
  }
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'valid_id',
    surveyId: 'valid_survey_id',
    accountId: 'valid_account_id',
    answer: 'valid_answer',
    date: new Date()
  }
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const systemUnderTest = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    systemUnderTest,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await systemUnderTest.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  /*
    test('Should return 403 if LoadSurveyById return null', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpReponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpReponse.statusCode).toBe(403)
    expect(httpReponse.body).toEqual(new InvalidParamError('surveyId'))
    })
  */

  test('Should return 403 if an invalid answer is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle({
      surveyId: 'any_id',
      accountId: 'any_account_id',
      answer: 'wrong_answer'
    })
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('answer'))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { systemUnderTest, saveSurveyResultStub } = makeSystemUnderTest()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await systemUnderTest.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { systemUnderTest, saveSurveyResultStub } = makeSystemUnderTest()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 on SaveSurveyResults success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeSurveyResult())
  })
})
