import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

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
