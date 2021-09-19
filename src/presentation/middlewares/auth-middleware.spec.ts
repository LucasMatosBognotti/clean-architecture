import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exits in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
        return new Promise(resolve => resolve({ id: 'any_id' }))
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call loadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
        return new Promise(resolve => resolve({ id: 'any_id' }))
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)
    await systemUnderTest.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
