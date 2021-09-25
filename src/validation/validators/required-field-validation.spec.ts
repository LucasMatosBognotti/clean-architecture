import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSystemUnderTest = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Should return a MissinParamError if validation fails', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate({ name: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
