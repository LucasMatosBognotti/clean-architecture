import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result-controlle-factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
