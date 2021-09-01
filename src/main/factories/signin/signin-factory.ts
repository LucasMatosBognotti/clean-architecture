import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignInController } from '../../../presentation/controllers/signin/signin-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignInValidation } from './signin-validation-factory'

export const makeSignInController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  const accountMongoRepository = new AccountMongoRepository()
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const signInController = new SignInController(authentication, makeSignInValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signInController, logMongoRepository)
}
