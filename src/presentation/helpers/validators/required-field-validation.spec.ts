import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return a MissinParamError if validation fails', () => {
    const systemUnderTest = new RequiredFieldValidation('field')
    const error = systemUnderTest.validate({ name: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const systemUnderTest = new RequiredFieldValidation('field')
    const error = systemUnderTest.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
