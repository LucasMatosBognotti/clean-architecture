import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, successRequest } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'

interface SystemUnderTestTypes {
  systemUnderTest: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
      return new Promise(resolve => resolve({ id: 'valid_id' }))
    }
  }

  return new LoadAccountByTokenStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)
  return {
    systemUnderTest,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exits in headers', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call loadAccountByToken with correct accessToken', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await systemUnderTest.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  /*  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(undefined)))
    const httpResponse = await systemUnderTest.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  }) */

  test('Should return 200 if LoadAccuntByToken returns as account', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(httpResponse).toEqual(successRequest({ id: 'valid_id' }))
  })
})
