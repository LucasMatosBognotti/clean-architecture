import { HttpResponse } from '.'

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}
