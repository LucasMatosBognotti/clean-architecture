import { HttpRequest, HttpResponse, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, serverError, successRequest } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.validation = validation
    this.addAccount = addAccount
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
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
