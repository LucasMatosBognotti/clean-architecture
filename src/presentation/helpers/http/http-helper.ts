import { ServerError, UnathorizedError } from '@/presentation/errors'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnathorizedError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack ?? error.message)
})

export const successRequest = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})
