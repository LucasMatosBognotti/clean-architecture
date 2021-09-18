import { DbAddSurvey } from './db-add-survey'
import { AddSurvey, AddSurveyRepository } from './db-add-survey-protocols'

interface SystemUnderTestTypes {
  systemUnderTest: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeFakeSurveyData = (): AddSurvey.Params => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }]
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyRepository.Params): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const systemUnderTest = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    systemUnderTest,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  it('Should call AddSurveyRepository with correct values', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await systemUnderTest.add(makeFakeSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  })
})
