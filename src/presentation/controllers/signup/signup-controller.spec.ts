import { SignUpController } from './signup-controller'
import { AddAccount, AddAccountModel, AccountModel, Validation } from './signup-controller-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'

interface SystemUnderTestTypes {
  systemUnderTest: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const systemUnderTest = new SignUpController(addAccountStub, validationStub)

  return {
    systemUnderTest,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => (reject(new Error())))
    })
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with corrent values', async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await systemUnderTest.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
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
