import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddlere } from '../factories/middlewares/auth-middleware-factory'

export const auth = adaptMiddleware(makeAuthMiddlere())
