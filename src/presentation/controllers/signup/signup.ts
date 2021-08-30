import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './signup-protocols'
import { badRequest, serverError, successRequest } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount

  constructor (addAccount: AddAccount, validation: Validation) {
    this.validation = validation
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return successRequest(account)
    } catch (err) {
      return serverError(err)
    }
  }
}
