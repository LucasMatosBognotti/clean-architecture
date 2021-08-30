import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './signin-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, successRequest, unauthorized } from '../../helpers/http-helper'

export class SignInController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }

      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) {
        return unauthorized()
      }

      return successRequest({ accessToken })
    } catch (err) {
      return serverError(err)
    }
  }
}
