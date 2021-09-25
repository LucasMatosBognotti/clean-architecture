import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeSignInController } from '@/main/factories/controllers/signin/signin-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/signin', adaptRoute(makeSignInController()))
}
