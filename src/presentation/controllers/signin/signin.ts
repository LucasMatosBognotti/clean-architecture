import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './signin-protocols'
import { badRequest, serverError, successRequest, unauthorized } from '../../helpers/http-helper'

export class SignInController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
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
