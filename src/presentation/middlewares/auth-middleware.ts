import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, serverError, successRequest } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  private readonly loadAccountByToken: LoadAccountByToken

  constructor (loadAccountByToken: LoadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = await httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken)
        if (account) {
          return successRequest({ id: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (err) {
      return serverError(err as Error)
    }
  }
}
