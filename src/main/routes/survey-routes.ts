import { Router } from 'express'
import { adminAuth, auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
