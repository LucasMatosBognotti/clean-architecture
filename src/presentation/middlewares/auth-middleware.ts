import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, successRequest } from '@/presentation/helpers/http/http-helper'
import { HttpResponse, Middleware } from '@/presentation/protocols'

export class AuthMiddleware implements Middleware {
  private readonly loadAccountByToken: LoadAccountByToken
  private readonly role?: string

  constructor (loadAccountByToken: LoadAccountByToken, role?: string) {
    this.loadAccountByToken = loadAccountByToken
    this.role = role
  }

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
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

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
