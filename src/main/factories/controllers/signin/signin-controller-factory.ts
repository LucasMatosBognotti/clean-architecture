import { SignInController } from '../../../../presentation/controllers/signin/signin-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeSignInValidation } from './signin-validation-factory'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(makeDbAuthentication(), makeSignInValidation())
  return makeLogControllerDecorator(controller)
}
