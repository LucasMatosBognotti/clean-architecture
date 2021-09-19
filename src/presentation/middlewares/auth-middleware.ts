import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, serverError, successRequest } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  private readonly loadAccountByToken: LoadAccountByToken
  private readonly role?: string

  constructor (loadAccountByToken: LoadAccountByToken, role?: string) {
    this.loadAccountByToken = loadAccountByToken
    this.role = role
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = await httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
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
