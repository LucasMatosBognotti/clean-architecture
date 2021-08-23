import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SystemUnderTest {
  controllerStub: Controller
  systemUnderTest: LogControllerDecorator
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Lucas'
        }
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSystemUnderTest = (): SystemUnderTest => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const systemUnderTest = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    controllerStub,
    systemUnderTest,
    logErrorRepositoryStub
  }
}

describe('LogController', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, systemUnderTest } = makeSystemUnderTest()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await systemUnderTest.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Lucas'
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { systemUnderTest, controllerStub, logErrorRepositoryStub } = makeSystemUnderTest()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await systemUnderTest.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
