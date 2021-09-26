import { ServerError } from '@/presentation/errors'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SurveyModel, LoadSurveyById } from './save-survey-result-controller-protocols'

type SystemUnderTestTypes = {
  systemUnderTest: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeFakeRequest = (): SaveSurveyResultController.Request => {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: ''
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

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const systemUnderTest = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    systemUnderTest,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await systemUnderTest.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  /* test('Should return 403 if LoadSurveyById return null', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpReponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpReponse.statusCode).toBe(403)
    expect(httpReponse.body).toEqual(new InvalidParamError('surveyId'))
  }) */

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpReponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpReponse.statusCode).toBe(500)
    expect(httpReponse.body).toEqual(new ServerError())
  })
})
