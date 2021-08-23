import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SystemUnderTest {
  controllerStub: Controller
  systemUnderTest: LogControllerDecorator
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
  const systemUnderTest = new LogControllerDecorator(controllerStub)
  return {
    controllerStub,
    systemUnderTest
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
})
