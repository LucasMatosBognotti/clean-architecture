import { HttpRequest, Authentication, Validation } from './signin-controller-protocols'
import { MissingParamError, ServerError, UnathorizedError } from '@/presentation/errors'
import { SignInController } from './signin-controller'
import { AuthenticationModel } from '@/domain/usecases/authentication'

interface SystemUnderTestTypes {
  systemUnderTest: SignInController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const systemUnderTest = new SignInController(authenticationStub, validationStub)
  return {
    systemUnderTest,
    validationStub,
    authenticationStub
  }
}

describe('SignIn Controller', () => {
  test('Should call Authetication with correct values', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await systemUnderTest.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnathorizedError())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accessToken: 'any_token' })
  })

  test('Should call Validation with correct value', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await systemUnderTest.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation return an error', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.body).toEqual(new MissingParamError('any_field'))
  })
})
