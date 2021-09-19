import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, serverError, successRequest } from '../helpers/http/http-helper'
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

const makeSystemUnderTest = (role?: string): SystemUnderTestTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub, role)
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
    const role = 'any_role'
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await systemUnderTest.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
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

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await systemUnderTest.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
