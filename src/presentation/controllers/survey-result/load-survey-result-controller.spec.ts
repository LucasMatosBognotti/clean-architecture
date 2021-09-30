import { CheckSurveyById } from '@/domain/usecases/check-survey-by-id'
import { LoadSurveyResultController } from './load-survey-result-controller'

type SystemUnderTestTypes = {
  systemUnderTest: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
}

const makeFakeRequest = (): LoadSurveyResultController.Request => {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id'
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

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const checkSurveyByIdStub = makeCheckSurveyById()
  const systemUnderTest = new LoadSurveyResultController(checkSurveyByIdStub)
  return {
    systemUnderTest,
    checkSurveyByIdStub
  }
}

describe('LoadSurveyResult Controller', () => {
  it('Should call CheckSurveyById with correct values', async () => {
    const { systemUnderTest, checkSurveyByIdStub } = makeSystemUnderTest()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    const httpRequest = makeFakeRequest()
    await systemUnderTest.handle(httpRequest)
    expect(checkByIdSpy).toHaveBeenCalledWith(httpRequest.surveyId)
  })
})
