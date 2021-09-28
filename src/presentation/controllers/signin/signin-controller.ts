import { Controller, HttpResponse, Authentication, Validation } from './signin-controller-protocols'
import { badRequest, serverError, successRequest, unauthorized } from '@/presentation/helpers/http/http-helper'

export class SignInController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (request: SignInController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return successRequest({ accessToken })
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

export namespace SignInController {
  export type Request = {
    email: string
    password: string
  }
}
