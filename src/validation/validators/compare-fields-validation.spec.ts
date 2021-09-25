import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSystemUnderTest = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
