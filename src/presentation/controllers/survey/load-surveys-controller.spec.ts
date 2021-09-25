import MockDate from 'mockdate'
import { ServerError } from '../../errors'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { noContent } from '../../helpers/http/http-helper'

interface SystemUnderTestTypes {
  systemUnderTest: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const mockRequest = (): LoadSurveysController.Request => ({ accountId: 'any_id' })

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

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}

const makeLoadSurveysController = (): SystemUnderTestTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const systemUnderTest = new LoadSurveysController(loadSurveysStub)
  return {
    systemUnderTest,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { systemUnderTest, loadSurveysStub } = makeLoadSurveysController()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await systemUnderTest.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { systemUnderTest } = makeLoadSurveysController()
    const httpResponse = await systemUnderTest.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeSurveys())
  })

  test('Should return 204 if LoadSurvey returns empty', async () => {
    const { systemUnderTest, loadSurveysStub } = makeLoadSurveysController()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse = await systemUnderTest.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { systemUnderTest, loadSurveysStub } = makeLoadSurveysController()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await systemUnderTest.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
