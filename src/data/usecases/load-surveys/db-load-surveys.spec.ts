import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'

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

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
        return new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    const systemUnderTest = new DbLoadSurveys(loadSurveysRepositoryStub)
    await systemUnderTest.load('any_id')
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
