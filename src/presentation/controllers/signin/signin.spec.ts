import { MissingParamError } from '../../errors'
import { SignInController } from './signin'

describe('SignIn Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const systemUnderTest = new SignInController()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
