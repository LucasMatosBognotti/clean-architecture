import { HttpResponse, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, serverError, successRequest } from '@/presentation/helpers/http/http-helper'

export class SignUpController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.validation = validation
    this.addAccount = addAccount
    this.authentication = authentication
  }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      await this.addAccount.add({
        name,
        email,
        password
      })
      const accessToken = await this.authentication.auth({
        email,
        password
      })
      return successRequest({ accessToken })
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
