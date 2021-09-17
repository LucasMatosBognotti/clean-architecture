import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
import { badRequest } from '../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  private readonly validation: Validation

  constructor (validation: Validation) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    return new Promise(resolve => resolve({
      body: '',
      statusCode: 200
    }))
  }
}
