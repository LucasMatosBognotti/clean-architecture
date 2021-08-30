import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  private readonly fielName: string

  constructor (fieldName: string) {
    this.fielName = fieldName
  }

  validate (input: any): Error | undefined {
    if (!input[this.fielName]) {
      return new MissingParamError(this.fielName)
    }
  }
}
