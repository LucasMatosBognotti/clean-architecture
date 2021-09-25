import { adaptMiddleware } from '@/main/adapters/express-middleware-adapter'
import { makeAuthMiddlere } from '@/main/factories/middlewares/auth-middleware-factory'

export const auth = adaptMiddleware(makeAuthMiddlere())
