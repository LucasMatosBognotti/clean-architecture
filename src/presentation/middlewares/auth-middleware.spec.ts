import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exits in headers', async () => {
    const systemUnderTest = new AuthMiddleware()
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
